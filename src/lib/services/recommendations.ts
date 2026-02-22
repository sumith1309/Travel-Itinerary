// ============================================================
// TRAILS AND MILES — Recommendation Engine (6-Layer Pipeline)
// Layer 1: Cold Start (seasonal/trending)
// Layer 2: Profile-Based (interest/budget/style matching)
// Layer 3: Seasonal Intelligence (peak/shoulder/off scoring)
// Layer 4: Behavioral Signals (page views, searches, intent)
// Layer 5: Collaborative Filtering (similar users' travel)
// Layer 6: AI Synthesis (ultra recommendations via OpenAI)
// ============================================================

import prisma from '@/lib/db';
import { cacheGet, cacheSet, CacheKeys, TTL } from '@/lib/cache/redis';
import { generatePersonalizedRecommendations, generateUltraRecommendations } from '@/lib/ai/openai';
import { formatProfileForAI, formatHistoryForAI, formatBehaviorForAI } from '@/lib/services/context-builder';
import type { RecommendationResult, CountrySummary, AIRecommendation, BehaviorWeights, TravelHistoryEntry } from '@/types';

// ============================================================
// Local type aliases for Prisma query results
// ============================================================

type TravelProfile = {
  id: string;
  userId: string;
  defaultTravelStyle: string | null;
  defaultPace: string | null;
  budgetMinINR: number;
  budgetMaxINR: number;
  preferredInterests: string[];
  dietaryPreferences: string[];
  companionType: string | null;
  accessibilityNeeds: unknown | null;
  onboardingCompleted: boolean;
};

type TravelHistoryWithDest = {
  id: string;
  userId: string;
  destinationId: string;
  cityId: string | null;
  tripDate: Date;
  durationDays: number;
  travelStyle: string | null;
  budgetSpentINR: unknown | null;
  rating: number | null;
  highlights: string[];
  notes: string | null;
  destination: {
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
  };
  city: {
    id: string;
    name: string;
    slug: string;
    heroImageUrl: string | null;
    budgetTier: string | null;
    isCapital: boolean;
    avgDailyBudgetINR: number | null;
    tags: string[];
    latitude: unknown | null;
    longitude: unknown | null;
  } | null;
};

type BehaviorEventRecord = {
  id: string;
  userId: string;
  eventType: string;
  entityType: string | null;
  entityId: string | null;
  metadata: unknown;
  createdAt: Date;
};

type CountryWithRegion = {
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
};

// ============================================================
// Month names for seasonal reasoning
// ============================================================

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ============================================================
// Main Entry Point
// ============================================================

