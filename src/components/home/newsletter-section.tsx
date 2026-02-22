'use client';

import { NewsletterSignup } from '@/components/shared/newsletter-signup';

export function NewsletterSection() {
  return (
    <section className="relative py-[var(--spacing-section)] px-4 gradient-brand overflow-hidden">
      <div className="noise" />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold text-white mb-3">
          Get Travel Inspiration in Your Inbox
        </h2>
        <p className="text-white/70 mb-8">
          Join 10,000+ Indian travellers who receive weekly destination guides,
          visa updates, and exclusive travel deals.
        </p>
        <NewsletterSignup variant="dark" />
      </div>
    </section>
  );
}
