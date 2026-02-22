import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { registerSchema } from '@/lib/validators';
import { success, errorResponse, withRateLimit } from '@/lib/api-utils';
import { ZodError } from 'zod';

async function handler(req: NextRequest): Promise<NextResponse> {
  if (req.method !== 'POST') {
    return errorResponse(405, 'Method Not Allowed', 'Only POST is allowed');
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, 'Bad Request', 'Invalid JSON body');
  }

  let data;
  try {
    data = registerSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
      return errorResponse(422, 'Validation Error', 'Validation failed', errors);
    }
    throw err;
  }

  const existing = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
    select: { id: true },
  });

  if (existing) {
    return errorResponse(409, 'Conflict', 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      name: data.name ?? null,
      passwordHash,
      travelProfile: {
        create: {
          budgetMinINR: 20000,
          budgetMaxINR: 100000,
          preferredInterests: [],
          dietaryPreferences: [],
          onboardingCompleted: false,
        },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      passportNationality: true,
      createdAt: true,
      travelProfile: {
        select: {
          id: true,
          onboardingCompleted: true,
          budgetMinINR: true,
          budgetMaxINR: true,
        },
      },
    },
  });

  return success(user, 201);
}

// Apply rate limit: 10 requests/min per IP
export const POST = withRateLimit(
  (req: NextRequest) => handler(req),
  10,
  60_000
) as typeof handler;
