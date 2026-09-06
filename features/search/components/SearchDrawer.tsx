'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { useSearch } from '@/features/products/hooks/useSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { formatPrice } from '@/utils/formatPrice';
import { POPULAR_SEARCHES, GROCERY_POPULAR_SEARCHES, PET_FOOD_POPULAR_SEARCHES, MEGASTORE_POPULAR_SEARCHES, PIZZA_POPULAR_SEARCHES, PLANT_GARDEN_POPULAR_SEARCHES, SKIN_CARE_POPULAR_SEARCHES, JEWELLERY_POPULAR_SEARCHES, PHONE_CASE_POPULAR_SEARCHES, SMART_WATCHES_POPULAR_SEARCHES, FOOTWEAR_POPULAR_SEARCHES } from '@/lib/constants';
import { getStorefrontFromPath, productHrefBaseFor, shopHrefFor } from '@/utils/storefront';

/* ── Icons ── */

function IconSearch({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" />
    </svg>
  );
}

function IconClose({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
    </svg>
  );
}

/* ── Suggestion pages data ── */

const fashionSuggestionPages = [
  { label: 'About us', href: '/pages/about' },
  { label: 'Ultimate Guide to Styling Jewelry Like a Fashion Expert', href: '/pages/faq' },
];

const grocerySuggestionPages = [
  { label: 'About us', href: '/grocery/about' },
  { label: 'Store Location', href: '/grocery/store-location' },
];

const petFoodSuggestionPages = [
  { label: 'About us', href: '/pet-food/about' },
  { label: 'Store Location', href: '/pet-food/store-location' },
];

const megastoreSuggestionPages = [
  { label: 'About us', href: '/megastore/about' },
  { label: 'Store Location', href: '/megastore/store-location' },
];

const carAccessoriesSuggestionPages = [
  { label: 'About us', href: '/car-accessories/about' },
  { label: 'Store Location', href: '/car-accessories/store-location' },
];

const pizzaSuggestionPages = [
  { label: 'About us', href: '/pizza/about' },
  { label: 'Store Location', href: '/pizza/store-location' },
];

const plantGardenSuggestionPages = [
  { label: 'About us', href: '/plant-garden/about' },
  { label: 'Store Location', href: '/plant-garden/store-location' },
];

const skinCareSuggestionPages = [
  { label: 'About us', href: '/skin-care/about' },
  { label: 'Store Location', href: '/skin-care/store-location' },
];

const jewellerySuggestionPages = [
  { label: 'About us', href: '/pages/about' },
  { label: 'Store Location', href: '/pages/store-location' },
];

const boutiqueSuggestionPages = [
  { label: 'About us', href: '/boutique-fashion/about' },
  { label: 'Store Location', href: '/boutique-fashion/store-location' },
];

const phoneCaseSuggestionPages = [
  { label: 'About us', href: '/phone-case/about' },
  { label: 'Store Location', href: '/phone-case/store-location' },
];

const smartWatchesSuggestionPages = [
  { label: 'About us', href: '/smart-watches/about' },
  { label: 'Store Location', href: '/smart-watches/store-location' },
];

const footwearSuggestionPages = [
  { label: 'About us', href: '/footwear/about' },
  { label: 'Store Location', href: '/pages/store-location' },
];

/* ── Component ── */

