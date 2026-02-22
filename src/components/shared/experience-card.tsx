'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn, formatINR } from '@/lib/utils';
import { resolveImage, getExperienceImage } from '@/lib/unsplash';

interface ExperienceCardProps {
  name: string;
  slug: string;
  category: string;
  shortDescription?: string | null;
  heroImageUrl?: string | null;
  budgetRangeINR?: { budget?: number; midRange?: number; luxury?: number } | null;
  className?: string;
}

const categoryIcons: Record<string, string> = {
  FOOD_MARKETS: '🍜',
  ISLAND_BEACH: '🏝️',
  CULTURE_HISTORY: '🏛️',
  LUXURY_STAYS: '✨',
  ADVENTURE_ACTIVITIES: '🏔️',
  NATURE_LANDSCAPES: '🌿',
};

export function ExperienceCard({ name, slug, category, shortDescription, heroImageUrl, budgetRangeINR, className }: ExperienceCardProps) {
  const image = resolveImage(heroImageUrl, getExperienceImage(slug));
  const budget = budgetRangeINR as { budget?: number; midRange?: number } | null;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
      <Link href={`/experiences/${slug}`} className={cn('block neu-raised overflow-hidden group', className)}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <Image src={image} alt={name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/50 to-transparent" />
          <div className="absolute top-3 left-3 h-10 w-10 flex items-center justify-center rounded-full glass text-lg">
            {categoryIcons[category] ?? '🌍'}
          </div>
          <h3 className="absolute bottom-3 left-4 right-4 font-display text-xl font-semibold text-white">{name}</h3>
        </div>
        <div className="p-4 space-y-2">
          {shortDescription && <p className="text-sm text-stone line-clamp-2">{shortDescription}</p>}
          {budget && (
            <p className="text-sm font-mono text-forest">
              From {formatINR(budget.budget ?? 0)}<span className="text-stone font-sans">/day</span>
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
