'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, AlertCircle, Sparkles, Globe, Check, X } from 'lucide-react';
import { fadeUp, staggerContainer, tapSpring } from '@/lib/animations';
import { cn } from '@/lib/utils';

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

interface PopularDestination {
  slug: string;
  name: string;
  region: string;
  regionSlug: string;
  budgetTier: string | null;
  tags: string[];
  heroImageUrl: string | null;
  score: number;
  isInSeason: boolean;
}

export function StepDestination({ selectedSlugs, selectedName, onSelect }: StepDestinationProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [popularDestinations, setPopularDestinations] = useState<PopularDestination[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDestination, setCustomDestination] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    async function fetchPopular() {
      try {
        const res = await fetch('/api/destinations/popular?limit=8');
        if (res.ok) {
          const { data } = await res.json();
          setPopularDestinations(data ?? []);
        }
      } catch {
        // Silent fail
      } finally {
        setIsLoadingPopular(false);
      }
    }
    fetchPopular();
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setHasSearched(false);
      setShowCustomInput(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setHasSearched(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=destinations`);
        if (res.ok) {
          const { data } = await res.json();
          setResults(data ?? []);
          setShowCustomInput((data ?? []).length === 0);
        }
      } catch {
        // Silent fail
        setShowCustomInput(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleCustomDestination = async () => {
    if (!customDestination.trim()) return;
    
    setIsValidating(true);
    try {
      const res = await fetch('/api/destinations/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: customDestination.trim() }),
      });
      
      if (res.ok) {
        const { data } = await res.json();
        onSelect([data.slug], data.name);
        setQuery('');
        setResults([]);
        setShowCustomInput(false);
        setCustomDestination('');
      } else {
        onSelect([customDestination.trim().toLowerCase().replace(/\s+/g, '-')], customDestination.trim());
        setQuery('');
        setResults([]);
        setShowCustomInput(false);
        setCustomDestination('');
      }
    } catch {
      onSelect([customDestination.trim().toLowerCase().replace(/\s+/g, '-')], customDestination.trim());
      setQuery('');
      setResults([]);
      setShowCustomInput(false);
      setCustomDestination('');
    } finally {
      setIsValidating(false);
    }
  };

  const getRegionEmoji = (regionSlug: string) => {
    switch (regionSlug) {
      case 'domestic-india':
        return '🇮🇳';
      case 'east-southeast-asia':
        return '🌏';
      case 'south-asia':
        return '🏝️';
      case 'europe':
        return '🇪🇺';
      case 'middle-east':
        return '🕌';
      case 'americas':
        return '🌎';
      case 'africa':
        return '🌍';
      default:
        return '🌍';
    }
  };

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
          Search any destination worldwide or pick from popular choices below
        </p>
      </motion.div>

      {/* Search */}
      <motion.div variants={fadeUp} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any destination... (Paris, Tokyo, Bali, Noida, etc.)"
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

        {/* No Results - Custom Destination Input */}
        {hasSearched && !isSearching && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 z-10 mt-1 rounded-xl border border-forest/30 bg-forest/5 shadow-elevated p-4"
          >
            <div className="flex items-start gap-3 mb-3">
              <Globe className="h-5 w-5 text-forest shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-midnight mb-1">
                  Can&apos;t find &quot;{query}&quot; in our database?
                </p>
                <p className="text-xs text-stone">
                  No problem! Enter any destination and our AI will create a personalized itinerary for you.
                </p>
              </div>
            </div>
            
            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-forest text-white py-2.5 text-sm font-medium hover:bg-forest/90 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Plan trip to {query}
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={customDestination}
                  onChange={(e) => setCustomDestination(e.target.value)}
                  placeholder={query}
                  className="w-full rounded-lg border border-sand-200 bg-white py-2.5 px-3 text-sm text-midnight placeholder:text-stone/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomDestination('');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-sand-200 text-stone py-2 text-sm hover:bg-sand-50 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomDestination}
                    disabled={!customDestination.trim() || isValidating}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-forest text-white py-2 text-sm font-medium hover:bg-forest/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isValidating ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Confirm
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
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
          <p className="text-sm font-medium text-midnight mb-3">
            {isLoadingPopular ? 'Loading destinations...' : 'Popular destinations'}
          </p>
          
          {isLoadingPopular ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="neu-raised rounded-xl p-4 animate-pulse bg-sand-100"
                >
                  <div className="h-6 w-6 rounded bg-sand-200 mb-2" />
                  <div className="h-4 w-20 rounded bg-sand-200" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {popularDestinations.map((dest) => (
                <motion.button
                  key={dest.slug}
                  {...tapSpring}
                  onClick={() => onSelect([dest.slug], dest.name)}
                  className={cn(
                    'neu-raised rounded-xl p-4 text-left hover:shadow-card-hover transition-all group relative overflow-hidden',
                    selectedSlugs.includes(dest.slug) && 'ring-2 ring-forest'
                  )}
                >
                  <div className="relative z-10">
                    <span className="text-2xl mb-2 block">
                      {getRegionEmoji(dest.regionSlug)}
                    </span>
                    <span className="text-sm font-medium text-midnight block">{dest.name}</span>
                    <span className="text-xs text-stone">{dest.region}</span>
                    {dest.isInSeason && (
                      <span className="absolute top-2 right-2 text-xs bg-forest/10 text-forest px-1.5 py-0.5 rounded-full">
                        Peak
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Global tip */}
          <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-forest/5 border border-forest/10">
            <Globe className="h-4 w-4 text-forest shrink-0 mt-0.5" />
            <p className="text-xs text-stone">
              <span className="font-medium text-midnight">Any destination works!</span> Can&apos;t find what you&apos;re looking for? Just type the name and our AI will create a personalized itinerary — whether it&apos;s Paris, Tokyo, Machu Picchu, or your hometown!
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
