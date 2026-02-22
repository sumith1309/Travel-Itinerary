'use client';

// ============================================================
// TRAILS AND MILES — Traveller Archetype Selection Cards
// Grid of 5 gradient cards for onboarding travel personality quiz
// ============================================================

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { fadeUp, tapSpring, staggerContainer } from '@/lib/animations';

interface Archetype {
  value: string;
  travelStyle: string;
  label: string;
  description: string;
  color: string;
}

interface ArchetypeCardProps {
  archetypes: Archetype[];
  selected: string | null;
  onSelect: (value: string) => void;
}

export function ArchetypeCard({ archetypes, selected, onSelect }: ArchetypeCardProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={staggerContainer(0.05, 0.08)}
      initial="hidden"
      animate="visible"
    >
      {archetypes.map((archetype) => {
        const isSelected = selected === archetype.value;

        return (
          <motion.button
            key={archetype.value}
            type="button"
            variants={fadeUp}
            whileTap={tapSpring.whileTap}
            transition={tapSpring.transition}
            onClick={() => onSelect(archetype.value)}
            className={cn(
              'relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300',
              'bg-gradient-to-br',
              archetype.color,
              'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2',
              isSelected
                ? 'ring-2 ring-forest scale-105 shadow-elevated'
                : 'ring-0 scale-100 shadow-card hover:shadow-card-hover hover:scale-[1.02]'
            )}
            aria-pressed={isSelected}
          >
            {/* Noise texture overlay for visual depth */}
            <div className="absolute inset-0 opacity-[0.06] bg-[url('data:image/svg+xml,%3Csvg+viewBox=%270+0+256+256%27+xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter+id=%27noise%27%3E%3CfeTurbulence+type=%27fractalNoise%27+baseFrequency=%270.9%27+numOctaves=%274%27+stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect+width=%27100%25%27+height=%27100%25%27+filter=%27url(%23noise)%27/%3E%3C/svg%3E')] pointer-events-none" />

            {/* Selected checkmark indicator */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}

            {/* Card content */}
            <div className="relative z-10">
              <h3 className="font-display text-lg font-bold text-white leading-snug">
                {archetype.label}
              </h3>
              <p className="mt-2 text-sm text-white/80 leading-relaxed font-sans">
                {archetype.description}
              </p>
            </div>

            {/* Decorative gradient shimmer on selected */}
            {isSelected && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
