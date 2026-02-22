// ============================================================
// TRAILS AND MILES — RAG Context Builder
// Queries Prisma for destination data and formats it for AI prompts
// ============================================================

import prisma from '@/lib/db';
import type { TravelProfileData, TravelHistoryEntry } from '@/types';
import { getUpcomingFestivals } from '@/lib/data/festivals';
import { POPULAR_TRAIN_ROUTES } from '@/lib/data/train-routes';

/**
 * Build rich RAG context from destination database for AI grounding.
 * Prevents hallucination by injecting real data into the system prompt.
 */
export async function buildRAGContext(
  destinationSlug: string,
  cityNames?: string[]
): Promise<string> {
  const country = await prisma.country.findUnique({
    where: { slug: destinationSlug },
    include: {
      cities: {
        where: { status: 'PUBLISHED' },
        include: {
          pointsOfInterest: {
            where: { status: 'PUBLISHED' },
            take: 15,
            orderBy: { ratingCount: 'desc' },
          },
        },
        take: destinationSlug === 'india' ? 25 : 5,
      },
      visaInfo: { where: { status: 'PUBLISHED' } },
    },
  });

  if (!country) return '';

  const cities = cityNames?.length
    ? country.cities.filter((c) => cityNames.includes(c.slug) || cityNames.includes(c.name.toLowerCase()))
    : country.cities;

  const quickFacts = country.quickFacts as Record<string, unknown> | null;
  const bestSeasons = country.bestSeasons as { months?: number[]; description?: string; peak?: number[]; shoulder?: number[]; avoid?: number[] } | null;

  const citiesText = cities
    .map((city) => {
      const food = city.foodHighlights as { mustTry?: string[]; vegetarianOptions?: string[]; indianFoodAvailable?: boolean } | null;
      const transport = city.localTransport as Record<string, unknown> | null;

      const poisText = city.pointsOfInterest
        .map(
          (p) =>
            `    - ${p.name} [${p.category}] — ₹${Number(p.avgCostINR ?? 0)} avg, ~${p.avgDurationMins ?? 60}min, tags: ${p.tags.join(', ')} (slug: ${p.slug})`
        )
        .join('\n');

      return `  ${city.name} (avg ₹${city.avgDailyBudgetINR ?? 3000}/day, ${city.budgetTier ?? 'moderate'}):
    Tags: ${city.tags.join(', ')}
    Vegetarian options: ${food?.vegetarianOptions?.join(', ') ?? 'Limited'}
    Indian food available: ${food?.indianFoodAvailable ? 'Yes' : 'Limited'}
    Must-try dishes: ${food?.mustTry?.join(', ') ?? 'Ask locally'}
    Safety: ${city.safetyTips.slice(0, 3).join('; ') || 'Standard precautions'}
    Transport: ${transport ? JSON.stringify(transport) : 'Taxi and local buses available'}
    Points of Interest:
${poisText}`;
    })
    .join('\n\n');

  const visaText = country.visaInfo
    .map((v) => {
      const fees = v.fees as { inrApprox?: number } | null;
      const time = v.processingTimeDays as { min?: number; max?: number } | null;
      return `  - ${v.visaType}: ₹${fees?.inrApprox ?? 0} fee, ${time?.min ?? 0}-${time?.max ?? 7} day processing`;
    })
    .join('\n');

  // Build India-specific context if applicable
  let indiaContext = '';
  if (destinationSlug === 'india') {
    const currentMonth = new Date().getMonth() + 1;
    const upcoming = getUpcomingFestivals(currentMonth, 4);
    const festivalLines = upcoming
      .map(
        (f) =>
          `  - ${f.name} (Month ${f.month}): ${f.travelImpact} impact — ${f.travelTip}. Best at: ${f.bestDestinations.join(', ')}`
      )
      .join('\n');

    const trainLines = POPULAR_TRAIN_ROUTES.slice(0, 8)
      .map(
        (r) =>
          `  - ${r.trainNames[0]}: ${r.from} → ${r.to}, ${r.durationHours}hrs, Sleeper ₹${r.fareINR.sleeper}/AC3 ₹${r.fareINR.ac3}/AC2 ₹${r.fareINR.ac2}`
      )
      .join('\n');

    indiaContext = `

Upcoming Festivals (travel impact):
${festivalLines}

Popular Train Routes:
${trainLines}
  Booking: Book 120 days in advance on IRCTC (irctc.co.in). Tatkal opens at 10am (AC) / 11am (Sleeper).

India-Specific Notes:
  - UPI (Google Pay, PhonePe, Paytm) accepted almost everywhere
  - No visa needed — domestic travel (ILP required for Arunachal, Nagaland, Mizoram; PAP for Lakshadweep)
  - Budget in INR, not USD. Average backpacker: ₹1,500-3,000/day; Mid-range: ₹3,000-8,000/day; Luxury: ₹8,000+/day
  - SIM cards: Jio/Airtel available at airports (₹200-500 for 28 days unlimited data)`;
  }

  return `=== DESTINATION DATABASE: ${country.name} ===

Quick Facts:
  Currency: ${country.currencyCode} (${country.currencyName ?? ''})
  Language: ${country.language ?? 'N/A'}
  Timezone: ${country.timezone ?? 'N/A'}
  Safety Rating: ${country.safetyRating ?? 'N/A'}/5
  Budget Tier: ${country.budgetTier ?? 'moderate'}
  Indian Food: ${quickFacts?.indianFoodAvailability ?? 'varies'}
  SIM Card Cost: ${quickFacts?.simCardCost ?? 'N/A'}
  UPI Accepted: ${quickFacts?.upiAccepted ? 'Yes (limited)' : 'No — carry cash/cards'}
  Electrical Plug: ${quickFacts?.electricalPlug ?? 'N/A'}

Best Seasons:
  ${bestSeasons?.description ?? 'Year-round destination'}
  Peak months: ${bestSeasons?.peak?.join(', ') ?? 'N/A'}
  Shoulder months: ${bestSeasons?.shoulder?.join(', ') ?? 'N/A'}
  Avoid: ${bestSeasons?.avoid?.join(', ') ?? 'None'}

Cities and Points of Interest:
${citiesText}

Visa Information for Indian Passport Holders:
${visaText}${indiaContext}

=== END DESTINATION DATA ===`;
}

