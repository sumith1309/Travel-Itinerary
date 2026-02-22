// ============================================================
// POST /api/itineraries/[slug]/regenerate-day — Regenerate a single day
// Uses AI to regenerate one day of an existing itinerary.
// Auth required. Only the itinerary owner can regenerate days.
// ============================================================

import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { success, errorResponse, withErrorHandler } from '@/lib/api-utils';
import { generateItinerary } from '@/lib/ai/openai';
import { buildRAGContext } from '@/lib/services/context-builder';

export const POST = withErrorHandler(async (
  req: NextRequest,
  context?: { params?: Promise<{ slug: string }> }
) => {
  const slug = (await context?.params)?.slug ?? '';

  if (!slug) {
    return errorResponse(400, 'Bad Request', 'Itinerary slug is required');
  }

  // ── Auth check ─────────────────────────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, 'Unauthorized', 'Authentication required');
  }
  const userId = session.user.id;

  // ── Parse body ─────────────────────────────────────────────
  let body: { dayNumber?: number };
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, 'Bad Request', 'Invalid JSON body');
  }

  const { dayNumber } = body;

  if (typeof dayNumber !== 'number' || dayNumber < 1) {
    return errorResponse(400, 'Bad Request', 'dayNumber is required and must be a positive integer');
  }

  // ── Find itinerary owned by user ───────────────────────────
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      OR: [
        { shareToken: slug, userId },
        { id: slug, userId },
      ],
    },
    select: {
      id: true,
      title: true,
      destinationSlugs: true,
      durationDays: true,
      travelStyle: true,
      pace: true,
      companionType: true,
      budgetTotalINR: true,
      interests: true,
    },
  });

  if (!itinerary) {
    return errorResponse(404, 'Not Found', 'Itinerary not found or does not belong to you');
  }

  if (dayNumber > itinerary.durationDays) {
    return errorResponse(
      400,
      'Bad Request',
      `dayNumber ${dayNumber} exceeds itinerary duration of ${itinerary.durationDays} days`
    );
  }

  // ── Find the existing day ──────────────────────────────────
  const day = await prisma.itineraryDay.findFirst({
    where: { itineraryId: itinerary.id, dayNumber },
    include: { items: true },
  });

  if (!day) {
    return errorResponse(404, 'Not Found', `Day ${dayNumber} not found in this itinerary`);
  }

  // ── Build destination context for AI ───────────────────────
  const primarySlug = itinerary.destinationSlugs[0];
  let destinationContext = '';

  if (primarySlug) {
    destinationContext = await buildRAGContext(primarySlug);
  }

  // ── Fetch user profile and travel history for personalization
  const [travelProfile, travelHistory] = await Promise.all([
    prisma.travelProfile.findUnique({ where: { userId } }),
    prisma.travelHistory.findMany({
      where: { userId },
      include: {
        destination: { include: { region: true } },
        city: true,
      },
      orderBy: { tripDate: 'desc' },
      take: 10,
    }),
  ]);

  // ── Generate a fresh single-day itinerary via AI ───────────
  const generated = await generateItinerary({
    destinationSlugs: itinerary.destinationSlugs,
    durationDays: 1,
    travelStyle: itinerary.travelStyle ?? undefined,
    pace: itinerary.pace ?? undefined,
    companionType: itinerary.companionType ?? undefined,
    interests: itinerary.interests,
    budgetTotalINR: itinerary.budgetTotalINR
      ? Math.round(Number(itinerary.budgetTotalINR) / itinerary.durationDays)
      : undefined,
    userProfile: travelProfile,
    travelHistory: travelHistory as Parameters<typeof generateItinerary>[0]['travelHistory'],
    destinationContext,
  });

  const generatedDay = generated.days[0];

  if (!generatedDay) {
    return errorResponse(
      500,
      'Generation Failed',
      'AI failed to generate a replacement day. Please try again.'
    );
  }

  // ── Delete old items for this day ──────────────────────────
  await prisma.itineraryItem.deleteMany({
    where: { dayId: day.id },
  });

  // ── Update day metadata and create new items ───────────────
  const updatedDay = await prisma.itineraryDay.update({
    where: { id: day.id },
    data: {
      title: generatedDay.title,
      description: generatedDay.description,
      dailyBudgetINR: generatedDay.dailyBudgetINR,
      weatherAdvisory: generatedDay.weatherAdvisory ?? null,
      items: {
        create: generatedDay.items.map((item, idx) => ({
          timeSlot: item.timeSlot,
          startTime: item.startTime ?? null,
          endTime: item.endTime ?? null,
          title: item.title,
          description: item.description,
          estimatedCostINR: item.estimatedCostINR,
          transportMode: item.transportMode ?? null,
          transportDurationMins: item.transportDurationMins ?? null,
          transportNotes: item.transportNotes ?? null,
          tags: item.tags,
          sortOrder: idx,
        })),
      },
    },
    include: {
      items: { orderBy: { sortOrder: 'asc' } },
      city: true,
    },
  });

  // ── Update itinerary timestamp ─────────────────────────────
  await prisma.itinerary.update({
    where: { id: itinerary.id },
    data: { updatedAt: new Date() },
  });

  return success(updatedDay);
});
