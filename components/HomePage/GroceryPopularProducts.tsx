// src/features/grocery-shop/components/GroceryPopularProducts.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import type { Product } from '@/types/product';
import { ShoppingBag } from 'lucide-react';

function IconCart({ size = 16 }: { size?: number }) {
  return <ShoppingBag size={size} />;
}

// Default fallback tabs
const DEFAULT_TABS = [
  { id: 'all', label: 'All', category: '' },
  { id: 'fruits', label: 'Fresh Fruits', category: 'Fresh Fruits' },
  { id: 'dairy', label: 'Milk & Dairies', category: 'Milk & Dairies' },
  { id: 'meats', label: 'Meats', category: 'Meats' },
  { id: 'vegetables', label: 'Vegetables', category: 'Vegetables' },
  { id: 'drinks', label: 'Drinks & Juice', category: 'Drinks & Juice' },
];

export function GroceryPopularProducts() {
  const [activeTab, setActiveTab] = useState('all');
  const { openQuickView } = useUIStore();

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

  // Get category from active tab
  const currentCategory = tabs.find(t => t.id === activeTab)?.category || '';

  // Fetch products from Sanity with category filter
  const { data, isLoading, error } = useProducts({
    category: currentCategory || undefined,
    limit: 12,
    sort: 'best-selling',
  });

  const products = data?.products || [];

  // Show loading state
  if (isLoading || categoriesLoading) {
    return (
      <section className="gpp-section">
        <div className="container-main">
          <div className="gpp-heading-row">
            <h2 className="gpp-heading">Popular Products</h2>
          </div>
          <div className="gpp-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ backgroundColor: '#f5f5f5', borderRadius: '10px', height: '140px' }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="gpp-section">
        <div className="container-main">
          <p style={{ textAlign: 'center', color: '#ef4444' }}>
            Failed to load products. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="gpp-section">
      <div className="container-main">
        <div className="gpp-heading-row">
          <h2 className="gpp-heading">Popular Products</h2>
        </div>

        <div className="gpp-tabs-row">
          <div className="gpp-tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`gpp-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="gpp-grid">
          {products.length === 0 ? (
            <div className="gpp-empty">
              {activeTab === 'all' 
                ? 'No products available yet. Start adding products in Sanity!'
                : `No products in "${tabs.find(t => t.id === activeTab)?.label || 'this'}" category yet.`
              }
            </div>
          ) : (
            products.map((product, i) => (
              <div
                key={product.id}
                className="gpp-card"
                style={{ animation: 'gppFadeIn 300ms ease forwards', animationDelay: `${i * 30}ms`, opacity: 0 }}
              >
                <Link href={`/grocery/product/${product.slug}`} className="gpp-card-img-wrap" aria-label={product.name}>
                  <div className="gpp-card-img-inner">
                    <Image
                      src={product.images[0]?.src || ''}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      sizes="104px"
                    />
                  </div>
                </Link>

                <div className="gpp-card-info">
                  <Link href={`/grocery/product/${product.slug}`} className="gpp-card-name">{product.name}</Link>
                  <div className="gpp-card-price">
                    {product.compareAtPrice && (
                      <span className="gpp-price-old">${product.compareAtPrice.toFixed(2)}</span>
                    )}
                    <span className={`gpp-price-new ${product.compareAtPrice ? 'is-sale' : ''}`}>
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="gpp-stock">{product.stockQuantity || 50} in stock</span>
                </div>

                <div className="gpp-tooltip-wrap">
                  <button
                    type="button"
                    className="gpp-quick-add"
                    onClick={() => openQuickView(product)}
                    aria-label={`Quick add ${product.name}`}
                  >
                    <IconCart size={16} />
                  </button>
                  <span className="gpp-tooltip" aria-hidden="true">Quick Add</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .gpp-heading-row {
          margin-bottom: 24px;
        }
        .gpp-heading {
          font-size: 24px;
          font-weight: 700;
          color: #222;
          letter-spacing: -0.3px;
        }

        .gpp-tabs-row {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 24px;
        }
        .gpp-tabs {
          display: flex;
          gap: 22px;
          flex-wrap: wrap;
          align-items: center;
        }
        .gpp-tab {
          position: relative;
          font-size: 16px;
          font-weight: 500;
          color: #666;
          padding: 10px 0;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 220ms ease;
        }
        .gpp-tab::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 1.5px;
          background-color: #222;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .gpp-tab:hover { color: #222; }
        .gpp-tab.is-active {
          color: #222;
          font-weight: 600;
        }
        .gpp-tab.is-active::after { transform: scaleX(1); }

        .gpp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .gpp-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #888;
          font-size: 14px;
          background-color: #f9f9f9;
          border-radius: 10px;
        }

        .gpp-card {
          display: grid;
          grid-template-columns: 104px 1fr auto;
          align-items: center;
          gap: 18px;
          padding: 18px;
          height: 140px;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          background-color: #fff;
          transition: border-color 250ms ease, box-shadow 250ms ease, transform 250ms ease;
        }
        .gpp-card:hover {
          border-color: #d0d0d0;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .gpp-card-img-wrap {
          display: block;
          position: relative;
          width: 104px;
          height: 104px;
          background-color: #f9faf5;
          border-radius: 10px;
          overflow: hidden;
        }
        .gpp-card-img-inner {
          position: absolute;
          inset: 10px;
        }
        .gpp-card-img-inner img {
          transition: transform 400ms ease;
        }
        .gpp-card:hover .gpp-card-img-inner img {
          transform: scale(1.06);
        }

        .gpp-card-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .gpp-card-name {
          display: block;
          font-size: 17px;
          font-weight: 600;
          color: #222;
          text-decoration: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: -0.1px;
          transition: color 200ms ease;
        }
        .gpp-card-name:hover { color: #1B8057; }

        .gpp-card-price {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .gpp-price-old {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
        }
        .gpp-price-new {
          font-size: 16px;
          font-weight: 600;
          color: #222;
        }
        .gpp-price-new.is-sale { color: #222; }

        .gpp-stock {
          font-size: 14px;
          color: #1B8057;
          font-weight: 500;
        }

        .gpp-tooltip-wrap {
          position: relative;
        }
        .gpp-quick-add {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background-color: #fff;
          border: 1px solid #e0e0e0;
          color: #555;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 220ms ease, color 220ms ease, border-color 220ms ease, transform 220ms ease;
        }
        .gpp-quick-add:hover {
          background-color: #1B8057;
          border-color: #1B8057;
          color: #fff;
        }

        .gpp-tooltip {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          background-color: #222;
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 6px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 220ms ease, transform 220ms ease;
          z-index: 5;
        }
        .gpp-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: #222;
        }
        .gpp-tooltip-wrap:hover .gpp-tooltip,
        .gpp-quick-add:focus-visible + .gpp-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        @keyframes gppFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (min-width: 750px) {
          .gpp-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .gpp-heading { font-size: 28px; }
          .gpp-heading-row { margin-bottom: 30px; }
          .gpp-tabs-row { margin-bottom: 30px; }
          .gpp-tab { font-size: 18px; }
          .gpp-tabs { gap: 28px; }
        }
        @media (min-width: 992px) {
          .gpp-grid { grid-template-columns: repeat(3, 1fr); gap: 20px 24px; }
          .gpp-heading { font-size: 30px; }
          .gpp-heading-row { margin-bottom: 36px; }
          .gpp-tabs-row { margin-bottom: 32px; }
          .gpp-tab { font-size: 19px; }
        }
      `}</style>
    </section>
  );
}