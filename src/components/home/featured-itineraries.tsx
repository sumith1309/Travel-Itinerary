import { getFeaturedItineraries } from '@/lib/data/itineraries';
import { ItineraryCard } from '@/components/shared/itinerary-card';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export async function FeaturedItineraries() {
  const itineraries = await getFeaturedItineraries();

  if (itineraries.length === 0) return null;

  return (
    <section className="py-[var(--spacing-section)] px-4 bg-surface-sunken">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeader
            title="Featured Itineraries"
            subtitle="Ready-to-use travel plans crafted by experts and AI"
            viewAllHref="/itineraries"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((it, i) => (
            <ScrollReveal key={it.id} delay={i * 0.1}>
              <ItineraryCard
                title={it.title}
                shareToken={it.shareToken ?? it.id}
                destinationSlugs={it.destinationSlugs}
                durationDays={it.durationDays}
                travelStyle={it.travelStyle}
                budgetTotalINR={it.budgetTotalINR ? Number(it.budgetTotalINR) : null}
                isAiGenerated={it.isAiGenerated}
                viewCount={it.viewCount}
                saveCount={it.saveCount}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
