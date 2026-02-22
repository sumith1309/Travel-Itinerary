import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-6 text-center">
      {/* Large 404 */}
      <h1 className="font-display text-[10rem] font-bold leading-none text-forest/10 sm:text-[14rem]">
        404
      </h1>

      {/* Message */}
      <div className="-mt-8 space-y-3">
        <h2 className="font-display text-3xl font-bold text-midnight sm:text-4xl">
          Page not found
        </h2>
        <p className="mx-auto max-w-md text-stone">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
      </div>

      {/* CTAs */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Button asChild>
          <Link href="/destinations">Explore Destinations</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
