'use client';

import { MapPin, IndianRupee, Plane } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface RichDestinationCardProps {
  name: string;
  slug: string;
  budgetTier?: string;
  visaType?: string;
  tags?: string[];
}

export function RichDestinationCard({
  name,
  slug,
  budgetTier,
  visaType,
  tags,
}: RichDestinationCardProps) {
  return (
    <a
      href={`/destinations/${slug}`}
      className="block neu-raised rounded-xl p-3 my-2 hover:shadow-card-hover transition-shadow group"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <MapPin className="h-4 w-4 text-forest" />
        <span className="font-semibold text-midnight text-sm group-hover:text-forest transition-colors">
          {name}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {budgetTier && (
          <Badge variant="secondary" className="text-[10px]">
            {budgetTier}
          </Badge>
        )}
        {visaType && (
          <Badge variant="outline" className="text-[10px]">
            <Plane className="h-2.5 w-2.5 mr-0.5" />
            {visaType.replace(/_/g, ' ')}
          </Badge>
        )}
        {tags?.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="outline" className="text-[10px]">
            {tag}
          </Badge>
        ))}
      </div>
    </a>
  );
}

interface RichItineraryTriggerCardProps {
  params: Record<string, unknown>;
  onGenerate: () => void;
}

export function RichItineraryTriggerCard({
  params,
  onGenerate,
}: RichItineraryTriggerCardProps) {
  return (
    <div className="neu-raised rounded-xl p-4 my-2 border border-forest/20 bg-forest-50">
      <p className="text-sm font-semibold text-forest mb-2">
        Ready to generate your itinerary?
      </p>
      <div className="text-xs text-stone space-y-0.5 mb-3">
        {!!params.destination && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            <span>{String(params.destination)}</span>
          </div>
        )}
        {!!params.durationDays && (
          <div>Duration: {String(params.durationDays)} days</div>
        )}
        {!!params.budget && (
          <div className="flex items-center gap-1.5">
            <IndianRupee className="h-3 w-3" />
            <span>{formatINR(Number(params.budget))}</span>
          </div>
        )}
      </div>
      <button
        onClick={onGenerate}
        className="w-full rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white hover:bg-forest-600 transition-colors"
      >
        Generate My Itinerary
      </button>
    </div>
  );
}
