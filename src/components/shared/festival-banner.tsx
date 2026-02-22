'use client';

import { PartyPopper, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUpcomingFestivals } from '@/lib/data/festivals';
import type { IndianFestival } from '@/lib/data/festivals';

interface FestivalBannerProps {
  currentMonth?: number;
  maxFestivals?: number;
  className?: string;
}

const impactConfig: Record<IndianFestival['travelImpact'], { icon: typeof PartyPopper; label: string; color: string }> = {
  positive: { icon: CheckCircle, label: 'Great time to visit', color: 'text-green-600 bg-green-50' },
  crowded: { icon: AlertTriangle, label: 'Expect crowds', color: 'text-amber-600 bg-amber-50' },
  neutral: { icon: PartyPopper, label: 'Normal travel', color: 'text-forest bg-forest/10' },
};

export function FestivalBanner({ currentMonth, maxFestivals = 4, className }: FestivalBannerProps) {
  const month = currentMonth ?? new Date().getMonth() + 1;
  const festivals = getUpcomingFestivals(month, maxFestivals);

  if (festivals.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <PartyPopper className="h-5 w-5 text-orange" strokeWidth={1.5} />
        <h3 className="font-display text-lg font-semibold text-midnight">Upcoming Festivals</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {festivals.map((festival) => {
          const config = impactConfig[festival.travelImpact];
          const Icon = config.icon;
          return (
            <div
              key={festival.name}
              className="neu-flat rounded-xl p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-medium text-midnight text-sm">{festival.name}</h4>
                  <p className="text-xs text-stone">{festival.dateRange}</p>
                </div>
                <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', config.color)}>
                  <Icon className="h-3 w-3" />
                  {config.label}
                </span>
              </div>
              <p className="text-xs text-stone leading-relaxed">{festival.travelTip}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
