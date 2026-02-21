// ============================================================
// TRAILS AND MILES — Upstash Redis Cache
// Graceful fallback: returns null/void when not configured
// ============================================================

let redisClient: ReturnType<typeof createRedisClient> | null = null;

function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  // Use dynamic import to avoid bundling issues when not configured
  return { url, token };
}

async function getRedis() {
  if (!redisClient) {
    const config = createRedisClient();
    if (!config) return null;
    try {
      const { Redis } = await import('@upstash/redis');
      redisClient = new Redis({ url: config.url, token: config.token }) as unknown as ReturnType<
        typeof createRedisClient
      >;
      return redisClient as unknown as import('@upstash/redis').Redis;
    } catch {
      return null;
    }
  }
  return redisClient as unknown as import('@upstash/redis').Redis;
}

// ============================================================
// TTL Constants (seconds)
// ============================================================

export const TTL = {
  SHORT: 60, // Search results, real-time data
  MEDIUM: 300, // API lists, paginated responses
  LONG: 3600, // Destination pages, country data, visa info
  VERY_LONG: 86400, // Static content, embeddings
} as const;

// ============================================================
// Cache Key Builders
// ============================================================

export const CacheKeys = {
  country: (slug: string) => `country:${slug}`,
  countryList: (region?: string) => `countries:${region ?? 'all'}`,
  city: (slug: string) => `city:${slug}`,
  visa: (type?: string, country?: string, page?: number) =>
    `visa:${type ?? 'all'}:${country ?? 'all'}:${page ?? 1}`,
  search: (q: string, type: string, page: number) =>
    `search:${q.toLowerCase()}:${type}:${page}`,
  recommendations: (userId: string) => `recs:${userId}`,
  trending: () => 'recs:trending',
  chat: (sessionId: string) => `chat:${sessionId}`,
  experiences: (category?: string) => `experiences:${category ?? 'all'}`,
} as const;

// ============================================================
// Cache Operations
// ============================================================

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const redis = await getRedis();
    if (!redis) return null;
    const value = await redis.get(key);
    if (!value) return null;
    return typeof value === 'string' ? (JSON.parse(value) as T) : (value as T);
  } catch {
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T, ttl: number): Promise<void> {
  try {
    const redis = await getRedis();
    if (!redis) return;
    await redis.set(key, JSON.stringify(value), { ex: ttl });
  } catch {
    // Silent fail — cache is a performance enhancement, not a hard dependency
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    const redis = await getRedis();
    if (!redis) return;
    await redis.del(key);
  } catch {
    // Silent fail
  }
}

export async function cacheDelPattern(pattern: string): Promise<void> {
  try {
    const redis = await getRedis();
    if (!redis) return;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Silent fail
  }
}

// ============================================================
// Cache-Aside Helper
// Tries cache first, falls back to fetcher, caches result
// ============================================================

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = TTL.MEDIUM
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const data = await fetcher();
  await cacheSet(key, data, ttl);
  return data;
}
