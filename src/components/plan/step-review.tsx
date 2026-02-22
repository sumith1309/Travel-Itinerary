'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users, Wallet, Heart, Sparkles, Pencil } from 'lucide-react';
import { fadeUp, staggerContainer, tapSpring } from '@/lib/animations';
import {
  TRAVEL_STYLES,
  PACE_OPTIONS,
  COMPANION_OPTIONS,
  INTEREST_TAGS,
  DIETARY_OPTIONS,
  getBudgetTierLabel,
} from '@/lib/constants';
import { formatINR } from '@/lib/utils';

interface StepReviewProps {
  destinationName: string;
  durationDays: number;
  startDate: string | null;
  travelStyle: string;
  pace: string;
  companionType: string;
  budget: number;
  dietaryPreferences: string[];
  interests: string[];
  specialRequests: string;
  onEditStep: (step: number) => void;
}

function ReviewRow({
  icon: Icon,
  label,
  value,
  step,
  onEdit,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  step: number;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-sand-100 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest/10">
        <Icon className="h-4 w-4 text-forest" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-stone mb-0.5">{label}</p>
        <div className="text-sm font-medium text-midnight">{value}</div>
      </div>
      <motion.button
        {...tapSpring}
        onClick={() => onEdit(step)}
        className="shrink-0 p-1.5 rounded-lg text-stone hover:text-forest hover:bg-forest/5 transition-colors"
        aria-label={`Edit ${label}`}
      >
        <Pencil className="h-3.5 w-3.5" />
      </motion.button>
    </div>
  );
}

export function StepReview({
  destinationName,
  durationDays,
  startDate,
  travelStyle,
  pace,
  companionType,
  budget,
  dietaryPreferences,
  interests,
  specialRequests,
  onEditStep,
}: StepReviewProps) {
  const styleName = TRAVEL_STYLES.find((s) => s.value === travelStyle)?.label ?? travelStyle;
  const paceName = PACE_OPTIONS.find((p) => p.value === pace)?.label ?? pace;
  const companionName = COMPANION_OPTIONS.find((c) => c.value === companionType)?.label ?? companionType;
  const interestNames = interests
    .map((i) => INTEREST_TAGS.find((t) => t.value === i))
    .filter(Boolean)
    .map((t) => `${t!.icon} ${t!.label}`);
  const dietaryNames = dietaryPreferences
    .map((d) => DIETARY_OPTIONS.find((o) => o.value === d)?.label)
    .filter(Boolean);

  return (
    <motion.div
      variants={staggerContainer(0.1, 0.08)}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <h2 className="font-display text-2xl font-bold text-midnight mb-2">
          Review your trip
        </h2>
        <p className="text-stone text-sm">
          Everything look good? Hit generate to build your personalised itinerary.
        </p>
      </motion.div>

      {/* Summary Card */}
      <motion.div variants={fadeUp} className="neu-raised rounded-xl p-5">
        {/* Destination Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-sand-100 mb-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest text-white">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-display font-bold text-midnight">{destinationName}</p>
            <p className="text-xs text-stone">
              {durationDays} day{durationDays > 1 ? 's' : ''} · {styleName} · {paceName}
            </p>
          </div>
        </div>

        <ReviewRow
          icon={Calendar}
          label="Dates"
          value={
            startDate
              ? new Date(startDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Flexible dates'
          }
          step={2}
          onEdit={onEditStep}
        />

        <ReviewRow
          icon={Clock}
          label="Duration & Pace"
          value={`${durationDays} day${durationDays > 1 ? 's' : ''} · ${paceName} pace`}
          step={2}
          onEdit={onEditStep}
        />

        <ReviewRow
          icon={Users}
          label="Travelling with"
          value={companionName}
          step={4}
          onEdit={onEditStep}
        />

        <ReviewRow
          icon={Wallet}
          label="Budget"
          value={
            <span>
              {formatINR(budget)}{' '}
              <span className="text-xs text-stone">per person · {getBudgetTierLabel(budget)}</span>
            </span>
          }
          step={4}
          onEdit={onEditStep}
        />

        <ReviewRow
          icon={Heart}
          label="Interests"
          value={
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              {interestNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center rounded-full bg-forest/10 px-2.5 py-0.5 text-xs font-medium text-forest"
                >
                  {name}
                </span>
              ))}
            </div>
          }
          step={5}
          onEdit={onEditStep}
        />

        {dietaryNames.length > 0 && !dietaryNames.includes('No Preference') && (
          <ReviewRow
            icon={Sparkles}
            label="Dietary"
            value={dietaryNames.join(', ')}
            step={4}
            onEdit={onEditStep}
          />
        )}
      </motion.div>

      {/* Special Requests */}
      {specialRequests && (
        <motion.div variants={fadeUp} className="neu-raised rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-brand-orange" />
            <span className="text-sm font-medium text-midnight">Special Requests</span>
          </div>
          <p className="text-sm text-stone italic">&quot;{specialRequests}&quot;</p>
        </motion.div>
      )}

      {/* AI Note */}
      <motion.div
        variants={fadeUp}
        className="flex items-start gap-3 rounded-xl bg-forest/5 border border-forest/10 p-4"
      >
        <Sparkles className="h-5 w-5 text-forest shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-midnight">
            Our AI will craft a personalised day-by-day itinerary
          </p>
          <p className="text-xs text-stone mt-1">
            Including morning/afternoon/evening activities, restaurant picks, insider tips,
            estimated costs in ₹, and photography spots.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
