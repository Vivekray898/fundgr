// src/features/grocery-shop/components/GroceryFeaturedProducts.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { GroceryProductCard } from './GroceryProductCard';

function IconArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

const INITIAL_LIMIT = 8;
const REVEAL_DELAY_MS = 600;

// Default fallback tabs (if Sanity categories fail to load)
const DEFAULT_TABS = [
  { id: 'all', label: 'All', category: '' },
  { id: 'fruits', label: 'Fresh Fruits', category: 'Fresh Fruits' },
  { id: 'dairy', label: 'Milk & Dairies', category: 'Milk & Dairies' },
  { id: 'meats', label: 'Meats', category: 'Meats' },
  { id: 'vegetables', label: 'Vegetables', category: 'Vegetables' },
];

export function GroceryFeaturedProducts() {
  const [activeTab, setActiveTab] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch categories from Sanity
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Build tabs from categories or use defaults
  const tabs = categories && categories.length > 0
    ? [
        { id: 'all', label: 'All', category: '' },
        ...categories.map((cat) => ({
          id: cat.slug || cat._id,
          label: cat.name,
          category: cat.name,  // Use the category NAME for filtering
        })),
      ]
    : DEFAULT_TABS;

  // Get the category from the active tab
  const currentCategory = tabs.find(t => t.id === activeTab)?.category || '';
  
  // Fetch products from Sanity
  const { data, isLoading, error } = useProducts({ 
    limit: 20,
    sort: 'best-selling'
  });

  // Filter products by category
  const allProducts = data?.products || [];
  const filtered = currentCategory
    ? allProducts.filter((p) => p.category === currentCategory)
    : allProducts;

  const visibleProducts = showAll ? filtered : filtered.slice(0, INITIAL_LIMIT);
  const hasMore = filtered.length > INITIAL_LIMIT;
  const showViewAllButton = hasMore && !showAll;

  // Reset expansion when switching tabs
  useEffect(() => {
    setShowAll(false);
    setIsRevealing(false);
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, []);

  const handleViewAll = () => {
    if (isRevealing || showAll) return;
    setIsRevealing(true);
    revealTimerRef.current = setTimeout(() => {
      setShowAll(true);
      setIsRevealing(false);
      revealTimerRef.current = null;
    }, REVEAL_DELAY_MS);
  };

  // Show loading state
  if (isLoading || categoriesLoading) {
    return (
      <section className="gfp-section">
        <div className="container-main">
          <div className="gfp-heading-row">
            <h2 className="gfp-heading">Featured Products</h2>
            <div className="gfp-tabs" role="tablist">
              {DEFAULT_TABS.map((tab) => (
                <button key={tab.id} className="gfp-tab" disabled>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="gfp-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ backgroundColor: '#f5f5f5', borderRadius: '10px', height: '280px' }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="gfp-section">
        <div className="container-main">
          <p style={{ textAlign: 'center', color: '#ef4444' }}>
            Failed to load products. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="gfp-section">
      <div className="container-main">
        <div className="gfp-heading-row">
          <h2 className="gfp-heading">Featured Products</h2>
          <div className="gfp-tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`gfp-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="gfp-grid">
          {visibleProducts.length === 0 ? (
            <div className="gfp-empty">
              {activeTab === 'all' 
                ? 'No products available yet. Start adding products in Sanity!'
                : `No products in "${tabs.find(t => t.id === activeTab)?.label || 'this'}" category yet.`
              }
            </div>
          ) : (
            visibleProducts.map((product, i) => {
              const isNewlyRevealed = showAll && i >= INITIAL_LIMIT;
              const delayIndex = isNewlyRevealed ? i - INITIAL_LIMIT : i;
              return (
                <div
                  key={product.id}
                  style={{
                    animation: 'gfpFadeUp 400ms ease forwards',
                    animationDelay: `${delayIndex * 40}ms`,
                    opacity: 0,
                  }}
                >
                  <GroceryProductCard 
                    product={product} 
                    showCountdown={i === 0 && activeTab === 'all'} 
                  />
                </div>
              );
            })
          )}
        </div>

        {showViewAllButton && (
          <div className="gfp-view-all-wrap">
            <button
              type="button"
              className={`gfp-view-all ${isRevealing ? 'is-loading' : ''}`}
              onClick={handleViewAll}
              disabled={isRevealing}
              aria-live="polite"
              aria-busy={isRevealing}
            >
              {isRevealing ? (
                <>
                  <span className="gfp-spinner" aria-hidden="true" />
                  Loading...
                </>
              ) : (
                <>
                  View All
                  <IconArrowRight size={13} />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .gfp-heading-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          margin-bottom: 36px;
        }
        @media (max-width: 749px) {
          .gfp-tabs { justify-content: center; gap: 16px; }
        }
        .gfp-heading {
          font-size: 26px;
          font-weight: 700;
          color: #222;
          letter-spacing: -0.2px;
        }

        .gfp-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
        }
        .gfp-tab {
          position: relative;
          font-size: 16px;
          font-weight: 400;
          color: #1B8057;
          padding: 8px 0;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 200ms ease;
        }
        .gfp-tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .gfp-tab::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 1.5px;
          background: #14623F;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .gfp-tab:hover { color: #1B8057; }
        .gfp-tab.is-active { color: #1B8057; font-weight: 500; }
        .gfp-tab.is-active::after { transform: scaleX(1); }

        .gfp-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .gfp-grid > * {
          min-width: 0;
        }
        .gfp-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #888;
          font-size: 14px;
          background-color: #f9f9f9;
          border-radius: 10px;
        }

        .gfp-view-all-wrap {
          text-align: center;
          margin-top: 36px;
        }
        .gfp-view-all {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-width: 150px;
          justify-content: center;
          font-size: 14px;
          font-weight: 500;
          color: #222;
          padding: 10px 24px;
          border: 1.5px solid #222;
          border-radius: 40px;
          text-decoration: none;
          background-color: #fff;
          cursor: pointer;
          transition: background-color 250ms ease, border-color 250ms ease, color 250ms ease, transform 250ms ease;
        }
        .gfp-view-all:hover:not(:disabled) {
          background-color: #1B8057;
          border-color: #1B8057;
          color: #fff;
          transform: translateY(-1px);
        }
        .gfp-view-all.is-loading {
          background-color: #1B8057;
          border-color: #1B8057;
          color: #fff;
          cursor: wait;
        }
        .gfp-view-all:disabled { opacity: 1; }

        .gfp-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: gfpSpin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes gfpFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gfpSpin {
          to { transform: rotate(360deg); }
        }

        @media (min-width: 750px) {
          .gfp-heading-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 48px;
          }
          .gfp-heading { font-size: 28px; }
          .gfp-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; }
        }

        @media (min-width: 992px) {
          .gfp-heading-row { margin-bottom: 56px; }
          .gfp-heading { font-size: 30px; }
          .gfp-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
          .gfp-tab { font-size: 18px; }
          .gfp-tabs { gap: 40px; }
        }

        @media (min-width: 1200px) {
          .gfp-heading { font-size: 32px; }
        }
      `}</style>
    </section>
  );
}