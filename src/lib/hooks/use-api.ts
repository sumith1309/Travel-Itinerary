'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? body.message ?? `API error ${res.status}`);
  }
  return res.json();
}

export function useSearch(query: string, type?: string) {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: () => apiFetch<{ data: unknown[] }>(`/api/search?q=${encodeURIComponent(query)}${type ? `&type=${type}` : ''}`),
    enabled: query.length > 1,
    staleTime: 30_000,
  });
}

export function useRecommendations(limit = 6) {
  return useQuery({
    queryKey: ['recommendations', limit],
    queryFn: () => apiFetch<{ data: unknown[] }>(`/api/recommendations?limit=${limit}`),
    staleTime: 60_000,
  });
}

export function useGenerateItinerary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch<{ data: unknown }>('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, generate: true }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['itineraries'] }),
  });
}
