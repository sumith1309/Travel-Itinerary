import { z } from 'zod';

// ============================================================
// COMMON
// ============================================================

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

// ============================================================
// AUTH
// ============================================================

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ============================================================
// DESTINATIONS
// ============================================================

export const destinationsQuerySchema = paginationSchema.extend({
  region: z.string().optional(),
  budgetTier: z.enum(['budget', 'moderate', 'premium']).optional(),
  includeVisa: z.coerce.boolean().optional(),
});

export type DestinationsQuery = z.infer<typeof destinationsQuerySchema>;

// ============================================================
// ITINERARIES
// ============================================================

export const itinerariesQuerySchema = paginationSchema.extend({
  type: z.enum(['my', 'samples', 'public']).default('samples'),
  destination: z.string().optional(),
  style: z
    .enum(['LEISURE', 'ADVENTURE', 'LUXURY', 'BUDGET', 'CULTURAL'])
    .optional(),
  duration: z.coerce.number().min(1).max(30).optional(),
});

export type ItinerariesQuery = z.infer<typeof itinerariesQuerySchema>;

const baseItinerarySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  destinationSlugs: z
    .array(z.string())
    .min(1, 'At least one destination is required')
    .max(5),
  durationDays: z.number().min(1).max(30),
  travelStyle: z
    .enum(['LEISURE', 'ADVENTURE', 'LUXURY', 'BUDGET', 'CULTURAL'])
    .optional(),
  pace: z.enum(['RELAXED', 'BALANCED', 'FAST']).optional(),
  companionType: z.enum(['SOLO', 'COUPLE', 'FAMILY', 'FRIENDS']).optional(),
  interests: z.array(z.string()).optional(),
  budgetTotalINR: z.number().positive().optional(),
});

export const createItinerarySchema = baseItinerarySchema.extend({
  generate: z.literal(false).optional(),
  description: z.string().max(500).optional(),
});

export const generateItinerarySchema = baseItinerarySchema.extend({
  generate: z.literal(true),
  dietaryPreferences: z
    .array(z.enum(['VEGETARIAN', 'VEGAN', 'JAIN', 'HALAL', 'NO_PREFERENCE']))
    .optional(),
  accessibilityNeeds: z.record(z.unknown()).optional(),
});

export const itineraryBodySchema = z.discriminatedUnion('generate', [
  createItinerarySchema,
  generateItinerarySchema,
]);

export type CreateItineraryInput = z.infer<typeof createItinerarySchema>;
export type GenerateItineraryInput = z.infer<typeof generateItinerarySchema>;

// ============================================================
// CHATBOT
// ============================================================

export const createSessionSchema = z.object({
  action: z.literal('create_session'),
  destinationContext: z.string().optional(),
  title: z.string().max(100).optional(),
});

export const sendMessageSchema = z.object({
  action: z.literal('message'),
  sessionId: z.string().cuid('Invalid session ID'),
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message too long'),
  stream: z.boolean().optional().default(false),
});

export const chatbotBodySchema = z.discriminatedUnion('action', [
  createSessionSchema,
  sendMessageSchema,
]);

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

// ============================================================
// SEARCH
// ============================================================

export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(1, 'Search query is required')
    .max(200, 'Search query too long'),
  type: z
    .enum(['all', 'destinations', 'experiences', 'blogs', 'visa'])
    .default('all'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

// ============================================================
// VISA
// ============================================================

export const visaQuerySchema = paginationSchema.extend({
  type: z
    .enum(['VISA_FREE', 'VISA_ON_ARRIVAL', 'E_VISA', 'EMBASSY_VISA'])
    .optional(),
  country: z.string().optional(),
});

export type VisaQuery = z.infer<typeof visaQuerySchema>;

// ============================================================
// RECOMMENDATIONS
// ============================================================

export const recommendationsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(20).default(10),
  exclude: z.string().optional(),
});

export type RecommendationsQuery = z.infer<typeof recommendationsQuerySchema>;

// ============================================================
// USERS
// ============================================================

export const updateProfileSchema = z.object({
  _type: z.literal('profile'),
  name: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  passportNationality: z.string().length(2).toUpperCase().optional(),
});

export const updateTravelProfileSchema = z.object({
  _type: z.literal('travel_profile'),
  defaultTravelStyle: z
    .enum(['LEISURE', 'ADVENTURE', 'LUXURY', 'BUDGET', 'CULTURAL'])
    .optional(),
  defaultPace: z.enum(['RELAXED', 'BALANCED', 'FAST']).optional(),
  budgetMinINR: z.number().min(0).optional(),
  budgetMaxINR: z.number().min(0).optional(),
  preferredInterests: z.array(z.string()).optional(),
  dietaryPreferences: z
    .array(z.enum(['VEGETARIAN', 'VEGAN', 'JAIN', 'HALAL', 'NO_PREFERENCE']))
    .optional(),
  companionType: z.enum(['SOLO', 'COUPLE', 'FAMILY', 'FRIENDS']).optional(),
  accessibilityNeeds: z.record(z.unknown()).optional(),
  onboardingCompleted: z.boolean().optional(),
});

export const userPatchSchema = z.discriminatedUnion('_type', [
  updateProfileSchema,
  updateTravelProfileSchema,
]);

export const logTripSchema = z.object({
  action: z.literal('log_trip'),
  destinationId: z.string().cuid(),
  cityId: z.string().cuid().optional(),
  tripDate: z.string().datetime(),
  durationDays: z.number().min(1).max(365),
  travelStyle: z
    .enum(['LEISURE', 'ADVENTURE', 'LUXURY', 'BUDGET', 'CULTURAL'])
    .optional(),
  budgetSpentINR: z.number().positive().optional(),
  rating: z.number().min(1).max(5).optional(),
  highlights: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
});

export const trackEventSchema = z.object({
  action: z.literal('track_event'),
  eventType: z.string().min(1).max(100),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const userPostSchema = z.discriminatedUnion('action', [
  logTripSchema,
  trackEventSchema,
]);

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateTravelProfileInput = z.infer<typeof updateTravelProfileSchema>;
export type LogTripInput = z.infer<typeof logTripSchema>;
export type TrackEventInput = z.infer<typeof trackEventSchema>;
