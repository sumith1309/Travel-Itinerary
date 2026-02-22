// ============================================================
// POST /api/analytics — Track behavior events (batch support)
// GET  /api/analytics — User travel insights summary (auth required)
// ============================================================

import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { success, errorResponse, withErrorHandler } from '@/lib/api-utils';
import { batchTrackEvents, getEventSummary } from '@/lib/services/tracking';
import type { TrackableEvent } from '@/lib/services/tracking';

// ── POST /api/analytics — Track behavior events ─────────────

export const POST = withErrorHandler(async (req: NextRequest) => {
  // ── Optional auth (allow anonymous page views) ─────────────
  const session = await auth();
  const userId = session?.user?.id ?? null;

  // ── Parse body ─────────────────────────────────────────────
  let body: {
    events?: Array<{ type: string; data: Record<string, unknown> }>;
    type?: string;
    data?: Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, 'Bad Request', 'Invalid JSON body');
  }

  // ── Normalize: single event or batch ───────────────────────
  let events: Array<{ type: string; data: Record<string, unknown> }>;

  if (Array.isArray(body.events)) {
    events = body.events;
  } else if (body.type && typeof body.type === 'string') {
    events = [{ type: body.type, data: body.data ?? {} }];
  } else {
    return errorResponse(
      400,
      'Bad Request',
      'Request must include either "events" array or a single event with "type" and "data"'
    );
  }

  // ── Validate events ────────────────────────────────────────
  if (events.length === 0) {
    return errorResponse(400, 'Bad Request', 'At least one event is required');
  }

  if (events.length > 50) {
    return errorResponse(400, 'Bad Request', 'Maximum 50 events per batch');
  }

  for (const event of events) {
    if (!event.type || typeof event.type !== 'string') {
      return errorResponse(400, 'Bad Request', 'Each event must have a "type" string');
    }
  }

  // ── Track events if authenticated ──────────────────────────
  if (userId) {
    const trackableEvents = events.map((e) => ({
      type: e.type,
      data: e.data,
    })) as TrackableEvent[];

    await batchTrackEvents(userId, trackableEvents);
  }
  // Anonymous events are acknowledged but not persisted
  // (could be sent to an analytics service like Mixpanel in future)

  return success({ tracked: events.length, authenticated: !!userId });
});

// ── GET /api/analytics — User travel insights summary ────────

export const GET = withErrorHandler(async (_req: NextRequest) => {
  // ── Auth required for insights ─────────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, 'Unauthorized', 'Authentication required to view insights');
  }
  const userId = session.user.id;

  // ── Get event summary ──────────────────────────────────────
  const summary = await getEventSummary(userId);

  return success(summary);
});
