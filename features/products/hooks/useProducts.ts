// src/features/products/hooks/useProducts.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  getRelatedProducts,
  getFeaturedProducts,
  getNewArrivals,
  getSaleProducts,
  searchProducts,
  getProductCategories,
  getProductBrands,
} from '@/services/productService';
import type { ProductQueryParams, Product } from '@/types/product';

// ============================================
// PRODUCT LIST HOOKS
// ============================================

/**
 * Hook for fetching products with filters and pagination
 */
export function useProducts(params: ProductQueryParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for infinite scrolling product list
 */
export function useInfiniteProducts(params: Omit<ProductQueryParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => getProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================
// SINGLE PRODUCT HOOKS
// ============================================

/**
 * Hook for fetching a single product by slug
 */
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });
}

/**
 * Hook for fetching a single product by ID
 */
export function useProductById(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

// ============================================
// COLLECTION HOOKS
// ============================================

/**
 * Hook for fetching related products
 */
export function useRelatedProducts(productId: string, limit: number = 4) {
  return useQuery({
    queryKey: ['products', 'related', productId, limit],
    queryFn: () => getRelatedProducts(productId, limit),
    staleTime: 5 * 60 * 1000,
    enabled: !!productId,
  });
}

/**
 * Hook for fetching featured products
 */
export function useFeaturedProducts(limit: number = 8) {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => getFeaturedProducts(limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching new arrivals
 */
export function useNewArrivals(limit: number = 8) {
  return useQuery({
    queryKey: ['products', 'new-arrivals', limit],
    queryFn: () => getNewArrivals(limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching sale products
 */
export function useSaleProducts(limit: number = 8) {
  return useQuery({
    queryKey: ['products', 'sale', limit],
    queryFn: () => getSaleProducts(limit),
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================
// SEARCH HOOKS
// ============================================

/**
 * Hook for searching products
 */
export function useSearchProducts(query: string, limit: number = 10) {
  return useQuery({
    queryKey: ['products', 'search', query, limit],
    queryFn: () => searchProducts(query, limit),
    staleTime: 5 * 60 * 1000,
    enabled: !!query && query.length >= 2,
  });
}

// ============================================
// FILTER HOOKS
// ============================================

/**
 * Hook for fetching all available categories
 */
export function useProductCategories() {
  return useQuery({
    queryKey: ['product', 'categories'],
    queryFn: () => getProductCategories(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching all available brands
 */
export function useProductBrands() {
  return useQuery({
    queryKey: ['product', 'brands'],
    queryFn: () => getProductBrands(),
    staleTime: 5 * 60 * 1000,
  });
}