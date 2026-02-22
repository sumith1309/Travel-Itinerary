'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Eye, Bookmark, Sparkles } from 'lucide-react';
import { cn, formatINR } from '@/lib/utils';
import { getDestinationImage } from '@/lib/unsplash';

interface ItineraryCardProps {
  title: string;
  shareToken: string;
  destinationSlugs: string[];
  durationDays: number;
  travelStyle?: string | null;
  budgetTotalINR?: number | { toNumber(): number } | null;
  isAiGenerated: boolean;
  viewCount: number;
  saveCount: number;
  className?: string;
}

const styleColors: Record<string, string> = {
  LEISURE: 'bg-forest/10 text-forest',
  ADVENTURE: 'bg-orange/10 text-orange-600',
  LUXURY: 'bg-purple-100 text-purple-700',
  BUDGET: 'bg-success/10 text-success',
  CULTURAL: 'bg-info/10 text-info',
};

export function ItineraryCard({ title, shareToken, destinationSlugs, durationDays, travelStyle, budgetTotalINR, isAiGenerated, viewCount, saveCount, className }: ItineraryCardProps) {
  const image = getDestinationImage(destinationSlugs[0] ?? 'vietnam', 'card');

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
      <Link href={`/itineraries/${shareToken}`} className={cn('block neu-raised overflow-hidden group', className)}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
          <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/50 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
              <Calendar className="h-3 w-3" /> {durationDays} days
            </span>
            {isAiGenerated && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange/80 text-white backdrop-blur-sm">
                <Sparkles className="h-3 w-3" /> AI
              </span>
            )}
          </div>
          <h3 className="absolute bottom-3 left-4 right-4 font-display text-lg font-semibold text-white leading-tight">{title}</h3>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            {travelStyle && (
              <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', styleColors[travelStyle] ?? 'bg-sand-200 text-stone')}>
                {travelStyle.charAt(0) + travelStyle.slice(1).toLowerCase()}
              </span>
            )}
            {budgetTotalINR && (
              <span className="font-mono text-sm text-forest font-medium">{formatINR(Number(budgetTotalINR))}</span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-stone">
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {viewCount.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Bookmark className="h-3 w-3" /> {saveCount.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
