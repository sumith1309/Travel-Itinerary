'use client';

import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TypingIndicator } from './typing-indicator';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === 'user';

  // Strip itinerary trigger tags from display
  const displayContent = content
    .replace(/\[GENERATE_ITINERARY\][\s\S]*?\[\/GENERATE_ITINERARY\]/g, '')
    .trim();

  if (!displayContent && isStreaming) {
    return (
      <div className="flex gap-3 px-4 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
          <Bot className="h-4 w-4" />
        </div>
        <TypingIndicator />
      </div>
    );
  }

  if (!displayContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex gap-3 px-4 py-2',
        isUser && 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-orange/10 text-orange'
            : 'bg-forest/10 text-forest'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'neu-raised bg-orange-50 text-midnight'
            : 'neu-raised bg-white text-midnight'
        )}
      >
        <MessageContent content={displayContent} />
        {isStreaming && (
          <span className="inline-block h-4 w-0.5 animate-pulse bg-forest ml-0.5" />
        )}
      </div>
    </motion.div>
  );
}

// ── Render message with basic markdown ───────────────────────

function MessageContent({ content }: { content: string }) {
  // Simple markdown: bold, bullet points, price formatting
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;

        // Bullet points
        if (line.match(/^[•\-\*]\s/)) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-forest shrink-0">•</span>
              <span>{renderInline(line.replace(/^[•\-\*]\s/, ''))}</span>
            </div>
          );
        }

        return <p key={i}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string) {
  // Bold text
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Price formatting — highlight ₹ amounts
    const priceRegex = /(₹[\d,]+)/g;
    const priceParts = part.split(priceRegex);
    return priceParts.map((pp, j) => {
      if (pp.match(priceRegex)) {
        return (
          <span key={`${i}-${j}`} className="font-mono text-forest font-medium">
            {pp}
          </span>
        );
      }
      return pp;
    });
  });
}
