'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Search, Menu, Sun, Moon, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';
import { Logo } from './logo';

const navLinks = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/weekend-getaways', label: 'Getaways' },
  { href: '/visa', label: 'Visa Hub' },
  { href: '/itineraries', label: 'Itineraries' },
  { href: '/blog', label: 'Blog' },
];

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { toggleSearch, toggleMobileNav } = useUIStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-midnight/70 hover:text-forest transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSearch}
              className="flex items-center gap-2 h-9 px-3 rounded-xl text-sm text-stone hover:text-midnight hover:bg-sand-200/50 transition-colors"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              <span className="hidden sm:inline text-xs text-stone/60">
                <kbd className="font-mono">⌘K</kbd>
              </span>
            </button>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9 flex items-center justify-center rounded-xl text-stone hover:text-midnight hover:bg-sand-200/50 transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" strokeWidth={1.5} />
              <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" strokeWidth={1.5} />
            </button>

            {session ? (
              <Link
                href="/profile"
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-forest-100 text-forest hover:bg-forest-200 transition-colors"
              >
                <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex h-9 px-4 items-center rounded-xl text-sm font-medium bg-forest text-white hover:bg-forest-600 transition-colors"
              >
                Sign in
              </Link>
            )}

            <button
              onClick={toggleMobileNav}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl text-stone hover:text-midnight hover:bg-sand-200/50 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
