'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useItineraryBuilder } from '@/lib/hooks/use-itinerary-builder';
import { WizardProgressBar } from '@/components/plan/wizard-progress-bar';
import { StepDestination } from '@/components/plan/step-destination';
import { StepDuration } from '@/components/plan/step-duration';
import { StepStyle } from '@/components/plan/step-style';
import { StepCompanions } from '@/components/plan/step-companions';
import { StepInterests } from '@/components/plan/step-interests';
import { StepReview } from '@/components/plan/step-review';
import { GenerationProgress } from '@/components/plan/generation-progress';
import { tapSpring } from '@/lib/animations';

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function PlanPage() {
  const searchParams = useSearchParams();
  const builder = useItineraryBuilder();

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
    setDestination,
    setDuration,
    setStartDate,
    setTravelStyle,
    setPace,
    setCompanionType,
    setBudget,
    setDietaryPreferences,
    toggleInterest,
    setSpecialRequests,
    setStep,
    nextStep,
    prevStep,
    canProceed,
    generateItinerary,
    setGenerationError,
  } = builder;

  // Handle URL parameters from home page widget
  useEffect(() => {
    const dest = searchParams.get('dest');
    const days = searchParams.get('days');
    const style = searchParams.get('style');

    if (dest && !destinationSlugs.length) {
      const slug = dest.toLowerCase().replace(/\s+/g, '-');
      setDestination([slug], dest);
    }
    if (days && !durationDays) {
      setDuration(parseInt(days, 10) || 5);
    }
    if (style && !travelStyle) {
      setTravelStyle(style);
    }
  }, [searchParams, destinationSlugs.length, durationDays, travelStyle, setDestination, setDuration, setTravelStyle]);

  // If generating, show progress animation
  if (isGenerating || generationError) {
    return (
      <div className="pt-24 pb-[var(--spacing-section)]">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <GenerationProgress
            isGenerating={isGenerating}
            destinationName={destinationName}
            error={generationError}
            onRetry={() => {
              setGenerationError(null);
              generateItinerary();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-[var(--spacing-section)]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <WizardProgressBar
            currentStep={currentStep}
            onStepClick={(step) => setStep(step)}
          />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={currentStep}
            custom={1}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentStep === 1 && (
              <StepDestination
                selectedSlugs={destinationSlugs}
                selectedName={destinationName}
                onSelect={setDestination}
              />
            )}

            {currentStep === 2 && (
              <StepDuration
                duration={durationDays}
                onDurationChange={setDuration}
                startDate={startDate}
                onStartDateChange={setStartDate}
                destinationName={destinationName}
              />
            )}

            {currentStep === 3 && (
              <StepStyle
                travelStyle={travelStyle}
                pace={pace}
                onStyleChange={setTravelStyle}
                onPaceChange={setPace}
              />
            )}

            {currentStep === 4 && (
              <StepCompanions
                companionType={companionType}
                budget={budgetTotalINR}
                dietaryPreferences={dietaryPreferences}
                onCompanionChange={setCompanionType}
                onBudgetChange={setBudget}
                onDietaryChange={setDietaryPreferences}
              />
            )}

            {currentStep === 5 && (
              <StepInterests
                interests={interests}
                specialRequests={specialRequests}
                onToggleInterest={toggleInterest}
                onSpecialRequestsChange={setSpecialRequests}
              />
            )}

            {currentStep === 6 && (
              <StepReview
                destinationName={destinationName}
                durationDays={durationDays}
                startDate={startDate}
                travelStyle={travelStyle}
                pace={pace}
                companionType={companionType}
                budget={budgetTotalINR}
                dietaryPreferences={dietaryPreferences}
                interests={interests}
                specialRequests={specialRequests}
                onEditStep={setStep}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-sand-100">
          <motion.button
            {...tapSpring}
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-stone hover:text-midnight transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </motion.button>

          {currentStep < 6 ? (
            <motion.button
              {...tapSpring}
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-green"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          ) : (
            <motion.button
              {...tapSpring}
              onClick={generateItinerary}
              disabled={!canProceed()}
              className="flex items-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-green"
            >
              <Sparkles className="h-4 w-4" />
              Generate Itinerary
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
