'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, Sparkles, MapPin } from 'lucide-react';
import { GENERATION_STAGES } from '@/lib/constants';

interface GenerationProgressProps {
  isGenerating: boolean;
  destinationName: string;
  error?: string | null;
  onRetry?: () => void;
}

export function GenerationProgress({
  isGenerating,
  destinationName,
  error,
  onRetry,
}: GenerationProgressProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStage(0);
      setCompletedStages([]);
      return;
    }

    let stageIndex = 0;
    const timers: NodeJS.Timeout[] = [];

    function advanceStage() {
      if (stageIndex < GENERATION_STAGES.length - 1) {
        setCompletedStages((prev) => [...prev, stageIndex]);
        stageIndex++;
        setCurrentStage(stageIndex);

        const timer = setTimeout(advanceStage, GENERATION_STAGES[stageIndex].duration);
        timers.push(timer);
      }
    }

    const timer = setTimeout(advanceStage, GENERATION_STAGES[0].duration);
    timers.push(timer);

    return () => timers.forEach(clearTimeout);
  }, [isGenerating]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
          <span className="text-3xl">😔</span>
        </div>
        <h3 className="font-display text-xl font-bold text-midnight mb-2">
          Something went wrong
        </h3>
        <p className="text-sm text-stone text-center max-w-sm mb-6">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest/90 transition-colors"
          >
            Try again
          </button>
        )}
      </motion.div>
    );
  }

  if (!isGenerating) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Animated icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="relative mb-8"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest/10">
          <Sparkles className="h-8 w-8 text-forest" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-forest/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Destination name */}
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-4 w-4 text-forest" />
        <span className="text-sm font-medium text-midnight">
          Planning your {destinationName} adventure
        </span>
      </div>

      {/* Progress stages */}
      <div className="w-full max-w-xs space-y-3">
        {GENERATION_STAGES.map((stage, i) => {
          const isCompleted = completedStages.includes(i);
          const isCurrent = currentStage === i;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-forest"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div key="loading">
                      <Loader2 className="h-5 w-5 text-forest animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="pending"
                      className="h-2 w-2 rounded-full bg-sand-300"
                    />
                  )}
                </AnimatePresence>
              </div>
              <span
                className={`text-sm transition-colors ${
                  isCurrent
                    ? 'text-midnight font-medium'
                    : isCompleted
                      ? 'text-forest'
                      : 'text-stone/50'
                }`}
              >
                {stage.message}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Subtle tip */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="text-xs text-stone mt-8 text-center"
      >
        This usually takes 15–30 seconds
      </motion.p>
    </motion.div>
  );
}
