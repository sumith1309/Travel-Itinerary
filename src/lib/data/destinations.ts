import prisma from '@/lib/db';
import type { ContentStatus } from '@prisma/client';

export async function getCountries(region?: string, budgetTier?: string) {
  const where: Record<string, unknown> = { status: 'PUBLISHED' as ContentStatus };
  if (region) where.region = { slug: region };
  if (budgetTier) where.budgetTier = budgetTier;

  return prisma.country.findMany({
    where,
    include: {
      region: { select: { name: true, slug: true } },
      cities: { select: { id: true, name: true, slug: true }, where: { status: 'PUBLISHED' }, orderBy: { sortOrder: 'asc' } },
      visaInfo: { select: { visaType: true, fees: true, processingTimeDays: true }, take: 1 },
    },
    orderBy: { name: 'asc' },
  });
}

export async function getCountryBySlug(slug: string) {
  const country = await prisma.country.findUnique({
    where: { slug },
    include: {
      region: { select: { name: true, slug: true } },
      cities: {
        where: { status: 'PUBLISHED' },
        orderBy: { sortOrder: 'asc' },
        include: {
          pointsOfInterest: {
            where: { status: 'PUBLISHED' },
            orderBy: { ratingAvg: 'desc' },
            take: 6,
          },
        },
      },
      visaInfo: true,
    },
  });

  if (!country) return null;

  // Experiences and Itineraries use string arrays (bestDestinations / destinationSlugs)
  // so we query them separately
  const [experiences, itineraries] = await Promise.all([
    prisma.experience.findMany({
      where: { status: 'PUBLISHED', bestDestinations: { has: slug } },
      take: 6,
    }),
    prisma.itinerary.findMany({
      where: { isSample: true, status: 'PUBLISHED', destinationSlugs: { has: slug } },
      take: 3,
    }),
  ]);

  return { ...country, experiences, itineraries };
}

export async function getCityBySlug(slug: string) {
  return prisma.city.findUnique({
    where: { slug },
    include: {
      country: {
        select: { name: true, slug: true, currencyCode: true, currencyName: true },
      },
      pointsOfInterest: {
        where: { status: 'PUBLISHED' },
        orderBy: { ratingAvg: 'desc' },
      },
    },
  });
}

export async function getRegions() {
  return prisma.region.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      countries: {
        where: { status: 'PUBLISHED' },
        select: { id: true, name: true, slug: true, budgetTier: true },
      },
    },
  });
}
