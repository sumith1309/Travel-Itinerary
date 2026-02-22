'use client';

import { motion } from 'framer-motion';
import { QUICK_PROMPTS } from '@/lib/constants';
import { fadeUp, staggerContainer } from '@/lib/animations';

interface QuickPromptsProps {
  onSelect: (message: string) => void;
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <motion.div
      variants={staggerContainer(0.1, 0.08)}
      initial="hidden"
      animate="visible"
      className="px-4 py-6 space-y-3"
    >
      <p className="text-sm text-stone text-center mb-4">
        Try one of these to get started:
      </p>
      <div className="grid grid-cols-1 gap-2">
        {QUICK_PROMPTS.map((prompt) => (
          <motion.button
            key={prompt.label}
            variants={fadeUp}
            onClick={() => onSelect(prompt.message)}
            className="neu-raised rounded-xl px-4 py-3 text-left hover:shadow-card-hover transition-shadow group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{prompt.icon}</span>
              <span className="text-sm font-medium text-midnight group-hover:text-forest transition-colors">
                {prompt.label}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
