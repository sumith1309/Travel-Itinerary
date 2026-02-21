// ============================================================
// TRAILS AND MILES — Shared TypeScript Types
// ============================================================

import type {
  TravelStyle,
  Pace,
  CompanionType,
  VisaType,
  ItineraryStatus,
  DietaryPreference,
  ContentStatus,
  ExperienceCategory,
  DifficultyLevel,
  NotificationType,
} from '@prisma/client';

export type {
  TravelStyle,
  Pace,
  CompanionType,
  VisaType,
  ItineraryStatus,
  DietaryPreference,
  ContentStatus,
  ExperienceCategory,
  DifficultyLevel,
  NotificationType,
};

// ============================================================
// API Response Types
// ============================================================

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiPaginated<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: { field: string; message: string }[];
}

// ============================================================
// User Types
// ============================================================

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  passportNationality: string;
  emailVerified: Date | null;
  createdAt: Date;
  travelProfile: TravelProfileData | null;
}

export interface TravelProfileData {
  id: string;
  userId: string;
  defaultTravelStyle: TravelStyle | null;
  defaultPace: Pace | null;
  budgetMinINR: number;
  budgetMaxINR: number;
  preferredInterests: string[];
  dietaryPreferences: DietaryPreference[];
  companionType: CompanionType | null;
  accessibilityNeeds: unknown | null;
  onboardingCompleted: boolean;
}

export interface TravelHistoryEntry {
  id: string;
  userId: string;
  destinationId: string;
  cityId: string | null;
  tripDate: Date;
  durationDays: number;
  travelStyle: TravelStyle | null;
  budgetSpentINR: number | null;
  rating: number | null;
  highlights: string[];
  notes: string | null;
  destination: CountrySummary;
  city: CitySummary | null;
}

export interface UserStats {
  itineraryCount: number;
  savedCount: number;
  reviewCount: number;
  chatCount: number;
}

// ============================================================
// Destination Types
// ============================================================

export interface RegionSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface CountrySummary {
  id: string;
  name: string;
  slug: string;
  heroImageUrl: string | null;
  currencyCode: string;
  budgetTier: string | null;
  safetyRating: number | null;
  tags: string[];
  bestSeasons: BestSeasons | null;
  region: RegionSummary;
}

export interface CountryDetail extends CountrySummary {
  description: string | null;
  heroVideoUrl: string | null;
  currencyName: string | null;
  timezone: string | null;
  language: string | null;
  capitalCity: string | null;
  quickFacts: QuickFacts | null;
  cities: CityWithPOICount[];
  visaInfo: VisaInfoSummary[];
  sampleItineraries: ItinerarySummary[];
  experiences: ExperienceSummary[];
  similarDestinations: CountrySummary[];
}

export interface CitySummary {
  id: string;
  name: string;
  slug: string;
  heroImageUrl: string | null;
  budgetTier: string | null;
  isCapital: boolean;
  avgDailyBudgetINR: number | null;
  tags: string[];
  latitude: number | null;
  longitude: number | null;
}

export interface CityWithPOICount extends CitySummary {
  _count: { pointsOfInterest: number };
}

export interface CityDetail extends CitySummary {
  description: string | null;
  bestSeasons: BestSeasons | null;
  localTransport: Record<string, unknown> | null;
  safetyTips: string[];
  foodHighlights: FoodHighlights | null;
  pointsOfInterest: POISummary[];
}

export interface POISummary {
  id: string;
  name: string;
  slug: string;
  category: ExperienceCategory;
  subcategory: string | null;
  shortDescription: string | null;
  avgDurationMins: number | null;
  avgCostINR: number | null;
  ratingAvg: number | null;
  ratingCount: number;
  tags: string[];
  images: POIImages | null;
}

export interface POIDetail extends POISummary {
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  openingHours: Record<string, unknown> | null;
  tips: string[];
  bestTimeToVisit: string | null;
  accessibilityInfo: Record<string, unknown> | null;
}

export interface ExperienceSummary {
  id: string;
  name: string;
  slug: string;
  category: ExperienceCategory;
  shortDescription: string | null;
  heroImageUrl: string | null;
  idealDurationDays: { min: number; max: number } | null;
  budgetRangeINR: BudgetRange | null;
  bestDestinations: string[];
  tags: string[];
}

// ============================================================
// Visa Types
// ============================================================

export interface VisaInfoSummary {
  id: string;
  visaType: VisaType;
  description: string | null;
  fees: VisaFees | null;
  processingTimeDays: ProcessingTime | null;
  country: CountrySummary;
}

export interface VisaInfoDetail extends VisaInfoSummary {
  documentsRequired: VisaDocument[];
  commonMistakes: string[];
  tips: string[];
  applicationUrl: string | null;
  checklistPdfUrl: string | null;
  lastVerifiedAt: Date | null;
}

