'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ShareModal } from './share-modal';
import { PDFExport } from './pdf-export';
import { RegenerateButton } from './regenerate-button';
import { tapSpring } from '@/lib/animations';

interface PDFDay {
  dayNumber: number;
  title: string | null;
  dailyBudgetINR: number | string | null;
  items: {
    timeSlot: string;
    startTime: string | null;
    endTime: string | null;
    title: string;
    description: string | null;
    estimatedCostINR: number | string | null;
    transportMode: string | null;
  }[];
}

interface ItineraryActionsProps {
  itineraryId: string;
  shareToken: string | null;
  title: string;
  description: string | null;
  durationDays: number;
  travelStyle: string | null;
  totalBudget: number;
  days: PDFDay[];
  isOwner: boolean;
}

export function ItineraryActions({
  itineraryId,
  shareToken,
  title,
  description,
  durationDays,
  travelStyle,
  totalBudget,
  days,
  isOwner,
}: ItineraryActionsProps) {
  const [showShare, setShowShare] = useState(false);
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/itineraries/${shareToken ?? itineraryId}`
    : '';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Share Button */}
      <motion.button
        {...tapSpring}
        onClick={() => setShowShare(true)}
        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-midnight neu-raised hover:shadow-card-hover transition-shadow"
      >
        <Share2 className="h-4 w-4" />
        Share
      </motion.button>

      {/* PDF Export */}
      <PDFExport
        title={title}
        description={description}
        durationDays={durationDays}
        travelStyle={travelStyle}
        totalBudget={totalBudget}
        days={days}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        shareUrl={shareUrl}
        title={title}
      />
    </div>
  );
}

interface DayRegenerateProps {
  dayNumber: number;
  itineraryId: string;
}

export function DayRegenerate({ dayNumber, itineraryId }: DayRegenerateProps) {
  return (
    <RegenerateButton
      dayNumber={dayNumber}
      itineraryId={itineraryId}
      onRegenerated={() => window.location.reload()}
    />
  );
}
