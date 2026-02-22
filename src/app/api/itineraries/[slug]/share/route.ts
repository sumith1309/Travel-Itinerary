// ============================================================
// GET /api/itineraries/[slug]/share — Get shareable itinerary link
// Generates or retrieves a share token for public itinerary access.
// No auth required (public itineraries can be shared by anyone).
// ============================================================

import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { success, errorResponse, withErrorHandler } from '@/lib/api-utils';
import { absoluteUrl } from '@/lib/utils';

export const GET = withErrorHandler(async (
  _req: NextRequest,
  context?: { params?: Promise<{ slug: string }> }
) => {
  const slug = (await context?.params)?.slug ?? '';

  if (!slug) {
    return errorResponse(400, 'Bad Request', 'Itinerary slug or ID is required');
  }

  // ── Look up itinerary by shareToken or ID ──────────────────
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      OR: [
        { shareToken: slug },
        { id: slug },
      ],
    },
    select: {
      id: true,
      title: true,
      shareToken: true,
      status: true,
      isPublic: true,
    },
  });

  if (!itinerary) {
    return errorResponse(404, 'Not Found', 'Itinerary not found');
  }

  // ── Generate share token if missing ────────────────────────
  let shareToken = itinerary.shareToken;

  if (!shareToken) {
    const updated = await prisma.itinerary.update({
      where: { id: itinerary.id },
      data: {
        shareToken: undefined, // Let Prisma default (cuid) generate it
      },
      select: { shareToken: true },
    });
    shareToken = updated.shareToken;
  }

  // Safety check — shareToken should exist after update
  if (!shareToken) {
    // Fallback: use the itinerary ID as the token
    const fallback = await prisma.itinerary.update({
      where: { id: itinerary.id },
      data: { shareToken: itinerary.id },
      select: { shareToken: true },
    });
    shareToken = fallback.shareToken!;
  }

  const shareUrl = absoluteUrl(`/itineraries/${shareToken}`);

  return success({
    shareUrl,
    shareToken,
    title: itinerary.title,
    isPublic: itinerary.isPublic,
  });
});
