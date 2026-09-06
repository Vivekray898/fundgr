// src/features/products/hooks/useProduct.ts
import { useQuery } from '@tanstack/react-query';
import { getProductBySlug } from '@/services/productService';

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });
}