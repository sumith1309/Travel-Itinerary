// ============================================================
// GET /api/recommendations/personalized — Full 6-layer pipeline
// Auth required. Returns AI-powered personalized recommendations.
// ============================================================

import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { success, errorResponse, withErrorHandler } from '@/lib/api-utils';
import { getRecommendations } from '@/lib/services/recommendations';

export const GET = withErrorHandler(async (req: NextRequest) => {
  // ── Auth check ─────────────────────────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, 'Unauthorized', 'Authentication required');
  }
  const userId = session.user.id;

  // ── Parse query params ─────────────────────────────────────
  const { searchParams } = req.nextUrl;
  const limit = Math.min(
    Math.max(parseInt(searchParams.get('limit') ?? '10', 10) || 10, 1),
    20
  );
  const excludeParam = searchParams.get('exclude') ?? '';
  const excludeArr = excludeParam
    ? excludeParam.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  // ── Get personalized recommendations ───────────────────────
  const results = await getRecommendations(userId, limit, excludeArr);

  return success(results);
});
