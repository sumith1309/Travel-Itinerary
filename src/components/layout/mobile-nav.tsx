'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, MapPin, FileText, Compass, BookOpen, User, LogIn, Tent } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';

const navItems = [
  { href: '/destinations', label: 'Destinations', icon: MapPin },
  { href: '/weekend-getaways', label: 'Getaways', icon: Tent },
  { href: '/visa', label: 'Visa Hub', icon: FileText },
  { href: '/itineraries', label: 'Itineraries', icon: Compass },
  { href: '/blog', label: 'Blog', icon: BookOpen },
];

export function MobileNav() {
  const { data: session } = useSession();
  const { isMobileNavOpen, toggleMobileNav } = useUIStore();

  return (
    <Dialog.Root open={isMobileNavOpen} onOpenChange={toggleMobileNav}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-midnight/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-[300px] bg-surface shadow-elevated p-6 animate-slide-in-right focus:outline-none">
          <div className="flex items-center justify-between mb-8">
            <span className="font-display text-lg font-bold text-forest">Menu</span>
            <Dialog.Close className="h-8 w-8 flex items-center justify-center rounded-lg text-stone hover:text-midnight hover:bg-sand-200 transition-colors">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={toggleMobileNav}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-midnight hover:bg-sand-200/50 transition-colors"
              >
                <item.icon className="h-[18px] w-[18px] text-stone" strokeWidth={1.5} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-sand-300">
            {session ? (
              <Link
                href="/profile"
                onClick={toggleMobileNav}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-midnight hover:bg-sand-200/50 transition-colors"
              >
                <User className="h-[18px] w-[18px] text-stone" strokeWidth={1.5} />
                My Profile
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={toggleMobileNav}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-forest bg-forest-50 hover:bg-forest-100 transition-colors"
              >
                <LogIn className="h-[18px] w-[18px]" strokeWidth={1.5} />
                Sign in
              </Link>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
