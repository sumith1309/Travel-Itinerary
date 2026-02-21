# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Trails and Miles** — AI-powered travel planning platform for Indian travellers. Next.js 15 App Router monolith with API routes (backend complete), frontend in early stages (Phase 2).

## Commands

```bash
npm run dev              # Start dev server (Turbopack) on localhost:3000
npm run build            # Production build (type-checks + compiles)
npm run lint             # ESLint (Next.js config)
npm run type-check       # TypeScript check without emitting

# Database (Prisma + Neon PostgreSQL)
npm run db:generate      # Generate Prisma client from schema
npm run db:push          # Push schema to database (no migrations)
npm run db:migrate       # Create + apply migrations
npm run db:seed          # Seed 5 East Asian countries via prisma/seed.ts
npm run db:studio        # Open Prisma Studio GUI
```

**First-time setup**: `cp .env.example .env` then fill `DATABASE_URL`, `NEXTAUTH_SECRET`, `ANTHROPIC_API_KEY`. Run `npx prisma db push && npm run db:seed && npm run dev`.

## Architecture

### Stack
- **Next.js 15** (App Router) + **React 19** + **TailwindCSS 3** + **Radix UI**
- **Prisma 6** ORM with Neon serverless PostgreSQL
- **NextAuth 4** (JWT strategy, credentials + Google OAuth)
- **Anthropic Claude API** via `@anthropic-ai/sdk` for AI features
- **Upstash Redis** for caching (optional — app works without it)

### Path alias
`@/*` maps to `./src/*` (configured in tsconfig.json)

### Source layout

```
src/
  app/
    api/                  # All API routes (Next.js route handlers)
      auth/               # /api/auth/register + [...nextauth]
      destinations/       # GET list + GET [slug] detail
      itineraries/        # CRUD + AI generation (POST with generate:true)
      chatbot/            # Session create + message (with SSE streaming)
      search/             # Unified search across entities
      visa/               # Visa info for Indian passport holders
      recommendations/    # Personalized + trending recommendations
      users/              # Profile, travel profile, history, events
  lib/
    ai/claude.ts          # Claude SDK: chat, streaming, itinerary gen, recommendations
    cache/redis.ts        # Upstash Redis with cache-aside pattern (withCache)
    config/auth.ts        # NextAuth config + session augmentation
    config/env.ts         # Zod-validated environment variables
    db/prisma.ts          # Prisma client singleton (serverless-safe)
    services/recommendations.ts  # 3-stage pipeline: cold-start → content-based → AI
    utils/api.ts          # Response builders, error handler, auth helpers, rate limiting
    validators/schemas.ts # All Zod schemas for request validation
  types/index.ts          # Shared TypeScript types (re-exports Prisma enums)
  middleware.ts           # Security headers + cache-control for API routes
prisma/
  schema.prisma           # 25+ models (see enums for domain vocabulary)
  seed.ts                 # Seeds 5 countries with cities, POIs, visa info, experiences
```

### Key patterns

**API route handlers** follow this pattern:
```typescript
export const GET = withErrorHandler(async (req: NextRequest) => {
  const query = someSchema.parse(Object.fromEntries(req.nextUrl.searchParams));
  const result = await withCache(cacheKey, async () => { /* prisma query */ }, TTL.LONG);
  return paginated(result.data, result.total, query.page, query.limit);
});
```
- `withErrorHandler` — catches ApiError, ZodError, PrismaClientKnownRequestError
- `withCache` — cache-aside with Redis (graceful fallback to DB when Redis unavailable)
- `requireAuth(req)` / `optionalAuth(req)` — session auth helpers
- Response builders: `success(data)`, `paginated(data, total, page, limit)`, `errorResponse(status, title, detail)`

**Dynamic route params** (Next.js 15): params are `Promise`, must be awaited:
```typescript
context?: { params?: Promise<{ slug: string }> }
const slug = (await context?.params)?.slug ?? '';
```

**Discriminated unions** for polymorphic request bodies:
- Itineraries: `generate: true` triggers AI generation, `generate: false` is manual CRUD
- Chatbot: `action: 'create_session'` | `action: 'message'`
- Users PATCH: `_type: 'profile'` | `_type: 'travel_profile'`
- Users POST: `action: 'log_trip'` | `action: 'track_event'`

**AI service** (`src/lib/ai/claude.ts`):
- Singleton Anthropic client
- `sendChatMessage` — standard request/response
- `streamChatMessage` — returns ReadableStream for SSE (`data: {text}` chunks, final `data: {done:true}`)
- `generateItinerary` — structured JSON output (itinerary schema in system prompt)
- `generatePersonalizedRecommendations` — ranks destinations by user profile

**Recommendation pipeline** (`src/lib/services/recommendations.ts`):
- Phase 0 (cold start): trending + seasonal scoring
- Phase 1 (partial): content-based filtering on interests/budget/season
- Phase 2 (full): AI-powered via Claude, falls back to Phase 1 on error

### Database

All IDs use `cuid()`. Key Prisma enums: `TravelStyle`, `Pace`, `CompanionType`, `VisaType`, `ItineraryStatus`, `DietaryPreference`, `ContentStatus`, `ExperienceCategory`. JSON fields (`bestSeasons`, `quickFacts`, `fees`, etc.) have corresponding TypeScript interfaces in `src/types/index.ts`.

### Design system (Tailwind)

- Brand colors: `brand-forest` (#1B4D3E), `brand-orange` (#E8734A), `brand-sand` (#F7F3EB), `brand-stone` (#8B8578), `brand-midnight` (#1A1A2E), `accent-green` (#2C7A5B)
- Fonts: `font-display` (Playfair Display), `font-sans` (Outfit), `font-mono` (JetBrains Mono)
- Custom shadows: `shadow-card`, `shadow-card-hover`, `shadow-elevated`, `shadow-glow-green`, `shadow-glow-orange`
- Custom animations: `animate-fade-in`, `animate-fade-up`, `animate-slide-in-right`, `animate-scale-in`, `animate-float`, `animate-shimmer`
- Semantic color tokens via CSS variables (shadcn/ui pattern): `primary`, `secondary`, `destructive`, `muted`, `accent`, `popover`, `card`
- Dark mode via `class` strategy

### Environment variables

Required: `DATABASE_URL`, `NEXTAUTH_SECRET`, `ANTHROPIC_API_KEY`
Optional: `GOOGLE_CLIENT_ID/SECRET`, `UPSTASH_REDIS_REST_URL/TOKEN`, `MAPBOX_ACCESS_TOKEN`, `CLOUDINARY_*`
Validated at startup via Zod in `src/lib/config/env.ts`.

### India-specific context

All budgets/costs are in INR. Visa info is India-passport-specific. AI prompts include Indian traveller context (vegetarian options, UPI acceptance, SIM card info, Indian food availability). The `passportNationality` field defaults to "IN".
