'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveImage, getDestinationImage } from '@/lib/unsplash';

interface DestinationCardProps {
  name: string;
  slug: string;
  heroImageUrl?: string | null;
  budgetTier?: string | null;
  cityCount: number;
  visaType?: string;
  className?: string;
}

const visaColors: Record<string, string> = {
  VISA_FREE: 'bg-success/80 text-white',
  VISA_ON_ARRIVAL: 'bg-warning/80 text-white',
  E_VISA: 'bg-info/80 text-white',
  EMBASSY_VISA: 'bg-error/80 text-white',
};

const visaLabels: Record<string, string> = {
  VISA_FREE: 'Visa Free',
  VISA_ON_ARRIVAL: 'VOA',
  E_VISA: 'E-Visa',
  EMBASSY_VISA: 'Embassy',
};

const budgetLabels: Record<string, string> = {
  budget: 'Budget',
  moderate: 'Mid-Range',
  premium: 'Premium',
};

export function DestinationCard({ name, slug, heroImageUrl, budgetTier, cityCount, visaType, className }: DestinationCardProps) {
  const image = resolveImage(heroImageUrl, getDestinationImage(slug, 'card'));

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
      <Link href={`/destinations/${slug}`} className={cn('block neu-raised overflow-hidden group', className)}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-transparent" />

          {visaType && (
            <span className={cn('absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm', visaColors[visaType])}>
              {visaLabels[visaType]}
            </span>
          )}

          {budgetTier && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
              {budgetLabels[budgetTier] ?? budgetTier}
            </span>
          )}

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-display text-2xl font-semibold text-white">{name}</h3>
          </div>
        </div>

        <div className="p-4 flex items-center gap-2 text-sm text-stone">
          <MapPin className="h-4 w-4" strokeWidth={1.5} />
          <span>{cityCount} {cityCount === 1 ? 'city' : 'cities'}</span>
        </div>
      </Link>
    </motion.div>
  );
}
