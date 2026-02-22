import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Globe, Shield, Wallet, Train } from 'lucide-react';
import { getCountryBySlug } from '@/lib/data/destinations';
import { resolveImage, getDestinationImage } from '@/lib/unsplash';
import { formatINR } from '@/lib/utils';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { CityCard } from '@/components/shared/city-card';
import { VisaBadge } from '@/components/shared/visa-badge';
import { ItineraryCard } from '@/components/shared/itinerary-card';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { SectionHeader } from '@/components/shared/section-header';
import { Button } from '@/components/ui/button';
import { RegionExplorer } from '@/components/india/region-explorer';
import { FoodGuide } from '@/components/india/food-guide';
import { FestivalBanner } from '@/components/shared/festival-banner';
import { TrainInfo } from '@/components/shared/train-info';
import { POPULAR_TRAIN_ROUTES } from '@/lib/data/train-routes';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) return { title: 'Not Found' };
  return {
    title: country.name,
    description: country.description?.slice(0, 160),
  };
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) notFound();

  const heroImage = resolveImage(country.heroImageUrl, getDestinationImage(slug, 'hero'));
  const visa = country.visaInfo?.[0];
  const visaFees = visa?.fees as { inrApprox?: number } | null;

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image src={heroImage} alt={country.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-4">
          <div className="mx-auto max-w-7xl w-full">
            <Breadcrumb
              items={[
                { label: 'Destinations', href: '/destinations' },
                { label: country.name },
              ]}
              className="mb-4 text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white"
            />
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">{country.name}</h1>
            {country.region && (
              <p className="mt-2 text-white/70">{country.region.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Facts Bar */}
      <div className="relative z-10 -mt-8 mx-auto max-w-7xl px-4">
        <div className="glass rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-forest" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-stone">Language</p>
              <p className="text-sm font-medium text-midnight">{country.language}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-forest" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-stone">Currency</p>
              <p className="text-sm font-medium text-midnight">{country.currencyCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-forest" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-stone">Safety</p>
              <p className="text-sm font-medium text-midnight">{country.safetyRating}/5</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-forest" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-stone">Cities</p>
              <p className="text-sm font-medium text-midnight">{country.cities.length} to explore</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-[var(--spacing-section-sm)]">
        {/* Description */}
        <ScrollReveal>
          <div className="max-w-3xl mb-16">
            <p className="text-lg text-midnight leading-relaxed">{country.description}</p>
          </div>
        </ScrollReveal>

        {/* Cities — India gets grouped by sub-region, others get flat grid */}
        {country.cities.length > 0 && (
          <section className="mb-16">
            <ScrollReveal>
              <SectionHeader
                title={slug === 'india' ? 'Explore by Region' : `Cities in ${country.name}`}
                subtitle={slug === 'india' ? '25 cities across 4 diverse regions' : 'Explore the best cities and towns'}
              />
            </ScrollReveal>
            {slug === 'india' ? (
              <RegionExplorer cities={country.cities} countrySlug={slug} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {country.cities.map((city, i) => (
                  <ScrollReveal key={city.id} delay={i * 0.1}>
                    <CityCard
                      name={city.name}
                      slug={city.slug}
                      countrySlug={slug}
                      heroImageUrl={city.heroImageUrl}
                      avgDailyBudgetINR={city.avgDailyBudgetINR ?? undefined}
                      poiCount={city.pointsOfInterest?.length ?? 0}
                      tags={city.tags}
                    />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </section>
        )}

        {/* India-specific sections */}
        {slug === 'india' && (
          <>
            {/* Festival Calendar */}
            <ScrollReveal>
              <section className="mb-16">
                <FestivalBanner maxFestivals={6} />
              </section>
            </ScrollReveal>

            {/* Regional Food Guide */}
            <ScrollReveal>
              <section className="mb-16">
                <FoodGuide cities={country.cities} />
              </section>
            </ScrollReveal>

            {/* Popular Train Routes */}
            <section className="mb-16">
              <ScrollReveal>
                <SectionHeader
                  title="Travel by Train"
                  subtitle="Popular Indian Railway routes between cities"
                />
              </ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {POPULAR_TRAIN_ROUTES.slice(0, 6).map((route, i) => (
                  <ScrollReveal key={route.name} delay={i * 0.08}>
                    <TrainInfo route={route} />
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Visa Summary */}
        {visa && (
          <ScrollReveal>
            <section className="mb-16">
              <SectionHeader title="Visa Information" subtitle="For Indian passport holders" />
              <div className="neu-raised p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <VisaBadge visaType={visa.visaType} feeINR={visaFees?.inrApprox} />
                  <p className="text-sm text-stone max-w-xl">{visa.description?.slice(0, 200)}...</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/visa/${slug}`}>Full Visa Guide</Link>
                </Button>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Sample Itineraries */}
        {country.itineraries && country.itineraries.length > 0 && (
          <section className="mb-16">
            <ScrollReveal>
              <SectionHeader title="Sample Itineraries" viewAllHref="/itineraries" />
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {country.itineraries.map((it, i) => (
                <ScrollReveal key={it.id} delay={i * 0.1}>
                  <ItineraryCard
                    title={it.title}
                    shareToken={it.shareToken ?? it.id}
                    destinationSlugs={it.destinationSlugs}
                    durationDays={it.durationDays}
                    travelStyle={it.travelStyle}
                    budgetTotalINR={it.budgetTotalINR}
                    isAiGenerated={it.isAiGenerated}
                    viewCount={it.viewCount}
                    saveCount={it.saveCount}
                  />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <ScrollReveal>
          <div className="text-center py-12 neu-raised rounded-2xl">
            <h2 className="font-display text-2xl font-semibold text-midnight mb-3">
              Ready for {country.name}?
            </h2>
            <p className="text-stone mb-6">Plan your perfect trip with AI-powered itineraries</p>
            <Button size="lg" asChild>
              <Link href="/itineraries">Create Your Itinerary</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
