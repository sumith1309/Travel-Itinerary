'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { ArchetypeCard } from '@/components/onboarding/archetype-card';
import { PaceSelector } from '@/components/onboarding/pace-selector';
import { BudgetSlider } from '@/components/onboarding/budget-slider';
import { InterestPicker } from '@/components/onboarding/interest-picker';
import { DietarySelector } from '@/components/onboarding/dietary-selector';
import { OnboardingConfetti } from '@/components/onboarding/onboarding-confetti';
import {
  ONBOARDING_STEPS,
  TRAVELLER_ARCHETYPES,
  PACE_OPTIONS,
  BUDGET_RANGE,
  INTEREST_TAGS,
  DIETARY_OPTIONS,
} from '@/lib/constants';
import { tapSpring } from '@/lib/animations';

interface OnboardingData {
  archetype: string;
  pace: string;
  budgetMin: number;
  budgetMax: number;
  interests: string[];
  dietaryPreferences: string[];
}

const stepVariants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    archetype: '',
    pace: '',
    budgetMin: 20000,
    budgetMax: 100000,
    interests: [],
    dietaryPreferences: [],
  });

  const updateField = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.archetype !== '';
      case 2: return data.pace !== '';
      case 3: return data.budgetMin > 0 && data.budgetMax > data.budgetMin;
      case 4: return data.interests.length >= 2;
      case 5: return true; // dietary is optional
      default: return false;
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!session?.user?.id) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map archetype to travelStyle
      const archetypeToStyle: Record<string, string> = {
        explorer: 'ADVENTURE',
        foodie: 'CULTURAL',
        adventurer: 'ADVENTURE',
        'culture-seeker': 'CULTURAL',
        relaxer: 'LEISURE',
      };

      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _type: 'travel_profile',
          travelStyle: archetypeToStyle[data.archetype] ?? 'LEISURE',
          pace: data.pace,
          budgetMinINR: data.budgetMin,
          budgetMaxINR: data.budgetMax,
          preferredInterests: data.interests,
          dietaryPreferences: data.dietaryPreferences.length > 0 ? data.dietaryPreferences : ['NO_PREFERENCE'],
          onboardingCompleted: true,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save profile');
      }

      setIsComplete(true);
    } catch (err) {
      console.error('Onboarding save error:', err);
      setIsSubmitting(false);
    }
  }, [session, router, data]);

  // Completion screen
  if (isComplete) {
    return <OnboardingConfetti redirectUrl="/" />;
  }

  const totalSteps = ONBOARDING_STEPS.length;

  return (
    <div className="min-h-screen flex flex-col pt-24 pb-16">
      <div className="mx-auto w-full max-w-lg px-4 sm:px-6 flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-bold text-midnight"
          >
            Let&apos;s personalise your experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-stone mt-2"
          >
            Step {currentStep} of {totalSteps} — {ONBOARDING_STEPS[currentStep - 1]?.title}
          </motion.p>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full rounded-full bg-sand-200 mb-8">
          <motion.div
            className="h-full rounded-full bg-forest"
            initial={false}
            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ type: 'spring', damping: 20 }}
          />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentStep === 1 && (
              <ArchetypeCard
                archetypes={[...TRAVELLER_ARCHETYPES]}
                selected={data.archetype}
                onSelect={(value) => updateField('archetype', value)}
              />
            )}

            {currentStep === 2 && (
              <PaceSelector
                options={[...PACE_OPTIONS]}
                selected={data.pace}
                onSelect={(value) => updateField('pace', value)}
              />
            )}

            {currentStep === 3 && (
              <BudgetSlider
                min={BUDGET_RANGE.min}
                max={BUDGET_RANGE.max}
                value={[data.budgetMin, data.budgetMax]}
                onChange={([min, max]) => {
                  setData((prev) => ({ ...prev, budgetMin: min, budgetMax: max }));
                }}
              />
            )}

            {currentStep === 4 && (
              <InterestPicker
                interests={[...INTEREST_TAGS]}
                selected={data.interests}
                onToggle={(interest) => {
                  setData((prev) => ({
                    ...prev,
                    interests: prev.interests.includes(interest)
                      ? prev.interests.filter((i) => i !== interest)
                      : prev.interests.length < 6
                        ? [...prev.interests, interest]
                        : prev.interests,
                  }));
                }}
                min={2}
                max={6}
              />
            )}

            {currentStep === 5 && (
              <DietarySelector
                options={[...DIETARY_OPTIONS]}
                selected={data.dietaryPreferences}
                onToggle={(pref) => {
                  setData((prev) => ({
                    ...prev,
                    dietaryPreferences: prev.dietaryPreferences.includes(pref)
                      ? prev.dietaryPreferences.filter((d) => d !== pref)
                      : [...prev.dietaryPreferences, pref],
                  }));
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-sand-100">
          <motion.button
            {...tapSpring}
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-stone hover:text-midnight transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </motion.button>

          {currentStep < totalSteps ? (
            <motion.button
              {...tapSpring}
              onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))}
              disabled={!canProceed()}
              className="flex items-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-green"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          ) : (
            <motion.button
              {...tapSpring}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest/90 transition-colors disabled:opacity-40 shadow-glow-green"
            >
              <Sparkles className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Complete Setup'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
