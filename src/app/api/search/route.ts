import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { searchQuerySchema } from '@/lib/validators/schemas';
import { success, withErrorHandler, withRateLimit } from '@/lib/utils/api';
import { withCache, CacheKeys, TTL } from '@/lib/cache/redis';
import type { SearchResult } from '@/types';

async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchQuerySchema.parse(Object.fromEntries(searchParams));

  const { q, type, page, limit } = query;
  const skip = (page - 1) * limit;
  const results: SearchResult[] = [];

  const cacheKey = CacheKeys.search(q, type, page);

  const cached = await (async () => {
    try {
      return null; // Skip cache check here, use withCache below
    } catch {
      return null;
    }
  })();

  if (cached) return success(cached);

  const searchTerm = q.toLowerCase();

  const data = await withCache(
    cacheKey,
    async () => {
      const searchResults: SearchResult[] = [];

      if (type === 'all' || type === 'destinations') {
        const [countries, cities] = await Promise.all([
          prisma.country.findMany({
            where: {
              status: 'PUBLISHED',
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { tags: { has: searchTerm } },
                { capitalCity: { contains: q, mode: 'insensitive' } },
              ],
            },
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              heroImageUrl: true,
              budgetTier: true,
              tags: true,
              currencyCode: true,
            },
            take: Math.ceil(limit / 2),
          }),
          prisma.city.findMany({
            where: {
              status: 'PUBLISHED',
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { tags: { has: searchTerm } },
              ],
            },
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              heroImageUrl: true,
              budgetTier: true,
              country: { select: { name: true, slug: true } },
            },
            take: Math.ceil(limit / 3),
          }),
        ]);

        searchResults.push(
          ...countries.map(
            (c): SearchResult => ({
              type: 'country',
              id: c.id,
              title: c.name,
              description: c.description?.substring(0, 150) ?? null,
              slug: c.slug,
              imageUrl: c.heroImageUrl,
              metadata: {
                budgetTier: c.budgetTier,
                tags: c.tags,
                currencyCode: c.currencyCode,
              },
            })
          ),
          ...cities.map(
            (c): SearchResult => ({
              type: 'city',
              id: c.id,
              title: c.name,
              description: c.description?.substring(0, 150) ?? null,
              slug: c.slug,
              imageUrl: c.heroImageUrl,
              metadata: {
                country: c.country.name,
                countrySlug: c.country.slug,
                budgetTier: c.budgetTier,
              },
            })
          )
        );
      }

      if (type === 'all' || type === 'experiences') {
        const experiences = await prisma.experience.findMany({
          where: {
            status: 'PUBLISHED',
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { tags: { has: searchTerm } },
            ],
          },
          select: {
            id: true,
            name: true,
            slug: true,
            shortDescription: true,
            heroImageUrl: true,
            category: true,
            tags: true,
          },
          take: Math.ceil(limit / 4),
        });

        searchResults.push(
          ...experiences.map(
            (e): SearchResult => ({
              type: 'experience',
              id: e.id,
              title: e.name,
              description: e.shortDescription ?? null,
              slug: e.slug,
              imageUrl: e.heroImageUrl,
              metadata: { category: e.category, tags: e.tags },
            })
          )
        );
      }

      if (type === 'all' || type === 'blogs') {
        const blogs = await prisma.blogPost.findMany({
          where: {
            status: 'PUBLISHED',
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { excerpt: { contains: q, mode: 'insensitive' } },
              { tags: { has: searchTerm } },
            ],
          },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImageUrl: true,
            category: true,
            readTimeMinutes: true,
          },
          take: Math.ceil(limit / 4),
        });

        searchResults.push(
          ...blogs.map(
            (b): SearchResult => ({
              type: 'blog',
              id: b.id,
              title: b.title,
              description: b.excerpt ?? null,
              slug: b.slug,
              imageUrl: b.coverImageUrl,
              metadata: {
                category: b.category,
                readTimeMinutes: b.readTimeMinutes,
              },
            })
          )
        );
      }

      if (type === 'all' || type === 'visa') {
        const visaEntries = await prisma.visaInfo.findMany({
          where: {
            status: 'PUBLISHED',
            country: {
              name: { contains: q, mode: 'insensitive' },
            },
          },
          include: {
            country: {
              select: {
                id: true,
                name: true,
                slug: true,
                heroImageUrl: true,
              },
            },
          },
          take: Math.ceil(limit / 5),
        });

        searchResults.push(
          ...visaEntries.map(
            (v): SearchResult => ({
              type: 'visa',
              id: v.id,
              title: `${v.country.name} — ${v.visaType.replace(/_/g, ' ')}`,
              description: v.description ?? `Visa information for ${v.country.name}`,
              slug: v.country.slug,
              imageUrl: v.country.heroImageUrl,
              metadata: { visaType: v.visaType, countryId: v.country.id },
            })
          )
        );
      }

      return searchResults.slice(skip, skip + limit);
    },
    TTL.SHORT
  );

  return success(data);
}

export const GET = withRateLimit(withErrorHandler(handler), 200, 60_000);
