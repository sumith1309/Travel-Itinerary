// ============================================================
// TRAILS AND MILES — Claude AI Service
// Anthropic SDK integration for chat, streaming, and itinerary generation
// ============================================================

import Anthropic from '@anthropic-ai/sdk';
import type {
  ChatContext,
  GeneratedItinerary,
  TravelProfileData,
  TravelHistoryEntry,
  RecommendationResult,
  CountrySummary,
} from '@/types';

// Singleton client
let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

const AI_MODEL = process.env.AI_MODEL ?? 'claude-sonnet-4-5-20250929';
const AI_MAX_TOKENS = parseInt(process.env.AI_MAX_TOKENS ?? '4096', 10);
const AI_MAX_TOKENS_ITINERARY = parseInt(process.env.AI_MAX_TOKENS_ITINERARY ?? '8192', 10);

// ============================================================
// System Prompts
// ============================================================

function buildChatSystemPrompt(
  profile: TravelProfileData | null,
  history: TravelHistoryEntry[]
): string {
  const visitedDestinations = history.map((h) => h.destination.name).join(', ');
  const dietaryNote =
    profile?.dietaryPreferences?.includes('VEGETARIAN') ||
    profile?.dietaryPreferences?.includes('VEGAN') ||
    profile?.dietaryPreferences?.includes('JAIN')
      ? `The user follows ${profile.dietaryPreferences.join('/')} dietary preferences — always highlight vegetarian/vegan options and confirm food availability.`
      : '';

  const budgetNote =
    profile?.budgetMinINR && profile?.budgetMaxINR
      ? `User's typical budget: ₹${profile.budgetMinINR.toLocaleString('en-IN')} – ₹${profile.budgetMaxINR.toLocaleString('en-IN')} per person.`
      : '';

  const styleNote = profile?.defaultTravelStyle
    ? `Preferred travel style: ${profile.defaultTravelStyle}.`
    : '';

  const historyNote = visitedDestinations
    ? `Previously visited: ${visitedDestinations}. Avoid recommending these unless the user explicitly asks.`
    : '';

  return `You are the Trails and Miles Smart Travel Assistant — an expert travel planner specializing in trips for Indian travellers.

## Your Identity
- You work for Trails and Miles, India's premier AI travel planning platform
- You are knowledgeable, warm, and practical
- You always contextualize advice for Indian travellers

## Core Principles
1. **India-First Context**: All budgets in INR. Mention Indian food availability, SIM card options, UPI/card acceptance, power adapter needs, and Indian passport visa requirements.
2. **Practical Details**: Include local transport apps (Grab, Gojek, etc.), safety tips relevant to Indians, cultural etiquette, and emergency contact numbers.
3. **Vegetarian Awareness**: ${dietaryNote || 'Mention vegetarian options in every food recommendation.'}
4. **Budget Transparency**: Provide estimates for 3 tiers — Budget (₹), Mid-Range (₹₹), Luxury (₹₹₹).
5. **Personalization**: ${historyNote || 'Suggest destinations based on user interests.'}

## User Profile
${budgetNote}
${styleNote}
${profile?.preferredInterests?.length ? `Interests: ${profile.preferredInterests.join(', ')}.` : ''}
${profile?.companionType ? `Travelling: ${profile.companionType}.` : ''}

## Your Capabilities
- Suggest destinations and explain why they suit the user
- Plan day-wise itineraries with morning/afternoon/evening activities
- Explain visa requirements for Indian passport holders
- Estimate costs in INR for accommodation, food, transport, and activities
- Recommend vegetarian-friendly restaurants
- Provide practical logistics (SIM cards, forex, local apps, transport)
- Flag safety considerations naturally and helpfully

## Response Style
- Conversational, warm, and encouraging
- Use bullet points for lists and options
- Use **bold** for emphasis on key information
- Keep responses focused and actionable
- When generating an itinerary through conversation, be thorough and detailed`;
}

