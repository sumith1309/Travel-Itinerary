'use client';

// ============================================================
// TRAILS AND MILES — Chat Store (Zustand)
// State management for the AI chatbot panel
// ============================================================

import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

interface ChatState {
  // Panel state
  isOpen: boolean;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;

  // Session state
  activeSessionId: string | null;
  sessions: ChatSession[];
  setActiveSession: (id: string | null) => void;
  setSessions: (sessions: ChatSession[]) => void;
  addSession: (session: ChatSession) => void;

  // Message state
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  clearMessages: () => void;

  // Streaming state
  isStreaming: boolean;
  setStreaming: (streaming: boolean) => void;

  // Itinerary trigger
  itineraryTrigger: Record<string, unknown> | null;
  setItineraryTrigger: (params: Record<string, unknown> | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // Panel
  isOpen: false,
  togglePanel: () => set((s) => ({ isOpen: !s.isOpen })),
  openPanel: () => set({ isOpen: true }),
  closePanel: () => set({ isOpen: false }),

  // Session
  activeSessionId: null,
  sessions: [],
  setActiveSession: (id) => set({ activeSessionId: id }),
  setSessions: (sessions) => set({ sessions }),
  addSession: (session) =>
    set((s) => ({
      sessions: [session, ...s.sessions],
      activeSessionId: session.id,
    })),

  // Messages
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((s) => ({ messages: [...s.messages, message] })),
  updateLastAssistantMessage: (content) =>
    set((s) => {
      const msgs = [...s.messages];
      const lastIdx = msgs.findLastIndex((m) => m.role === 'assistant');
      if (lastIdx !== -1) {
        msgs[lastIdx] = { ...msgs[lastIdx], content, isStreaming: false };
      }
      return { messages: msgs };
    }),
  clearMessages: () => set({ messages: [] }),

  // Streaming
  isStreaming: false,
  setStreaming: (streaming) => set({ isStreaming: streaming }),

  // Itinerary trigger
  itineraryTrigger: null,
  setItineraryTrigger: (params) => set({ itineraryTrigger: params }),
}));
