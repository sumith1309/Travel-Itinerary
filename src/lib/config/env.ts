import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_DATABASE_URL: z.string().optional(),

  // NextAuth
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),

  // Google OAuth (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // OpenAI
  OPENAI_API_KEY: z.string().startsWith('sk-', 'OPENAI_API_KEY must start with sk-'),
  AI_MODEL: z.string().default('o3'),
  AI_MAX_TOKENS: z.coerce.number().default(4096),
  AI_MAX_TOKENS_ITINERARY: z.coerce.number().default(8192),

  // Upstash Redis (optional)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Mapbox (optional)
  MAPBOX_ACCESS_TOKEN: z.string().optional(),

  // Cloudinary (optional)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // App
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.string().url().default('http://localhost:3000'),
});

function parseEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missing = result.error.issues.map((issue) => {
      const path = issue.path.join('.');
      return `  • ${path}: ${issue.message}`;
    });

    throw new Error(
      `\n\n❌ Invalid environment variables:\n${missing.join('\n')}\n\n` +
        `Copy .env.example to .env and fill in the required values.\n`
    );
  }

  return result.data;
}

export const env = parseEnv();
