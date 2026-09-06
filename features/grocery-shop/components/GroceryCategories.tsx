// src/features/grocery-shop/components/GroceryCategories.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useCategories } from '../hooks/useCategories';

import 'swiper/css';

function IconArrowLeftS({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
    </svg>
  );
}

function IconArrowRightS({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

// Fallback data if Sanity is not available
const DEFAULT_CATEGORIES = [
  { id: 'drinks', label: 'Drinks & Juice', items: 13, image: '/grocery-shop/categories-slider/categories-slider1.webp', href: '/shop' },
  { id: 'fruits', label: 'Fresh Fruits', items: 13, image: '/grocery-shop/categories-slider/categories-slider2.webp', href: '/shop' },
  { id: 'grocery', label: 'Grocery store', items: 13, image: '/grocery-shop/categories-slider/categories-slider3.webp', href: '/shop' },
  { id: 'vegetables', label: 'Vegetables', items: 13, image: '/grocery-shop/categories-slider/categories-slider4.webp', href: '/shop' },
  { id: 'seafood', label: 'Seafood', items: 12, image: '/grocery-shop/categories-slider/categories-slider5.webp', href: '/shop' },
  { id: 'meats', label: 'Meats', items: 9, image: '/grocery-shop/categories-slider/categories-slider1.webp', href: '/shop' },
  { id: 'dairy', label: 'Milk & Dairies', items: 14, image: '/grocery-shop/categories-slider/categories-slider2.webp', href: '/shop' },
];

export function GroceryCategories() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const { data: categories, isLoading } = useCategories();

  // Use Sanity data if available, otherwise fallback to default
  const displayCategories = categories && categories.length > 0
    ? categories.map((cat) => ({
        id: cat._id,
        label: cat.name,
        items: cat.itemCount || 0,
        image: cat.image,
        href: cat.href || `/grocery/shop?category=${cat.slug}`,
      }))
    : DEFAULT_CATEGORIES;

  // Show loading state (skeleton matching card layout)
  if (isLoading) {
    return (
      <section className="gc-section">
        <div className="container-main">
          <div className="gc-heading-row">
            <h2 className="gc-heading">Shop by Categories</h2>
            <div className="gc-arrows">
              <button className="gc-nav-btn" disabled>
                <IconArrowLeftS size={18} />
              </button>
              <button className="gc-nav-btn" disabled>
                <IconArrowRightS size={18} />
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '12px',
                  padding: '50px 30px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  minHeight: '180px',
                }}
              >
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#e0e0e0' }} />
                <div style={{ width: '80%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '4px' }} />
                <div style={{ width: '50%', height: '14px', backgroundColor: '#e0e0e0', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="gc-section">
      <div className="container-main">
        {/* Heading row */}
        <div className="gc-heading-row">
          <h2 className="gc-heading">Shop by Categories</h2>
          <div className="gc-arrows">
            <button
              onClick={() => swiperInstance?.slidePrev()}
              aria-label="Previous categories"
              className="gc-nav-btn"
            >
              <IconArrowLeftS size={18} />
            </button>
            <button
              onClick={() => swiperInstance?.slideNext()}
              aria-label="Next categories"
              className="gc-nav-btn"
            >
              <IconArrowRightS size={18} />
            </button>
          </div>
        </div>

        {/* Slider — mobile-first slide counts */}
        <Swiper
          modules={[Navigation]}
          onSwiper={setSwiperInstance}
          slidesPerView={2}
          breakpoints={{
            750: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          spaceBetween={16}
          loop={displayCategories.length > 5}
          speed={600}
          style={{ overflow: 'hidden' }}
        >
          {displayCategories.map((cat) => (
            <SwiperSlide key={cat.id}>
              <Link href={cat.href} className="gc-card">
                <div className="gc-card-img-wrap">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    quality={95}
                    style={{ objectFit: 'contain' }}
                    sizes="(min-width: 1200px) 80px, (min-width: 992px) 72px, (min-width: 750px) 68px, 60px"
                  />
                </div>
                <span className="gc-card-label">{cat.label}</span>
                <span className="gc-card-items">{cat.items} Items</span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        /* ── Mobile base ── */
        .gc-heading-row {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .gc-heading {
          font-size: 22px;
          font-weight: 700;
          color: #222;
          line-height: 1.2;
        }
        .gc-arrows {
          display: flex;
          gap: 8px;
        }
        .gc-nav-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid #e5e5e5;
          background-color: #fff;
          color: #222;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 250ms ease, border-color 250ms ease, color 250ms ease;
        }
        .gc-nav-btn:hover:not(:disabled) {
          background-color: #1B8057;
          border-color: #1B8057;
          color: #fff;
        }
        .gc-nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .gc-card {
          display: grid;
          grid-template-rows: auto auto auto;
          justify-items: center;
          text-align: center;
          text-decoration: none;
          color: inherit;
          background-color: rgb(248, 250, 251);
          border-radius: 12px;
          padding: 3rem 2rem 2rem; /* 30px 20px 20px — mobile */
          transition: transform 300ms ease, box-shadow 300ms ease;
        }
        .gc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .gc-card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          max-width: 60px;
          margin-bottom: 1.8rem;
          transition: transform 400ms ease;
        }
        .gc-card:hover .gc-card-img-wrap {
          transform: scale(1.08);
        }

        .gc-card-label {
          display: block;
          font-size: 17px;
          font-weight: 700;
          color: #222;
          letter-spacing: -0.1px;
          margin-bottom: 4px;
          transition: color 300ms ease;
        }
        .gc-card:hover .gc-card-label {
          color: #1B8057;
        }
        .gc-card-items {
          display: block;
          font-size: 14px;
          color: #888;
        }

        /* ── ≥ 750px — tablet ── */
        @media (min-width: 750px) {
          .gc-heading { font-size: 26px; }
          .gc-heading-row { margin-bottom: 28px; }
          .gc-card { padding: 4rem 2.5rem 2.5rem; }
          .gc-card-img-wrap { max-width: 68px; }
          .gc-card-label { font-size: 18px; }
        }

        /* ── ≥ 992px — small desktop ── */
        @media (min-width: 992px) {
          .gc-heading { font-size: 30px; }
          .gc-heading-row { margin-bottom: 32px; }
          .gc-card { padding: 5rem 3rem 3rem; }
          .gc-card-img-wrap { max-width: 72px; margin-bottom: 2rem; }
          .gc-card-label { font-size: 19px; }
          .gc-card-items { font-size: 15px; }
          .gc-nav-btn { width: 40px; height: 40px; }
        }

        /* ── ≥ 1200px — large desktop ── */
        @media (min-width: 1200px) {
          .gc-heading { font-size: 32px; }
          .gc-card-img-wrap { max-width: 80px; }
          .gc-card-label { font-size: 20px; }
        }
      `}</style>
    </section>
  );
}