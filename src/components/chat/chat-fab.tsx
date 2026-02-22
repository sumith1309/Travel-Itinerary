'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from '@/lib/hooks/use-chat';
import { tapSpring } from '@/lib/animations';

export function ChatFAB() {
  const { isOpen, togglePanel } = useChat();

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          {...tapSpring}
          onClick={togglePanel}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white shadow-glow-green hover:bg-forest-600 transition-colors"
          aria-label="Open chat with MILES"
        >
          <MessageCircle className="h-6 w-6" />

          {/* Glow ring */}
          <span className="absolute inset-0 rounded-full animate-glow border-2 border-forest/30" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
