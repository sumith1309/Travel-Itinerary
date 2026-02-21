import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { visaQuerySchema } from '@/lib/validators/schemas';
import { success, withErrorHandler } from '@/lib/utils/api';
import { withCache, CacheKeys, TTL } from '@/lib/cache/redis';
import type { VisaCategoryCounts } from '@/types';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const query = visaQuerySchema.parse(Object.fromEntries(searchParams));

  const { page, limit, type, country } = query;
  const skip = (page - 1) * limit;

  const cacheKey = CacheKeys.visa(type, country, page);

  const data = await withCache(
    cacheKey,
    async () => {
      const where = {
        status: 'PUBLISHED' as const,
        ...(type ? { visaType: type } : {}),
        ...(country
          ? { country: { slug: country } }
          : {}),
      };

      const [visaEntries, total, categoryCounts] = await Promise.all([
        prisma.visaInfo.findMany({
          where,
          include: {
            country: {
              include: {
                region: { select: { id: true, name: true, slug: true, description: true } },
              },
            },
          },
          orderBy: [{ country: { name: 'asc' } }],
          skip,
          take: limit,
        }),
        prisma.visaInfo.count({ where }),
        // Category counts
        prisma.visaInfo.groupBy({
          by: ['visaType'],
          where: { status: 'PUBLISHED' },
          _count: { _all: true },
        }),
      ]);

      const counts: VisaCategoryCounts = {
        VISA_FREE: 0,
        VISA_ON_ARRIVAL: 0,
        E_VISA: 0,
        EMBASSY_VISA: 0,
      };
      categoryCounts.forEach((c) => {
        counts[c.visaType] = c._count._all;
      });

      return { visaEntries, total, categoryCounts: counts };
    },
    TTL.LONG
  );

  return success({
    data: data.visaEntries,
    meta: {
      pagination: {
        page,
        limit,
        total: data.total,
        totalPages: Math.ceil(data.total / limit),
      },
      categoryCounts: data.categoryCounts,
    },
  });
});