export async function getRecommendations(
  userId: string,
  limit: number = 10,
  exclude: string[] = []
): Promise<RecommendationResult[]> {
  // Check cache first
  const cacheKey = CacheKeys.recommendations(userId);
  const cached = await cacheGet<RecommendationResult[]>(cacheKey);
  if (cached) {
    return filterAndLimit(cached, exclude, limit);
  }

  // Fetch profile, history, and behavior events in parallel
  const [profile, history, events] = await Promise.all([
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
    prisma.behaviorEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
  ]);

  const currentMonth = new Date().getMonth() + 1; // 1-12

  // Layer 1: Cold Start — always runs as the base layer
  let results = await coldStartRecommendations(20);

  // If no profile or not onboarded, return cold start results
  if (!profile || !profile.onboardingCompleted) {
    await cacheSet(cacheKey, results, TTL.MEDIUM);
    return filterAndLimit(results, exclude, limit);
  }

  const typedProfile = profile as TravelProfile;
  const typedHistory = history as TravelHistoryWithDest[];
  const typedEvents = events as BehaviorEventRecord[];

  // Remove already-visited destinations from base results
  const visitedSlugs = new Set(typedHistory.map((h) => h.destination.slug));
  results = results.filter((r) => !visitedSlugs.has(r.country.slug));

  // Layer 2: Profile-Based Scoring
  results = applyProfileScoring(results, typedProfile);

  // Layer 3: Seasonal Intelligence
  results = applySeasonalScoring(results, currentMonth);

  // Layer 4: Behavioral Signals (if events exist)
  if (typedEvents.length > 0) {
    const behaviorWeights = analyzeBehavior(typedEvents);
    results = applyBehaviorScoring(results, behaviorWeights);
  }

  // Layer 5: Collaborative Filtering (if history exists)
  if (typedHistory.length > 0) {
    const collaborativeRecs = await getCollaborativeRecommendations(userId, typedHistory);
    results = mergeCollaborative(results, collaborativeRecs);
  }

  // Layer 6: AI Synthesis (if enough data for meaningful AI input)
  const hasEnoughData = typedHistory.length > 0 || typedEvents.length > 10;
  if (hasEnoughData) {
    try {
      // Build context strings for AI
      const profileContext = formatProfileForAI(typedProfile as Parameters<typeof formatProfileForAI>[0]);
      const historyContext = formatHistoryForAI(
        typedHistory.map((h) => ({
          ...h,
          travelStyle: h.travelStyle as TravelHistoryEntry['travelStyle'],
          budgetSpentINR: h.budgetSpentINR != null ? Number(h.budgetSpentINR) : null,
          destination: {
            ...h.destination,
            bestSeasons: h.destination.bestSeasons as CountrySummary['bestSeasons'],
          },
          city: h.city
            ? {
                ...h.city,
                latitude: h.city.latitude != null ? Number(h.city.latitude) : null,
                longitude: h.city.longitude != null ? Number(h.city.longitude) : null,
              }
            : null,
        })) as TravelHistoryEntry[]
      );
      const behaviorContext = formatBehaviorForAI(
        typedEvents.map((e) => ({
          eventType: e.eventType,
          entityType: e.entityType,
          entityId: e.entityId,
          metadata: e.metadata,
          createdAt: e.createdAt,
        }))
      );

      // Format destinations for AI context
      const destinationsContext = results
        .slice(0, 15)
        .map(
          (r, i) =>
            `${i + 1}. ${r.country.name} (slug: ${r.country.slug}) — ${r.country.budgetTier ?? 'moderate'} budget, tags: ${r.country.tags.join(', ')}, region: ${r.country.region.name}, safety: ${r.country.safetyRating ?? 'N/A'}/5`
        )
        .join('\n');

      const aiRecs = await generateUltraRecommendations(
        profileContext,
        historyContext,
        behaviorContext,
        destinationsContext,
        currentMonth
      );

      if (aiRecs.length > 0) {
        results = mergeAIRecommendations(results, aiRecs);
      }
    } catch (error) {
      // AI synthesis failed — fall back to layers 1-5 results
      console.warn(
        '[Recommendations] Layer 6 AI synthesis failed, using layers 1-5:',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  // Final sort, deduplicate, and cap scores
  results = deduplicateResults(results);
  results.sort((a, b) => b.score - a.score);
  results = results.map((r) => ({
    ...r,
    score: Math.min(Math.max(r.score, 0), 1),
  }));

  // Cache results for 5 minutes
  await cacheSet(cacheKey, results, TTL.MEDIUM);

  return filterAndLimit(results, exclude, limit);
}

// ============================================================
// Layer 1: Cold Start — Trending + Seasonal
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
// Layer 2: Profile-Based Scoring
// ============================================================

function applyProfileScoring(
  recs: RecommendationResult[],
  profile: TravelProfile
): RecommendationResult[] {
  const budgetTierMap: Record<string, string> = {
    budget: 'BUDGET',
    moderate: 'LEISURE',
    premium: 'LUXURY',
    luxury: 'LUXURY',
  };

  return recs.map((rec) => {
    let scoreBoost = 0;
    const boostReasons: string[] = [];

    // Interest overlap: +0.15 per matching interest
    const interestMatches = profile.preferredInterests.filter((interest) =>
      rec.country.tags.some((tag) =>
        tag.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(tag.toLowerCase())
      )
    );
    if (interestMatches.length > 0) {
      scoreBoost += interestMatches.length * 0.15;
      boostReasons.push(`matches interests: ${interestMatches.slice(0, 2).join(', ')}`);
    }

    // Budget tier match: +0.2
    const countryBudgetTier = rec.country.budgetTier?.toLowerCase() ?? 'moderate';
    const userMidBudget = (profile.budgetMinINR + profile.budgetMaxINR) / 2;
    const budgetTierFromUser =
      userMidBudget < 40000 ? 'budget' : userMidBudget < 120000 ? 'moderate' : 'luxury';
    if (countryBudgetTier === budgetTierFromUser) {
      scoreBoost += 0.2;
      boostReasons.push('fits your budget');
    }

    // Travel style match: +0.15
    if (profile.defaultTravelStyle) {
      const expectedStyle = budgetTierMap[countryBudgetTier] ?? 'LEISURE';
      if (profile.defaultTravelStyle === expectedStyle) {
        scoreBoost += 0.15;
        boostReasons.push(`suits your ${profile.defaultTravelStyle.toLowerCase()} style`);
      }
    }

    // Dietary: vegetarian-friendly bonus: +0.1
    const hasVegDiet = profile.dietaryPreferences.some((d) =>
      ['VEGETARIAN', 'VEGAN', 'JAIN'].includes(d)
    );
    if (hasVegDiet) {
      const vegFriendlyTags = ['vegetarian', 'veg-friendly', 'temple', 'buddhist', 'hindu'];
      const isVegFriendly = rec.country.tags.some((tag) =>
        vegFriendlyTags.some((vt) => tag.toLowerCase().includes(vt))
      );
      if (isVegFriendly) {
        scoreBoost += 0.1;
        boostReasons.push('vegetarian-friendly destination');
      }
    }

    const newScore = rec.score + scoreBoost;
    const reason =
      boostReasons.length > 0
        ? `${boostReasons[0].charAt(0).toUpperCase() + boostReasons[0].slice(1)}${boostReasons.length > 1 ? ` and ${boostReasons.slice(1).join(', ')}` : ''}`
        : rec.reason;

    return {
      ...rec,
      score: newScore,
      reason,
      matchTags:
        interestMatches.length > 0
          ? rec.country.tags
              .filter((t) =>
                profile.preferredInterests.some(
                  (i) =>
                    t.toLowerCase().includes(i.toLowerCase()) ||
                    i.toLowerCase().includes(t.toLowerCase())
                )
              )
              .slice(0, 3)
          : rec.matchTags,
    };
  });
}

// ============================================================
// Layer 3: Seasonal Intelligence
// ============================================================

function applySeasonalScoring(
  recs: RecommendationResult[],
  currentMonth: number
): RecommendationResult[] {
  return recs.map((rec) => {
    const seasons = rec.country.bestSeasons as {
      months?: number[];
      peak?: number[];
      shoulder?: number[];
      avoid?: number[];
      description?: string;
    } | null;

    if (!seasons) return rec;

    let seasonalBoost = 0;
    let seasonalNote = '';

    // Peak season scoring: +1.0 multiplier effect (score * 1.0 added)
    if (seasons.peak?.includes(currentMonth)) {
      seasonalBoost = 1.0;
      seasonalNote = `Peak season in ${MONTH_NAMES[currentMonth]} — ideal weather and conditions`;
    }
    // Shoulder season: +0.75
    else if (seasons.shoulder?.includes(currentMonth)) {
      seasonalBoost = 0.75;
      seasonalNote = `Shoulder season in ${MONTH_NAMES[currentMonth]} — fewer crowds, good conditions`;
    }
    // In general best months but not peak/shoulder categorized
    else if (seasons.months?.includes(currentMonth)) {
      seasonalBoost = 0.5;
      seasonalNote = `Good time to visit in ${MONTH_NAMES[currentMonth]}`;
    }
    // Avoid months: penalty
    else if (seasons.avoid?.includes(currentMonth)) {
      seasonalBoost = -0.3;
      seasonalNote = `${MONTH_NAMES[currentMonth]} is not the best time — consider visiting later`;
    }
    // Off-season (not in any list)
    else {
      seasonalBoost = 0.3;
      seasonalNote = `Off-season — potential for deals and fewer tourists`;
    }

    // Festival bonus: check for notable months (Oct-Nov for Diwali travel, Dec-Jan for New Year,
    // Mar-Apr for Holi/Easter, summer holidays Jun-Jul for family travel)
    const festivalMonths: Record<number, string> = {
      1: 'New Year travel season',
      3: 'Holi break',
      4: 'Easter and summer break starting',
      6: 'Summer holidays',
      7: 'Summer holidays',
      10: 'Dussehra/Diwali travel season',
      11: 'Diwali travel season',
      12: 'Christmas and New Year travel',
    };
    if (festivalMonths[currentMonth]) {
      seasonalBoost += 0.05;
    }

    return {
      ...rec,
      score: rec.score + seasonalBoost * 0.15, // Scale seasonal boost to a reasonable range
      reason: seasonalNote || rec.reason,
    };
  });
}

// ============================================================
// Layer 4: Behavioral Signals
// ============================================================

function analyzeBehavior(events: BehaviorEventRecord[]): BehaviorWeights {
  const destinationViews: Record<string, number> = {};
  const categoryInterest: Record<string, number> = {};
  const searchTerms: string[] = [];
  let highIntentSignals = 0;

  for (const event of events) {
    const meta = event.metadata as Record<string, unknown> | null;

    switch (event.eventType) {
      case 'destination_view': {
        const slug = String(meta?.slug ?? event.entityId ?? '');
        if (slug) {
          destinationViews[slug] = (destinationViews[slug] || 0) + 1;
        }
        break;
      }
      case 'search': {
        const query = meta?.query ? String(meta.query) : null;
        if (query && !searchTerms.includes(query.toLowerCase())) {
          searchTerms.push(query.toLowerCase());
        }
        break;
      }
      case 'itinerary_generate': {
        highIntentSignals += 3;
        // Also track the destination if available
        const destSlug = meta?.destination ? String(meta.destination) : null;
        if (destSlug) {
          destinationViews[destSlug] = (destinationViews[destSlug] || 0) + 2;
        }
        break;
      }
      case 'visa_check': {
        highIntentSignals += 2;
        const country = meta?.country ? String(meta.country) : null;
        if (country) {
          destinationViews[country] = (destinationViews[country] || 0) + 1;
        }
        break;
      }
      case 'poi_view':
      case 'experience_view': {
        if (meta?.category) {
          const cat = String(meta.category);
          categoryInterest[cat] = (categoryInterest[cat] || 0) + 1;
        }
        break;
      }
      case 'blog_read': {
        // Extract tags or categories from blog reading
        const tags = meta?.tags;
        if (Array.isArray(tags)) {
          for (const tag of tags) {
            categoryInterest[String(tag)] = (categoryInterest[String(tag)] || 0) + 0.5;
          }
        }
        break;
      }
      case 'save_itinerary':
      case 'share_itinerary': {
        highIntentSignals += 1;
        break;
      }
    }
  }

  // Determine travel readiness from intent signals
  const travelReadiness: BehaviorWeights['travelReadiness'] =
    highIntentSignals > 5 ? 'ready' : highIntentSignals > 2 ? 'planning' : 'browsing';

  return {
    destinationViews,
    categoryInterest,
    searchTerms,
    highIntentSignals,
    travelReadiness,
  };
}

function applyBehaviorScoring(
  recs: RecommendationResult[],
  weights: BehaviorWeights
): RecommendationResult[] {
  return recs.map((rec) => {
    let behaviorBoost = 0;

    // Boost destinations that match viewed destinations: +0.1 per view (capped)
    const viewCount = weights.destinationViews[rec.country.slug] || 0;
    if (viewCount > 0) {
      behaviorBoost += Math.min(viewCount * 0.1, 0.3);
    }

    // Boost destinations matching viewed categories: +0.1 per category match
    const categoryMatches = rec.country.tags.filter((tag) => {
      const tagLower = tag.toLowerCase();
      return Object.keys(weights.categoryInterest).some(
        (cat) =>
          tagLower.includes(cat.toLowerCase()) || cat.toLowerCase().includes(tagLower)
      );
    });
    behaviorBoost += Math.min(categoryMatches.length * 0.1, 0.3);

    // Boost destinations matching search terms: +0.05 per term match
    const searchMatches = weights.searchTerms.filter((term) => {
      const termLower = term.toLowerCase();
      return (
        rec.country.name.toLowerCase().includes(termLower) ||
        rec.country.slug.includes(termLower) ||
        rec.country.tags.some((t) => t.toLowerCase().includes(termLower)) ||
        rec.country.region.name.toLowerCase().includes(termLower)
      );
    });
    behaviorBoost += Math.min(searchMatches.length * 0.05, 0.2);

    // High-intent readiness boost: +0.15 if user is ready to book
    if (weights.travelReadiness === 'ready') {
      behaviorBoost += 0.15;
    } else if (weights.travelReadiness === 'planning') {
      behaviorBoost += 0.05;
    }

    return {
      ...rec,
      score: rec.score + behaviorBoost,
      reason:
        viewCount > 0
          ? `You've been exploring ${rec.country.name} — here's why it's a great fit`
          : searchMatches.length > 0
            ? `Matches your recent searches for ${searchMatches[0]}`
            : rec.reason,
    };
  });
}

// ============================================================
// Layer 5: Collaborative Filtering
// ============================================================

async function getCollaborativeRecommendations(
  userId: string,
  history: TravelHistoryWithDest[]
): Promise<RecommendationResult[]> {
  const visitedDestIds = history.map((h) => h.destinationId);
  const visitedSlugs = new Set(history.map((h) => h.destination.slug));

  if (visitedDestIds.length === 0) return [];

  // Find users who have visited at least one destination in common
  const similarUserTrips = await prisma.travelHistory.findMany({
    where: {
      destinationId: { in: visitedDestIds },
      userId: { not: userId },
    },
    select: {
      userId: true,
      destinationId: true,
    },
  });

  if (similarUserTrips.length === 0) return [];

  // Count overlap per user (how many destinations they share with current user)
  const userOverlap: Record<string, number> = {};
  for (const trip of similarUserTrips) {
    userOverlap[trip.userId] = (userOverlap[trip.userId] || 0) + 1;
  }

  // Get the top similar users (those with highest overlap)
  const similarUserIds = Object.entries(userOverlap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([uid]) => uid);

  if (similarUserIds.length === 0) return [];

  // Find what these similar users also visited (that current user hasn't)
  const theirTrips = await prisma.travelHistory.findMany({
    where: {
      userId: { in: similarUserIds },
      destinationId: { notIn: visitedDestIds },
    },
    include: {
      destination: {
        include: { region: true },
      },
    },
  });

  if (theirTrips.length === 0) return [];

  // Score by overlap frequency: how many similar users visited this destination
  const destFrequency: Record<string, { count: number; dest: CountryWithRegion }> = {};
  for (const trip of theirTrips) {
    const slug = trip.destination.slug;
    if (visitedSlugs.has(slug)) continue;
    if (!destFrequency[slug]) {
      destFrequency[slug] = { count: 0, dest: trip.destination };
    }
    destFrequency[slug].count += 1;
  }

  // Convert to RecommendationResults
  const maxFreq = Math.max(...Object.values(destFrequency).map((d) => d.count), 1);

  return Object.entries(destFrequency)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([, { count, dest }]) => ({
      country: formatCountrySummary(dest),
      score: 0.3 + (count / maxFreq) * 0.4, // Score range: 0.3 to 0.7
      reason: `Travellers with similar trips also loved ${dest.name}`,
      matchTags: dest.tags.slice(0, 3),
    }));
}

function mergeCollaborative(
  base: RecommendationResult[],
  collaborative: RecommendationResult[]
): RecommendationResult[] {
  if (collaborative.length === 0) return base;

  const result = [...base];
  const existingSlugs = new Set(result.map((r) => r.country.slug));

  for (const collab of collaborative) {
    const existingIdx = result.findIndex((r) => r.country.slug === collab.country.slug);
    if (existingIdx >= 0) {
      // Merge: boost existing score with collaborative signal
      const existing = result[existingIdx];
      result[existingIdx] = {
        ...existing,
        score: existing.score + collab.score * 0.3, // 30% weight for collaborative signal
        reason:
          existing.score < collab.score
            ? collab.reason
            : existing.reason,
      };
    } else if (!existingSlugs.has(collab.country.slug)) {
      // Add new collaborative recommendation
      result.push(collab);
      existingSlugs.add(collab.country.slug);
    }
  }

  return result;
}

// ============================================================
// Layer 6: AI Synthesis
// ============================================================

function mergeAIRecommendations(
  base: RecommendationResult[],
  aiRecs: AIRecommendation[]
): RecommendationResult[] {
  if (aiRecs.length === 0) return base;

  const result = [...base];

  for (const aiRec of aiRecs) {
    const existingIdx = result.findIndex(
      (r) => r.country.slug === aiRec.destinationSlug
    );

    if (existingIdx >= 0) {
      const existing = result[existingIdx];
      // AI score is weighted 0.6 vs base 0.4
      const mergedScore = existing.score * 0.4 + aiRec.score * 0.6;
      result[existingIdx] = {
        ...existing,
        score: mergedScore,
        reason: aiRec.reason || existing.reason,
        matchTags:
          existing.matchTags.length > 0 ? existing.matchTags : result[existingIdx].matchTags,
      };
    }
    // AI recs that don't match any base result are intentionally skipped
    // because we don't have the full CountrySummary object for them
  }

  return result;
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

function deduplicateResults(results: RecommendationResult[]): RecommendationResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.country.slug)) return false;
    seen.add(r.country.slug);
    return true;
  });
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
