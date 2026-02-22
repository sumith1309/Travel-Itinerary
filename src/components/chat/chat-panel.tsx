'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/lib/hooks/use-chat';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { QuickPrompts } from './quick-prompts';
import { RichItineraryTriggerCard } from './rich-card';

export function ChatPanel() {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    messages,
    isStreaming,
    isOpen,
    itineraryTrigger,
    sendMessage,
    stopStreaming,
    closePanel,
    setItineraryTrigger,
  } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleItineraryGenerate = () => {
    if (itineraryTrigger) {
      // Navigate to plan page with pre-filled params
      const params = new URLSearchParams();
      if (itineraryTrigger.destination) params.set('destination', String(itineraryTrigger.destination));
      if (itineraryTrigger.durationDays) params.set('duration', String(itineraryTrigger.durationDays));
      if (itineraryTrigger.travelStyle) params.set('style', String(itineraryTrigger.travelStyle));
      router.push(`/plan?${params.toString()}`);
      setItineraryTrigger(null);
      closePanel();
    }
  };

  const isAuthenticated = !!session?.user;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 right-0 z-50 flex h-full w-full flex-col bg-sand-50 shadow-elevated md:bottom-6 md:right-6 md:h-[600px] md:w-[400px] md:rounded-2xl md:border md:border-sand-200"
          >
            {/* Header */}
            <div className="glass flex items-center justify-between border-b border-sand-200 px-4 py-3 md:rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-midnight">MILES</h3>
                  <p className="text-[10px] text-stone">Your Travel AI</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={closePanel}
                  className="hidden rounded-lg p-1.5 text-stone hover:bg-sand-200 transition-colors md:block"
                  aria-label="Minimize"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={closePanel}
                  className="rounded-lg p-1.5 text-stone hover:bg-sand-200 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto scrollbar-hide py-2"
            >
              {!isAuthenticated ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <Sparkles className="h-10 w-10 text-forest/30 mb-3" />
                  <p className="text-sm font-medium text-midnight mb-1">
                    Sign in to chat with MILES
                  </p>
                  <p className="text-xs text-stone mb-4">
                    Your personal AI travel advisor
                  </p>
                  <a
                    href="/login"
                    className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white hover:bg-forest-600 transition-colors"
                  >
                    Sign In
                  </a>
                </div>
              ) : messages.length === 0 ? (
                <QuickPrompts onSelect={sendMessage} />
              ) : (
                <>
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      role={msg.role}
                      content={msg.content}
                      isStreaming={msg.isStreaming}
                    />
                  ))}
                  {itineraryTrigger && (
                    <div className="px-4">
                      <RichItineraryTriggerCard
                        params={itineraryTrigger}
                        onGenerate={handleItineraryGenerate}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input */}
            {isAuthenticated && (
              <ChatInput
                onSend={sendMessage}
                onStop={stopStreaming}
                isStreaming={isStreaming}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
