// ============================================================
// POST /api/chat/stream — Dedicated SSE streaming chat endpoint
// Streams AI responses via Server-Sent Events for real-time UX
// ============================================================

import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { errorResponse } from '@/lib/api-utils';
import { streamChatMessage } from '@/lib/ai/openai';
import type { ChatContext } from '@/types';

export async function POST(req: NextRequest) {
  try {
    // ── Auth check ───────────────────────────────────────────
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse(401, 'Unauthorized', 'Authentication required');
    }
    const userId = session.user.id;

    // ── Parse body ───────────────────────────────────────────
    let body: { sessionId?: string; content?: string };
    try {
      body = await req.json();
    } catch {
      return errorResponse(400, 'Bad Request', 'Invalid JSON body');
    }

    const { sessionId, content } = body;

    if (!sessionId || typeof sessionId !== 'string') {
      return errorResponse(400, 'Bad Request', 'sessionId is required');
    }
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return errorResponse(400, 'Bad Request', 'content is required and must be non-empty');
    }
    if (content.length > 2000) {
      return errorResponse(400, 'Bad Request', 'Message exceeds 2000 character limit');
    }

    // ── Verify session ownership ─────────────────────────────
    const chatSession = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!chatSession) {
      return errorResponse(404, 'Not Found', 'Chat session not found or does not belong to you');
    }

    // ── Save user message to DB ──────────────────────────────
    await prisma.chatMessage.create({
      data: { sessionId, role: 'user', content },
    });

    // ── Fetch context in parallel ────────────────────────────
    const [messages, travelProfile, travelHistory] = await Promise.all([
      prisma.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
        take: 20,
      }),
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

    // ── Build ChatContext ─────────────────────────────────────
    const destinationContext = (
      chatSession.context as { destinationContext?: string } | null
    )?.destinationContext;

    const chatContext: ChatContext = {
      sessionId,
      userProfile: travelProfile,
      travelHistory: travelHistory as ChatContext['travelHistory'],
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
        metadata: m.metadata as Record<string, unknown> | null,
        createdAt: m.createdAt,
      })),
      destinationContext,
    };

    // ── Stream the AI response ───────────────────────────────
    const { stream: readableStream, getFullText } = await streamChatMessage(
      chatContext,
      content
    );

    // ── Fire-and-forget: save assistant message after streaming
    getFullText()
      .then(async (fullText) => {
        if (fullText) {
          await prisma.chatMessage.create({
            data: { sessionId, role: 'assistant', content: fullText },
          });
          await prisma.chatSession.update({
            where: { id: sessionId },
            data: { updatedAt: new Date() },
          });
        }
      })
      .catch((err) => {
        console.error('[Chat Stream] Failed to save assistant message:', err);
      });

    // ── Return raw SSE response (not NextResponse) ───────────
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('[Chat Stream] Unexpected error:', error);
    return errorResponse(500, 'Internal Server Error', 'An unexpected error occurred');
  }
}
