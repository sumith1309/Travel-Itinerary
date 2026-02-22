import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVisaByCountrySlug } from '@/lib/data/visa';
import { formatINR } from '@/lib/utils';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { VisaBadge } from '@/components/shared/visa-badge';
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const visa = await getVisaByCountrySlug(slug);
  if (!visa) return { title: 'Not Found' };
  return { title: `${visa.country.name} Visa Guide`, description: `Complete visa guide for Indian travellers to ${visa.country.name}` };
}

export default async function VisaDetailPage({ params }: Props) {
  const { slug } = await params;
  const visa = await getVisaByCountrySlug(slug);
  if (!visa) notFound();

  const fees = visa.fees as { inrApprox?: number; amount?: number; currency?: string } | null;
  const processing = visa.processingTimeDays as { min?: number; max?: number } | null;
  const docs = (visa.documentsRequired as { name: string; description: string; mandatory: boolean }[]) ?? [];
  const mistakes = (visa.commonMistakes as string[]) ?? [];
  const tips = (visa.tips as string[]) ?? [];

  return (
    <div className="pt-24 pb-[var(--spacing-section)]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Visa Hub', href: '/visa' }, { label: visa.country.name }]} className="mb-6" />

        <ScrollReveal>
          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-midnight mb-4">{visa.country.name} Visa Guide</h1>
            <div className="flex flex-wrap items-center gap-4">
              <VisaBadge visaType={visa.visaType} feeINR={fees?.inrApprox} />
              {processing && (
                <span className="text-sm text-stone">
                  Processing: {processing.min === 0 ? 'Instant (on arrival)' : `${processing.min}–${processing.max} business days`}
                </span>
              )}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <p className="text-midnight leading-relaxed mb-10">{visa.description}</p>
        </ScrollReveal>

        {/* Documents */}
        <ScrollReveal>
          <section className="mb-10">
            <h2 className="font-display text-xl font-semibold text-midnight mb-4">Required Documents</h2>
            <div className="space-y-3">
              {docs.map((doc, i) => (
                <div key={i} className="neu-raised p-4 flex gap-3">
                  {doc.mandatory ? (
                    <CheckCircle2 className="h-5 w-5 text-forest shrink-0 mt-0.5" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-sand-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-midnight">{doc.name}</p>
                    <p className="text-xs text-stone mt-0.5">{doc.description}</p>
                  </div>
                  {doc.mandatory && <span className="ml-auto text-xs text-forest font-medium shrink-0">Required</span>}
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Common Mistakes */}
        {mistakes.length > 0 && (
          <ScrollReveal>
            <section className="mb-10">
              <h2 className="font-display text-xl font-semibold text-midnight mb-4">Common Mistakes to Avoid</h2>
              <div className="space-y-3">
                {mistakes.map((mistake, i) => (
                  <div key={i} className="neu-concave p-4 flex gap-3">
                    <XCircle className="h-5 w-5 text-error shrink-0 mt-0.5" />
                    <p className="text-sm text-midnight">{mistake}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Tips */}
        {tips.length > 0 && (
          <ScrollReveal>
            <section className="mb-10">
              <h2 className="font-display text-xl font-semibold text-midnight mb-4">Pro Tips</h2>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <div key={i} className="neu-raised p-4 flex gap-3">
                    <Lightbulb className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <p className="text-sm text-midnight">{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {visa.applicationUrl && (
          <ScrollReveal>
            <div className="text-center py-8">
              <Button size="lg" asChild>
                <a href={visa.applicationUrl} target="_blank" rel="noopener noreferrer">
                  Apply Now <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
