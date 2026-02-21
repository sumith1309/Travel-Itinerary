// ============================================================
// TRAILS AND MILES — Recommendation Engine
// Multi-stage pipeline: cold-start → content-based → AI personalization
// ============================================================

import { prisma } from '@/lib/db/prisma';
import { cacheGet, cacheSet, CacheKeys, TTL } from '@/lib/cache/redis';
import { generatePersonalizedRecommendations } from '@/lib/ai/openai';
import type { RecommendationResult, CountrySummary } from '@/types';

// ============================================================
// Main Entry Point
// ============================================================

export async function getRecommendations(
  userId: string,
  limit: number = 10,
  exclude: string[] = []
): Promise<RecommendationResult[]> {
  // Check cache
  const cacheKey = CacheKeys.recommendations(userId);
  const cached = await cacheGet<RecommendationResult[]>(cacheKey);
  if (cached) {
    return filterAndLimit(cached, exclude, limit);
  }

  const [profile, history] = await Promise.all([
    prisma.travelProfile.findUnique({ where: { userId } }),
    prisma.travelHistory.findMany({
      where: { userId },
      include: {
        destination: {
          include: { region: true },
        },
        city: true,
      },
      orderBy: { tripDate: 'desc' },
      take: 20,
    }),
  ]);

  let results: RecommendationResult[];

  if (!profile || !profile.onboardingCompleted) {
    // Phase 0 — Cold start
    results = await coldStartRecommendations();
  } else if (history.length === 0) {
    // Phase 1 — Content-based filtering (profile but no history)
    results = await partialPersonalization(profile as Parameters<typeof partialPersonalization>[0]);
  } else {
    // Phase 3 — Full AI personalization
    results = await fullPersonalization(
      profile as Parameters<typeof fullPersonalization>[0],
      history as Parameters<typeof fullPersonalization>[1]
    );
  }

  // Cache results for 5 minutes
  await cacheSet(cacheKey, results, TTL.MEDIUM);

  return filterAndLimit(results, exclude, limit);
}

// ============================================================
// Phase 0: Cold Start — Trending + Seasonal
// ============================================================

export async function coldStartRecommendations(limit: number = 10): Promise<RecommendationResult[]> {
  const cacheKey = CacheKeys.trending();
  const cached = await cacheGet<RecommendationResult[]>(cacheKey);
  if (cached) return cached.slice(0, limit);

  const currentMonth = new Date().getMonth() + 1; // 1-12

  const countries = await prisma.country.findMany({
    where: { status: 'PUBLISHED' },
    include: { region: true },
    take: 20,
  });

  const scored = countries.map((country) => {
    const seasons = country.bestSeasons as { months?: number[] } | null;
    const isInSeason = seasons?.months?.includes(currentMonth) ?? false;

    const score = isInSeason ? 0.8 : 0.4;

    const reasons: { [key: string]: string } = {
      'VISA_FREE': 'No visa required for Indian passport holders',
    };

    return {
      country: formatCountrySummary(country),
      score,
      reason: isInSeason
        ? `Perfect time to visit — peak season for Indian travellers`
        : `Great destination, available year-round`,
      matchTags: country.tags.slice(0, 3),
    } satisfies RecommendationResult;
  });

  const results = scored.sort((a, b) => b.score - a.score).slice(0, limit);
  await cacheSet(cacheKey, results, TTL.MEDIUM);
  return results;
}

// ============================================================
// Phase 2: Partial Personalization — Content-Based Filtering
// ============================================================

