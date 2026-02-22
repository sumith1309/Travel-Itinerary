'use client';

// ============================================================
// TRAILS AND MILES — Onboarding Confetti Celebration
// Animated confetti dots + success message after profile creation
// Auto-redirects after 3 seconds
// ============================================================

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations';

interface OnboardingConfettiProps {
  redirectUrl?: string;
}

// Generate a fixed set of confetti particle definitions
function generateParticles(count: number) {
  const colors = [
    'bg-forest',
    'bg-forest-300',
    'bg-orange',
    'bg-orange-300',
    'bg-sage',
    'bg-sage-300',
    'bg-sand-400',
    'bg-forest-200',
    'bg-orange-200',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    size: Math.random() * 8 + 4, // 4–12px
    startX: Math.random() * 100, // % horizontal start
    endX: (Math.random() - 0.5) * 200, // px horizontal drift
    delay: Math.random() * 0.8,
    duration: Math.random() * 1.5 + 1.5, // 1.5–3s fall
    rotate: Math.random() * 720 - 360,
  }));
}

export function OnboardingConfetti({ redirectUrl = '/' }: OnboardingConfettiProps) {
  const router = useRouter();
  const particles = useMemo(() => generateParticles(40), []);

  // Auto-redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(redirectUrl);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, redirectUrl]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[400px] overflow-hidden">
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={cn('absolute rounded-full', particle.color)}
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.startX}%`,
              top: -20,
            }}
            initial={{
              opacity: 1,
              y: 0,
              x: 0,
              rotate: 0,
              scale: 0,
            }}
            animate={{
              opacity: [1, 1, 0],
              y: [0, 300, 500],
              x: particle.endX,
              rotate: particle.rotate,
              scale: [0, 1, 0.6],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}
      </div>

      {/* Success icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative z-10 w-20 h-20 rounded-full bg-forest flex items-center justify-center mb-6 shadow-glow-green"
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-10 h-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.svg>
      </motion.div>

      {/* Main message */}
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
        className="relative z-10 font-display text-2xl sm:text-3xl font-bold text-midnight text-center"
      >
        Your travel profile is ready!
      </motion.h2>

      {/* Sub message */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-3 text-base text-stone font-sans text-center max-w-sm"
      >
        We will personalize your experience from here
      </motion.p>

      {/* Redirect countdown indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 mt-8"
      >
        <div className="flex items-center gap-2 text-xs text-stone/60 font-sans">
          <motion.div
            className="w-4 h-4 rounded-full border-2 border-forest/30"
            style={{ borderTopColor: 'var(--color-forest)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          Redirecting...
        </div>
      </motion.div>
    </div>
  );
}
