import { NextRequest } from 'next/server';
import { recommendationsQuerySchema } from '@/lib/validators/schemas';
import { success, withErrorHandler, optionalAuth } from '@/lib/utils/api';
import { getRecommendations, coldStartRecommendations } from '@/lib/services/recommendations';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await optionalAuth(req);
  const { searchParams } = req.nextUrl;
  const query = recommendationsQuerySchema.parse(Object.fromEntries(searchParams));

  const { limit, exclude } = query;
  const excludeSlugs = exclude ? exclude.split(',').map((s) => s.trim()) : [];

  if (user) {
    const recommendations = await getRecommendations(user.id, limit, excludeSlugs);
    return success(recommendations);
  }

  // Anonymous user — cold start (seasonal trending)
  const recommendations = await coldStartRecommendations(limit);
  const filtered = recommendations.filter((r) => !excludeSlugs.includes(r.country.slug));

  return success(filtered);
});
