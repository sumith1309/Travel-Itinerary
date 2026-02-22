'use client';

// ============================================================
// TRAILS AND MILES — Trip Pace Selector
// 3 horizontal neumorphic cards for relaxed / balanced / fast
// ============================================================

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { fadeUp, tapSpring, staggerContainer } from '@/lib/animations';

interface PaceOption {
  value: string;
  label: string;
  description: string;
  icon: string;
}

interface PaceSelectorProps {
  options: PaceOption[];
  selected: string | null;
  onSelect: (value: string) => void;
}

export function PaceSelector({ options, selected, onSelect }: PaceSelectorProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      variants={staggerContainer(0.05, 0.1)}
      initial="hidden"
      animate="visible"
    >
      {options.map((option) => {
        const isSelected = selected === option.value;

        return (
          <motion.button
            key={option.value}
            type="button"
            variants={fadeUp}
            whileTap={tapSpring.whileTap}
            transition={tapSpring.transition}
            onClick={() => onSelect(option.value)}
            className={cn(
              'relative flex flex-col items-center text-center p-6 transition-all duration-300',
              'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2',
              isSelected
                ? 'neu-pressed border-2 border-forest'
                : 'neu-raised'
            )}
            aria-pressed={isSelected}
          >
            {/* Icon */}
            <span className="text-4xl leading-none" role="img" aria-hidden="true">
              {option.icon}
            </span>

            {/* Label */}
            <h3
              className={cn(
                'mt-3 font-sans text-base font-bold transition-colors duration-200',
                isSelected ? 'text-forest' : 'text-midnight'
              )}
            >
              {option.label}
            </h3>

            {/* Description */}
            <p className="mt-1.5 text-sm text-stone leading-relaxed font-sans">
              {option.description}
            </p>

            {/* Selected indicator dot */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="absolute top-3 right-3 w-3 h-3 rounded-full bg-forest"
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
