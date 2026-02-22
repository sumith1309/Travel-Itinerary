'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { MapPin, Tent } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { WEEKEND_GETAWAYS } from '@/lib/data/weekend-getaways';
import { MetroGetawayCard } from '@/components/india/metro-getaway-card';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { FestivalBanner } from '@/components/shared/festival-banner';

export default function WeekendGetawaysPage() {
  const [selectedMetro, setSelectedMetro] = useState(0);
  const current = WEEKEND_GETAWAYS[selectedMetro];

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-forest/10 via-sand to-orange/5 pt-32 pb-16 px-4">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb
            items={[{ label: 'Weekend Getaways' }]}
            className="mb-4"
          />
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10">
              <Tent className="h-6 w-6 text-forest" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-midnight">
                Weekend Getaways
              </h1>
              <p className="text-stone text-sm">Escape the city without the leave application</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Metro Selector Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {WEEKEND_GETAWAYS.map((metro, i) => (
            <button
              key={metro.metroSlug || metro.metro}
              onClick={() => setSelectedMetro(i)}
              className={cn(
                'relative rounded-full px-5 py-2.5 text-sm font-medium transition-all',
                i === selectedMetro
                  ? 'bg-forest text-white shadow-md'
                  : 'neu-flat text-midnight hover:bg-sand-200/50'
              )}
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {metro.metro}
              </span>
            </button>
          ))}
        </div>

        {/* Current Metro Getaways */}
        {current && (
          <motion.div
            key={current.metro}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-display text-2xl font-semibold text-midnight mb-2">
              From {current.metro}
            </h2>
            <p className="text-stone text-sm mb-6">
              {current.getaways.length} getaway destinations within easy reach
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {current.getaways.map((getaway, i) => (
                <ScrollReveal key={getaway.to} delay={i * 0.08}>
                  <MetroGetawayCard getaway={getaway} />
                </ScrollReveal>
              ))}
            </div>
          </motion.div>
        )}

        {/* Festival Calendar */}
        <div className="mt-16">
          <ScrollReveal>
            <FestivalBanner maxFestivals={4} />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
