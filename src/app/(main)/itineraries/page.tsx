import type { Metadata } from 'next';
import { getSampleItineraries } from '@/lib/data/itineraries';
import { ItineraryCard } from '@/components/shared/itinerary-card';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const metadata: Metadata = {
  title: 'Itineraries',
  description: 'Ready-to-use travel itineraries for Indian travellers. Sample plans, AI-generated trips, and expert recommendations.',
};

export default async function ItinerariesPage() {
  const itineraries = await getSampleItineraries();

  return (
    <div className="pt-24 pb-[var(--spacing-section)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Itineraries' }]} className="mb-6" />
        <ScrollReveal>
          <SectionHeader title="Travel Itineraries" subtitle="Expert-crafted and AI-powered travel plans — ready to customize" />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((it, i) => (
            <ScrollReveal key={it.id} delay={i * 0.08}>
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
    </div>
  );
}
