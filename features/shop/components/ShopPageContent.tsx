// src/features/shop/components/ShopPageContent.tsx
'use client';

import { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/features/products/hooks/useProducts';
import { HomeProductCard } from '@/features/home/components/HomeProductCard';
import { GroceryProductCard } from '@/features/grocery-shop/components/GroceryProductCard';
import { FeaturedSlider, type FeaturedCardTheme } from '@/features/home/components/FeaturedSlider';
import { MobileFilterDrawer, IconFilter } from './MobileFilterDrawer';
import { PriceRangeSlider } from './PriceRangeSlider';
import { GroceryFeaturedSlider } from '@/features/grocery-shop/components/GroceryFeaturedSlider';
import { GroceryShopFAQ } from '@/features/grocery-shop/components/GroceryShopFAQ';
import { SORT_OPTIONS, PRODUCTS_PER_PAGE } from '@/lib/constants';
import type { FiltersData } from '@/types/common';
import type { Product } from '@/types/product';

/* ── Icons ── */

/* 2-col icon */
function IconCol2() {
  return (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.5 12.5" width="12" height="14">
      <path d="M.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 01.75 0z" fillRule="evenodd" />
      <path d="M4.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 014.75 0z" fillRule="evenodd" />
    </svg>
  );
}

/* 3-col icon */
function IconCol3() {
  return (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.5 12.5" width="14" height="14">
      <path d="M.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 01.75 0z" fillRule="evenodd" />
      <path d="M4.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 014.75 0z" fillRule="evenodd" />
      <path d="M8.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 018.75 0z" fillRule="evenodd" />
    </svg>
  );
}

/* 4-col icon */
function IconCol4() {
  return (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.5 12.5" width="16" height="14">
      <path d="M.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 01.75 0z" fillRule="evenodd" />
      <path d="M4.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 014.75 0z" fillRule="evenodd" />
      <path d="M8.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 018.75 0z" fillRule="evenodd" />
      <path d="M12.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 0112.75 0z" fillRule="evenodd" />
    </svg>
  );
}

/* Sort icon */
function IconSort() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10" width="16" height="10" fill="currentColor">
      <path d="m0 0h16v2h-16zm0 4h12v2h-12zm0 4h8v2h-8z" />
    </svg>
  );
}

function IconChevronDown({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
    </svg>
  );
}

/* ── Shop theme ── */

export interface ShopPageTheme {
  headerBg: string;
  toolbarBg: string;
  sidebarBg: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  accentColor: string;
  inputBg: string;
  tagBg: string;
}

const DEFAULT_THEME: ShopPageTheme = {
  headerBg: 'rgb(247, 248, 252)',
  toolbarBg: 'rgb(247, 248, 252)',
  sidebarBg: 'rgb(247, 248, 252)',
  textColor: '#222',
  mutedColor: '#555',
  borderColor: '#e5e5e5',
  accentColor: '#222',
  inputBg: '#fff',
  tagBg: '#fff',
};

const ShopThemeCtx = createContext<ShopPageTheme>(DEFAULT_THEME);

/* ── Filter Group ── */

