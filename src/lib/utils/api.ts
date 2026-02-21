import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { authOptions } from '@/lib/config/auth';

// ============================================================
// API Error Class
// ============================================================

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly title: string,
    public readonly detail: string,
    public readonly errors?: { field: string; message: string }[]
  ) {
    super(detail);
    this.name = 'ApiError';
  }
}

// ============================================================
// Response Builders
// ============================================================

export function success<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  return NextResponse.json({
    data,
    meta: {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
}

export function errorResponse(
  status: number,
  title: string,
  detail: string,
  errors?: { field: string; message: string }[]
): NextResponse {
  const baseUrl = process.env.APP_URL ?? 'https://api.trailsandmiles.com';
  return NextResponse.json(
    {
      type: `${baseUrl}/errors/${status}`,
      title,
      status,
      detail,
      ...(errors ? { errors } : {}),
    },
    { status }
  );
}

// ============================================================
// Error Handler Wrapper
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteHandler = (req: NextRequest, context?: any) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return errorResponse(error.status, error.title, error.detail, error.errors);
      }

      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        return errorResponse(422, 'Validation Error', 'Validation failed', errors);
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return errorResponse(409, 'Conflict', 'A record with this value already exists');
        }
        if (error.code === 'P2025') {
          return errorResponse(404, 'Not Found', 'The requested resource was not found');
        }
        return errorResponse(500, 'Database Error', 'A database error occurred');
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        return errorResponse(400, 'Bad Request', 'Invalid data provided');
      }

      console.error('[API Error]', error);
      return errorResponse(500, 'Internal Server Error', 'An unexpected error occurred');
    }
  };
}

// ============================================================
// Auth Helpers
// ============================================================

export async function requireAuth(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new ApiError(401, 'Unauthorized', 'Authentication required');
  }
  return session.user;
}

export async function optionalAuth(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

// ============================================================
// Rate Limiting (in-memory for prototype)
// In production: replace with Upstash Redis rate limiting
// ============================================================

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function withRateLimit(
  handler: RouteHandler,
  maxRequests = 100,
  windowMs = 60_000
): RouteHandler {
  return async (req, context) => {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';

    const key = `${ip}:${req.nextUrl.pathname}`;
    const now = Date.now();

    const entry = rateLimitStore.get(key);

    if (!entry || entry.resetAt < now) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    } else {
      entry.count++;
      if (entry.count > maxRequests) {
        return errorResponse(
          429,
          'Too Many Requests',
          `Rate limit exceeded. Try again in ${Math.ceil((entry.resetAt - now) / 1000)} seconds`
        );
      }
    }

    return handler(req, context);
  };
}

// ============================================================
// Pagination Helper
// ============================================================

export function getPaginationOffset(page: number, limit: number) {
  return (page - 1) * limit;
}

// ============================================================
// CORS Headers (for API routes)
// ============================================================

export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.APP_URL ?? 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function handleOptions() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}
