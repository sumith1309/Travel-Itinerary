'use client';

// ============================================================
// TRAILS AND MILES — Client-Side Tracking Hook
// Batched event tracking with automatic page view + time-on-page
// ============================================================

import { useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

interface TrackingEvent {
  type: string;
  data: Record<string, unknown>;
}

const BATCH_SIZE = 5;
const BATCH_INTERVAL = 30_000; // 30 seconds

export function useTracking() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const queueRef = useRef<TrackingEvent[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pageEntryRef = useRef<number>(Date.now());

  // ── Flush Queue ──────────────────────────────────────────

  const flush = useCallback(async () => {
    if (queueRef.current.length === 0) return;

    const events = [...queueRef.current];
    queueRef.current = [];

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
    } catch {
      // Re-queue on failure (up to a limit)
      if (queueRef.current.length < 50) {
        queueRef.current.push(...events);
      }
    }
  }, []);

  // ── Track Event ──────────────────────────────────────────

  const trackEvent = useCallback(
    (type: string, data: Record<string, unknown> = {}) => {
      queueRef.current.push({
        type,
        data: {
          ...data,
          page: pathname,
          timestamp: new Date().toISOString(),
        },
      });

      // Auto-flush when batch is full
      if (queueRef.current.length >= BATCH_SIZE) {
        flush();
      }
    },
    [pathname, flush]
  );

  // ── Batch Timer ──────────────────────────────────────────

  useEffect(() => {
    timerRef.current = setInterval(flush, BATCH_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      flush(); // Flush remaining on unmount
    };
  }, [flush]);

  // ── Auto Page View ───────────────────────────────────────

  useEffect(() => {
    pageEntryRef.current = Date.now();
    trackEvent('page_view', { page: pathname });

    // Track time-on-page when leaving
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const timeSpent = Math.round((Date.now() - pageEntryRef.current) / 1000);
        if (timeSpent > 2) {
          trackEvent('page_view', {
            page: pathname,
            timeSpent,
            action: 'leave',
          });
          flush();
        }
      } else {
        pageEntryRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [pathname, trackEvent, flush]);

  // ── Convenience Methods ──────────────────────────────────

  const trackDestinationView = useCallback(
    (slug: string) => trackEvent('destination_view', { slug }),
    [trackEvent]
  );

  const trackSearch = useCallback(
    (query: string, resultCount: number) =>
      trackEvent('search', { query, resultCount }),
    [trackEvent]
  );

  const trackVisaCheck = useCallback(
    (country: string, visaType: string) =>
      trackEvent('visa_check', { country, visaType }),
    [trackEvent]
  );

  const trackRecommendationClick = useCallback(
    (slug: string, position: number, reason: string) =>
      trackEvent('recommendation_click', { slug, position, reason }),
    [trackEvent]
  );

  const trackItineraryGenerate = useCallback(
    (destination: string, duration: number, style: string) =>
      trackEvent('itinerary_generate', { destination, duration, style }),
    [trackEvent]
  );

  return {
    trackEvent,
    trackDestinationView,
    trackSearch,
    trackVisaCheck,
    trackRecommendationClick,
    trackItineraryGenerate,
    flush,
  };
}
