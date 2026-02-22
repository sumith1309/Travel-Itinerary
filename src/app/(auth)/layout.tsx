import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left — Hero image (hidden on mobile) */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80"
          alt="Tropical beach destination"
          fill
          priority
          className="object-cover"
        />
        {/* Gradient overlay */}
        <div className="gradient-hero absolute inset-0" />

        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <h2 className="font-display text-4xl font-bold text-white">
            Your next adventure starts here
          </h2>
          <p className="mt-3 max-w-md text-lg text-white/80">
            AI-powered itineraries, visa guides, and destination intelligence
            — crafted for Indian travellers.
          </p>
        </div>
      </div>

      {/* Right — Form area */}
      <div className="flex w-full flex-col bg-sand lg:w-1/2">
        {/* Logo */}
        <div className="px-8 pt-8">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-forest transition-colors hover:text-forest-400"
          >
            Trails &amp; Miles
          </Link>
        </div>

        {/* Centered form card */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="neu-raised w-full max-w-md p-8 sm:p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
