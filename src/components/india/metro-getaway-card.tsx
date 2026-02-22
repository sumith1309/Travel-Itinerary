'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatINR } from '@/lib/utils';
import { getCityImage } from '@/lib/unsplash';
import type { WeekendGetaway } from '@/lib/data/weekend-getaways';

interface MetroGetawayCardProps {
  getaway: WeekendGetaway;
  className?: string;
}

export function MetroGetawayCard({ getaway, className }: MetroGetawayCardProps) {
  const imageUrl = getaway.toSlug ? getCityImage(getaway.toSlug) : getCityImage('hanoi');
  const href = getaway.toSlug ? `/destinations/india/${getaway.toSlug}` : '/destinations/india';

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn('neu-raised rounded-xl overflow-hidden group', className)}
      >
        <div className="relative h-40">
          <Image
            src={imageUrl}
            alt={getaway.to}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <h3 className="font-display text-lg font-bold text-white">{getaway.to}</h3>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center gap-4 text-xs text-stone">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {getaway.distanceKm} km
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {getaway.travelTime}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <Wallet className="h-3.5 w-3.5 text-forest" />
            <span className="font-mono text-midnight">
              {formatINR(getaway.budgetPerPersonINR.min)}–{formatINR(getaway.budgetPerPersonINR.max)}
            </span>
            <span className="text-stone">/person</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {getaway.bestFor.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-sand-200/60 px-2 py-0.5 text-xs text-stone capitalize"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-xs text-stone">{getaway.highlight}</p>
        </div>
      </motion.div>
    </Link>
  );
}