export async function partialPersonalization(
  profile: {
    budgetMinINR: number;
    budgetMaxINR: number;
    preferredInterests: string[];
    defaultTravelStyle: string | null;
    dietaryPreferences: string[];
  },
  limit: number = 10
): Promise<RecommendationResult[]> {
  const countries = await prisma.country.findMany({
    where: { status: 'PUBLISHED' },
    include: { region: true },
  });

  const budgetTierMap: Record<string, number> = {
    budget: 25000,
    moderate: 75000,
    premium: 200000,
  };

  const scored = countries.map((country) => {
    let score = 0;

    // Tag overlap with user interests
    const interestOverlap = profile.preferredInterests.filter((i) =>
      country.tags.some((t) => t.toLowerCase().includes(i.toLowerCase()))
    ).length;
    score += interestOverlap * 0.2;

    // Budget tier match
    const countryBudget = budgetTierMap[country.budgetTier ?? 'moderate'] ?? 75000;
    const userMidBudget = (profile.budgetMinINR + profile.budgetMaxINR) / 2;
    const budgetDiff = Math.abs(countryBudget - userMidBudget) / userMidBudget;
    score += Math.max(0, 0.4 - budgetDiff * 0.4);

    // Seasonality boost
    const currentMonth = new Date().getMonth() + 1;
    const seasons = country.bestSeasons as { months?: number[] } | null;
    if (seasons?.months?.includes(currentMonth)) score += 0.2;

    const matchTags = country.tags.filter((t) =>
      profile.preferredInterests.some((i) => t.toLowerCase().includes(i.toLowerCase()))
    );

    return {
      country: formatCountrySummary(country),
      score: Math.min(score, 1),
      reason: interestOverlap > 0
        ? `Matches your interests: ${matchTags.slice(0, 2).join(', ')}`
        : `Popular destination within your budget`,
      matchTags: matchTags.slice(0, 3),
    } satisfies RecommendationResult;
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

// ============================================================
// Phase 3: Full AI Personalization
// ============================================================

export async function fullPersonalization(
  profile: Parameters<typeof generatePersonalizedRecommendations>[0],
  history: Parameters<typeof generatePersonalizedRecommendations>[1],
  limit: number = 10
): Promise<RecommendationResult[]> {
  const visitedSlugs = history.map((h) => h.destination.slug);

  const availableCountries = await prisma.country.findMany({
    where: {
      status: 'PUBLISHED',
      slug: { notIn: visitedSlugs },
    },
    include: { region: true },
  });

  const formattedCountries = availableCountries.map(formatCountrySummary);

  try {
    return await generatePersonalizedRecommendations(profile, history, formattedCountries, limit);
  } catch {
    // Fallback to content-based if AI fails
    return partialPersonalization(profile, limit);
  }
}

// ============================================================
// Similar Destinations
// ============================================================

export async function getSimilarDestinations(
  countrySlug: string,
  limit: number = 4
): Promise<RecommendationResult[]> {
  const country = await prisma.country.findUnique({
    where: { slug: countrySlug },
    include: { region: true },
  });

  if (!country) return [];

  const similar = await prisma.country.findMany({
    where: {
      status: 'PUBLISHED',
      slug: { not: countrySlug },
      OR: [
        { regionId: country.regionId },
        { budgetTier: country.budgetTier },
      ],
    },
    include: { region: true },
    take: limit * 2,
  });

  // Score by tag overlap
  const scored = similar.map((c) => {
    const overlap = c.tags.filter((t) => country.tags.includes(t)).length;
    const sameRegion = c.regionId === country.regionId;

    return {
      country: formatCountrySummary(c),
      score: overlap * 0.15 + (sameRegion ? 0.3 : 0) + 0.1,
      reason: sameRegion
        ? `Same region as ${country.name}, with similar experiences`
        : `Similar travel style and budget to ${country.name}`,
      matchTags: c.tags.filter((t) => country.tags.includes(t)).slice(0, 3),
    } satisfies RecommendationResult;
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

// ============================================================
// Helpers
// ============================================================

function filterAndLimit(
  results: RecommendationResult[],
  exclude: string[],
  limit: number
): RecommendationResult[] {
  return results.filter((r) => !exclude.includes(r.country.slug)).slice(0, limit);
}

function formatCountrySummary(
  country: {
    id: string;
    name: string;
    slug: string;
    heroImageUrl: string | null;
    currencyCode: string;
    budgetTier: string | null;
    safetyRating: number | null;
    tags: string[];
    bestSeasons: unknown;
    region: { id: string; name: string; slug: string; description: string | null };
  }
): CountrySummary {
  return {
    id: country.id,
    name: country.name,
    slug: country.slug,
    heroImageUrl: country.heroImageUrl,
    currencyCode: country.currencyCode,
    budgetTier: country.budgetTier,
    safetyRating: country.safetyRating,
    tags: country.tags,
    bestSeasons: country.bestSeasons as CountrySummary['bestSeasons'],
    region: {
      id: country.region.id,
      name: country.region.name,
      slug: country.region.slug,
      description: country.region.description,
    },
  };
}
