import type { Variants, Transition } from 'framer-motion';

// ── TRANSITION CONFIGS ──────────────────────────────────────

export const smoothSpring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};

export const smoothEase: Transition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1],
};

// ── ANIMATION VARIANTS ──────────────────────────────────────

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

// ── STAGGER CONTAINERS ──────────────────────────────────────

export function staggerContainer(delayChildren = 0.1, staggerChildren = 0.1): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren,
        staggerChildren,
      },
    },
  };
}

// ── INTERACTION ANIMATIONS ──────────────────────────────────

export const tapSpring = {
  whileTap: { scale: 0.97 },
  transition: smoothSpring,
};

export const magneticHover = {
  whileHover: { y: -4, transition: gentleSpring },
};

export const cardHover = {
  whileHover: { y: -4, boxShadow: '12px 12px 24px rgba(0,0,0,0.1), -12px -12px 24px rgba(255,255,255,0.95)' },
  transition: smoothEase,
};
