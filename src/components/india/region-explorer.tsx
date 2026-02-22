'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { INDIA_SUB_REGIONS } from '@/lib/data/india-regions';
import { CityCard } from '@/components/shared/city-card';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

interface CityData {
  id: string;
  name: string;
  slug: string;
  heroImageUrl?: string | null;
  avgDailyBudgetINR?: number | null;
  tags: string[];
  pointsOfInterest?: unknown[];
}

interface RegionExplorerProps {
  cities: CityData[];
  countrySlug: string;
  className?: string;
}

export function RegionExplorer({ cities, countrySlug, className }: RegionExplorerProps) {
  const [expandedRegion, setExpandedRegion] = useState<string>(INDIA_SUB_REGIONS[0]?.slug ?? '');

  return (
    <div className={cn('space-y-6', className)}>
      {INDIA_SUB_REGIONS.map((region) => {
        const regionCities = cities.filter((c) => region.citySlugs.includes(c.slug));
        if (regionCities.length === 0) return null;
        const isExpanded = expandedRegion === region.slug;

        return (
          <div key={region.slug} className="neu-raised rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedRegion(isExpanded ? '' : region.slug)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-sand-200/30 transition-colors"
            >
              <div>
                <h3 className="font-display text-xl font-semibold text-midnight">{region.name}</h3>
                <p className="text-sm text-stone mt-0.5">{region.description} &middot; {regionCities.length} cities</p>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-stone" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5 pt-0">
                    {regionCities.map((city, i) => (
                      <ScrollReveal key={city.id} delay={i * 0.05}>
                        <CityCard
                          name={city.name}
                          slug={city.slug}
                          countrySlug={countrySlug}
                          heroImageUrl={city.heroImageUrl}
                          avgDailyBudgetINR={city.avgDailyBudgetINR ?? undefined}
                          poiCount={Array.isArray(city.pointsOfInterest) ? city.pointsOfInterest.length : 0}
                          tags={city.tags}
                        />
                      </ScrollReveal>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
