'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { fadeUp, staggerContainer, tapSpring } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { getDestinationImage } from '@/lib/unsplash';
import { ImageWithFallback } from '@/components/shared/image-with-fallback';

interface StepDestinationProps {
  selectedSlugs: string[];
  selectedName: string;
  onSelect: (slugs: string[], name: string) => void;
}

interface SearchResult {
  type: string;
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

const POPULAR = [
  { slug: 'vietnam', name: 'Vietnam', emoji: '🇻🇳' },
  { slug: 'thailand', name: 'Thailand', emoji: '🇹🇭' },
  { slug: 'indonesia', name: 'Indonesia', emoji: '🇮🇩' },
  { slug: 'singapore', name: 'Singapore', emoji: '🇸🇬' },
  { slug: 'maldives', name: 'Maldives', emoji: '🇲🇻' },
];

export function StepDestination({ selectedSlugs, selectedName, onSelect }: StepDestinationProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=destinations`);
        if (res.ok) {
          const { data } = await res.json();
          setResults(data ?? []);
        }
      } catch {
        // Silent fail
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <motion.div
      variants={staggerContainer(0.1, 0.08)}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <h2 className="font-display text-2xl font-bold text-midnight mb-2">
          Where do you want to go?
        </h2>
        <p className="text-stone text-sm">
          Search for a destination or pick from popular choices below
        </p>
      </motion.div>

      {/* Search */}
      <motion.div variants={fadeUp} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations..."
          className="w-full rounded-xl border border-sand-200 bg-sand-50 py-3 pl-11 pr-4 text-sm text-midnight placeholder:text-stone/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20"
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-forest border-t-transparent" />
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-xl border border-sand-200 bg-white shadow-elevated max-h-60 overflow-y-auto">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  onSelect([r.slug], r.title);
                  setQuery('');
                  setResults([]);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-sand-50 transition-colors"
              >
                <MapPin className="h-4 w-4 shrink-0 text-forest" />
                <div>
                  <p className="text-sm font-medium text-midnight">{r.title}</p>
                  {r.description && (
                    <p className="text-xs text-stone truncate">{r.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Selected */}
      {selectedSlugs.length > 0 && (
        <motion.div variants={fadeUp} className="neu-pressed rounded-xl p-4 border border-forest/20">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-forest" />
            <span className="font-semibold text-forest">{selectedName}</span>
            <button
              onClick={() => onSelect([], '')}
              className="ml-auto text-xs text-stone hover:text-red-500 transition-colors"
            >
              Change
            </button>
          </div>
        </motion.div>
      )}

      {/* Popular Destinations */}
      {selectedSlugs.length === 0 && (
        <motion.div variants={fadeUp}>
          <p className="text-sm font-medium text-midnight mb-3">Popular destinations</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {POPULAR.map((dest) => (
              <motion.button
                key={dest.slug}
                {...tapSpring}
                onClick={() => onSelect([dest.slug], dest.name)}
                className={cn(
                  'neu-raised rounded-xl p-4 text-left hover:shadow-card-hover transition-shadow',
                  selectedSlugs.includes(dest.slug) && 'ring-2 ring-forest'
                )}
              >
                <span className="text-2xl mb-2 block">{dest.emoji}</span>
                <span className="text-sm font-medium text-midnight">{dest.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