/**
 * Format user profile for AI prompt injection
 */
export function formatProfileForAI(profile: TravelProfileData): string {
  return `## User Profile
- Travel Style: ${profile.defaultTravelStyle ?? 'Not specified'}
- Pace: ${profile.defaultPace ?? 'Not specified'}
- Budget: ₹${profile.budgetMinINR.toLocaleString('en-IN')} – ₹${profile.budgetMaxINR.toLocaleString('en-IN')} per person
- Interests: ${profile.preferredInterests.join(', ') || 'Not specified'}
- Dietary: ${profile.dietaryPreferences.join(', ') || 'No preference'}
- Travelling: ${profile.companionType ?? 'Not specified'}
- Onboarding: ${profile.onboardingCompleted ? 'Complete' : 'Incomplete'}`;
}

/**
 * Format travel history for AI prompt injection
 */
export function formatHistoryForAI(history: TravelHistoryEntry[]): string {
  if (history.length === 0) return 'No previous travel history.';

  const trips = history
    .map(
      (h) =>
        `- ${h.destination.name}${h.city ? ` (${h.city.name})` : ''}: ${h.durationDays} days, ${h.travelStyle ?? 'unknown'} style, rated ${h.rating ?? 'N/A'}/5${h.highlights.length ? `, highlights: ${h.highlights.join(', ')}` : ''}`
    )
    .join('\n');

  return `## Travel History (${history.length} trips)\n${trips}`;
}

/**
 * Format behavior events into a summary for AI
 */
export function formatBehaviorForAI(
  events: Array<{ eventType: string; entityType: string | null; entityId: string | null; metadata: unknown; createdAt: Date }>
): string {
  if (events.length === 0) return 'No behavior data available.';

  const destinationViews: Record<string, number> = {};
  const searches: string[] = [];
  const categories: Record<string, number> = {};
  let highIntent = 0;

  for (const event of events) {
    const meta = event.metadata as Record<string, unknown> | null;
    switch (event.eventType) {
      case 'destination_view':
        destinationViews[String(meta?.slug ?? event.entityId ?? 'unknown')] =
          (destinationViews[String(meta?.slug ?? event.entityId ?? 'unknown')] || 0) + 1;
        break;
      case 'search':
        if (meta?.query) searches.push(String(meta.query));
        break;
      case 'itinerary_generate':
        highIntent += 3;
        break;
      case 'visa_check':
        highIntent += 2;
        break;
      case 'poi_view':
      case 'experience_view':
        if (meta?.category) categories[String(meta.category)] = (categories[String(meta.category)] || 0) + 1;
        break;
    }
  }

  const parts: string[] = ['## Behavior Summary'];
  if (Object.keys(destinationViews).length)
    parts.push(`Most viewed: ${Object.entries(destinationViews).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k} (${v}x)`).join(', ')}`);
  if (searches.length)
    parts.push(`Recent searches: ${[...new Set(searches)].slice(0, 5).join(', ')}`);
  if (Object.keys(categories).length)
    parts.push(`Interested in: ${Object.entries(categories).sort((a, b) => b[1] - a[1]).map(([k]) => k).join(', ')}`);
  parts.push(`Travel readiness: ${highIntent > 5 ? 'Ready to book' : highIntent > 2 ? 'Actively planning' : 'Browsing'}`);

  return parts.join('\n');
}
