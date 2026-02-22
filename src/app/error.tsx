'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-6 text-center">
      {/* Icon */}
      <div className="neu-raised mb-8 flex h-20 w-20 items-center justify-center rounded-full">
        <svg
          className="h-10 w-10 text-orange"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      {/* Message */}
      <h1 className="font-display text-3xl font-bold text-midnight sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-stone">
        We hit an unexpected error. You can try again, or head back to the
        homepage and start fresh.
      </p>

      {/* Error digest (dev only) */}
      {error.digest && (
        <p className="mt-4 font-mono text-xs text-stone/60">
          Error ID: {error.digest}
        </p>
      )}

      {/* Actions */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Button onClick={reset}>Try Again</Button>
        <Button asChild variant="outline">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