function buildItinerarySystemPrompt(): string {
  return `You are the Trails and Miles Itinerary Engine. Your ONLY job is to output a valid JSON itinerary object.

## CRITICAL RULES
1. Output ONLY valid JSON. No markdown, no explanation, no preamble.
2. Every cost must be in INR (Indian Rupees).
3. Include vegetarian food recommendations in every day.
4. Adjust item count by pace: RELAXED=3 items/day, BALANCED=4 items/day, FAST=5 items/day.
5. Include transport between locations (mode + duration in minutes).
6. Never suggest destinations the user has already visited (unless explicitly requested).
7. timeSlot must be exactly "morning", "afternoon", or "evening".

## JSON Schema
{
  "title": "string",
  "description": "string (2-3 sentences)",
  "destinationSlugs": ["string"],
  "durationDays": number,
  "travelStyle": "LEISURE|ADVENTURE|LUXURY|BUDGET|CULTURAL",
  "pace": "RELAXED|BALANCED|FAST",
  "companionType": "SOLO|COUPLE|FAMILY|FRIENDS",
  "budgetTotalINR": number,
  "days": [
    {
      "dayNumber": number,
      "citySlug": "string (optional)",
      "title": "string",
      "description": "string",
      "dailyBudgetINR": number,
      "weatherAdvisory": "string (optional)",
      "items": [
        {
          "timeSlot": "morning|afternoon|evening",
          "startTime": "HH:MM (optional)",
          "endTime": "HH:MM (optional)",
          "title": "string",
          "description": "string (2-3 sentences with practical tips)",
          "estimatedCostINR": number,
          "transportMode": "walking|taxi|tuk-tuk|bus|train|ferry|motorbike|metro (optional)",
          "transportDurationMins": number (optional),
          "transportNotes": "string (optional)",
          "tags": ["string"],
          "poiSlug": "string (optional, if matches a known POI)"
        }
      ]
    }
  ]
}`;
}

// ============================================================
// RAG Context Builder
// ============================================================

function buildDestinationContext(contextData: {
  countryName: string;
  cities: Array<{
    name: string;
    avgDailyBudgetINR: number | null;
    foodHighlights: unknown;
    tags: string[];
    pois: Array<{
      name: string;
      slug: string;
      category: string;
      avgCostINR: number | null;
      avgDurationMins: number | null;
      tags: string[];
    }>;
  }>;
  visaInfo: Array<{
    visaType: string;
    fees: unknown;
    processingTimeDays: unknown;
  }>;
}): string {
  const { countryName, cities, visaInfo } = contextData;

  const citiesText = cities
    .map((city) => {
      const poisText = city.pois
        .slice(0, 10)
        .map(
          (p) =>
            `    - ${p.name} [${p.category}] — ₹${p.avgCostINR ?? 0} avg, ~${p.avgDurationMins ?? 60}min (slug: ${p.slug})`
        )
        .join('\n');

      const food = city.foodHighlights as { vegetarianOptions?: string[] } | null;
      const vegOptions = food?.vegetarianOptions?.join(', ') ?? 'Limited options';

      return `  ${city.name} (avg ₹${city.avgDailyBudgetINR ?? 3000}/day):
    Tags: ${city.tags.join(', ')}
    Vegetarian options: ${vegOptions}
    Points of Interest:
${poisText}`;
    })
    .join('\n\n');

  const visaText = visaInfo
    .map((v) => {
      const fees = v.fees as { inrApprox?: number } | null;
      const time = v.processingTimeDays as { min?: number; max?: number } | null;
      return `  - ${v.visaType}: ₹${fees?.inrApprox ?? 0} fee, ${time?.min ?? 0}-${time?.max ?? 7} day processing`;
    })
    .join('\n');

  return `=== DESTINATION DATABASE: ${countryName} ===

Cities and Points of Interest:
${citiesText}

Visa Information for Indian Passport Holders:
${visaText}

=== END DESTINATION DATA ===`;
}

// ============================================================
// Standard Chat (non-streaming)
// ============================================================

