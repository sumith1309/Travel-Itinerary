import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { success, withErrorHandler, errorResponse } from '@/lib/utils/api';
import { withCache, CacheKeys, TTL } from '@/lib/cache/redis';
import { getSimilarDestinations } from '@/lib/services/recommendations';
import { buildDestinationContext } from '@/lib/ai/openai';

export const GET = withErrorHandler(async (
  _req: NextRequest,
  context?: { params?: Promise<{ slug: string }> }
) => {
  const slug = (await context?.params)?.slug ?? '';

  const detail = await withCache(
    CacheKeys.country(slug),
    async () => {
      const country = await prisma.country.findUnique({
        where: { slug, status: 'PUBLISHED' },
        include: {
          region: { select: { id: true, name: true, slug: true, description: true } },
          cities: {
            where: { status: 'PUBLISHED' },
            include: {
              _count: { select: { pointsOfInterest: true } },
            },
            orderBy: [{ isCapital: 'desc' }, { sortOrder: 'asc' }],
          },
          visaInfo: {
            where: { status: 'PUBLISHED' },
            select: {
              id: true,
              visaType: true,
              description: true,
              fees: true,
              processingTimeDays: true,
              documentsRequired: true,
              commonMistakes: true,
              tips: true,
            },
          },
        },
      });

      if (!country) return null;

      // Sample itineraries for this destination
      const sampleItineraries = await prisma.itinerary.findMany({
        where: {
          isSample: true,
          status: 'PUBLISHED',
          destinationSlugs: { has: slug },
        },
        select: {
          id: true,
          title: true,
          description: true,
          coverImageUrl: true,
          destinationSlugs: true,
          durationDays: true,
          travelStyle: true,
          pace: true,
          companionType: true,
          budgetTotalINR: true,
          viewCount: true,
          saveCount: true,
          isAiGenerated: true,
          createdAt: true,
        },
        orderBy: { viewCount: 'desc' },
        take: 6,
      });

      // Experiences linked to this destination
      const experiences = await prisma.experience.findMany({
        where: {
          status: 'PUBLISHED',
          bestDestinations: { has: slug },
        },
        take: 12,
      });

      // Build RAG context for AI use (stored in metadata)
      const cities = country.cities.map((city) => ({
        name: city.name,
        avgDailyBudgetINR: city.avgDailyBudgetINR,
        foodHighlights: city.foodHighlights,
        tags: city.tags,
        pois: [],
      }));

      return {
        ...country,
        sampleItineraries,
        experiences,
        destinationContext: buildDestinationContext({
          countryName: country.name,
          cities,
          visaInfo: country.visaInfo,
        }),
      };
    },
    TTL.LONG
  );

  if (!detail) {
    return errorResponse(404, 'Not Found', `Destination '${slug}' not found`);
  }

  // Get similar destinations (not cached here — recommendation service handles its own cache)
  const similarDestinations = await getSimilarDestinations(slug, 4);

  return success({ ...detail, similarDestinations });
});