function FilterGroup({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const theme = useContext(ShopThemeCtx);
  return (
    <div style={{ borderBottom: `1px solid ${theme.borderColor}`, paddingBottom: '20px', marginBottom: '20px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="filter-group-title"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '17px', fontWeight: 700, color: theme.textColor, padding: '0 0 4px' }}
      >
        {title}
        <span style={{ transition: 'transform 300ms ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-flex' }}>
          <IconChevronDown size={14} />
        </span>
      </button>
      {isOpen && <div style={{ paddingTop: '14px' }}>{children}</div>}
    </div>
  );
}

/* ── Custom Checkbox ── */

function FilterCheckbox({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  const theme = useContext(ShopThemeCtx);
  return (
    <label className="filter-checkbox-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '6px 0', fontSize: '14px', color: theme.mutedColor }}>
      <span
        className="filter-cb"
        style={{
          width: '20px', height: '20px', borderRadius: '3px', flexShrink: 0,
          border: checked ? `2px solid ${theme.accentColor}` : `2px solid ${theme.borderColor}`,
          backgroundColor: checked ? theme.accentColor : theme.inputBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 200ms ease',
        }}
      >
        {checked && (
          <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
            <path d="M1.5 3.5L2.83333 4.75L4.16667 6L9.5 1" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span>{label}</span>
      {count !== undefined && <span style={{ color: theme.borderColor, marginLeft: 'auto', fontSize: '15px' }}>{count}</span>}
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
    </label>
  );
}

/* ── Active Filter Tag ── */

function IconCloseSmall() {
  return (
    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.48627 9.32917L2.82849 3.67098" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.88539 9.38504L8.42932 3.61524" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  const theme = useContext(ShopThemeCtx);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px', color: theme.mutedColor, border: `1px solid ${theme.borderColor}`, borderRadius: '40px', backgroundColor: theme.tagBg, marginBottom: '8px', marginRight: '8px' }}>
      {label}
      <button className="filter-tag-remove" onClick={onRemove} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: theme.mutedColor, padding: 0 }}>
        <IconCloseSmall />
      </button>
    </span>
  );
}

/* ── Filter Sidebar ── */

function FilterSidebar({ filters, selectedFilters, onFilterChange, priceRange, onPriceChange, onRemoveAll }: {
  filters: FiltersData | undefined;
  selectedFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  onRemoveAll: () => void;
}) {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showMoreBrand, setShowMoreBrand] = useState(false);
  const [showMoreColor, setShowMoreColor] = useState(false);
  const [showMoreSize, setShowMoreSize] = useState(false);
  const theme = useContext(ShopThemeCtx);

  // If no filters or filters data is empty, show a message
  if (!filters) {
    return (
      <div style={{ backgroundColor: theme.sidebarBg, borderRadius: '8px', padding: '28px', overflow: 'hidden' }}>
        <h3 className="filter-group-title" style={{ fontSize: '20px', fontWeight: 700, color: theme.textColor, margin: 0 }}>Filter:</h3>
        <p style={{ fontSize: '14px', color: theme.mutedColor, marginTop: '20px' }}>No filter options available.</p>
      </div>
    );
  }

  // Ensure all arrays exist and filter out null values
  const safeCategories = (filters.categories || []).filter(c => c !== null);
  const safeBrands = (filters.brands || []).filter(b => b !== null);
  const safeColors = (filters.colors || []).filter(c => c !== null);
  const safeSizes = (filters.sizes || []).filter(s => s !== null);

  // Calculate total items safely
  const totalItems = safeCategories.reduce((s, c) => s + (c?.count || 0), 0);

  const hasActiveFilters = Object.values(selectedFilters).some(v => v !== '') || 
    priceRange[0] > (filters.priceRange?.min ?? 0) || 
    priceRange[1] < (filters.priceRange?.max ?? 100);

  const activeFilterTags: { label: string; key: string }[] = [];
  if (priceRange[0] > (filters.priceRange?.min ?? 0) || priceRange[1] < (filters.priceRange?.max ?? 100)) {
    activeFilterTags.push({ label: `$${priceRange[0].toFixed(2)} –$${priceRange[1].toFixed(2)}`, key: 'price' });
  }
  if (selectedFilters.availability) activeFilterTags.push({ label: `Availability: ${selectedFilters.availability}`, key: 'availability' });
  if (selectedFilters.brand) activeFilterTags.push({ label: `More filters: ${selectedFilters.brand}`, key: 'brand' });
  if (selectedFilters.color) activeFilterTags.push({ label: `Color: ${selectedFilters.color}`, key: 'color' });
  if (selectedFilters.size) activeFilterTags.push({ label: `Size: ${selectedFilters.size}`, key: 'size' });
  if (selectedFilters.category) activeFilterTags.push({ label: `Category: ${selectedFilters.category}`, key: 'category' });

  return (
    <div style={{ backgroundColor: theme.sidebarBg, borderRadius: '8px', padding: '28px', overflow: 'hidden' }}>
      {/* Header with Remove all */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 className="filter-group-title" style={{ fontSize: '20px', fontWeight: 700, color: theme.textColor, margin: 0 }}>Filter:</h3>
        {hasActiveFilters && (
          <button className="filter-remove-all" onClick={onRemoveAll} style={{ fontSize: '14px', color: '#F15B41', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
            Remove all
          </button>
        )}
      </div>

      {/* Active filter tags */}
      {activeFilterTags.length > 0 && (
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap' }}>
          {activeFilterTags.map((tag) => (
            <FilterTag
              key={tag.key}
              label={tag.label}
              onRemove={() => {
                if (tag.key === 'price') onPriceChange([filters.priceRange?.min ?? 0, filters.priceRange?.max ?? 100]);
                else onFilterChange(tag.key, '');
              }}
            />
          ))}
        </div>
      )}

      <FilterGroup title="Availability">
        <FilterCheckbox label="In stock" count={totalItems} checked={selectedFilters.availability === 'in-stock'} onChange={() => onFilterChange('availability', selectedFilters.availability === 'in-stock' ? '' : 'in-stock')} />
        <FilterCheckbox label="Out of stock" count={0} checked={selectedFilters.availability === 'out-of-stock'} onChange={() => onFilterChange('availability', selectedFilters.availability === 'out-of-stock' ? '' : 'out-of-stock')} />
      </FilterGroup>

      <FilterGroup title="Price">
        <PriceRangeSlider
          min={filters.priceRange?.min ?? 0}
          max={filters.priceRange?.max ?? 100}
          value={priceRange}
          onChange={onPriceChange}
          accentColor={theme.accentColor}
          mutedColor={theme.mutedColor}
          textColor={theme.textColor}
        />
      </FilterGroup>

      <FilterGroup title="More filters">
        {(showMoreFilters ? safeBrands : safeBrands.slice(0, 10)).map((b) => (
          <FilterCheckbox 
            key={`mf-${b?.name || 'unknown'}`} 
            label={b?.name || 'Unknown'} 
            count={b?.count || 0} 
            checked={selectedFilters.brand === b?.name} 
            onChange={() => onFilterChange('brand', selectedFilters.brand === b?.name ? '' : b?.name || '')} 
          />
        ))}
        {safeBrands.length > 10 && (
          <button onClick={() => setShowMoreFilters(!showMoreFilters)} className="filter-show-more" style={{ fontSize: '14px', color: theme.textColor, background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', fontWeight: 500 }}>
            {showMoreFilters ? '- Show less' : '+ Show more'}
          </button>
        )}
      </FilterGroup>

      <FilterGroup title="Brand">
        {(showMoreBrand ? safeBrands : safeBrands.slice(0, 10)).map((b) => (
          <FilterCheckbox 
            key={`br-${b?.name || 'unknown'}`} 
            label={b?.name || 'Unknown'} 
            count={b?.count || 0} 
            checked={selectedFilters.brand === b?.name} 
            onChange={() => onFilterChange('brand', selectedFilters.brand === b?.name ? '' : b?.name || '')} 
          />
        ))}
        {safeBrands.length > 10 && (
          <button onClick={() => setShowMoreBrand(!showMoreBrand)} className="filter-show-more" style={{ fontSize: '14px', color: theme.textColor, background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', fontWeight: 500 }}>
            {showMoreBrand ? '- Show less' : '+ Show more'}
          </button>
        )}
      </FilterGroup>

      <FilterGroup title="Color">
        {(showMoreColor ? safeColors : safeColors.slice(0, 8)).map((c) => (
          <FilterCheckbox 
            key={c?.name || 'unknown'} 
            label={c?.name || 'Unknown'} 
            count={c?.count || 0} 
            checked={selectedFilters.color === c?.name} 
            onChange={() => onFilterChange('color', selectedFilters.color === c?.name ? '' : c?.name || '')} 
          />
        ))}
        {safeColors.length > 8 && (
          <button onClick={() => setShowMoreColor(!showMoreColor)} className="filter-show-more" style={{ fontSize: '14px', color: theme.textColor, background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', fontWeight: 500 }}>
            {showMoreColor ? '- Show less' : '+ Show more'}
          </button>
        )}
      </FilterGroup>

      <FilterGroup title="Size">
        {(showMoreSize ? safeSizes : safeSizes.slice(0, 8)).map((s) => (
          <FilterCheckbox 
            key={s?.name || 'unknown'} 
            label={s?.name || 'Unknown'} 
            count={s?.count || 0} 
            checked={selectedFilters.size === s?.name} 
            onChange={() => onFilterChange('size', selectedFilters.size === s?.name ? '' : s?.name || '')} 
          />
        ))}
        {safeSizes.length > 8 && (
          <button onClick={() => setShowMoreSize(!showMoreSize)} className="filter-show-more" style={{ fontSize: '14px', color: theme.textColor, background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', fontWeight: 500 }}>
            {showMoreSize ? '- Show less' : '+ Show more'}
          </button>
        )}
      </FilterGroup>
    </div>
  );
}

/* ── Pagination ── */

function ShopPagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const theme = useContext(ShopThemeCtx);

  // Build page numbers: 1, 2, 3, ..., totalPages
  const pages: (number | '...')[] = [];
  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3);
    if (currentPage > 4) pages.push('...');
    if (currentPage > 3 && currentPage < totalPages - 2) {
      pages.push(currentPage);
    }
    if (currentPage < totalPages - 3) pages.push('...');
    pages.push(totalPages);
  }

  // Remove duplicates
  const unique: (number | '...')[] = [];
  pages.forEach((p) => {
    if (p === '...' && unique[unique.length - 1] === '...') return;
    if (typeof p === 'number' && unique.includes(p)) return;
    unique.push(p);
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '50px', paddingBottom: '10px' }}>
      {unique.map((p, i) => p === '...' ? (
        <span key={`dots-${i}`} style={{ fontSize: '16px', color: theme.mutedColor, letterSpacing: '2px' }}>...</span>
      ) : (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', border: 'none',
            fontSize: '16px', fontWeight: 500, cursor: 'pointer',
            backgroundColor: p === currentPage ? theme.accentColor : 'transparent',
            color: p === currentPage ? '#fff' : theme.textColor,
            transition: 'all 250ms ease',
          }}
          onMouseEnter={(e) => { if (p !== currentPage) { e.currentTarget.style.backgroundColor = theme.inputBg; } }}
          onMouseLeave={(e) => { if (p !== currentPage) { e.currentTarget.style.backgroundColor = 'transparent'; } }}
        >
          {p}
        </button>
      ))}

      {/* Next arrow */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px', color: theme.textColor }}
          aria-label="Next page"
        >
          ›
        </button>
      )}
    </div>
  );
}

/* ── Skeleton ── */

function ProductSkeleton({ cardVariant = 'home' }: { cardVariant?: 'home' | 'grocery' }) {
  const aspect = cardVariant === 'grocery' ? '1/1' : '3/4';
  return (
    <div>
      <div className="animate-shimmer" style={{ aspectRatio: aspect, borderRadius: cardVariant === 'grocery' ? '10px' : '4px', marginBottom: '14px' }} />
      <div className="animate-shimmer" style={{ height: '16px', width: '70%', margin: '0 auto 8px', borderRadius: '4px' }} />
      <div className="animate-shimmer" style={{ height: '14px', width: '40%', margin: '0 auto 12px', borderRadius: '4px' }} />
      {cardVariant === 'grocery' && (
        <div className="animate-shimmer" style={{ height: '52px', width: '100%', borderRadius: '40px' }} />
      )}
    </div>
  );
}

/* ── Main Component ── */

interface ShopPageContentProps {
  /** Route base for URL sync (e.g. "/shop" or "/grocery/shop"). Default: "/shop". */
  basePath?: string;
  /** Base href for linking to product detail pages (e.g. "/products" or "/grocery/product"). */
  productHrefBase?: string;
  /** Page header title. Default: "PRODUCTS". */
  title?: string;
  /** Home link label. Default: "Home". */
  homeLabel?: string;
  /** Home link href. Default: "/". */
  homeHref?: string;
  /** Breadcrumb label for the current page. Default: "Products". */
  breadcrumbLabel?: string;
  /** Which product card design to render. Default: "home" (fashion). Pass "grocery" for Grocery Shop. */
  cardVariant?: 'home' | 'grocery';
  /** Optional theming overrides forwarded to every HomeProductCard rendered on this page */
  cardTheme?: FeaturedCardTheme;
  /** Per-storefront dark/light theme overrides (bg colors, text colors, accent). */
  shopTheme?: Partial<ShopPageTheme>;
  /** Custom card renderer — when provided, replaces the built-in HomeProductCard / GroceryProductCard. */
  renderCard?: (product: Product, index: number) => React.ReactNode;
}

export function ShopPageContent({
  basePath = '/shop',
  productHrefBase = '/products',
  title = 'PRODUCTS',
  homeLabel = 'Home',
  homeHref = '/',
  breadcrumbLabel = 'Products',
  cardVariant = 'home',
  cardTheme,
  shopTheme,
  renderCard,
}: ShopPageContentProps = {}) {
  const theme: ShopPageTheme = { ...DEFAULT_THEME, ...shopTheme };
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const [savedView, setSavedView] = useState<2 | 3 | 4>(4);
  useEffect(() => {
    const stored = localStorage.getItem('shop-view-cols');
    if (stored === '2' || stored === '3' || stored === '4') setSavedView(Number(stored) as 2 | 3 | 4);
  }, []);
  const viewCols: 2 | 3 | 4 = viewParam === '2' ? 2 : viewParam === '3' ? 3 : viewParam === '4' ? 4 : savedView;
  const [sortOpen, setSortOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const filterTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Track filter changes to trigger loading state
  const prevFiltersRef = useRef('');
  const currentFilterKey = `${searchParams.toString()}`;

  useEffect(() => {
    if (prevFiltersRef.current && prevFiltersRef.current !== currentFilterKey) {
      setFilterLoading(true);
      if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
      filterTimerRef.current = setTimeout(() => setFilterLoading(false), 1500);
    }
    prevFiltersRef.current = currentFilterKey;
    return () => { if (filterTimerRef.current) clearTimeout(filterTimerRef.current); };
  }, [currentFilterKey]);

  const setViewCols = useCallback((cols: 2 | 3 | 4) => {
    localStorage.setItem('shop-view-cols', String(cols));
    setSavedView(cols);
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', String(cols));
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  }, [router, searchParams, basePath]);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'featured';
  const category = searchParams.get('category') || '';
  const collection = searchParams.get('collection') || '';
  const brand = searchParams.get('brand') || '';
  const color = searchParams.get('color') || '';
  const size = searchParams.get('size') || '';
  const availability = searchParams.get('availability') || '';
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : 0;
  const maxPriceParam = searchParams.get('maxPrice');
  const maxPrice = maxPriceParam ? parseInt(maxPriceParam) : undefined;

  const { data, isLoading } = useProducts({
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,
    sort,
    category: category || undefined,
    collection: collection || undefined,
    brand: brand || undefined,
    color: color || undefined,
    size: size || undefined,
    availability: availability || undefined,
    minPrice: minPrice || undefined,
    maxPrice,
  });

  // The slider needs a concrete number to display even when the URL has no
  // maxPrice param — fall back to this storefront's actual fetched max
  const displayMaxPrice = maxPrice ?? data?.filters?.priceRange?.max ?? 0;

  const updateParams = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (!('page' in updates)) params.set('page', '1');
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  }, [router, searchParams, basePath]);

  const handleFilterChange = (key: string, value: string) => updateParams({ [key]: value });
  const handlePriceChange = useCallback((range: [number, number]) => {
    updateParams({ minPrice: String(range[0]), maxPrice: String(range[1]) });
  }, [updateParams]);
  const handlePageChange = (page: number) => {
    updateParams({ page: String(page) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ShopThemeCtx.Provider value={theme}>
      {/* Page Header */}
      <div className="container-main" style={{ paddingTop: '30px' }}>
        <div style={{ backgroundColor: theme.headerBg, borderRadius: '10px', height: '120px', display: 'flex', alignItems: 'center', padding: '0 40px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 700, color: theme.textColor, marginBottom: '6px' }}>{title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
              <Link href={homeHref} style={{ color: theme.mutedColor, textDecoration: 'underline', textUnderlineOffset: '3px' }}>{homeLabel}</Link>
              <span style={{ color: '#bbb' }}>/</span>
              <span style={{ color: theme.textColor }}>{breadcrumbLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main">
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', backgroundColor: theme.toolbarBg, borderRadius: '0', padding: '0 20px', marginBottom: '30px', marginTop: '20px' }}>
          {/* Left: Desktop view toggles — hidden at <=749px */}
          <div className="shop-view-toggles" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {([
              { cols: 2 as const, Icon: IconCol2 },
              { cols: 3 as const, Icon: IconCol3 },
              { cols: 4 as const, Icon: IconCol4 },
            ]).map(({ cols, Icon }) => (
              <button
                key={cols}
                onClick={() => setViewCols(cols)}
                style={{
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid', borderColor: viewCols === cols ? theme.accentColor : theme.borderColor,
                  backgroundColor: viewCols === cols ? theme.accentColor : theme.inputBg,
                  color: viewCols === cols ? '#fff' : theme.mutedColor,
                  cursor: 'pointer', borderRadius: '4px', transition: 'all 200ms ease',
                }}
              >
                <Icon />
              </button>
            ))}
          </div>

          {/* Left: Mobile "Filter and sort" button — shown only at <=749px */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="shop-mobile-filter-btn"
            aria-label="Open filter and sort"
          >
            <IconFilter size={18} />
            <span>Filter and sort</span>
          </button>

          {/* Right: Sort + count (desktop) */}
          <div className="shop-sort-group" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Sort By dropdown — hidden at <=749px via .shop-sort-dropdown */}
            <div className="shop-sort-dropdown" style={{ position: 'relative' }}>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '15px', fontWeight: 600, color: theme.textColor, letterSpacing: '0.5px',
                }}
              >
                <IconSort />
                SORT BY
              </button>

              {sortOpen && (
                <div
                  style={{
                    position: 'absolute', top: 'calc(100% + 28px)', right: 0,
                    minWidth: '260px', backgroundColor: theme.inputBg, border: `1px solid ${theme.borderColor}`,
                    borderRadius: '8px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '10px 0', zIndex: 50,
                    animation: 'slideUp 200ms ease-out',
                  }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <label
                      key={o.value}
                      className="sort-dropdown-item"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 20px',
                        fontSize: '15px', color: theme.textColor, cursor: 'pointer',
                      }}
                      onClick={() => { updateParams({ sort: o.value }); setSortOpen(false); }}
                    >
                      <span style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        border: sort === o.value ? `5px solid ${theme.accentColor}` : `2px solid ${theme.borderColor}`,
                        display: 'inline-block', transition: 'all 200ms ease',
                      }} />
                      {o.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Product count — hidden during loading, spinner shown instead */}
            <span style={{ fontSize: '15px', fontWeight: 500, color: theme.textColor, minWidth: '90px', textAlign: 'right', display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              {filterLoading ? (
                <span className="filter-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
              ) : (
                <span style={{ animation: 'filterFadeIn 400ms ease' }}>
                  {data?.pagination ? `${data.pagination.total} products` : ''}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Main content: Filter + Products */}
        <div className="shop-main-row" style={{ display: 'flex', gap: '40px', paddingBottom: '60px' }}>
          {/* Sidebar — hidden at <=749px (replaced by mobile drawer) */}
          <div className="shop-sidebar" style={{ width: '290px', flexShrink: 0 }}>
            <FilterSidebar
              filters={data?.filters}
              selectedFilters={{ category, brand, color, size, availability }}
              onFilterChange={handleFilterChange}
              priceRange={[minPrice, displayMaxPrice]}
              onPriceChange={handlePriceChange}
              onRemoveAll={() => {
                const params = new URLSearchParams();
                const view = searchParams.get('view');
                if (view) params.set('view', view);
                router.push(`${basePath}?${params.toString()}`, { scroll: false });
              }}
            />
          </div>

          {/* Product Grid */}
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Loading spinner — centered in grid area */}
            {filterLoading && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10,
              }}>
                <div className="filter-spinner" />
              </div>
            )}

            <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${viewCols}, 1fr)`, gap: '24px', opacity: filterLoading ? 0.15 : 1, transition: 'opacity 400ms ease', minHeight: filterLoading ? '400px' : 'auto' }}>
              {isLoading
                ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => <ProductSkeleton key={i} cardVariant={cardVariant} />)
                : data?.products.map((product, i) => (
                    renderCard ? (
                      <div key={product.id} style={{ minWidth: 0 }}>{renderCard(product, i)}</div>
                    ) : cardVariant === 'grocery' ? (
                      <GroceryProductCard key={product.id} product={product} index={i} hrefBase={productHrefBase} />
                    ) : (
                      <HomeProductCard
                        key={product.id}
                        product={product}
                        index={i}
                        hrefBase={productHrefBase}
                        {...cardTheme}
                      />
                    )
                  ))
              }
            </div>

            {!filterLoading && data?.pagination && (
              <ShopPagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* You may also like — same as homepage Featured Collection Slider */}
      <div style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        {cardVariant === 'grocery' ? (
          <GroceryFeaturedSlider />
        ) : (
          <FeaturedSlider
            cardVariant={cardVariant}
            productHrefBase={productHrefBase}
            cardTheme={cardTheme}
          />
        )}
      </div>

      {cardVariant === 'grocery' && <GroceryShopFAQ />}

      {/* Mobile Filter & Sort drawer */}
      <MobileFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={data?.filters}
        selected={{ availability, brand, color, size, category, sort }}
        priceRange={[minPrice, displayMaxPrice]}
        productCount={data?.pagination?.total ?? 0}
        theme={{ accentColor: theme.accentColor, mutedColor: theme.mutedColor, textColor: theme.textColor }}
        onApply={(payload) => {
          const updates: Record<string, string> = {
            availability: payload.availability,
            brand: payload.brand,
            color: payload.color,
            size: payload.size,
            category: payload.category,
            sort: payload.sort === 'featured' ? '' : payload.sort,
            minPrice: payload.minPrice > 0 ? String(payload.minPrice) : '',
            maxPrice: payload.maxPrice < (data?.filters?.priceRange?.max ?? payload.maxPrice) ? String(payload.maxPrice) : '',
          };
          updateParams(updates);
        }}
        onRemoveAll={() => {
          const params = new URLSearchParams();
          const view = searchParams.get('view');
          if (view) params.set('view', view);
          router.push(`${basePath}?${params.toString()}`, { scroll: false });
        }}
      />

      <style>{`
        /* ── Mobile filter toolbar ── */
        .shop-mobile-filter-btn {
          display: none;
        }
        @media (max-width: 749px) {
          .shop-view-toggles { display: none !important; }
          .shop-sort-dropdown { display: none !important; }
          .shop-mobile-filter-btn {
            display: inline-flex;
            align-items: center;
            gap: clamp(5px, 1.6vw, 8px);
            padding: clamp(7px, 2.2vw, 10px) clamp(12px, 4vw, 18px);
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-size: clamp(12px, 3.5vw, 15px);
            font-weight: 500;
            color: #222;
            cursor: pointer;
            white-space: nowrap;
            transition: background-color 180ms ease, border-color 180ms ease;
          }
          .shop-mobile-filter-btn svg {
            width: clamp(14px, 4.2vw, 18px);
            height: auto;
          }
          .shop-mobile-filter-btn:hover {
            background-color: #f4f4f4;
            border-color: #c9c9c9;
          }
          .shop-sidebar { display: none !important; }
          .shop-main-row { gap: 0 !important; }
        }

        /* Responsive product grid overrides */
        @media (max-width: 991px) {
          .shop-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 18px !important;
          }
        }
        @media (max-width: 749px) {
          .shop-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }

        .sort-dropdown-item:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .filter-group-title:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .filter-checkbox-row:hover .filter-cb {
          border-color: #222 !important;
        }
        .filter-show-more:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .filter-remove-all:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .filter-tag-remove:hover {
          text-decoration: underline;
        }
        .filter-spinner {
          width: 24px;
          height: 24px;
          border: 2.5px solid #e0e0e0;
          border-top-color: #222;
          border-radius: 50%;
          animation: filterSpin 0.6s linear infinite;
        }
        @keyframes filterSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes filterFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </ShopThemeCtx.Provider>
  );
}