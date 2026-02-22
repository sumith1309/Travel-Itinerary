import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getVisaEntries } from '@/lib/data/visa';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { VisaBadge } from '@/components/shared/visa-badge';

const visaOrder = ['VISA_FREE', 'VISA_ON_ARRIVAL', 'E_VISA', 'EMBASSY_VISA'];
const visaEmoji: Record<string, string> = {
  VISA_FREE: '🟢',
  VISA_ON_ARRIVAL: '🟡',
  E_VISA: '🔵',
  EMBASSY_VISA: '🔴',
};

export async function VisaGlance() {
  const entries = await getVisaEntries();

  const grouped = visaOrder.map((type) => ({
    type,
    entries: entries.filter((e) => e.visaType === type),
  }));

  return (
    <section className="py-[var(--spacing-section)] px-4">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeader
            title="Visa at a Glance"
            subtitle="Visa requirements for Indian passport holders"
            viewAllHref="/visa"
            viewAllLabel="Full Visa Hub"
          />
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {grouped.map(({ type, entries: items }, i) => (
            <ScrollReveal key={type} delay={i * 0.1}>
              <div className="neu-raised p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{visaEmoji[type]}</span>
                  <VisaBadge visaType={type} size="sm" />
                </div>
                <ul className="space-y-2">
                  {items.map((entry) => {
                    const fees = entry.fees as { inrApprox?: number } | null;
                    return (
                      <li key={entry.id} className="flex items-center justify-between text-sm">
                        <Link href={`/visa/${entry.country.slug}`} className="text-midnight hover:text-forest transition-colors">
                          {entry.country.name}
                        </Link>
                        {fees?.inrApprox !== undefined && fees.inrApprox > 0 && (
                          <span className="font-mono text-xs text-stone">₹{fees.inrApprox.toLocaleString('en-IN')}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