export function SearchDrawer() {
  const { searchOpen, closeSearch } = useUIStore();
  const pathname = usePathname();
  const storefront = getStorefrontFromPath(pathname);
  const searchEndpoint =
    storefront === 'grocery' ? '/api/grocery-search' :
    storefront === 'pet-food' ? '/api/pet-food-search' :
    storefront === 'nutrition' ? '/api/nutrition-search' :
    storefront === 'megastore' ? '/api/megastore-search' :
    storefront === 'car-accessories' ? '/api/car-accessories-search' :
    storefront === 'pizza' ? '/api/pizza-search' :
    storefront === 'plant-garden' ? '/api/plant-garden-search' :
    storefront === 'skin-care' ? '/api/skin-care-search' :
    storefront === 'jewellery' ? '/api/jewellery-search' :
    storefront === 'headphones' ? '/api/headphones-search' :
    storefront === 'sneaker' ? '/api/sneaker-search' :
    storefront === 'boutique-fashion' ? '/api/boutique-fashion-search' :
    storefront === 'elegant-fashion' ? '/api/elegant-fashion-search' :
    storefront === 'lipstain' ? '/api/lipstain-search' :
    storefront === 'phone-case' ? '/api/phone-case-search' :
    storefront === 'smart-watches' ? '/api/smart-watches-search' :
    storefront === 'footwear' ? '/api/footwear-search' :
    storefront === 'fashion-04' ? '/api/fashion-04-search' :
    storefront === 'fashion-03' ? '/api/fashion-03-search' :
    storefront === 'active-wear' ? '/api/active-wear-search' :
    storefront === 'backpack' ? '/api/backpack-search' :
    storefront === 'basketball' ? '/api/basketball-search' :
    storefront === 'glasses' ? '/api/glasses-search' :
    storefront === 'plumbing-supplies' ? '/api/plumbing-supplies-search' :
    storefront === 'book' ? '/api/book-search' :
    storefront === 'jewelry-2' ? '/api/jewelry-2-search' :
    storefront === 'coffee' ? '/api/coffee-search' :
    storefront === 'craft-and-decore' ? '/api/craft-and-decore-search' :
    storefront === 'toys' ? '/api/toys-search' :
    storefront === 'socks' ? '/api/socks-search' :
    storefront === 'pod' ? '/api/pod-search' :
    '/api/search';
  const productHrefBase = productHrefBaseFor(storefront);
  const shopHref = shopHrefFor(storefront);
  const popularTerms =
    storefront === 'grocery' ? GROCERY_POPULAR_SEARCHES :
    storefront === 'pet-food' ? PET_FOOD_POPULAR_SEARCHES :
    storefront === 'megastore' ? MEGASTORE_POPULAR_SEARCHES :
    storefront === 'pizza' ? PIZZA_POPULAR_SEARCHES :
    storefront === 'plant-garden' ? PLANT_GARDEN_POPULAR_SEARCHES :
    storefront === 'skin-care' ? SKIN_CARE_POPULAR_SEARCHES :
    storefront === 'jewellery' ? JEWELLERY_POPULAR_SEARCHES :
    storefront === 'phone-case' ? PHONE_CASE_POPULAR_SEARCHES :
    storefront === 'smart-watches' ? SMART_WATCHES_POPULAR_SEARCHES :
    storefront === 'footwear' ? FOOTWEAR_POPULAR_SEARCHES :
    POPULAR_SEARCHES;
  const suggestionPages =
    storefront === 'grocery' ? grocerySuggestionPages :
    storefront === 'pet-food' ? petFoodSuggestionPages :
    storefront === 'megastore' ? megastoreSuggestionPages :
    storefront === 'car-accessories' ? carAccessoriesSuggestionPages :
    storefront === 'pizza' ? pizzaSuggestionPages :
    storefront === 'plant-garden' ? plantGardenSuggestionPages :
    storefront === 'skin-care' ? skinCareSuggestionPages :
    storefront === 'jewellery' ? jewellerySuggestionPages :
    storefront === 'boutique-fashion' ? boutiqueSuggestionPages :
    storefront === 'phone-case' ? phoneCaseSuggestionPages :
    storefront === 'smart-watches' ? smartWatchesSuggestionPages :
    storefront === 'footwear' ? footwearSuggestionPages :
    fashionSuggestionPages;
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data } = useSearch(debouncedQuery, { endpoint: searchEndpoint });

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSearch(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [searchOpen, closeSearch]);

  const hasQuery = query.trim().length > 0;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeSearch}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 9999,
          transition: 'opacity 250ms ease',
          opacity: searchOpen ? 1 : 0,
          pointerEvents: searchOpen ? 'auto' : 'none',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '420px',
          maxWidth: '100vw',
          backgroundColor: '#fff',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 350ms ease',
          transform: searchOpen ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: searchOpen ? '-4px 0 24px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        {/* ── Search input row ── */}
        <div style={{ padding: '24px 24px 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              paddingBottom: '14px',
              borderBottom: '1.5px solid #222',
            }}
          >
            <IconSearch size={24} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for..."
              autoFocus={searchOpen}
              style={{
                flex: 1,
                fontSize: '18px',
                color: '#222',
                border: 'none',
                outline: 'none',
                background: 'none',
              }}
            />
            {hasQuery && (
              <button
                onClick={() => setQuery('')}
                style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: '#e0e0e0', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', color: '#666', lineHeight: 1,
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
            <button
              onClick={closeSearch}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', cursor: 'pointer', color: '#222',
              }}
              aria-label="Close search"
            >
              <IconClose size={24} />
            </button>
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>

          {/* ═══ DEFAULT STATE ═══ */}
          {!hasQuery && (
            <>
              {/* Popular searches */}
              <div style={{ paddingTop: '24px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '20px', fontWeight: 700, color: '#222', marginBottom: '14px' }}>
                  Popular searches:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {popularTerms.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      style={{
                        fontSize: '16px', color: '#555', background: 'none',
                        border: 'none', cursor: 'pointer', padding: 0,
                        transition: 'color 200ms ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#F15B41'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#555'; }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Most searched products */}
              <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#222', marginBottom: '16px' }}>
                Most searched products:
              </h4>

              <div>
                {data?.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`${productHrefBase}/${product.slug}`}
                    onClick={closeSearch}
                    className="search-product-item"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '14px 0', borderBottom: '1px solid #f0f0f0',
                      textDecoration: 'none', color: 'inherit',
                    }}
                  >
                    <div style={{ width: '60px', height: '70px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f5f5f5', flexShrink: 0, position: 'relative' }}>
                      <Image src={product.images[0]?.src || ''} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="60px" />
                    </div>
                    <div>
                      <p style={{ fontSize: '16px', fontWeight: 600, color: '#222', marginBottom: '5px' }}>
                        {product.name}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {product.compareAtPrice && (
                          <span style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through' }}>
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#222' }}>
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* ═══ SEARCH STATE ═══ */}
          {hasQuery && (
            <>
              {/* Suggestions */}
              {data?.suggestions && data.suggestions.length > 0 && (
                <div style={{ paddingTop: '20px', marginBottom: '8px' }}>
                  <div style={{ paddingBottom: '10px', borderBottom: '1px solid #e5e5e5', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#888', letterSpacing: '2px', textTransform: 'uppercase' }}>
                      SUGGESTIONS
                    </span>
                  </div>
                  {data.suggestions.slice(0, 3).map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        fontSize: '16px', color: '#222', padding: '10px 0',
                        background: 'none', border: 'none', cursor: 'pointer',
                        transition: 'color 200ms ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#F15B41'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#222'; }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Pages */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ paddingBottom: '10px', borderBottom: '1px solid #e5e5e5', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#888', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    PAGES
                  </span>
                </div>
                {suggestionPages.map((page) => (
                  <Link
                    key={page.label}
                    href={page.href}
                    onClick={closeSearch}
                    style={{
                      display: 'block', fontSize: '15px', color: '#222',
                      padding: '8px 0', textDecoration: 'none',
                      transition: 'color 200ms ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#F15B41'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#222'; }}
                  >
                    {page.label}
                  </Link>
                ))}
              </div>

              {/* Products */}
              <div style={{ paddingBottom: '10px', borderBottom: '1px solid #e5e5e5', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#888', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  PRODUCTS
                </span>
              </div>

              <div>
                {data?.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`${productHrefBase}/${product.slug}`}
                    onClick={closeSearch}
                    className="search-product-item"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '14px 0', borderBottom: '1px solid #f0f0f0',
                      textDecoration: 'none', color: 'inherit',
                    }}
                  >
                    <div style={{ width: '60px', height: '70px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f5f5f5', flexShrink: 0, position: 'relative' }}>
                      <Image src={product.images[0]?.src || ''} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="60px" />
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {product.vendor}
                      </p>
                      <p style={{ fontSize: '16px', fontWeight: 600, color: '#222', marginBottom: '5px' }}>
                        {product.name}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {product.compareAtPrice && (
                          <span style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through' }}>
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#222' }}>
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Bottom bar ── */}
        {hasQuery && (
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px', borderTop: '1px solid #e5e5e5',
            }}
          >
            <Link
              href={`${shopHref}?q=${encodeURIComponent(query)}`}
              onClick={closeSearch}
              style={{ fontSize: '14px', color: '#F15B41', textDecoration: 'underline', fontWeight: 500 }}
            >
              Search for &quot;{query}&quot;
            </Link>
            <Link
              href={`${shopHref}?q=${encodeURIComponent(query)}`}
              onClick={closeSearch}
              style={{ color: '#222', display: 'flex' }}
            >
              <IconArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .search-product-item:hover {
          background-color: #fafafa;
        }
      `}</style>
    </>
  );
}
