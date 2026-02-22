'use client';

import { UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { INDIA_SUB_REGIONS } from '@/lib/data/india-regions';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

interface CityFood {
  name: string;
  slug: string;
  foodHighlights: unknown;
  tags: string[];
}

interface FoodGuideProps {
  cities: CityFood[];
  className?: string;
}

interface FoodHighlights {
  mustTry?: string[];
  vegetarianOptions?: string[];
  indianFoodAvailable?: boolean;
  topRestaurants?: string[];
}

function parseFoodHighlights(raw: unknown): FoodHighlights | null {
  if (!raw || typeof raw !== 'object') return null;
  return raw as FoodHighlights;
}

export function FoodGuide({ cities, className }: FoodGuideProps) {
  // Group cities by sub-region and pick ones with food data
  const regionFoods = INDIA_SUB_REGIONS.map((region) => {
    const regionCities = cities
      .filter((c) => region.citySlugs.includes(c.slug))
      .map((c) => ({ ...c, food: parseFoodHighlights(c.foodHighlights) }))
      .filter((c) => c.food && c.food.mustTry && c.food.mustTry.length > 0);
    return { ...region, cities: regionCities };
  }).filter((r) => r.cities.length > 0);

  if (regionFoods.length === 0) return null;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-2">
        <UtensilsCrossed className="h-5 w-5 text-orange" strokeWidth={1.5} />
        <h3 className="font-display text-lg font-semibold text-midnight">Regional Cuisine Guide</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {regionFoods.map((region) => (
          <ScrollReveal key={region.slug}>
            <div className="neu-flat rounded-xl p-5 space-y-3">
              <h4 className="font-display font-semibold text-midnight">{region.name} Flavours</h4>
              {region.cities.slice(0, 3).map((city) => (
                <div key={city.slug} className="space-y-1">
                  <p className="text-sm font-medium text-midnight">{city.name}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {city.food!.mustTry!.slice(0, 4).map((dish) => (
                      <span
                        key={dish}
                        className="rounded-full bg-orange/10 px-2.5 py-0.5 text-xs text-orange"
                      >
                        {dish}
                      </span>
                    ))}
                  </div>
                  {city.food!.vegetarianOptions && city.food!.vegetarianOptions.length > 0 && (
                    <p className="text-xs text-stone">
                      Veg-friendly: {city.food!.vegetarianOptions.slice(0, 3).join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