export interface VisaCategoryCounts {
  VISA_FREE: number;
  VISA_ON_ARRIVAL: number;
  E_VISA: number;
  EMBASSY_VISA: number;
}

// ============================================================
// Itinerary Types
// ============================================================

export interface ItinerarySummary {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  destinationSlugs: string[];
  durationDays: number;
  travelStyle: TravelStyle | null;
  pace: Pace | null;
  companionType: CompanionType | null;
  budgetTotalINR: number | null;
  interests: string[];
  status: ItineraryStatus;
  isAiGenerated: boolean;
  isPublic: boolean;
  isSample: boolean;
  shareToken: string | null;
  viewCount: number;
  saveCount: number;
  createdAt: Date;
  user: { name: string | null; avatarUrl: string | null } | null;
  _count: { days: number };
}

export interface ItineraryDetail extends ItinerarySummary {
  days: ItineraryDayDetail[];
  metadata: Record<string, unknown> | null;
}

export interface ItineraryDayDetail {
  id: string;
  dayNumber: number;
  cityId: string | null;
  title: string | null;
  description: string | null;
  dailyBudgetINR: number | null;
  notes: string | null;
  weatherAdvisory: string | null;
  city: CitySummary | null;
  items: ItineraryItemDetail[];
}

export interface ItineraryItemDetail {
  id: string;
  timeSlot: string;
  startTime: string | null;
  endTime: string | null;
  title: string;
  description: string | null;
  estimatedCostINR: number | null;
  transportMode: string | null;
  transportDurationMins: number | null;
  transportNotes: string | null;
  imageUrl: string | null;
  tags: string[];
  sortOrder: number;
  poi: POISummary | null;
}

// ============================================================
// AI / Chatbot Types
// ============================================================

export interface ChatSessionSummary {
  id: string;
  title: string | null;
  context: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: { messages: number };
}

export interface ChatMessageData {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface ChatContext {
  sessionId: string;
  userProfile: TravelProfileData | null;
  travelHistory: TravelHistoryEntry[];
  messages: ChatMessageData[];
  destinationContext?: string;
}

// Generated itinerary structure returned by Claude
export interface GeneratedItinerary {
  title: string;
  description: string;
  destinationSlugs: string[];
  durationDays: number;
  travelStyle: TravelStyle;
  pace: Pace;
  companionType: CompanionType;
  budgetTotalINR: number;
  coverImageUrl?: string;
  days: GeneratedDay[];
}

export interface GeneratedDay {
  dayNumber: number;
  citySlug?: string;
  title: string;
  description: string;
  dailyBudgetINR: number;
  weatherAdvisory?: string;
  items: GeneratedItem[];
}

export interface GeneratedItem {
  timeSlot: 'morning' | 'afternoon' | 'evening';
  startTime?: string;
  endTime?: string;
  title: string;
  description: string;
  estimatedCostINR: number;
  transportMode?: string;
  transportDurationMins?: number;
  transportNotes?: string;
  tags: string[];
  poiSlug?: string;
}

// ============================================================
// Recommendation Types
// ============================================================

export interface RecommendationResult {
  country: CountrySummary;
  score: number;
  reason: string;
  matchTags: string[];
}

// ============================================================
// Search Types
// ============================================================

export interface SearchResult {
  type: 'country' | 'city' | 'experience' | 'blog' | 'visa';
  id: string;
  title: string;
  description: string | null;
  slug: string;
  imageUrl: string | null;
  metadata: Record<string, unknown>;
}

// ============================================================
// Shared JSON Sub-types
// ============================================================

export interface BestSeasons {
  months: number[];
  description?: string;
  peak?: number[];
  shoulder?: number[];
  avoid?: number[];
}

export interface QuickFacts {
  population?: string;
  capital?: string;
  language?: string;
  currency?: string;
  electricalPlug?: string;
  emergencyNumber?: string;
  indianFoodAvailability?: 'high' | 'medium' | 'low';
  simCardCost?: string;
  upiAccepted?: boolean;
  drivingSide?: 'left' | 'right';
  tipExpected?: boolean;
}

export interface BudgetRange {
  budget: number;
  midRange: number;
  luxury: number;
  currency?: string;
}

export interface VisaFees {
  currency: string;
  amount: number;
  inrApprox: number;
}

export interface ProcessingTime {
  min: number;
  max: number;
  unit?: string;
}

export interface VisaDocument {
  name: string;
  description: string;
  mandatory: boolean;
}

export interface POIImages {
  main?: string;
  gallery?: string[];
}

export interface FoodHighlights {
  mustTry: string[];
  vegetarianOptions: string[];
  indianFoodAvailable: boolean;
  topRestaurants?: string[];
}
