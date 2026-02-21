import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { chatbotBodySchema } from '@/lib/validators/schemas';
import {
  success,
  errorResponse,
  withErrorHandler,
  requireAuth,
} from '@/lib/utils/api';
import { sendChatMessage, streamChatMessage } from '@/lib/ai/openai';
import type { ChatContext } from '@/types';

// GET /api/chatbot — List user's chat sessions
export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);

  const sessions = await prisma.chatSession.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 20,
  });

  return success(sessions);
});

// POST /api/chatbot — Create session or send message
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, 'Bad Request', 'Invalid JSON body');
  }

  const data = chatbotBodySchema.parse(body);

  // ── Action: create_session ─────────────────────────────────
  if (data.action === 'create_session') {
    const session = await prisma.chatSession.create({
      data: {
        userId: user.id,
        title: data.title ?? 'New Trip',
        context: data.destinationContext
          ? { destinationContext: data.destinationContext }
          : undefined,
        isActive: true,
      },
    });

    // Welcome message
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: `Namaste! 🙏 I'm your Trails and Miles Smart Travel Assistant. I'm here to help you plan the perfect trip — personalized for Indian travellers like you.

Tell me where you'd like to go, and I'll help you with:
• **Itinerary planning** with day-wise activities
• **Visa requirements** for your Indian passport
• **Budget estimates** in INR
• **Vegetarian food** options and restaurants
• **Practical tips** on SIM cards, local transport, and more

So, where are you dreaming of travelling? 🌏`,
      },
    });

    return success(session, 201);
  }

  // ── Action: message ────────────────────────────────────────
  const { sessionId, content, stream } = data;

  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId: user.id },
  });

  if (!session) {
    return errorResponse(404, 'Not Found', 'Chat session not found');
  }

  // Save user message
  await prisma.chatMessage.create({
    data: { sessionId, role: 'user', content },
  });

  // Build context
  const [travelProfile, travelHistory, messages] = await Promise.all([
    prisma.travelProfile.findUnique({ where: { userId: user.id } }),
    prisma.travelHistory.findMany({
      where: { userId: user.id },
      include: {
        destination: { include: { region: true } },
        city: true,
      },
      orderBy: { tripDate: 'desc' },
      take: 10,
    }),
    prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    }),
  ]);

  const context: ChatContext = {
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
    destinationContext: (session.context as { destinationContext?: string } | null)
      ?.destinationContext,
  };

  // ── Streaming response ─────────────────────────────────────
  if (stream) {
    const { stream: readableStream, getFullText } = await streamChatMessage(context, content);

    // Save complete response after streaming (fire-and-forget)
    getFullText().then(async (fullText) => {
      if (fullText) {
        await prisma.chatMessage.create({
          data: { sessionId, role: 'assistant', content: fullText },
        });
        await prisma.chatSession.update({
          where: { id: sessionId },
          data: { updatedAt: new Date() },
        });
      }
    }).catch(console.error);

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  }

  // ── Standard (non-streaming) response ─────────────────────
  const assistantText = await sendChatMessage(context, content);

  await prisma.chatMessage.create({
    data: { sessionId, role: 'assistant', content: assistantText },
  });

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
  });

  return success({ message: assistantText, sessionId });
});
