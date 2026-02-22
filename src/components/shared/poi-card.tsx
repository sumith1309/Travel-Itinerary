import Image from 'next/image';
import { Clock, IndianRupee } from 'lucide-react';
import { cn, formatINR } from '@/lib/utils';
import { getCategoryImage } from '@/lib/unsplash';

interface POICardProps {
  name: string;
  category: string;
  subcategory?: string | null;
  shortDescription?: string | null;
  heroImageUrl?: string | null;
  avgDurationMins: number;
  avgCostINR: number;
  bestTimeToVisit?: string | null;
  className?: string;
}

export function POICard({ name, category, subcategory, shortDescription, heroImageUrl, avgDurationMins, avgCostINR, bestTimeToVisit, className }: POICardProps) {
  const image = heroImageUrl && heroImageUrl.startsWith('http') ? heroImageUrl : getCategoryImage(category);

  return (
    <div className={cn('neu-raised overflow-hidden group', className)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
        <Image src={image} alt={name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-forest/80 text-white backdrop-blur-sm">
          {subcategory ?? category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-display text-lg font-semibold text-midnight leading-tight">{name}</h3>
        {shortDescription && <p className="text-sm text-stone line-clamp-2">{shortDescription}</p>}
        <div className="flex items-center gap-4 text-sm text-stone">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
            {avgDurationMins >= 60 ? `${Math.round(avgDurationMins / 60)}h` : `${avgDurationMins}m`}
          </span>
          <span className="flex items-center gap-1">
            <IndianRupee className="h-3.5 w-3.5" strokeWidth={1.5} />
            {avgCostINR === 0 ? 'Free' : formatINR(avgCostINR)}
          </span>
        </div>
        {bestTimeToVisit && (
          <p className="text-xs text-stone/70 italic">{bestTimeToVisit}</p>
        )}
      </div>
    </div>
  );
}
