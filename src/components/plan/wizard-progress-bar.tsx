'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUILDER_STEPS } from '@/lib/constants';

interface WizardProgressBarProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function WizardProgressBar({ currentStep, onStepClick }: WizardProgressBarProps) {
  return (
    <div className="w-full">
      {/* Desktop: horizontal steps */}
      <div className="hidden sm:flex items-center justify-between">
        {BUILDER_STEPS.map((step, i) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted && onStepClick;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step circle + label */}
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  'flex flex-col items-center gap-1.5 group',
                  isClickable && 'cursor-pointer'
                )}
              >
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-sm font-mono font-bold transition-all',
                    isCompleted
                      ? 'bg-forest text-white'
                      : isCurrent
                        ? 'bg-forest text-white shadow-glow-green'
                        : 'bg-sand-200 text-stone'
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </motion.div>
                <span
                  className={cn(
                    'text-[11px] font-medium whitespace-nowrap',
                    isCurrent ? 'text-forest' : isCompleted ? 'text-midnight' : 'text-stone'
                  )}
                >
                  {step.title}
                </span>
              </button>

              {/* Connector line */}
              {i < BUILDER_STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mt-[-16px]">
                  <div
                    className={cn(
                      'h-full rounded-full transition-colors',
                      currentStep > step.id ? 'bg-forest' : 'bg-sand-200'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: progress bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-midnight">
            Step {currentStep} of {BUILDER_STEPS.length}
          </span>
          <span className="text-sm text-stone">
            {BUILDER_STEPS[currentStep - 1]?.title}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-sand-200">
          <motion.div
            className="h-full rounded-full bg-forest"
            initial={false}
            animate={{ width: `${((currentStep - 1) / (BUILDER_STEPS.length - 1)) * 100}%` }}
            transition={{ type: 'spring', damping: 20 }}
          />
        </div>
      </div>
    </div>
  );
}
