'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Loader2 } from 'lucide-react';
import { tapSpring } from '@/lib/animations';

interface RegenerateButtonProps {
  dayNumber: number;
  itineraryId: string;
  onRegenerated?: () => void;
}

export function RegenerateButton({ dayNumber, itineraryId, onRegenerated }: RegenerateButtonProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setError(null);
    setShowConfirm(false);

    try {
      const res = await fetch(`/api/itineraries/${itineraryId}/regenerate-day`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayNumber }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? 'Failed to regenerate day');
      }

      onRegenerated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="relative inline-flex">
      <motion.button
        {...tapSpring}
        onClick={() => setShowConfirm(true)}
        disabled={isRegenerating}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-stone hover:text-forest hover:bg-forest/5 transition-colors disabled:opacity-50"
      >
        {isRegenerating ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <RefreshCw className="h-3.5 w-3.5" />
        )}
        {isRegenerating ? 'Regenerating...' : 'Regenerate day'}
      </motion.button>

      {/* Confirmation Popover */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="absolute top-full left-0 mt-1 z-20 w-56 rounded-xl bg-white border border-sand-200 shadow-elevated p-3"
          >
            <p className="text-xs text-midnight mb-2 font-medium">
              Regenerate Day {dayNumber}?
            </p>
            <p className="text-[11px] text-stone mb-3">
              AI will create a new plan for this day. Current activities will be replaced.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-lg py-1.5 text-xs font-medium text-stone bg-sand-100 hover:bg-sand-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerate}
                className="flex-1 rounded-lg py-1.5 text-xs font-medium text-white bg-forest hover:bg-forest/90 transition-colors"
              >
                Regenerate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full left-0 mt-1 z-20 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600"
          >
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 underline hover:no-underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
