import type { Metadata } from 'next';
import { getVisaEntries, getVisaCategoryCounts } from '@/lib/data/visa';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { VisaBadge } from '@/components/shared/visa-badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import Image from 'next/image';
import { resolveImage, getDestinationImage } from '@/lib/unsplash';
import { formatINR } from '@/lib/utils';
import { FileText, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Visa Hub',
  description: 'Complete visa guide for Indian passport holders. Visa-free, VOA, e-visa, and embassy visa requirements for all destinations.',
};

export default async function VisaPage() {
  const entries = await getVisaEntries();
  const counts = await getVisaCategoryCounts();

  const types = [
    { value: 'all', label: 'All', count: entries.length },
    { value: 'VISA_FREE', label: 'Visa Free', count: counts['VISA_FREE'] ?? 0 },
    { value: 'VISA_ON_ARRIVAL', label: 'VOA', count: counts['VISA_ON_ARRIVAL'] ?? 0 },
    { value: 'E_VISA', label: 'E-Visa', count: counts['E_VISA'] ?? 0 },
    { value: 'EMBASSY_VISA', label: 'Embassy', count: counts['EMBASSY_VISA'] ?? 0 },
  ];

  return (
    <div className="pt-24 pb-[var(--spacing-section)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Visa Hub' }]} className="mb-6" />
        <ScrollReveal>
          <SectionHeader
            title="Visa Hub for Indian Travellers"
            subtitle="Everything you need to know about visa requirements, documents, fees, and processing times"
          />
        </ScrollReveal>

        <Tabs defaultValue="all">
          <TabsList className="mb-8 flex-wrap">
            {types.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label} ({t.count})
              </TabsTrigger>
            ))}
          </TabsList>

          {types.map((t) => {
            const filtered = t.value === 'all' ? entries : entries.filter((e) => e.visaType === t.value);
            return (
              <TabsContent key={t.value} value={t.value}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((entry) => {
                    const fees = entry.fees as { inrApprox?: number } | null;
                    const processing = entry.processingTimeDays as { min?: number; max?: number } | null;
                    const image = resolveImage(entry.country.heroImageUrl, getDestinationImage(entry.country.slug, 'card'));
                    return (
                      <ScrollReveal key={entry.id}>
                        <Link href={`/visa/${entry.country.slug}`} className="block neu-raised overflow-hidden group">
                          <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
                            <Image src={image} alt={entry.country.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-midnight/50 to-transparent" />
                            <h3 className="absolute bottom-3 left-4 font-display text-xl font-semibold text-white">{entry.country.name}</h3>
                          </div>
                          <div className="p-4 space-y-3">
                            <VisaBadge visaType={entry.visaType} feeINR={fees?.inrApprox} />
                            <div className="flex items-center gap-4 text-sm text-stone">
                              {processing && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                                  {processing.min === 0 ? 'Instant' : `${processing.min}–${processing.max} days`}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
                                {(entry.documentsRequired as unknown[])?.length ?? 0} docs
                              </span>
                            </div>
                          </div>
                        </Link>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
