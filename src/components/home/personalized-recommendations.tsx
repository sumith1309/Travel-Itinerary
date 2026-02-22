'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { fadeUp, staggerContainer, tapSpring } from '@/lib/animations';
import { formatINR } from '@/lib/utils';

interface Recommendation {
  slug: string;
  name: string;
  tagline: string | null;
  imageUrl: string | null;
  score: number;
  reason: string;
  tags: string[];
  budgetRange?: { min: number; max: number };
}

export function PersonalizedRecommendations() {
  const { data: session } = useSession();
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch('/api/recommendations/personalized?limit=4');
        if (res.ok) {
          const { data } = await res.json();
          setRecs(data ?? []);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [session?.user]);

  // Don't render for unauthenticated users or if no recs
  if (!session?.user || (!loading && recs.length === 0)) {
    return null;
  }

  return (
    <section className="py-[var(--spacing-section)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer(0.1, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-brand-orange" />
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-midnight">
                  Picked for You
                </h2>
              </div>
              <p className="text-stone text-sm">
                Based on your travel style and interests
              </p>
            </div>
            <Link
              href="/destinations"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-forest hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="neu-raised rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-40 bg-sand-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-sand-200 rounded w-2/3" />
                    <div className="h-3 bg-sand-100 rounded w-full" />
                    <div className="h-3 bg-sand-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendation Cards */}
          {!loading && recs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recs.map((rec) => (
                <motion.div key={rec.slug} variants={fadeUp}>
                  <Link href={`/destinations/${rec.slug}`}>
                    <motion.div
                      {...tapSpring}
                      className="neu-raised rounded-2xl overflow-hidden group cursor-pointer hover:shadow-card-hover transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative h-40 bg-sand-100 overflow-hidden">
                        {rec.imageUrl ? (
                          <img
                            src={rec.imageUrl}
                            alt={rec.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <MapPin className="h-8 w-8 text-stone/30" />
                          </div>
                        )}
                        {/* Score badge */}
                        <div className="absolute top-2 right-2 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-mono font-bold text-forest">
                          {Math.round(rec.score * 100)}% match
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-display text-lg font-semibold text-midnight mb-1">
                          {rec.name}
                        </h3>
                        <p className="text-xs text-stone line-clamp-2 mb-2">
                          {rec.reason}
                        </p>
                        {rec.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {rec.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-medium text-forest"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
