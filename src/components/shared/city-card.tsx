'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn, formatINR } from '@/lib/utils';
import { resolveImage, getCityImage } from '@/lib/unsplash';

interface CityCardProps {
  name: string;
  slug: string;
  countrySlug: string;
  heroImageUrl?: string | null;
  avgDailyBudgetINR?: number | { toNumber(): number } | null;
  poiCount: number;
  tags?: string[];
  className?: string;
}

export function CityCard({ name, slug, countrySlug, heroImageUrl, avgDailyBudgetINR, poiCount, tags, className }: CityCardProps) {
  const image = resolveImage(heroImageUrl, getCityImage(slug));

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
      <Link href={`/destinations/${countrySlug}/${slug}`} className={cn('block neu-raised overflow-hidden group', className)}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <Image src={image} alt={name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/50 to-transparent" />
          <h3 className="absolute bottom-3 left-4 font-display text-xl font-semibold text-white">{name}</h3>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone">{poiCount} places to visit</span>
            {avgDailyBudgetINR && (
              <span className="font-mono text-forest font-medium">{formatINR(Number(avgDailyBudgetINR))}/day</span>
            )}
          </div>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-sand-200 text-stone">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
