'use client';

// ============================================================
// TRAILS AND MILES — Chat Hook
// SSE stream parsing, session management, itinerary trigger detection
// ============================================================

import { useCallback, useRef } from 'react';
import { useChatStore } from '@/stores/chat-store';
import type { StreamEvent } from '@/types';

export function useChat() {
  const {
    messages,
    activeSessionId,
    isStreaming,
    isOpen,
    sessions,
    itineraryTrigger,
    addMessage,
    setMessages,
    setStreaming,
    setActiveSession,
    setSessions,
    addSession,
    togglePanel,
    openPanel,
    closePanel,
    setItineraryTrigger,
  } = useChatStore();

  const abortRef = useRef<AbortController | null>(null);

  // ── Create Session ───────────────────────────────────────

  const createSession = useCallback(
    async (context?: { destinationContext?: string; title?: string }) => {
      try {
        const res = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_session',
            ...context,
          }),
        });
        if (!res.ok) throw new Error('Failed to create session');
        const { data } = await res.json();

        addSession({
          id: data.id,
          title: data.title,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
          messageCount: 0,
        });

        // Load welcome message
        const msgRes = await fetch(`/api/chatbot?sessionId=${data.id}`);
        if (msgRes.ok) {
          // The GET endpoint returns sessions, not messages
          // The welcome message was created server-side, we fetch all messages via a separate approach
        }

        // Add the welcome message directly since we know the server creates one
        addMessage({
          id: `welcome-${data.id}`,
          role: 'assistant',
          content: `Namaste! 🙏 I'm MILES, your AI travel companion at Trails and Miles. I'm here to help you plan the perfect trip — personalized for Indian travellers like you.\n\nTell me where you'd like to go, and I'll help with:\n• **Itinerary planning** with day-wise activities\n• **Visa requirements** for your Indian passport\n• **Budget estimates** in INR\n• **Vegetarian food** options and restaurants\n• **Practical tips** on SIM cards, local transport, and more\n\nSo, where are you dreaming of travelling? 🌏`,
          createdAt: new Date(),
        });

        return data.id as string;
      } catch (error) {
        console.error('[Chat] Failed to create session:', error);
        return null;
      }
    },
    [addSession, addMessage]
  );

  // ── Load Sessions ────────────────────────────────────────

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/chatbot');
      if (!res.ok) return;
      const { data } = await res.json();
      setSessions(
        data.map((s: Record<string, unknown>) => ({
          id: s.id,
          title: s.title,
          createdAt: new Date(s.createdAt as string),
          updatedAt: new Date(s.updatedAt as string),
          messageCount: (s._count as { messages: number })?.messages ?? 0,
        }))
      );
    } catch {
      // Silent failure for session load
    }
  }, [setSessions]);

  // ── Send Message (Streaming) ─────────────────────────────

  const sendMessage = useCallback(
    async (content: string) => {
      let sessionId = activeSessionId;

      // Create session if needed
      if (!sessionId) {
        sessionId = await createSession();
        if (!sessionId) return;
      }

      // Add user message optimistically
      addMessage({
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        createdAt: new Date(),
      });

      // Add placeholder for assistant
      const assistantId = `assistant-${Date.now()}`;
      addMessage({
        id: assistantId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        isStreaming: true,
      });

      setStreaming(true);
      setItineraryTrigger(null);

      // Abort previous stream if any
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, content }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Stream failed: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error('No readable stream');

        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6);

            try {
              const event = JSON.parse(jsonStr) as StreamEvent;

              if (event.type === 'text' && event.content) {
                fullText += event.content;
                // Update the streaming message in store
                useChatStore.setState((s) => {
                  const msgs = [...s.messages];
                  const idx = msgs.findIndex((m) => m.id === assistantId);
                  if (idx !== -1) {
                    msgs[idx] = { ...msgs[idx], content: fullText };
                  }
                  return { messages: msgs };
                });
              } else if (event.type === 'itinerary_trigger' && event.params) {
                setItineraryTrigger(event.params);
              } else if (event.type === 'error') {
                console.error('[Chat] Stream error:', event.message);
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }

        // Mark streaming complete
        useChatStore.setState((s) => {
          const msgs = [...s.messages];
          const idx = msgs.findIndex((m) => m.id === assistantId);
          if (idx !== -1) {
            msgs[idx] = { ...msgs[idx], isStreaming: false };
          }
          return { messages: msgs };
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('[Chat] Stream error:', error);
          // Update assistant message with error
          useChatStore.setState((s) => {
            const msgs = [...s.messages];
            const idx = msgs.findIndex((m) => m.id === assistantId);
            if (idx !== -1) {
              msgs[idx] = {
                ...msgs[idx],
                content: 'Sorry, I encountered an error. Please try again.',
                isStreaming: false,
              };
            }
            return { messages: msgs };
          });
        }
      } finally {
        setStreaming(false);
      }
    },
    [activeSessionId, createSession, addMessage, setStreaming, setItineraryTrigger]
  );

  // ── Stop Streaming ───────────────────────────────────────

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
  }, [setStreaming]);

  return {
    messages,
    sessions,
    activeSessionId,
    isStreaming,
    isOpen,
    itineraryTrigger,
    sendMessage,
    createSession,
    loadSessions,
    stopStreaming,
    setActiveSession,
    setMessages,
    togglePanel,
    openPanel,
    closePanel,
    setItineraryTrigger,
  };
}
