import { NextRequest } from 'next/server';
import { success, withErrorHandler, requireAuth } from '@/lib/api-utils';
import { z } from 'zod';

const validateSchema = z.object({
  destination: z.string().min(2).max(100),
});

async function handler(req: NextRequest) {
  await requireAuth(req);
  
  const body = await req.json();
  const { destination } = validateSchema.parse(body);
  
  const slug = destination
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  return success({
    slug,
    name: destination.trim(),
    isValid: true,
    isCustom: true,
  });
}

export const POST = withErrorHandler(handler);
