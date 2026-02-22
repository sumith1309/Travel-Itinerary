import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, MapPin, Compass, Wallet, Users, UtensilsCrossed, History, Settings } from 'lucide-react';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { cn, formatINR, getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'View and manage your travel profile, preferences, and trip history on Trails and Miles.',
};

function formatEnumLabel(value: string): string {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      passportNationality: true,
      createdAt: true,
      travelProfile: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  const travelProfile = user.travelProfile;
  const initials = getInitials(user.name ?? user.email ?? 'U');
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="pt-24 pb-[var(--spacing-section)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Profile' }]} className="mb-6" />

        {/* Profile header card */}
        <ScrollReveal>
          <div className="neu-raised p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="h-20 w-20 rounded-full bg-forest flex items-center justify-center shrink-0">
                <span className="font-display text-2xl font-semibold text-white">
                  {initials}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-midnight">
                  {user.name ?? 'Traveller'}
                </h1>
                <p className="text-stone mt-1">{user.email}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    {user.passportNationality === 'IN' ? 'India' : user.passportNationality}
                  </Badge>
                  <span className="text-xs text-stone">Member since {memberSince}</span>
                </div>
              </div>

              {/* Edit button */}
              <Button variant="outline" size="sm" asChild className="shrink-0">
                <Link href="#">
                  <Settings className="h-4 w-4 mr-1.5" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Travel Preferences */}
        <ScrollReveal delay={0.1}>
          <div className="neu-raised p-6 sm:p-8 mb-8">
            <SectionHeader
              title="Travel Preferences"
              subtitle="Your default travel style and preferences"
              className="mb-6"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Travel Style */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-midnight">
                  <Compass className="h-4 w-4 text-forest" />
                  Travel Style
                </div>
                <div>
                  {travelProfile?.defaultTravelStyle ? (
                    <Badge>{formatEnumLabel(travelProfile.defaultTravelStyle)}</Badge>
                  ) : (
                    <span className="text-sm text-stone/60">Not set</span>
                  )}
                </div>
              </div>

              {/* Pace */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-midnight">
                  <MapPin className="h-4 w-4 text-forest" />
                  Pace
                </div>
                <div>
                  {travelProfile?.defaultPace ? (
                    <Badge>{formatEnumLabel(travelProfile.defaultPace)}</Badge>
                  ) : (
                    <span className="text-sm text-stone/60">Not set</span>
                  )}
                </div>
              </div>

              {/* Budget Range */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-midnight">
                  <Wallet className="h-4 w-4 text-forest" />
                  Budget Range
                </div>
                <div>
                  {travelProfile ? (
                    <Badge variant="outline">
                      {formatINR(travelProfile.budgetMinINR)} &ndash; {formatINR(travelProfile.budgetMaxINR)}
                    </Badge>
                  ) : (
                    <span className="text-sm text-stone/60">Not set</span>
                  )}
                </div>
              </div>

              {/* Companion Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-midnight">
                  <Users className="h-4 w-4 text-forest" />
                  Companion Type
                </div>
                <div>
                  {travelProfile?.companionType ? (
                    <Badge>{formatEnumLabel(travelProfile.companionType)}</Badge>
                  ) : (
                    <span className="text-sm text-stone/60">Not set</span>
                  )}
                </div>
              </div>

              {/* Dietary Preferences */}
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center gap-2 text-sm font-medium text-midnight">
                  <UtensilsCrossed className="h-4 w-4 text-forest" />
                  Dietary Preferences
                </div>
                <div className="flex flex-wrap gap-2">
                  {travelProfile?.dietaryPreferences && travelProfile.dietaryPreferences.length > 0 ? (
                    travelProfile.dietaryPreferences.map((pref) => (
                      <Badge key={pref} variant="secondary">
                        {formatEnumLabel(pref)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-stone/60">No preferences set</span>
                  )}
                </div>
              </div>

              {/* Interests */}
              {travelProfile?.preferredInterests && travelProfile.preferredInterests.length > 0 && (
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-midnight">
                    <Compass className="h-4 w-4 text-forest" />
                    Interests
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {travelProfile.preferredInterests.map((interest) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Travel History */}
        <ScrollReveal delay={0.2}>
          <div className="neu-raised p-6 sm:p-8">
            <SectionHeader
              title="Travel History"
              subtitle="Your past trips and adventures"
              className="mb-6"
            />

            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-2xl bg-sand-200 flex items-center justify-center mb-4">
                <History className="h-8 w-8 text-stone" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-midnight mb-2">
                No trips yet
              </h3>
              <p className="text-sm text-stone max-w-md mb-6">
                Start planning your first adventure and your travel history will appear here.
              </p>
              <Button asChild>
                <Link href="/destinations">Explore Destinations</Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
