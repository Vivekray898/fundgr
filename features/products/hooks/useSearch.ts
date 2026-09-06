'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import type { SearchApiResponse } from '@/types/common';

export function useSearch(query: string, options: { endpoint?: string } = {}) {
  const endpoint = options.endpoint ?? '/api/search';
  return useQuery({
    queryKey: ['search', endpoint, query],
    queryFn: () => apiFetch<SearchApiResponse>(endpoint, { params: { q: query } }),
    enabled: true,
  });
}
