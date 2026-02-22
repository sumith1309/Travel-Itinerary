'use client';

// ============================================================
// TRAILS AND MILES — Interest Picker
// Flexbox grid of pill-shaped toggleable tags for travel interests
// ============================================================

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { fadeUp, tapSpring, staggerContainer } from '@/lib/animations';

interface Interest {
  value: string;
  label: string;
  icon: string;
}

interface InterestPickerProps {
  interests: Interest[];
  selected: string[];
  onToggle: (value: string) => void;
  min?: number;
  max?: number;
}

export function InterestPicker({
  interests,
  selected,
  onToggle,
  min = 2,
  max = 6,
}: InterestPickerProps) {
  const count = selected.length;
  const isAtMax = count >= max;

  return (
    <motion.div
      variants={staggerContainer(0.02, 0.04)}
      initial="hidden"
      animate="visible"
    >
      {/* Helper text */}
      <p className="text-sm text-stone font-sans mb-4">
        Select {min}&ndash;{max} interests{' '}
        <span
          className={cn(
            'font-mono text-xs ml-1 px-2 py-0.5 rounded-full',
            count < min
              ? 'bg-orange-50 text-orange-600'
              : count <= max
                ? 'bg-forest-50 text-forest'
                : 'bg-error/10 text-error'
          )}
        >
          {count}/{max}
        </span>
      </p>

      {/* Pills grid */}
      <div className="flex flex-wrap gap-2.5">
        {interests.map((interest) => {
          const isSelected = selected.includes(interest.value);
          const isDisabled = isAtMax && !isSelected;

          return (
            <motion.button
              key={interest.value}
              type="button"
              variants={fadeUp}
              whileTap={isDisabled ? undefined : tapSpring.whileTap}
              transition={tapSpring.transition}
              onClick={() => {
                if (!isDisabled) onToggle(interest.value);
              }}
              disabled={isDisabled}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-sans',
                'transition-all duration-200 cursor-pointer',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2',
                isSelected
                  ? 'bg-forest text-white border-forest shadow-sm'
                  : 'bg-white border-sand-200 text-stone hover:border-forest-200 hover:text-midnight',
                isDisabled && !isSelected && 'opacity-40 cursor-not-allowed'
              )}
              aria-pressed={isSelected}
            >
              <span role="img" aria-hidden="true" className="text-base leading-none">
                {interest.icon}
              </span>
              <span className={cn('font-medium', isSelected && 'text-white')}>
                {interest.label}
              </span>

              {/* Animated checkmark for selected pills */}
              {isSelected && (
                <motion.svg
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="w-3.5 h-3.5 ml-0.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Minimum warning */}
      {count > 0 && count < min && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-xs text-orange-500 font-sans"
        >
          Pick at least {min - count} more to continue
        </motion.p>
      )}
    </motion.div>
  );
}
