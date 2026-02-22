'use client';

import { motion } from 'framer-motion';
import { Calendar, Sun, Cloud, CloudRain } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';

interface StepDurationProps {
  duration: number;
  onDurationChange: (days: number) => void;
  startDate: string | null;
  onStartDateChange: (date: string | null) => void;
  destinationName: string;
}

export function StepDuration({
  duration,
  onDurationChange,
  startDate,
  onStartDateChange,
  destinationName,
}: StepDurationProps) {
  return (
    <motion.div
      variants={staggerContainer(0.1, 0.08)}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={fadeUp}>
        <h2 className="font-display text-2xl font-bold text-midnight mb-2">
          How long is your trip?
        </h2>
        <p className="text-stone text-sm">
          {destinationName
            ? `Plan your perfect ${destinationName} adventure`
            : 'Select the duration for your trip'}
        </p>
      </motion.div>

      {/* Duration Slider */}
      <motion.div variants={fadeUp} className="neu-raised rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-stone">Duration</span>
          <span className="text-2xl font-display font-bold text-forest">
            {duration} <span className="text-base font-sans font-normal text-stone">day{duration > 1 ? 's' : ''}</span>
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={30}
          value={duration}
          onChange={(e) => onDurationChange(Number(e.target.value))}
          className="w-full h-2 bg-sand-200 rounded-full appearance-none cursor-pointer accent-forest [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:shadow-md"
        />

        <div className="flex justify-between mt-2 text-[10px] text-stone">
          <span>1 day</span>
          <span>1 week</span>
          <span>2 weeks</span>
          <span>30 days</span>
        </div>

        {/* Suggested durations */}
        <div className="flex gap-2 mt-4">
          {[3, 5, 7, 10, 14].map((d) => (
            <button
              key={d}
              onClick={() => onDurationChange(d)}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors ${
                duration === d
                  ? 'bg-forest text-white'
                  : 'bg-sand-100 text-stone hover:bg-sand-200'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </motion.div>

      {/* Optional Date */}
      <motion.div variants={fadeUp} className="neu-raised rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-forest" />
          <span className="text-sm font-medium text-midnight">Travel dates (optional)</span>
        </div>
        <input
          type="date"
          value={startDate ?? ''}
          onChange={(e) => onStartDateChange(e.target.value || null)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full rounded-lg border border-sand-200 bg-sand-50 px-4 py-2.5 text-sm text-midnight focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20"
        />
        {startDate && (
          <button
            onClick={() => onStartDateChange(null)}
            className="mt-2 text-xs text-stone hover:text-red-500 transition-colors"
          >
            Clear date
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
