// ============================================================
// POST /api/recommendations/explain — "Why was this recommended?"
// Returns an AI-generated personalized explanation for a specific
// destination recommendation based on the user's profile & history.
// ============================================================

import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { success, errorResponse, withErrorHandler } from '@/lib/api-utils';
import { explainRecommendation } from '@/lib/ai/openai';
import { formatProfileForAI, formatHistoryForAI } from '@/lib/services/context-builder';
import type { TravelProfileData, TravelHistoryEntry } from '@/types';

export const POST = withErrorHandler(async (req: NextRequest) => {
  // ── Auth check ─────────────────────────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, 'Unauthorized', 'Authentication required');
  }
  const userId = session.user.id;

  // ── Parse body ─────────────────────────────────────────────
  let body: { destinationSlug?: string };
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, 'Bad Request', 'Invalid JSON body');
  }

  const { destinationSlug } = body;

  if (!destinationSlug || typeof destinationSlug !== 'string') {
    return errorResponse(400, 'Bad Request', 'destinationSlug is required');
  }

  // ── Fetch destination ──────────────────────────────────────
  const country = await prisma.country.findUnique({
    where: { slug: destinationSlug },
    select: {
      id: true,
      name: true,
      slug: true,
      tags: true,
      budgetTier: true,
      description: true,
    },
  });

  if (!country) {
    return errorResponse(404, 'Not Found', `Destination "${destinationSlug}" not found`);
  }

  // ── Fetch user profile and history ─────────────────────────
  const [travelProfile, travelHistory] = await Promise.all([
    prisma.travelProfile.findUnique({ where: { userId } }),
    prisma.travelHistory.findMany({
      where: { userId },
      include: {
        destination: { include: { region: true } },
        city: true,
      },
      orderBy: { tripDate: 'desc' },
      take: 10,
    }),
  ]);

  // ── Build AI contexts ──────────────────────────────────────
  const profileContext = travelProfile
    ? formatProfileForAI(travelProfile as TravelProfileData)
    : '## User Profile\nNo profile data available.';

  const historyContext = formatHistoryForAI(
    travelHistory as unknown as TravelHistoryEntry[]
  );

  // ── Generate explanation ───────────────────────────────────
  const explanation = await explainRecommendation(
    country.name,
    country.tags,
    profileContext,
    historyContext
  );

  return success({
    destinationSlug: country.slug,
    destinationName: country.name,
    explanation,
  });
});
