// ============================================================
// POST /api/preferences/infer — Infer preferences from behavior
// Analyzes user behavior events via AI to detect travel archetype,
// interests, budget tier, readiness, and suggested destinations.
// ============================================================

import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { success, errorResponse, withErrorHandler } from '@/lib/api-utils';
import { inferPreferences } from '@/lib/ai/openai';

export const POST = withErrorHandler(async (req: NextRequest) => {
  // ── Auth check ─────────────────────────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, 'Unauthorized', 'Authentication required');
  }
  const userId = session.user.id;

  // ── Fetch recent behavior events ───────────────────────────
  const events = await prisma.behaviorEvent.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  if (events.length < 5) {
    return errorResponse(
      422,
      'Insufficient Data',
      `Need at least 5 behavior events to infer preferences. Currently have ${events.length}.`
    );
  }

  // ── Call AI inference ──────────────────────────────────────
  const result = await inferPreferences(
    events.map((e) => ({
      eventType: e.eventType,
      entityType: e.entityType,
      metadata: e.metadata,
      createdAt: e.createdAt,
    }))
  );

  if (!result) {
    return errorResponse(
      500,
      'Inference Failed',
      'Could not infer preferences from the provided behavior data. Try again later.'
    );
  }

  return success(result);
});
