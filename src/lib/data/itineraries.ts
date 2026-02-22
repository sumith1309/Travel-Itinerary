import prisma from '@/lib/db';

export async function getSampleItineraries() {
  return prisma.itinerary.findMany({
    where: { isSample: true, status: 'PUBLISHED' },
    include: {
      days: {
        orderBy: { dayNumber: 'asc' },
        include: {
          items: { orderBy: { sortOrder: 'asc' } },
        },
      },
    },
    orderBy: { viewCount: 'desc' },
  });
}

export async function getFeaturedItineraries() {
  return prisma.itinerary.findMany({
    where: { isSample: true, status: 'PUBLISHED', isPublic: true },
    orderBy: { saveCount: 'desc' },
    take: 3,
  });
}

export async function getItineraryByShareToken(token: string) {
  return prisma.itinerary.findUnique({
    where: { shareToken: token },
    include: {
      days: {
        orderBy: { dayNumber: 'asc' },
        include: {
          city: { select: { id: true, name: true, slug: true } },
          items: {
            orderBy: { sortOrder: 'asc' },
            include: {
              poi: { select: { id: true, name: true, latitude: true, longitude: true } },
            },
          },
        },
      },
    },
  });
}
