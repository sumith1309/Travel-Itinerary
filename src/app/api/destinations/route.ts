import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { destinationsQuerySchema } from '@/lib/validators';
import { paginated, withErrorHandler } from '@/lib/api-utils';
import { withCache, CacheKeys, TTL } from '@/lib/cache/redis';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const query = destinationsQuerySchema.parse(Object.fromEntries(searchParams));

  const { page, limit, region, budgetTier } = query;
  const skip = (page - 1) * limit;

  const cacheKey = CacheKeys.countryList(region ?? budgetTier ?? 'all');

  const result = await withCache(
    `${cacheKey}:p${page}:l${limit}`,
    async () => {
      const where = {
        status: 'PUBLISHED' as const,
        ...(region ? { region: { slug: region } } : {}),
        ...(budgetTier ? { budgetTier } : {}),
      };

      const [countries, total] = await Promise.all([
        prisma.country.findMany({
          where,
          include: {
            region: { select: { id: true, name: true, slug: true, description: true } },
            _count: { select: { cities: true } },
          },
          orderBy: [{ safetyRating: 'desc' }, { name: 'asc' }],
          skip,
          take: limit,
        }),
        prisma.country.count({ where }),
      ]);

      return { countries, total };
    },
    TTL.LONG
  );

  return paginated(result.countries, result.total, page, limit);
});
