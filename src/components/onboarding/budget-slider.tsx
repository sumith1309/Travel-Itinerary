'use client';

// ============================================================
// TRAILS AND MILES — Budget Range Slider
// Dual-thumb native range inputs styled with the design system
// Displays INR-formatted values with budget tier labels
// ============================================================

import { useCallback, useId } from 'react';
import { cn, formatINR } from '@/lib/utils';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations';
import { getBudgetTierLabel } from '@/lib/constants';

interface BudgetSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function BudgetSlider({ min, max, value, onChange }: BudgetSliderProps) {
  const id = useId();
  const [minVal, maxVal] = value;

  // Calculate percentage positions for the active track fill
  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Math.min(Number(e.target.value), maxVal - 5000);
      onChange([newMin, maxVal]);
    },
    [maxVal, onChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Math.max(Number(e.target.value), minVal + 5000);
      onChange([minVal, newMax]);
    },
    [minVal, onChange]
  );

  const tierLabel = getBudgetTierLabel(maxVal);

  const tierColor = (() => {
    if (maxVal <= 50000) return 'text-info';
    if (maxVal <= 200000) return 'text-forest';
    return 'text-orange-600';
  })();

  return (
    <motion.div
      className="w-full"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {/* Value display */}
      <div className="flex items-center justify-between mb-6">
        <div className="neu-pressed px-4 py-2.5 rounded-xl">
          <p className="text-xs text-stone font-sans uppercase tracking-wider mb-0.5">From</p>
          <p className="font-mono text-lg font-bold text-midnight">{formatINR(minVal)}</p>
        </div>
        <div className="flex-shrink-0 px-3">
          <span className="text-stone font-sans text-lg">&mdash;</span>
        </div>
        <div className="neu-pressed px-4 py-2.5 rounded-xl">
          <p className="text-xs text-stone font-sans uppercase tracking-wider mb-0.5">To</p>
          <p className="font-mono text-lg font-bold text-midnight">{formatINR(maxVal)}</p>
        </div>
      </div>

      {/* Slider track */}
      <div className="relative h-10 flex items-center">
        {/* Background track */}
        <div className="absolute left-0 right-0 h-2 rounded-full bg-sand-200" />

        {/* Active (filled) track */}
        <div
          className="absolute h-2 rounded-full bg-forest transition-all duration-150"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min range input */}
        <input
          id={`${id}-min`}
          type="range"
          min={min}
          max={max}
          step={5000}
          value={minVal}
          onChange={handleMinChange}
          className={cn(
            'absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-10',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:pointer-events-auto',
            '[&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-white',
            '[&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-forest',
            '[&::-webkit-slider-thumb]:shadow-card-hover',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:appearance-none',
            '[&::-moz-range-thumb]:pointer-events-auto',
            '[&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-white',
            '[&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-forest',
            '[&::-moz-range-thumb]:shadow-card-hover',
            '[&::-moz-range-thumb]:cursor-pointer'
          )}
          aria-label="Minimum budget"
        />

        {/* Max range input */}
        <input
          id={`${id}-max`}
          type="range"
          min={min}
          max={max}
          step={5000}
          value={maxVal}
          onChange={handleMaxChange}
          className={cn(
            'absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-20',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:pointer-events-auto',
            '[&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-white',
            '[&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-forest',
            '[&::-webkit-slider-thumb]:shadow-card-hover',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:appearance-none',
            '[&::-moz-range-thumb]:pointer-events-auto',
            '[&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-white',
            '[&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-forest',
            '[&::-moz-range-thumb]:shadow-card-hover',
            '[&::-moz-range-thumb]:cursor-pointer'
          )}
          aria-label="Maximum budget"
        />
      </div>

      {/* Scale markers */}
      <div className="flex justify-between mt-2 px-0.5">
        <span className="text-xs text-stone font-mono">{formatINR(min)}</span>
        <span className="text-xs text-stone font-mono">{formatINR(max)}</span>
      </div>

      {/* Budget tier label */}
      <div className="mt-4 text-center">
        <motion.span
          key={tierLabel}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full',
            'bg-white/80 border border-sand-200',
            'font-sans text-sm font-semibold',
            tierColor
          )}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          {tierLabel} Traveller
        </motion.span>
      </div>
    </motion.div>
  );
}
