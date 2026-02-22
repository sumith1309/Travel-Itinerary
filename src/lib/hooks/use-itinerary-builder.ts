'use client';

// ============================================================
// TRAILS AND MILES — Itinerary Builder Hook
// Wraps builder store with computed values and submission logic
// ============================================================

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useItineraryBuilderStore } from '@/stores/itinerary-builder-store';

export function useItineraryBuilder() {
  const router = useRouter();
  const store = useItineraryBuilderStore();

  const {
    currentStep,
    destinationSlugs,
    destinationName,
    durationDays,
    startDate,
    travelStyle,
    pace,
    companionType,
    budgetTotalINR,
    dietaryPreferences,
    interests,
    specialRequests,
    isGenerating,
    generationError,
  } = store;

  // ── Computed: Summary Data ───────────────────────────────

  const summaryData = {
    destination: destinationName || destinationSlugs.join(', '),
    duration: `${durationDays} day${durationDays > 1 ? 's' : ''}`,
    style: travelStyle,
    pace,
    companions: companionType,
    budget: budgetTotalINR,
    dietary: dietaryPreferences,
    interests,
    specialRequests,
  };

  // ── Computed: Progress ───────────────────────────────────

  const progress = Math.round(((currentStep - 1) / 5) * 100);
  const isComplete = currentStep === 6 && store.canProceed();

  // ── Submit: Generate Itinerary ───────────────────────────

  const generateItinerary = useCallback(async () => {
    store.setGenerating(true);
    store.setGenerationError(null);

    try {
      const res = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generate: true,
          title: `${destinationName} — ${durationDays}-Day ${travelStyle} Trip`,
          destinationSlugs,
          durationDays,
          travelStyle: travelStyle || undefined,
          pace: pace || undefined,
          companionType: companionType || undefined,
          budgetTotalINR,
          interests,
          dietaryPreferences: dietaryPreferences.length ? dietaryPreferences : undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ?? `Generation failed (${res.status})`);
      }

      const { data } = await res.json();
      const slug = data.shareToken ?? data.id;

      // Reset wizard and navigate
      store.reset();
      router.push(`/itineraries/${slug}`);
    } catch (error) {
      store.setGenerationError(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    } finally {
      store.setGenerating(false);
    }
  }, [
    store,
    destinationSlugs,
    destinationName,
    durationDays,
    travelStyle,
    pace,
    companionType,
    budgetTotalINR,
    interests,
    dietaryPreferences,
    router,
  ]);

  return {
    // State
    ...store,
    summaryData,
    progress,
    isComplete,

    // Actions
    generateItinerary,
  };
}
