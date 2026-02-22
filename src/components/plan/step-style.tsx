'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, tapSpring } from '@/lib/animations';
import { TRAVEL_STYLES, PACE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface StepStyleProps {
  travelStyle: string;
  pace: string;
  onStyleChange: (style: string) => void;
  onPaceChange: (pace: string) => void;
}

export function StepStyle({ travelStyle, pace, onStyleChange, onPaceChange }: StepStyleProps) {
  return (
    <motion.div
      variants={staggerContainer(0.1, 0.08)}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Travel Style */}
      <motion.div variants={fadeUp}>
        <h2 className="font-display text-2xl font-bold text-midnight mb-2">
          How do you like to travel?
        </h2>
        <p className="text-stone text-sm mb-4">Pick your travel style</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TRAVEL_STYLES.map((style) => (
            <motion.button
              key={style.value}
              {...tapSpring}
              onClick={() => onStyleChange(style.value)}
              className={cn(
                'rounded-xl p-4 text-left transition-all',
                travelStyle === style.value
                  ? 'neu-pressed border-2 border-forest bg-forest-50'
                  : 'neu-raised hover:shadow-card-hover'
              )}
            >
              <span className="text-2xl mb-2 block">{style.icon}</span>
              <p className="text-sm font-semibold text-midnight">{style.label}</p>
              <p className="text-xs text-stone mt-0.5 line-clamp-2">{style.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Pace */}
      <motion.div variants={fadeUp}>
        <h3 className="font-display text-lg font-semibold text-midnight mb-2">
          What pace suits you?
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {PACE_OPTIONS.map((opt) => (
            <motion.button
              key={opt.value}
              {...tapSpring}
              onClick={() => onPaceChange(opt.value)}
              className={cn(
                'rounded-xl p-4 text-center transition-all',
                pace === opt.value
                  ? 'neu-pressed border-2 border-forest bg-forest-50'
                  : 'neu-raised hover:shadow-card-hover'
              )}
            >
              <span className="text-2xl mb-1 block">{opt.icon}</span>
              <p className="text-sm font-semibold text-midnight">{opt.label}</p>
              <p className="text-[11px] text-stone mt-0.5">{opt.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
