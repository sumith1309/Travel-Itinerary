import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { itinerariesQuerySchema, itineraryBodySchema } from '@/lib/validators/schemas';
import {
  success,
  paginated,
  errorResponse,
  withErrorHandler,
  withRateLimit,
  requireAuth,
  optionalAuth,
} from '@/lib/utils/api';
import { generateItinerary, buildDestinationContext } from '@/lib/ai/openai';
import type { GeneratedItinerary } from '@/types';

// GET /api/itineraries
export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await optionalAuth(req);
  const { searchParams } = req.nextUrl;
  const query = itinerariesQuerySchema.parse(Object.fromEntries(searchParams));

  const { page, limit, type, destination, style, duration } = query;
  const skip = (page - 1) * limit;

  if (type === 'my' && !user) {
    return errorResponse(401, 'Unauthorized', 'Authentication required to view your itineraries');
  }

  const where = {
    ...(type === 'my' && user ? { userId: user.id, status: { not: 'ARCHIVED' as const } } : {}),
    ...(type === 'samples' ? { isSample: true, status: 'PUBLISHED' as const } : {}),
    ...(type === 'public' ? { isPublic: true, status: 'PUBLISHED' as const } : {}),
    ...(destination ? { destinationSlugs: { has: destination } } : {}),
    ...(style ? { travelStyle: style } : {}),
    ...(duration ? { durationDays: duration } : {}),
  } as Prisma.ItineraryWhereInput;

  const [itineraries, total] = await Promise.all([
    prisma.itinerary.findMany({
      where,
      include: {
        user: { select: { name: true, avatarUrl: true } },
        _count: { select: { days: true } },
      },
      orderBy:
        type === 'my' ? { updatedAt: 'desc' } : { viewCount: 'desc' },
      skip,
      take: limit,
    }),
    prisma.itinerary.count({ where }),
  ]);

  return paginated(itineraries, total, page, limit);
});

// POST /api/itineraries
async function postHandler(req: NextRequest) {
  const user = await requireAuth(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, 'Bad Request', 'Invalid JSON body');
  }

  const data = itineraryBodySchema.parse(body);

  if (!data.generate) {
    // Manual itinerary creation
    const itinerary = await prisma.itinerary.create({
      data: {
        userId: user.id,
        title: data.title,
        description: (data as { description?: string }).description ?? null,
        destinationSlugs: data.destinationSlugs,
        durationDays: data.durationDays,
        travelStyle: data.travelStyle ?? null,
        pace: data.pace ?? null,
        companionType: data.companionType ?? null,
        interests: data.interests ?? [],
        budgetTotalINR: data.budgetTotalINR ?? null,
        isAiGenerated: false,
        status: 'DRAFT',
      },
    });

    return success(itinerary, 201);
  }

  // AI-powered generation
  const generateData = data as Extract<typeof data, { generate: true }>;

  // Fetch user profile and travel history for personalization
  const [travelProfile, travelHistory] = await Promise.all([
    prisma.travelProfile.findUnique({ where: { userId: user.id } }),
    prisma.travelHistory.findMany({
      where: { userId: user.id },
      include: {
        destination: { include: { region: true } },
        city: true,
      },
      orderBy: { tripDate: 'desc' },
      take: 20,
    }),
  ]);

  // Build RAG context from destination database
  const destinationData = await prisma.country.findMany({
    where: {
      slug: { in: generateData.destinationSlugs },
      status: 'PUBLISHED',
    },
    include: {
      cities: {
        where: { status: 'PUBLISHED' },
        include: {
          pointsOfInterest: {
            where: { status: 'PUBLISHED' },
            select: {
              name: true,
              slug: true,
              category: true,
              avgCostINR: true,
              avgDurationMins: true,
              tags: true,
            },
            take: 15,
          },
        },
        take: 5,
      },
      visaInfo: {
        where: { status: 'PUBLISHED' },
        select: { visaType: true, fees: true, processingTimeDays: true },
      },
    },
  });

  const destinationContext = destinationData
    .map((country) =>
      buildDestinationContext({
        countryName: country.name,
        cities: country.cities.map((city) => ({
          name: city.name,
          avgDailyBudgetINR: city.avgDailyBudgetINR,
          foodHighlights: city.foodHighlights,
          tags: city.tags,
          pois: city.pointsOfInterest.map((p) => ({
            name: p.name,
            slug: p.slug,
            category: p.category,
            avgCostINR: p.avgCostINR ? Number(p.avgCostINR) : null,
            avgDurationMins: p.avgDurationMins,
            tags: p.tags,
          })),
        })),
        visaInfo: country.visaInfo,
      })
    )
    .join('\n\n');

  // Call Claude to generate itinerary
  const generated: GeneratedItinerary = await generateItinerary({
    destinationSlugs: generateData.destinationSlugs,
    durationDays: generateData.durationDays,
    travelStyle: generateData.travelStyle,
    pace: generateData.pace,
    companionType: generateData.companionType,
    interests: generateData.interests,
    budgetTotalINR: generateData.budgetTotalINR,
    dietaryPreferences: generateData.dietaryPreferences,
    userProfile: travelProfile,
    travelHistory: travelHistory as Parameters<typeof generateItinerary>[0]['travelHistory'],
    destinationContext,
  });

  // Save to database with nested days and items
  const itinerary = await prisma.itinerary.create({
    data: {
      userId: user.id,
      title: generated.title,
      description: generated.description,
      destinationSlugs: generated.destinationSlugs,
      durationDays: generated.durationDays,
      travelStyle: generated.travelStyle,
      pace: generated.pace,
      companionType: generated.companionType,
      budgetTotalINR: generated.budgetTotalINR,
      interests: generateData.interests ?? [],
      isAiGenerated: true,
      status: 'DRAFT',
      days: {
        create: generated.days.map((day) => ({
          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description,
          dailyBudgetINR: day.dailyBudgetINR,
          weatherAdvisory: day.weatherAdvisory ?? null,
          items: {
            create: day.items.map((item, idx) => ({
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
        })),
      },
    },
    include: {
      days: { include: { items: true, city: true }, orderBy: { dayNumber: 'asc' } },
    },
  });

  return success(itinerary, 201);
}

export const POST = withRateLimit(
  withErrorHandler(postHandler),
  30,
  60_000
);