export async function sendChatMessage(context: ChatContext, userMessage: string): Promise<string> {
  const claude = getClient();

  const messages: Anthropic.MessageParam[] = [
    ...context.messages
      .slice(-20)
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    { role: 'user', content: userMessage },
  ];

  const systemPrompt = buildChatSystemPrompt(context.userProfile, context.travelHistory);
  const fullSystem = context.destinationContext
    ? `${systemPrompt}\n\n${context.destinationContext}`
    : systemPrompt;

  const response = await claude.messages.create({
    model: AI_MODEL,
    max_tokens: AI_MAX_TOKENS,
    system: fullSystem,
    messages,
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  return textBlock?.type === 'text' ? textBlock.text : '';
}

// ============================================================
// Streaming Chat
// Returns a ReadableStream that sends SSE chunks
// ============================================================

export async function streamChatMessage(
  context: ChatContext,
  userMessage: string
): Promise<{ stream: ReadableStream; getFullText: () => Promise<string> }> {
  const claude = getClient();

  const messages: Anthropic.MessageParam[] = [
    ...context.messages
      .slice(-20)
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    { role: 'user', content: userMessage },
  ];

  const systemPrompt = buildChatSystemPrompt(context.userProfile, context.travelHistory);
  const fullSystem = context.destinationContext
    ? `${systemPrompt}\n\n${context.destinationContext}`
    : systemPrompt;

  let fullText = '';
  let resolveFullText: (text: string) => void;
  const fullTextPromise = new Promise<string>((resolve) => {
    resolveFullText = resolve;
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        const claudeStream = claude.messages.stream({
          model: AI_MODEL,
          max_tokens: AI_MAX_TOKENS,
          system: fullSystem,
          messages,
        });

        claudeStream.on('text', (text) => {
          fullText += text;
          const chunk = `data: ${JSON.stringify({ text })}\n\n`;
          controller.enqueue(encoder.encode(chunk));
        });

        await claudeStream.finalMessage();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
        resolveFullText!(fullText);
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Stream error';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`)
        );
        controller.close();
        resolveFullText!('');
      }
    },
  });

  return { stream, getFullText: () => fullTextPromise };
}

// ============================================================
// Itinerary Generation
// ============================================================

export interface ItineraryGenerationInput {
  destinationSlugs: string[];
  durationDays: number;
  travelStyle?: string;
  pace?: string;
  companionType?: string;
  interests?: string[];
  budgetTotalINR?: number;
  dietaryPreferences?: string[];
  userProfile: TravelProfileData | null;
  travelHistory: TravelHistoryEntry[];
  destinationContext: string;
}

