import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { getCountryBySlug } from '@/lib/data/destinations';
import { CityCard } from '@/components/shared/city-card';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { SectionHeader } from '@/components/shared/section-header';
import { Button } from '@/components/ui/button';

const FEATURED_CITY_SLUGS = ['jaipur', 'goa', 'kochi', 'varanasi', 'leh-ladakh', 'hampi'];

export async function ExploreIndia() {
  const india = await getCountryBySlug('india');
  if (!india) return null;

  const featuredCities = india.cities.filter((c) => FEATURED_CITY_SLUGS.includes(c.slug));

  if (featuredCities.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-[var(--spacing-section-sm)]">
      <ScrollReveal>
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-3 py-1 text-xs font-medium text-forest">
                <MapPin className="h-3 w-3" /> Domestic
              </span>
            </div>
            <SectionHeader
              title="Explore India"
              subtitle="25 cities, 100+ experiences — no visa needed"
            />
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:flex">
            <Link href="/destinations/india">
              View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCities.map((city, i) => (
          <ScrollReveal key={city.id} delay={i * 0.08}>
            <CityCard
              name={city.name}
              slug={city.slug}
              countrySlug="india"
              heroImageUrl={city.heroImageUrl}
              avgDailyBudgetINR={city.avgDailyBudgetINR ?? undefined}
              poiCount={city.pointsOfInterest?.length ?? 0}
              tags={city.tags}
            />
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Button variant="outline" asChild>
          <Link href="/destinations/india">
            Explore All Indian Cities <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
