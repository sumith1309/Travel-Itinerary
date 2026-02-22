import { getCountries } from '@/lib/data/destinations';
import { DestinationCard } from '@/components/shared/destination-card';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export async function TrendingDestinations() {
  const countries = await getCountries();

  return (
    <section className="py-[var(--spacing-section)] px-4">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeader
            title="Trending Destinations"
            subtitle="Hand-picked destinations loved by Indian travellers"
            viewAllHref="/destinations"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.slice(0, 6).map((country, i) => (
            <ScrollReveal key={country.id} delay={i * 0.1}>
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
    </section>
  );
}
