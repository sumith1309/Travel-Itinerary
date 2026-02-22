'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, IndianRupee, Camera, Utensils, Bus } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { formatINR } from '@/lib/utils';

interface ItineraryItemData {
  id: string;
  timeSlot: string;
  startTime: string | null;
  endTime: string | null;
  title: string;
  description: string | null;
  estimatedCostINR: number | string | null;
  transportMode: string | null;
  transportDurationMins: number | null;
  transportNotes: string | null;
  imageUrl: string | null;
  tags: string[];
}

interface EnhancedDayViewProps {
  dayNumber: number;
  title: string | null;
  description: string | null;
  dailyBudgetINR: number | string | null;
  weatherAdvisory: string | null;
  items: ItineraryItemData[];
  cityName?: string | null;
  onRegenerateDay?: (dayNumber: number) => void;
}

const SLOT_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; border: string }> = {
  morning: {
    label: 'Morning',
    icon: <span className="text-amber-500">☀️</span>,
    color: 'bg-amber-50',
    border: 'border-l-amber-400',
  },
  afternoon: {
    label: 'Afternoon',
    icon: <span className="text-blue-500">🌤️</span>,
    color: 'bg-blue-50',
    border: 'border-l-blue-400',
  },
  evening: {
    label: 'Evening',
    icon: <span className="text-purple-500">🌙</span>,
    color: 'bg-purple-50',
    border: 'border-l-purple-400',
  },
};

export function EnhancedDayView({
  dayNumber,
  title,
  description,
  dailyBudgetINR,
  weatherAdvisory,
  items,
  cityName,
}: EnhancedDayViewProps) {
  const sortedItems = [...items].sort((a, b) => {
    const order = { morning: 0, afternoon: 1, evening: 2 };
    const oa = order[a.timeSlot as keyof typeof order] ?? 3;
    const ob = order[b.timeSlot as keyof typeof order] ?? 3;
    return oa - ob;
  });

  const budget = Number(dailyBudgetINR ?? 0);

  return (
    <motion.div
      variants={staggerContainer(0.1, 0.05)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {/* Day Header */}
      <motion.div variants={fadeUp} className="flex items-start gap-4 mb-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-white font-mono text-lg font-bold shadow-glow-green">
          {dayNumber}
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-midnight">
            {title ?? `Day ${dayNumber}`}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-stone">
            {cityName && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {cityName}
              </span>
            )}
            {budget > 0 && (
              <span className="flex items-center gap-1 font-mono text-forest">
                <IndianRupee className="h-3 w-3" /> {formatINR(budget)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {sortedItems.length} activities
            </span>
          </div>
          {description && (
            <p className="text-sm text-stone mt-2 leading-relaxed">{description}</p>
          )}
        </div>
      </motion.div>

      {/* Weather Advisory */}
      {weatherAdvisory && (
        <motion.div
          variants={fadeUp}
          className="ml-6 mb-4 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-700"
        >
          <span>⛅</span>
          <span>{weatherAdvisory}</span>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="relative ml-6 border-l-2 border-sand-200 pl-8 space-y-4">
        {sortedItems.map((item, i) => {
          const slot = SLOT_CONFIG[item.timeSlot] ?? SLOT_CONFIG.morning;
          const cost = Number(item.estimatedCostINR ?? 0);
          const isFood = item.tags.some((t) => ['food', 'restaurant', 'cafe', 'dining'].includes(t.toLowerCase()));
          const isPhoto = item.tags.some((t) => ['photography', 'photo', 'viewpoint', 'sunset'].includes(t.toLowerCase()));

          return (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className={`relative border-l-4 ${slot.border} ${slot.color} rounded-xl p-4 neu-raised`}
            >
              {/* Timeline dot */}
              <div className="absolute -left-[calc(2rem+9px)] top-4 h-4 w-4 rounded-full bg-white border-2 border-forest" />

              {/* Time + Slot */}
              <div className="flex items-center gap-2 mb-2">
                {slot.icon}
                <span className="text-xs font-semibold uppercase tracking-wider text-stone">
                  {slot.label}
                </span>
                {item.startTime && (
                  <span className="text-xs font-mono text-stone/70">
                    {item.startTime}
                    {item.endTime && ` – ${item.endTime}`}
                  </span>
                )}
                {isFood && <Utensils className="h-3 w-3 text-brand-orange ml-auto" />}
                {isPhoto && <Camera className="h-3 w-3 text-forest ml-auto" />}
              </div>

              {/* Content */}
              <h3 className="font-semibold text-midnight mb-1">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-stone leading-relaxed mb-2">{item.description}</p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone">
                {cost > 0 && (
                  <span className="flex items-center gap-1 font-mono text-forest">
                    <IndianRupee className="h-3 w-3" /> {formatINR(cost)}
                  </span>
                )}
                {item.transportMode && (
                  <span className="flex items-center gap-1">
                    <Bus className="h-3 w-3" />
                    {item.transportMode}
                    {item.transportDurationMins && ` · ${item.transportDurationMins} min`}
                  </span>
                )}
                {item.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Transport note */}
              {item.transportNotes && i < sortedItems.length - 1 && (
                <div className="mt-3 pt-2 border-t border-sand-100 text-[11px] text-stone italic">
                  🚗 {item.transportNotes}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
