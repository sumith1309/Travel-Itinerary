'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, tapSpring } from '@/lib/animations';
import { INTEREST_TAGS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface StepInterestsProps {
  interests: string[];
  specialRequests: string;
  onToggleInterest: (interest: string) => void;
  onSpecialRequestsChange: (text: string) => void;
}

export function StepInterests({
  interests,
  specialRequests,
  onToggleInterest,
  onSpecialRequestsChange,
}: StepInterestsProps) {
  return (
    <motion.div
      variants={staggerContainer(0.1, 0.08)}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={fadeUp}>
        <h2 className="font-display text-2xl font-bold text-midnight mb-2">
          What excites you most?
        </h2>
        <p className="text-stone text-sm">
          Pick 2–6 interests to personalise your itinerary
        </p>
        <p className="text-xs text-forest mt-1 font-medium">
          {interests.length}/6 selected
          {interests.length < 2 && ' (pick at least 2)'}
        </p>
      </motion.div>

      {/* Interest Tags Grid */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5">
        {INTEREST_TAGS.map((tag) => {
          const isSelected = interests.includes(tag.value);
          const isDisabled = !isSelected && interests.length >= 6;

          return (
            <motion.button
              key={tag.value}
              {...tapSpring}
              onClick={() => !isDisabled && onToggleInterest(tag.value)}
              disabled={isDisabled}
              className={cn(
                'rounded-full px-4 py-2.5 text-sm font-medium transition-all',
                isSelected
                  ? 'bg-forest text-white shadow-glow-green scale-105'
                  : isDisabled
                    ? 'bg-sand-100 text-stone/40 cursor-not-allowed'
                    : 'neu-raised text-midnight hover:shadow-card-hover'
              )}
            >
              <span className="mr-1.5">{tag.icon}</span>
              {tag.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Special Requests */}
      <motion.div variants={fadeUp} className="neu-raised rounded-xl p-6">
        <h3 className="text-sm font-medium text-midnight mb-2">
          Anything else we should know? (optional)
        </h3>
        <p className="text-xs text-stone mb-3">
          E.g. &quot;We&apos;re celebrating our anniversary&quot; or &quot;Need wheelchair accessible venues&quot;
        </p>
        <textarea
          value={specialRequests}
          onChange={(e) => onSpecialRequestsChange(e.target.value)}
          placeholder="Special requests, celebrations, accessibility needs..."
          rows={3}
          maxLength={500}
          className="w-full rounded-lg border border-sand-200 bg-sand-50 px-4 py-3 text-sm text-midnight placeholder:text-stone/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20 resize-none"
        />
        <p className="text-[10px] text-stone text-right mt-1">
          {specialRequests.length}/500
        </p>
      </motion.div>
    </motion.div>
  );
}