export async function generateItinerary(
  input: ItineraryGenerationInput
): Promise<GeneratedItinerary> {
  const claude = getClient();

  const visitedDestinations = input.travelHistory.map((h) => h.destination.name);

  const userRequest = `Generate a ${input.durationDays}-day itinerary for: ${input.destinationSlugs.join(', ')}

Parameters:
- Travel Style: ${input.travelStyle ?? input.userProfile?.defaultTravelStyle ?? 'LEISURE'}
- Pace: ${input.pace ?? input.userProfile?.defaultPace ?? 'BALANCED'}
- Companions: ${input.companionType ?? input.userProfile?.companionType ?? 'SOLO'}
- Total Budget: ₹${(input.budgetTotalINR ?? ((input.userProfile?.budgetMinINR ?? 50000) + (input.userProfile?.budgetMaxINR ?? 100000)) / 2).toLocaleString('en-IN')}
- Interests: ${(input.interests ?? input.userProfile?.preferredInterests ?? []).join(', ') || 'General sightseeing'}
- Dietary: ${(input.dietaryPreferences ?? input.userProfile?.dietaryPreferences ?? []).join(', ') || 'No preference'}
${visitedDestinations.length ? `- Already visited (exclude unless asked): ${visitedDestinations.join(', ')}` : ''}

Use the destination data provided in the system context. Generate POI slugs where they match known points of interest.
Output ONLY the JSON object.`;

  const systemWithContext = `${buildItinerarySystemPrompt()}\n\n${input.destinationContext}`;

  const response = await claude.messages.create({
    model: AI_MODEL,
    max_tokens: AI_MAX_TOKENS_ITINERARY,
    system: systemWithContext,
    messages: [{ role: 'user', content: userRequest }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from itinerary generator');
  }

  // Extract JSON (handle potential markdown code blocks)
  let jsonText = textBlock.text.trim();
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonText = jsonMatch[1].trim();

  const parsed = JSON.parse(jsonText) as GeneratedItinerary;
  return parsed;
}

// ============================================================
// Personalized Recommendations
// ============================================================

export async function generatePersonalizedRecommendations(
  profile: TravelProfileData,
  travelHistory: TravelHistoryEntry[],
  availableDestinations: CountrySummary[],
  limit: number = 10
): Promise<RecommendationResult[]> {
  const claude = getClient();

  const visitedSlugs = travelHistory.map((h) => h.destination.slug);
  const candidates = availableDestinations.filter((d) => !visitedSlugs.includes(d.slug));

  if (candidates.length === 0) return [];

  const destList = candidates
    .map(
      (d, i) =>
        `${i + 1}. ${d.name} (slug: ${d.slug}) — ${d.budgetTier} budget, tags: ${d.tags.join(', ')}`
    )
    .join('\n');

  const prompt = `Based on this Indian traveller's profile, rank the top ${limit} destinations.

## User Profile
- Travel Style: ${profile.defaultTravelStyle ?? 'Not specified'}
- Budget: ₹${profile.budgetMinINR.toLocaleString('en-IN')} – ₹${profile.budgetMaxINR.toLocaleString('en-IN')}
- Interests: ${profile.preferredInterests.join(', ') || 'Not specified'}
- Dietary: ${profile.dietaryPreferences.join(', ') || 'No preference'}
- Travelling: ${profile.companionType ?? 'Not specified'}
- Previously visited: ${travelHistory.map((h) => h.destination.name).join(', ') || 'None'}

## Available Destinations
${destList}

Output ONLY a JSON array:
[
  {
    "slug": "destination-slug",
    "score": 0.0-1.0,
    "reason": "One sentence explaining why this suits this traveller",
    "matchTags": ["tag1", "tag2"]
  }
]`;

  const response = await claude.messages.create({
    model: AI_MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') return [];

  let jsonText = textBlock.text.trim();
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonText = jsonMatch[1].trim();

  const ranked = JSON.parse(jsonText) as Array<{
    slug: string;
    score: number;
    reason: string;
    matchTags: string[];
  }>;

  return ranked
    .map((r) => {
      const country = candidates.find((d) => d.slug === r.slug);
      if (!country) return null;
      return {
        country,
        score: r.score,
        reason: r.reason,
        matchTags: r.matchTags,
      };
    })
    .filter((r): r is RecommendationResult => r !== null)
    .slice(0, limit);
}

// ============================================================
// Preference Analysis from Behavior Events
// ============================================================

export async function analyzeUserPreferences(
  events: Array<{ eventType: string; entityType: string | null; metadata: unknown }>
): Promise<string[]> {
  if (events.length < 5) return [];

  const claude = getClient();

  const eventSummary = events
    .slice(-50)
    .map(
      (e) =>
        `${e.eventType}: ${e.entityType ?? ''} ${JSON.stringify(e.metadata ?? {})}`
    )
    .join('\n');

  const prompt = `Based on these user behavior events on a travel platform, infer the user's travel interests.
Output ONLY a JSON array of interest tags (max 8, from: beaches, mountains, culture, food, adventure, luxury, budget, nature, nightlife, wellness, shopping, history, islands, wildlife, photography).

Events:
${eventSummary}

Output format: ["tag1", "tag2", ...]`;

  const response = await claude.messages.create({
    model: AI_MODEL,
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') return [];

  let jsonText = textBlock.text.trim();
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonText = jsonMatch[1].trim();

  return JSON.parse(jsonText) as string[];
}

export { buildDestinationContext };
