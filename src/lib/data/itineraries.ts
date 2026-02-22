import prisma from '@/lib/db';

function serializeDecimals<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj;
  // Duck-type Prisma Decimal: has toNumber() and toFixed() but isn't a plain number
  if (typeof obj === 'object' && obj !== null && 'toNumber' in obj && typeof (obj as Record<string, unknown>).toNumber === 'function') {
    return (obj as unknown as { toNumber(): number }).toNumber() as unknown as T;
  }
  if (Array.isArray(obj)) return obj.map(serializeDecimals) as unknown as T;
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = serializeDecimals(value);
    }
    return result as T;
  }
  return obj;
}

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
  const itinerary = await prisma.itinerary.findUnique({
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
  return itinerary ? serializeDecimals(itinerary) : null;
}
