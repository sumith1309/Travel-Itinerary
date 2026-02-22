import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/lib/data/destinations';
import { resolveImage, getCityImage } from '@/lib/unsplash';
import { formatINR } from '@/lib/utils';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { POICard } from '@/components/shared/poi-card';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { SectionHeader } from '@/components/shared/section-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Shield, Utensils, Bus } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string; citySlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { citySlug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) return { title: 'Not Found' };
  return {
    title: `${city.name} Travel Guide`,
    description: city.description?.slice(0, 160),
  };
}

export default async function CityPage({ params }: Props) {
  const { slug: countrySlug, citySlug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) notFound();

  const heroImage = resolveImage(city.heroImageUrl, getCityImage(citySlug));
  const food = city.foodHighlights as { mustTry?: string[]; vegetarianOptions?: string[]; indianFoodAvailable?: boolean } | null;
  const transport = city.localTransport as Record<string, unknown> | null;
  const pois = city.pointsOfInterest ?? [];
  const categories = [...new Set(pois.map((p) => p.category))];

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[350px]">
        <Image src={heroImage} alt={city.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 flex flex-col justify-end pb-10 px-4">
          <div className="mx-auto max-w-7xl w-full">
            <Breadcrumb
              items={[
                { label: 'Destinations', href: '/destinations' },
                { label: city.country.name, href: `/destinations/${countrySlug}` },
                { label: city.name },
              ]}
              className="mb-4 text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white"
            />
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">{city.name}</h1>
            {city.avgDailyBudgetINR && (
              <p className="mt-2 text-white/70">Average daily budget: <span className="font-mono text-white">{formatINR(city.avgDailyBudgetINR)}</span></p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-[var(--spacing-section-sm)]">
        {/* Description */}
        <ScrollReveal>
          <p className="text-lg text-midnight leading-relaxed max-w-3xl mb-12">{city.description}</p>
        </ScrollReveal>

        {/* POIs by Category */}
        {pois.length > 0 && (
          <section className="mb-16">
            <ScrollReveal>
              <SectionHeader title="Places to Visit" subtitle={`Top things to see and do in ${city.name}`} />
            </ScrollReveal>
            <Tabs defaultValue={categories[0] ?? 'all'}>
              <TabsList className="mb-6 flex-wrap">
                {categories.map((cat) => (
                  <TabsTrigger key={cat} value={cat}>
                    {cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((cat) => (
                <TabsContent key={cat} value={cat}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pois.filter((p) => p.category === cat).map((poi) => {
                      const imgs = poi.images as string[] | null;
                      return (
                        <POICard
                          key={poi.id}
                          name={poi.name}
                          category={poi.category}
                          subcategory={poi.subcategory}
                          shortDescription={poi.shortDescription}
                          heroImageUrl={imgs?.[0] ?? null}
                          avgDurationMins={poi.avgDurationMins ?? 0}
                          avgCostINR={Number(poi.avgCostINR ?? 0)}
                          bestTimeToVisit={poi.bestTimeToVisit}
                        />
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </section>
        )}

        {/* Food */}
        {food && (
          <ScrollReveal>
            <section className="mb-16">
              <SectionHeader title="Food Scene" subtitle={`What to eat in ${city.name}`} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {food.mustTry && food.mustTry.length > 0 && (
                  <div className="neu-raised p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Utensils className="h-5 w-5 text-orange" strokeWidth={1.5} />
                      <h3 className="font-display text-lg font-semibold">Must-Try Dishes</h3>
                    </div>
                    <ul className="space-y-2">
                      {food.mustTry.map((dish, i) => (
                        <li key={i} className="text-sm text-midnight">{dish}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {food.vegetarianOptions && food.vegetarianOptions.length > 0 && (
                  <div className="neu-raised p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">🟢</span>
                      <h3 className="font-display text-lg font-semibold">Vegetarian Options</h3>
                    </div>
                    <ul className="space-y-2">
                      {food.vegetarianOptions.map((opt, i) => (
                        <li key={i} className="text-sm text-midnight">{opt}</li>
                      ))}
                    </ul>
                    {food.indianFoodAvailable && (
                      <p className="mt-4 text-xs text-forest font-medium">Indian food available in this city</p>
                    )}
                  </div>
                )}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Safety Tips */}
        {city.safetyTips && city.safetyTips.length > 0 && (
          <ScrollReveal>
            <section className="mb-16">
              <SectionHeader title="Safety Tips" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {city.safetyTips.map((tip, i) => (
                  <div key={i} className="neu-concave p-4 flex gap-3">
                    <Shield className="h-5 w-5 text-forest shrink-0 mt-0.5" strokeWidth={1.5} />
                    <p className="text-sm text-midnight">{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Transport */}
        {transport && Object.keys(transport).length > 0 && (
          <ScrollReveal>
            <section className="mb-16">
              <SectionHeader title="Getting Around" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(transport).map(([mode, info]) => (
                  <div key={mode} className="neu-raised p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bus className="h-4 w-4 text-forest" strokeWidth={1.5} />
                      <h4 className="text-sm font-semibold text-midnight capitalize">{mode}</h4>
                    </div>
                    <p className="text-sm text-stone">{typeof info === 'string' ? info : info === true ? 'Available' : String(info)}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
