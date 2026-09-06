'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HomeProductCard } from '@/features/home/components/HomeProductCard';
import { plantGardenProducts } from '@/data/plant-garden-products';

const TABS = ['Featured', 'New Arrivals', 'Bestsellers', 'Popular'] as const;
type Tab = typeof TABS[number];

function getProductsForTab(tab: Tab) {
  switch (tab) {
    case 'New Arrivals':
      return plantGardenProducts.filter((p) => p.badge === 'new').slice(0, 8);
    case 'Bestsellers':
      return [...plantGardenProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
    case 'Popular':
      return plantGardenProducts.filter((_, i) => i % 2 === 0).slice(0, 8);
    default:
      return plantGardenProducts.slice(0, 8);
  }
}

export function PlantGardenTrendingProducts() {
  const [activeTab, setActiveTab] = useState<Tab>('Featured');
  const products = getProductsForTab(activeTab);

  return (
    <section className="pg-trending">
      <div className="container-main">
        {/* Header row */}
        <div className="pg-trending-header">
          <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 700, color: '#111', margin: 0 }}>
            Trending Products
          </h2>
          <div className="pg-trending-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pg-tab-btn${activeTab === tab ? ' pg-tab-active' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'clamp(13px, 1.1vw, 15px)',
                  fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? '#3a7d44' : '#777',
                  padding: '4px 0',
                  borderBottom: activeTab === tab ? '2px solid #3a7d44' : '2px solid transparent',
                  transition: 'all 200ms ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="pg-trending-grid">
          {products.map((product, i) => (
            <HomeProductCard
              key={product.id}
              product={product}
              hrefBase="/plant-garden/product"
              index={i}
            />
          ))}
        </div>

        {/* View all */}
        <div style={{ textAlign: 'center', marginTop: 'clamp(24px, 3vw, 40px)' }}>
          <Link
            href="/plant-garden/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: 'clamp(10px, 1vw, 13px) clamp(24px, 2.5vw, 36px)',
              border: '1.5px solid #111',
              color: '#111',
              fontSize: 'clamp(13px, 1vw, 15px)',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#111'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#111'; }}
          >
            View All
            <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}>
              <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        .pg-trending-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: clamp(20px, 2.5vw, 36px);
        }
        .pg-trending-tabs {
          display: flex;
          gap: clamp(16px, 2vw, 28px);
          flex-wrap: wrap;
        }
        .pg-trending-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(12px, 1.5vw, 24px);
        }
        @media (min-width: 992px) {
          .pg-trending-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 749px) {
          .pg-trending-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .pg-trending-tabs { justify-content: center; }
        }
      `}</style>
    </section>
  );
}
