import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getItineraryByShareToken } from '@/lib/data/itineraries';
import { auth } from '@/lib/auth';
import { formatINR } from '@/lib/utils';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { EnhancedDayView } from '@/components/itinerary/enhanced-day-view';
import { BudgetChart } from '@/components/itinerary/budget-chart';
import { DayMap } from '@/components/itinerary/day-map';
import { ItineraryActions, DayRegenerate } from '@/components/itinerary/itinerary-client-actions';
import { Clock, MapPin, IndianRupee, Sparkles, Eye, Bookmark } from 'lucide-react';

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const it = await getItineraryByShareToken(slug);
  if (!it) return { title: 'Not Found' };
  return { title: it.title, description: it.description?.slice(0, 160) };
}

export default async function ItineraryDetailPage({ params }: Props) {
  const { slug } = await params;
  const it = await getItineraryByShareToken(slug);
  if (!it) notFound();

  const session = await auth();
  const isOwner = session?.user?.id === it.userId;

  const totalBudget = Number(it.budgetTotalINR ?? 0) || it.days.reduce((sum, day) => sum + Number(day.dailyBudgetINR ?? 0), 0);

  // Build budget breakdown from items across all days
  const budgetByCategory: Record<string, number> = {};
  for (const day of it.days) {
    for (const item of day.items) {
      const cost = Number(item.estimatedCostINR ?? 0);
      if (cost <= 0) continue;
      // Infer category from tags or time slot
      const isFood = item.tags.some((t: string) => ['food', 'restaurant', 'cafe', 'dining', 'meal'].includes(t.toLowerCase()));
      const isTransport = item.transportMode != null;
      const category = isFood ? 'food' : isTransport ? 'transport' : 'activities';
      budgetByCategory[category] = (budgetByCategory[category] ?? 0) + cost;
    }
  }
  const budgetItems = Object.entries(budgetByCategory).map(([category, amount]) => ({ category, amount }));

  // Serialize days for PDF export (converting Decimal to number)
  const pdfDays = it.days.map((day) => ({
    dayNumber: day.dayNumber,
    title: day.title,
    dailyBudgetINR: day.dailyBudgetINR ? Number(day.dailyBudgetINR) : null,
    items: day.items.map((item) => ({
      timeSlot: item.timeSlot,
      startTime: item.startTime,
      endTime: item.endTime,
      title: item.title,
      description: item.description,
      estimatedCostINR: item.estimatedCostINR ? Number(item.estimatedCostINR) : null,
      transportMode: item.transportMode,
    })),
  }));

  return (
    <div className="pt-24 pb-[var(--spacing-section)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Itineraries', href: '/itineraries' }, { label: it.title }]} className="mb-6" />

        {/* Header */}
        <ScrollReveal>
          <div className="mb-10">
            <div className="flex flex-wrap gap-2 mb-3">
              {it.travelStyle && <Badge>{it.travelStyle.charAt(0) + it.travelStyle.slice(1).toLowerCase()}</Badge>}
              {it.isAiGenerated && <Badge variant="secondary"><Sparkles className="h-3 w-3 mr-1" /> AI Generated</Badge>}
              {it.pace && <Badge variant="outline">{it.pace.charAt(0) + it.pace.slice(1).toLowerCase()} pace</Badge>}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-midnight mb-3">{it.title}</h1>
            {it.description && <p className="text-stone leading-relaxed mb-4">{it.description}</p>}
            <div className="flex flex-wrap items-center gap-4 text-sm text-stone mb-6">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {it.durationDays} days</span>
              {totalBudget > 0 && <span className="flex items-center gap-1 font-mono text-forest"><IndianRupee className="h-4 w-4" /> {formatINR(totalBudget)}</span>}
              <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {it.viewCount.toLocaleString()} views</span>
              <span className="flex items-center gap-1"><Bookmark className="h-4 w-4" /> {it.saveCount.toLocaleString()} saves</span>
            </div>

            {/* Actions: Share + PDF Export */}
            <ItineraryActions
              itineraryId={it.id}
              shareToken={it.shareToken}
              title={it.title}
              description={it.description}
              durationDays={it.durationDays}
              travelStyle={it.travelStyle}
              totalBudget={totalBudget}
              days={pdfDays}
              isOwner={isOwner}
            />
          </div>
        </ScrollReveal>

        {/* Day-by-Day Timeline */}
        <div className="space-y-12">
          {it.days.map((day) => (
            <ScrollReveal key={day.id}>
              <div>
                {/* Enhanced Day View */}
                <EnhancedDayView
                  dayNumber={day.dayNumber}
                  title={day.title}
                  description={day.description}
                  dailyBudgetINR={day.dailyBudgetINR ? Number(day.dailyBudgetINR) : null}
                  weatherAdvisory={day.weatherAdvisory}
                  items={day.items.map((item) => ({
                    id: item.id,
                    timeSlot: item.timeSlot,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    title: item.title,
                    description: item.description,
                    estimatedCostINR: item.estimatedCostINR ? Number(item.estimatedCostINR) : null,
                    transportMode: item.transportMode,
                    transportDurationMins: item.transportDurationMins,
                    transportNotes: item.transportNotes,
                    imageUrl: item.imageUrl,
                    tags: item.tags,
                  }))}
                  cityName={day.city?.name}
                />

                {/* Day Map */}
                <div className="mt-4 ml-6 pl-8">
                  <DayMap
                    dayNumber={day.dayNumber}
                    items={day.items.map((item) => ({
                      title: item.title,
                      timeSlot: item.timeSlot,
                      lat: item.poi?.latitude ? Number(item.poi.latitude) : undefined,
                      lng: item.poi?.longitude ? Number(item.poi.longitude) : undefined,
                    }))}
                  />
                </div>

                {/* Regenerate button (owner only) */}
                {isOwner && it.isAiGenerated && (
                  <div className="mt-3 ml-6 pl-8">
                    <DayRegenerate dayNumber={day.dayNumber} itineraryId={it.id} />
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Budget Chart */}
        {budgetItems.length > 0 && totalBudget > 0 && (
          <ScrollReveal>
            <div className="mt-12">
              <BudgetChart items={budgetItems} totalBudget={totalBudget} />
            </div>
          </ScrollReveal>
        )}

        {/* Budget Summary Table */}
        {totalBudget > 0 && (
          <ScrollReveal>
            <div className="mt-8 neu-raised rounded-xl p-6">
              <h2 className="font-display text-xl font-semibold text-midnight mb-4">Daily Budget Breakdown</h2>
              <div className="space-y-2">
                {it.days.map((day) => (
                  <div key={day.id} className="flex justify-between text-sm">
                    <span className="text-stone">Day {day.dayNumber}: {day.title}</span>
                    <span className="font-mono text-midnight">{formatINR(Number(day.dailyBudgetINR ?? 0))}</span>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t border-sand-300 flex justify-between font-semibold">
                  <span className="text-midnight">Total Estimated Budget</span>
                  <span className="font-mono text-forest">{formatINR(totalBudget)}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
