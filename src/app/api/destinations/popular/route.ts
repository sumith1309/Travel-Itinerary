import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { success, withErrorHandler } from '@/lib/api-utils';
import { withCache, CacheKeys, TTL } from '@/lib/cache/redis';

async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const limit = parseInt(searchParams.get('limit') || '8', 10);

  const data = await withCache(
    CacheKeys.trending(),
    async () => {
      const currentMonth = new Date().getMonth() + 1;

      const countries = await prisma.country.findMany({
        where: { status: 'PUBLISHED' },
        include: { region: true },
      });

      const scored = countries.map((country) => {
        const seasons = country.bestSeasons as { months?: number[]; peak?: number[] } | null;
        const isInSeason = seasons?.months?.includes(currentMonth) ?? false;
        const isPeak = seasons?.peak?.includes(currentMonth) ?? false;

        const score = isPeak ? 1.0 : isInSeason ? 0.8 : 0.4;

        return {
          slug: country.slug,
          name: country.name,
          region: country.region.name,
          regionSlug: country.region.slug,
          budgetTier: country.budgetTier,
          tags: country.tags.slice(0, 5),
          heroImageUrl: country.heroImageUrl,
          score,
          isInSeason,
        };
      });

      return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    },
    TTL.MEDIUM
  );

  return success(data);
}

export const GET = withErrorHandler(handler);
