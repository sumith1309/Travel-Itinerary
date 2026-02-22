import type { Metadata } from 'next';
import { getExperiences } from '@/lib/data/experiences';
import { ExperienceCard } from '@/components/shared/experience-card';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const metadata: Metadata = {
  title: 'Experiences',
  description: 'Curated travel experiences for Indian travellers — from street food adventures to luxury overwater stays.',
};

export default async function ExperiencesPage() {
  const experiences = await getExperiences();

  return (
    <div className="pt-24 pb-[var(--spacing-section)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Experiences' }]} className="mb-6" />
        <ScrollReveal>
          <SectionHeader title="Travel Experiences" subtitle="Unique experiences curated for Indian travellers across Southeast Asia" />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, i) => (
            <ScrollReveal key={exp.id} delay={i * 0.08}>
              <ExperienceCard
                name={exp.name}
                slug={exp.slug}
                category={exp.category}
                shortDescription={exp.shortDescription}
                heroImageUrl={exp.heroImageUrl}
                budgetRangeINR={exp.budgetRangeINR as { budget?: number; midRange?: number; luxury?: number } | null}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
