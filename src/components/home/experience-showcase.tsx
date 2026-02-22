import { getExperiences } from '@/lib/data/experiences';
import { ExperienceCard } from '@/components/shared/experience-card';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export async function ExperienceShowcase() {
  const experiences = await getExperiences();

  return (
    <section className="py-[var(--spacing-section)] px-4 bg-surface-sunken">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeader
            title="Curated Experiences"
            subtitle="Unique travel experiences designed for Indian travellers"
            viewAllHref="/experiences"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.slice(0, 6).map((exp, i) => (
            <ScrollReveal key={exp.id} delay={i * 0.1}>
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
    </section>
  );
}
