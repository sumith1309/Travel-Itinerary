import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/db';
import { userPatchSchema, userPostSchema } from '@/lib/validators';
import { success, withErrorHandler, requireAuth } from '@/lib/api-utils';
import { cacheDel, CacheKeys } from '@/lib/cache/redis';

// GET /api/users — Current user profile with stats
export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);

  const [userWithProfile, stats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        passportNationality: true,
        emailVerified: true,
        createdAt: true,
        travelProfile: true,
        travelHistory: {
          include: {
            destination: {
              include: {
                region: { select: { id: true, name: true, slug: true, description: true } },
              },
            },
            city: true,
          },
          orderBy: { tripDate: 'desc' },
          take: 20,
        },
      },
    }),
    prisma.$transaction([
      prisma.itinerary.count({ where: { userId: user.id } }),
      prisma.savedItinerary.count({ where: { userId: user.id } }),
      prisma.review.count({ where: { userId: user.id } }),
      prisma.chatSession.count({ where: { userId: user.id } }),
    ]),
  ]);

  const [itineraryCount, savedCount, reviewCount, chatCount] = stats;

  return success({
    ...userWithProfile,
    stats: { itineraryCount, savedCount, reviewCount, chatCount },
  });
});

// PATCH /api/users — Update profile or travel preferences
export const PATCH = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return success({ message: 'No changes made' });
  }

  const data = userPatchSchema.parse(body);

  if (data._type === 'profile') {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name ?? undefined,
        avatarUrl: data.avatarUrl ?? undefined,
        passportNationality: data.passportNationality ?? undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        passportNationality: true,
      },
    });

    return success(updated);
  }

  // travel_profile upsert
  const updated = await prisma.travelProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      defaultTravelStyle: data.defaultTravelStyle ?? null,
      defaultPace: data.defaultPace ?? null,
      budgetMinINR: data.budgetMinINR ?? 20000,
      budgetMaxINR: data.budgetMaxINR ?? 100000,
      preferredInterests: data.preferredInterests ?? [],
      dietaryPreferences: data.dietaryPreferences ?? [],
      companionType: data.companionType ?? null,
      accessibilityNeeds: (data.accessibilityNeeds as Prisma.InputJsonValue) ?? undefined,
      onboardingCompleted: data.onboardingCompleted ?? false,
    },
    update: {
      defaultTravelStyle: data.defaultTravelStyle ?? undefined,
      defaultPace: data.defaultPace ?? undefined,
      budgetMinINR: data.budgetMinINR ?? undefined,
      budgetMaxINR: data.budgetMaxINR ?? undefined,
      preferredInterests: data.preferredInterests ?? undefined,
      dietaryPreferences: data.dietaryPreferences ?? undefined,
      companionType: data.companionType ?? undefined,
      accessibilityNeeds: (data.accessibilityNeeds as Prisma.InputJsonValue) ?? undefined,
      onboardingCompleted: data.onboardingCompleted ?? undefined,
    },
  });

  // Invalidate recommendation cache
  await cacheDel(CacheKeys.recommendations(user.id));

  return success(updated);
});

// POST /api/users — Log trip or track event
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return success({ message: 'No action taken' });
  }

  const data = userPostSchema.parse(body);

  if (data.action === 'log_trip') {
    const history = await prisma.travelHistory.create({
      data: {
        userId: user.id,
        destinationId: data.destinationId,
        cityId: data.cityId ?? null,
        tripDate: new Date(data.tripDate),
        durationDays: data.durationDays,
        travelStyle: data.travelStyle ?? null,
        budgetSpentINR: data.budgetSpentINR ?? null,
        rating: data.rating ?? null,
        highlights: data.highlights ?? [],
        notes: data.notes ?? null,
      },
    });

    // Invalidate recommendation cache
    await cacheDel(CacheKeys.recommendations(user.id));

    return success(history, 201);
  }

  // track_event
  const event = await prisma.behaviorEvent.create({
    data: {
      userId: user.id,
      eventType: data.eventType,
      entityType: data.entityType ?? null,
      entityId: data.entityId ?? null,
      metadata: (data.metadata as Prisma.InputJsonValue) ?? undefined,
    },
  });

  return success(event, 201);
});
