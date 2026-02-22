'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, X, MapPin, FileText, Compass, BookOpen, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';

interface SearchResult {
  type: string;
  title: string;
  slug: string;
  description?: string;
}

const typeIcons: Record<string, typeof MapPin> = {
  destinations: MapPin,
  experiences: Compass,
  blogs: BookOpen,
  visa: FileText,
};

export function SearchOverlay() {
  const { isSearchOpen, toggleSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`);
      const data = await res.json();
      setResults(data.data?.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Escape') toggleSearch();
  };

  function getResultHref(result: SearchResult): string {
    const typeMap: Record<string, string> = {
      destinations: '/destinations/',
      experiences: '/experiences/',
      blogs: '/blog/',
      visa: '/visa/',
    };
    return (typeMap[result.type] ?? '/') + result.slug;
  }

  return (
    <Dialog.Root open={isSearchOpen} onOpenChange={toggleSearch}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-midnight/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-[15%] z-50 w-full max-w-xl -translate-x-1/2 bg-surface rounded-2xl shadow-elevated border border-sand-200 overflow-hidden focus:outline-none">
          <div className="flex items-center gap-3 px-4 border-b border-sand-200">
            <Search className="h-5 w-5 text-stone shrink-0" strokeWidth={1.5} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Search destinations, visa guides, experiences..."
              className="flex-1 h-14 bg-transparent text-sm text-midnight placeholder:text-stone/50 focus:outline-none"
              autoFocus
            />
            {loading && <Loader2 className="h-4 w-4 text-stone animate-spin" />}
            <Dialog.Close className="h-8 w-8 flex items-center justify-center rounded-lg text-stone hover:text-midnight hover:bg-sand-200 transition-colors">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {results.length > 0 && (
            <div className="max-h-80 overflow-y-auto p-2">
              {results.map((result, i) => {
                const Icon = typeIcons[result.type] ?? MapPin;
                return (
                  <Link
                    key={`${result.type}-${result.slug}`}
                    href={getResultHref(result)}
                    onClick={toggleSearch}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                      i === selectedIndex ? 'bg-forest-50 text-forest' : 'text-midnight hover:bg-sand-100'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-stone" strokeWidth={1.5} />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{result.title}</p>
                      {result.description && (
                        <p className="text-xs text-stone truncate mt-0.5">{result.description}</p>
                      )}
                    </div>
                    <span className="ml-auto text-xs text-stone/60 capitalize">{result.type}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {query.length >= 2 && results.length === 0 && !loading && (
            <div className="p-8 text-center">
              <p className="text-sm text-stone">No results found for &ldquo;{query}&rdquo;</p>
            </div>
          )}

          {query.length < 2 && (
            <div className="p-4 text-center">
              <p className="text-xs text-stone/60">Type at least 2 characters to search</p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
