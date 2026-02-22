'use client';

// ============================================================
// TRAILS AND MILES — Itinerary Builder Store (Zustand)
// Multi-step wizard state for the /plan page
// ============================================================

import { create } from 'zustand';

interface ItineraryBuilderState {
  // Current step (1-6)
  currentStep: number;

  // Step 1: Destination
  destinationSlugs: string[];
  destinationName: string;

  // Step 2: Duration
  durationDays: number;
  startDate: string | null;

  // Step 3: Style
  travelStyle: string;
  pace: string;

  // Step 4: Companions & Budget
  companionType: string;
  budgetTotalINR: number;
  dietaryPreferences: string[];

  // Step 5: Interests
  interests: string[];
  specialRequests: string;

  // Generation state
  isGenerating: boolean;
  generationError: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setDestination: (slugs: string[], name: string) => void;
  setDuration: (days: number) => void;
  setStartDate: (date: string | null) => void;
  setTravelStyle: (style: string) => void;
  setPace: (pace: string) => void;
  setCompanionType: (type: string) => void;
  setBudget: (amount: number) => void;
  setDietaryPreferences: (prefs: string[]) => void;
  toggleInterest: (interest: string) => void;
  setSpecialRequests: (text: string) => void;
  setGenerating: (generating: boolean) => void;
  setGenerationError: (error: string | null) => void;
  reset: () => void;
  canProceed: () => boolean;
}

const initialState = {
  currentStep: 1,
  destinationSlugs: [] as string[],
  destinationName: '',
  durationDays: 5,
  startDate: null as string | null,
  travelStyle: '',
  pace: '',
  companionType: '',
  budgetTotalINR: 75000,
  dietaryPreferences: [] as string[],
  interests: [] as string[],
  specialRequests: '',
  isGenerating: false,
  generationError: null as string | null,
};

export const useItineraryBuilderStore = create<ItineraryBuilderState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 6) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  setDestination: (slugs, name) => set({ destinationSlugs: slugs, destinationName: name }),
  setDuration: (days) => set({ durationDays: days }),
  setStartDate: (date) => set({ startDate: date }),
  setTravelStyle: (style) => set({ travelStyle: style }),
  setPace: (pace) => set({ pace: pace }),
  setCompanionType: (type) => set({ companionType: type }),
  setBudget: (amount) => set({ budgetTotalINR: amount }),
  setDietaryPreferences: (prefs) => set({ dietaryPreferences: prefs }),

  toggleInterest: (interest) =>
    set((s) => ({
      interests: s.interests.includes(interest)
        ? s.interests.filter((i) => i !== interest)
        : s.interests.length < 6
          ? [...s.interests, interest]
          : s.interests,
    })),

  setSpecialRequests: (text) => set({ specialRequests: text }),
  setGenerating: (generating) => set({ isGenerating: generating }),
  setGenerationError: (error) => set({ generationError: error }),

  reset: () => set(initialState),

  canProceed: () => {
    const s = get();
    switch (s.currentStep) {
      case 1: return s.destinationSlugs.length > 0;
      case 2: return s.durationDays >= 1 && s.durationDays <= 30;
      case 3: return s.travelStyle !== '' && s.pace !== '';
      case 4: return s.companionType !== '' && s.budgetTotalINR >= 5000;
      case 5: return s.interests.length >= 1;
      case 6: return true;
      default: return false;
    }
  },
}));
