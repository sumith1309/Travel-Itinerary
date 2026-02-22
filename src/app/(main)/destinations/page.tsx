import type { Metadata } from 'next';
import { getCountries } from '@/lib/data/destinations';
import { DestinationCard } from '@/components/shared/destination-card';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Breadcrumb } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'Explore our curated collection of destinations perfect for Indian travellers. From budget-friendly Vietnam to luxury Maldives.',
};

export default async function DestinationsPage() {
  const countries = await getCountries();

  return (
    <div className="pt-24 pb-[var(--spacing-section)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Destinations' }]} className="mb-6" />

        <ScrollReveal>
          <SectionHeader
            title="Explore Destinations"
            subtitle="Hand-picked countries and cities for Indian travellers — with visa info, budgets, and insider tips all in INR"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country, i) => (
            <ScrollReveal key={country.id} delay={i * 0.08}>
              <DestinationCard
                name={country.name}
                slug={country.slug}
                heroImageUrl={country.heroImageUrl}
                budgetTier={country.budgetTier}
                cityCount={country.cities.length}
                visaType={country.visaInfo[0]?.visaType}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
