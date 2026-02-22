'use client';

// ============================================================
// TRAILS AND MILES — Track View Component
// Invisible drop-in component that fires analytics events
// via IntersectionObserver (once) and tracks time-on-page on unmount
// ============================================================

import { useEffect, useRef, useCallback } from 'react';
import { useTracking } from '@/lib/hooks/use-tracking';

interface TrackViewProps {
  event: string;
  data?: Record<string, unknown>;
}

export function TrackView({ event, data = {} }: TrackViewProps) {
  const { trackEvent } = useTracking();
  const elementRef = useRef<HTMLDivElement>(null);
  const hasFiredRef = useRef(false);
  const entryTimeRef = useRef<number | null>(null);

  const fireEvent = useCallback(() => {
    if (hasFiredRef.current) return;
    hasFiredRef.current = true;
    entryTimeRef.current = Date.now();
    trackEvent(event, { ...data, trigger: 'viewport_enter' });
  }, [event, data, trackEvent]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Use IntersectionObserver to detect when element enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            fireEvent();
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();

      // Track time-on-page when component unmounts
      if (entryTimeRef.current !== null) {
        const timeSpent = Math.round((Date.now() - entryTimeRef.current) / 1000);
        if (timeSpent > 0) {
          trackEvent(event, {
            ...data,
            trigger: 'unmount',
            timeSpent,
          });
        }
      }
    };
    // Only run once on mount/unmount; stable references via refs handle the rest
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={elementRef} aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} />;
}
