'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, tapSpring } from '@/lib/animations';
import { COMPANION_OPTIONS, DIETARY_OPTIONS, BUDGET_RANGE, getBudgetTierLabel } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { formatINR } from '@/lib/utils';

interface StepCompanionsProps {
  companionType: string;
  budget: number;
  dietaryPreferences: string[];
  onCompanionChange: (type: string) => void;
  onBudgetChange: (amount: number) => void;
  onDietaryChange: (prefs: string[]) => void;
}

export function StepCompanions({
  companionType,
  budget,
  dietaryPreferences,
  onCompanionChange,
  onBudgetChange,
  onDietaryChange,
}: StepCompanionsProps) {
  const toggleDietary = (value: string) => {
    if (value === 'NO_PREFERENCE') {
      onDietaryChange(['NO_PREFERENCE']);
      return;
    }
    const without = dietaryPreferences.filter((d) => d !== 'NO_PREFERENCE');
    if (without.includes(value)) {
      onDietaryChange(without.filter((d) => d !== value));
    } else {
      onDietaryChange([...without, value]);
    }
  };

  return (
    <motion.div
      variants={staggerContainer(0.1, 0.08)}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Companion Type */}
      <motion.div variants={fadeUp}>
        <h2 className="font-display text-2xl font-bold text-midnight mb-2">
          Who&apos;s coming along?
        </h2>
        <p className="text-stone text-sm mb-4">This helps us tailor activities and accommodations</p>

        <div className="grid grid-cols-2 gap-3">
          {COMPANION_OPTIONS.map((opt) => (
            <motion.button
              key={opt.value}
              {...tapSpring}
              onClick={() => onCompanionChange(opt.value)}
              className={cn(
                'rounded-xl p-4 text-left transition-all',
                companionType === opt.value
                  ? 'neu-pressed border-2 border-forest bg-forest-50'
                  : 'neu-raised hover:shadow-card-hover'
              )}
            >
              <span className="text-2xl mb-2 block">{opt.icon}</span>
              <p className="text-sm font-semibold text-midnight">{opt.label}</p>
              <p className="text-xs text-stone mt-0.5">{opt.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Budget Slider */}
      <motion.div variants={fadeUp} className="neu-raised rounded-xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-midnight">Total Budget (per person)</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-forest/10 text-forest font-medium">
            {getBudgetTierLabel(budget)}
          </span>
        </div>
        <p className="text-2xl font-display font-bold text-forest mb-4">
          {formatINR(budget)}
        </p>

        <input
          type="range"
          min={BUDGET_RANGE.min}
          max={BUDGET_RANGE.max}
          step={5000}
          value={budget}
          onChange={(e) => onBudgetChange(Number(e.target.value))}
          className="w-full h-2 bg-sand-200 rounded-full appearance-none cursor-pointer accent-forest [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:shadow-md"
        />

        <div className="flex justify-between mt-2 text-[10px] text-stone">
          <span>{formatINR(BUDGET_RANGE.min)}</span>
          <span>{formatINR(50000)}</span>
          <span>{formatINR(200000)}</span>
          <span>{formatINR(BUDGET_RANGE.max)}</span>
        </div>
      </motion.div>

      {/* Dietary Preferences */}
      <motion.div variants={fadeUp}>
        <h3 className="font-display text-lg font-semibold text-midnight mb-2">
          Any dietary preferences?
        </h3>
        <p className="text-stone text-xs mb-3">We&apos;ll include restaurant recommendations accordingly</p>

        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((opt) => (
            <motion.button
              key={opt.value}
              {...tapSpring}
              onClick={() => toggleDietary(opt.value)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all',
                dietaryPreferences.includes(opt.value)
                  ? 'bg-forest text-white shadow-glow-green'
                  : 'neu-raised text-midnight hover:shadow-card-hover'
              )}
            >
              <span className="mr-1.5">{opt.icon}</span>
              {opt.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
