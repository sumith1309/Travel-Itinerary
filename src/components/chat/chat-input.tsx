'use client';

import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Square } from 'lucide-react';
import { tapSpring } from '@/lib/animations';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, isStreaming, disabled, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="border-t border-sand-200 bg-white/80 backdrop-blur-sm p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask MILES anything about travel..."
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none rounded-xl border border-sand-200 bg-sand-50 px-4 py-2.5 text-sm text-midnight placeholder:text-stone/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20 disabled:opacity-50 transition-colors"
        />
        {isStreaming ? (
          <motion.button
            {...tapSpring}
            onClick={onStop}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white shadow-sm hover:bg-red-600 transition-colors"
            aria-label="Stop generating"
          >
            <Square className="h-4 w-4" />
          </motion.button>
        ) : (
          <motion.button
            {...tapSpring}
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest text-white shadow-sm hover:bg-forest-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        )}
      </div>
      <p className="mt-1.5 text-[10px] text-stone/50 text-center">
        ⌘+Enter to send
      </p>
    </div>
  );
}
