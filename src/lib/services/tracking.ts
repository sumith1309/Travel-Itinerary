// ============================================================
// TRAILS AND MILES — Behavioral Tracking Service
// Server-side event persistence for recommendation intelligence
// ============================================================

import prisma from '@/lib/db';

// ── Event Type Definitions ───────────────────────────────────

export type TrackableEvent =
  | { type: 'page_view'; data: { page: string; destination?: string } }
  | { type: 'search'; data: { query: string; resultCount: number } }
  | { type: 'destination_view'; data: { slug: string; timeSpent?: number } }
  | { type: 'city_view'; data: { slug: string; country: string } }
  | { type: 'poi_view'; data: { slug: string; category: string; city: string } }
  | { type: 'experience_view'; data: { slug: string; category: string } }
  | { type: 'visa_check'; data: { country: string; visaType: string } }
  | { type: 'blog_read'; data: { slug: string; category: string; readTime: number } }
  | { type: 'itinerary_generate'; data: { destination: string; duration: number; style: string } }
  | { type: 'itinerary_view'; data: { slug: string; isAiGenerated: boolean } }
  | { type: 'itinerary_save'; data: { slug: string } }
  | { type: 'chat_message'; data: { sessionId: string; intent?: string } }
  | { type: 'onboarding_complete'; data: { archetype: string } }
  | { type: 'recommendation_click'; data: { slug: string; position: number; reason: string } }
  | { type: 'filter_use'; data: { filterType: string; value: string } };

// ── Track Single Event ───────────────────────────────────────

export async function trackEvent(
  userId: string,
  event: TrackableEvent
): Promise<void> {
  try {
    await prisma.behaviorEvent.create({
      data: {
        userId,
        eventType: event.type,
        entityType: getEntityType(event),
        entityId: getEntityId(event),
        metadata: (event.data ?? {}) as import('@prisma/client').Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    // Tracking should never break the user experience
    console.warn('[Tracking] Failed to persist event:', event.type, error);
  }
}

// ── Batch Track Events ───────────────────────────────────────

export async function batchTrackEvents(
  userId: string,
  events: TrackableEvent[]
): Promise<void> {
  if (events.length === 0) return;

  try {
    await prisma.behaviorEvent.createMany({
      data: events.map((event) => ({
        userId,
        eventType: event.type,
        entityType: getEntityType(event),
        entityId: getEntityId(event),
        metadata: (event.data ?? {}) as import('@prisma/client').Prisma.InputJsonValue,
      })),
    });
  } catch (error) {
    console.warn('[Tracking] Failed to batch persist events:', error);
  }
}

// ── Get Recent Events ────────────────────────────────────────

export async function getRecentEvents(
  userId: string,
  limit: number = 100
) {
  return prisma.behaviorEvent.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

// ── Get Event Summary ────────────────────────────────────────

export async function getEventSummary(userId: string) {
  const events = await getRecentEvents(userId, 200);

  const destinationViews: Record<string, number> = {};
  const searches: string[] = [];
  const categories: Record<string, number> = {};
  let totalEvents = events.length;
  let highIntentCount = 0;

  for (const event of events) {
    const meta = event.metadata as Record<string, unknown> | null;
    switch (event.eventType) {
      case 'destination_view':
        destinationViews[String(meta?.slug ?? '')] =
          (destinationViews[String(meta?.slug ?? '')] || 0) + 1;
        break;
      case 'search':
        if (meta?.query) searches.push(String(meta.query));
        break;
      case 'itinerary_generate':
        highIntentCount += 3;
        break;
      case 'visa_check':
        highIntentCount += 2;
        break;
      case 'poi_view':
      case 'experience_view':
        if (meta?.category)
          categories[String(meta.category)] =
            (categories[String(meta.category)] || 0) + 1;
        break;
    }
  }

  return {
    totalEvents,
    topDestinations: Object.entries(destinationViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([slug, count]) => ({ slug, count })),
    recentSearches: [...new Set(searches)].slice(0, 10),
    topCategories: Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count })),
    travelReadiness:
      highIntentCount > 5
        ? ('ready_to_book' as const)
        : highIntentCount > 2
          ? ('planning' as const)
          : ('browsing' as const),
  };
}

// ── Helpers ──────────────────────────────────────────────────

function getEntityType(event: TrackableEvent): string | null {
  switch (event.type) {
    case 'destination_view':
      return 'country';
    case 'city_view':
      return 'city';
    case 'poi_view':
      return 'poi';
    case 'experience_view':
      return 'experience';
    case 'itinerary_view':
    case 'itinerary_save':
    case 'itinerary_generate':
      return 'itinerary';
    case 'blog_read':
      return 'blog';
    case 'visa_check':
      return 'visa';
    case 'chat_message':
      return 'chat';
    default:
      return null;
  }
}

function getEntityId(event: TrackableEvent): string | null {
  const data = event.data as Record<string, unknown>;
  return (data.slug as string) ?? (data.sessionId as string) ?? null;
}
