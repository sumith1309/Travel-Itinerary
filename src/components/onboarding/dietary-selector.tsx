'use client';

// ============================================================
// TRAILS AND MILES — Dietary Preference Selector
// Multi-select horizontal pills for dietary preferences
// India-context: vegetarian, vegan, Jain, halal, no preference
// ============================================================

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { fadeUp, tapSpring, staggerContainer } from '@/lib/animations';

interface DietaryOption {
  value: string;
  label: string;
  icon: string;
}

interface DietarySelectorProps {
  options: DietaryOption[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function DietarySelector({ options, selected, onToggle }: DietarySelectorProps) {
  return (
    <motion.div
      variants={staggerContainer(0.03, 0.06)}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);

          return (
            <motion.button
              key={option.value}
              type="button"
              variants={fadeUp}
              whileTap={tapSpring.whileTap}
              transition={tapSpring.transition}
              onClick={() => onToggle(option.value)}
              className={cn(
                'inline-flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-sans',
                'transition-all duration-200 cursor-pointer',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2',
                isSelected
                  ? 'bg-orange-50 border-orange text-orange-700 shadow-sm'
                  : 'bg-white border-sand-200 text-stone hover:border-orange-200 hover:bg-orange-50/30'
              )}
              aria-pressed={isSelected}
            >
              <span role="img" aria-hidden="true" className="text-lg leading-none">
                {option.icon}
              </span>
              <span className="font-medium">{option.label}</span>

              {/* Animated selection indicator */}
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="flex items-center justify-center w-5 h-5 rounded-full bg-orange text-white ml-0.5"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Hint text */}
      <p className="mt-3 text-xs text-stone/70 font-sans">
        Select all that apply. We will highlight suitable restaurants and food experiences.
      </p>
    </motion.div>
  );
}
