'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Compass, BookOpen, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import type { SearchResult, ApiSuccess } from '@/types';

const SEARCH_TABS = [
  { value: 'all', label: 'All' },
  { value: 'destinations', label: 'Destinations' },
  { value: 'experiences', label: 'Experiences' },
  { value: 'blogs', label: 'Blog' },
  { value: 'visa', label: 'Visa' },
] as const;

type SearchType = (typeof SEARCH_TABS)[number]['value'];

const TYPE_CONFIG: Record<
  SearchResult['type'],
  { label: string; icon: typeof MapPin; href: (slug: string, metadata?: Record<string, unknown>) => string; variant: 'default' | 'secondary' | 'outline' | 'info' | 'warning' }
> = {
  country: {
    label: 'Destination',
    icon: MapPin,
    href: (slug) => `/destinations/${slug}`,
    variant: 'default',
  },
  city: {
    label: 'City',
    icon: MapPin,
    href: (slug, metadata) => {
      const countrySlug = metadata?.countrySlug as string | undefined;
      return countrySlug ? `/destinations/${countrySlug}/${slug}` : `/destinations/${slug}`;
    },
    variant: 'default',
  },
  experience: {
    label: 'Experience',
    icon: Compass,
    href: (slug) => `/experiences/${slug}`,
    variant: 'secondary',
  },
  blog: {
    label: 'Blog',
    icon: BookOpen,
    href: (slug) => `/blog/${slug}`,
    variant: 'info',
  },
  visa: {
    label: 'Visa',
    icon: FileText,
    href: (slug) => `/visa/${slug}`,
    variant: 'warning',
  },
};

function ResultSkeleton() {
  return (
    <div className="neu-raised p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

function ResultCard({ result }: { result: SearchResult }) {
  const config = TYPE_CONFIG[result.type];
  const Icon = config.icon;
  const href = config.href(result.slug, result.metadata);

  return (
    <Link href={href} className="block neu-raised p-5 group hover:shadow-card-hover transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant={config.variant} className="gap-1">
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
        {result.type === 'city' && typeof result.metadata?.country === 'string' && (
          <span className="text-xs text-stone">{result.metadata.country}</span>
        )}
      </div>
      <h3 className="font-display text-lg font-semibold text-midnight group-hover:text-forest transition-colors line-clamp-1">
        {result.title}
      </h3>
      {result.description && (
        <p className="mt-1 text-sm text-stone line-clamp-2">{result.description}</p>
      )}
    </Link>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [activeType, setActiveType] = useState<SearchType>(
    (searchParams.get('type') as SearchType) ?? 'all'
  );
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchResults = useCallback(async (q: string, type: SearchType) => {
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({ q: q.trim(), type });
      const res = await fetch(`/api/search?${params.toString()}`);

      if (!res.ok) {
        setResults([]);
        return;
      }

      const json: ApiSuccess<SearchResult[]> = await res.json();
      setResults(json.data ?? []);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults(query, activeType);

      // Update URL without navigation
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (activeType !== 'all') params.set('type', activeType);
      const qs = params.toString();
      router.replace(`/search${qs ? `?${qs}` : ''}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeType, fetchResults, router]);

  // Pre-fill from URL on mount
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q !== query) {
      setQuery(q);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-24 pb-[var(--spacing-section)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Search' }]} className="mb-6" />

        {/* Search input */}
        <ScrollReveal>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone/60 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search destinations, experiences, visa info..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 pl-12 pr-4 text-base rounded-2xl neu-input"
                autoFocus
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Type tabs */}
        <Tabs
          value={activeType}
          onValueChange={(val) => setActiveType(val as SearchType)}
        >
          <div className="flex justify-center mb-8">
            <TabsList>
              {SEARCH_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Results area — shared across all tabs */}
          {SEARCH_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {/* Loading state */}
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ResultSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Empty state — no query entered yet */}
              {!isLoading && !hasSearched && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-sand-200 flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-stone" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-midnight mb-2">
                    Find your next adventure
                  </h3>
                  <p className="text-sm text-stone max-w-md">
                    Try searching for &lsquo;Vietnam&rsquo;, &lsquo;temples&rsquo;, or &lsquo;visa&rsquo;
                  </p>
                </div>
              )}

              {/* Empty state — no results */}
              {!isLoading && hasSearched && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-sand-200 flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-stone" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-midnight mb-2">
                    No results found
                  </h3>
                  <p className="text-sm text-stone max-w-md">
                    We couldn&apos;t find anything for &ldquo;{query}&rdquo;. Try a different search term or browse our destinations.
                  </p>
                </div>
              )}

              {/* Results grid */}
              {!isLoading && results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((result) => (
                    <ScrollReveal key={result.id}>
                      <ResultCard result={result} />
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-24 pb-20 text-center text-stone">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
