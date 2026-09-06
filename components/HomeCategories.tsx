// components/HomeCategories.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { urlFor } from '@/sanity/lib/image';
import { Category } from '@/sanity.types';

import 'swiper/css';

// Define interface for categories with optional productCount
interface CategoryWithCount extends Category {
  productCount?: number;
  slug?: {
    current: string;
  } | string;
}

function IconArrowLeftS({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
    </svg>
  );
}

function IconArrowRightS({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

// Helper function to get category slug
const getCategorySlug = (category: any): string => {
  if (!category) return '';
  
  if (typeof category.slug === 'string') {
    return category.slug;
  }
  
  if (category.slug && typeof category.slug === 'object' && 'current' in category.slug) {
    return category.slug.current;
  }
  
  if (category.title) {
    return category.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  return '';
};

const HomeCategories = ({ categories }: { categories: Category[] }) => {
  const categoriesWithCount = categories as CategoryWithCount[];
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // If no categories, don't render
  if (!categoriesWithCount || categoriesWithCount.length === 0) {
    return null;
  }

  return (
    <section className="gc-section">
      <div className="container-main">
        {/* Heading row */}
        <div className="gc-heading-row">
          <h2 className="gc-heading">Beliebte Kategorien</h2>
          <div className="gc-arrows">
            <button
              onClick={() => swiperInstance?.slidePrev()}
              aria-label="Vorherige Kategorien"
              className="gc-nav-btn"
            >
              <IconArrowLeftS size={16} />
            </button>
            <button
              onClick={() => swiperInstance?.slideNext()}
              aria-label="Nächste Kategorien"
              className="gc-nav-btn"
            >
              <IconArrowRightS size={16} />
            </button>
          </div>
        </div>

        {/* Slider — mobile-first slide counts */}
        <Swiper
          modules={[Navigation]}
          onSwiper={setSwiperInstance}
          slidesPerView={2.2}
          breakpoints={{
            480: { slidesPerView: 2.5 },
            640: { slidesPerView: 3 },
            750: { slidesPerView: 3.5 },
            992: { slidesPerView: 4.5 },
            1200: { slidesPerView: 5.5 },
          }}
          spaceBetween={12}
          loop={categoriesWithCount.length > 5}
          speed={600}
          style={{ overflow: 'hidden' }}
        >
          {categoriesWithCount.map((category) => {
            const slug = getCategorySlug(category);
            const href = slug ? `/category/${slug}` : '#';
            
            return (
              <SwiperSlide key={category?._id}>
                <Link href={href} className="gc-card">
                  <div className="gc-card-img-wrap">
                    {category?.image ? (
                      <Image
                        src={urlFor(category?.image).url()}
                        alt={category?.title || 'Kategorie'}
                        fill
                        quality={90}
                        style={{ objectFit: 'contain', padding: '12%' }}
                        sizes="(min-width: 1200px) 72px, (min-width: 992px) 64px, (min-width: 750px) 56px, 48px"
                      />
                    ) : (
                      <div className="gc-card-img-fallback">📦</div>
                    )}
                    <span className="gc-card-tag">
                      {category?.productCount || 0}
                    </span>
                  </div>
                  <span className="gc-card-label">{category?.title}</span>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <style>{`
        .gc-section {
          --ink: #1a1a1a;
          --paper: #f8f6f2;
          --accent: #d4a853;
          --accent-dark: #b8923a;
          --line: #e8e3d8;
          --muted: #8a7a6a;
          --hover-bg: #f5f0e8;
        }

        /* ── Mobile base ── */
        .gc-heading-row {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .gc-heading {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--ink);
          line-height: 1.2;
          position: relative;
          padding-bottom: 8px;
          margin: 0;
        }
        .gc-heading::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 32px;
          height: 3px;
          border-radius: 2px;
          background: var(--accent);
        }
        .gc-arrows {
          display: flex;
          gap: 6px;
          padding-bottom: 2px;
        }
        .gc-nav-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1.5px solid var(--line);
          background-color: var(--paper);
          color: var(--ink);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
        }
        .gc-nav-btn:hover {
          background-color: var(--accent);
          border-color: var(--accent);
          color: #fff;
        }
        .gc-nav-btn:active {
          background-color: var(--accent-dark);
          border-color: var(--accent-dark);
        }
        .gc-nav-btn svg {
          width: 14px;
          height: 14px;
        }

        .gc-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          text-decoration: none;
          color: inherit;
          background-color: var(--paper);
          border: 1.5px solid var(--line);
          border-radius: 12px;
          padding: 16px 10px 12px;
          height: 100%;
          min-height: 110px;
          width: 100%;
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }
        .gc-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent);
          box-shadow: 0 4px 12px rgba(212, 168, 83, 0.15);
        }
        .gc-card:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        .gc-card-img-wrap {
          position: relative;
          width: 100%;
          max-width: 48px;
          aspect-ratio: 1 / 1;
          margin-bottom: 8px;
          border-radius: 50%;
          background: #fff;
          border: 1.5px solid var(--line);
          flex-shrink: 0;
        }
        .gc-card:hover .gc-card-img-wrap {
          border-color: var(--accent);
        }
        .gc-card-img-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: var(--muted);
        }

        .gc-card-tag {
          position: absolute;
          bottom: -6px;
          right: -10px;
          background: var(--accent);
          color: #fff;
          font-size: 8px;
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
          padding: 3px 5px;
          border-radius: 4px;
          border: 1px solid var(--accent-dark);
        }

        .gc-card-label {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.25;
          word-break: break-word;
          max-width: 100%;
        }

        @media (prefers-reduced-motion: reduce) {
          .gc-card, .gc-nav-btn { transition: none; }
        }

        /* ── ≥ 480px ── */
        @media (min-width: 480px) {
          .gc-card {
            padding: 18px 12px 14px;
            min-height: 120px;
          }
          .gc-card-img-wrap { max-width: 52px; }
          .gc-card-label { font-size: 13px; }
          .gc-card-tag { font-size: 9px; padding: 3px 6px; }
        }

        /* ── ≥ 640px ── */
        @media (min-width: 640px) {
          .gc-heading { font-size: 20px; }
          .gc-heading-row { margin-bottom: 20px; gap: 14px; }
          .gc-card {
            padding: 20px 14px 16px;
            min-height: 130px;
          }
          .gc-card-img-wrap { max-width: 56px; margin-bottom: 10px; }
          .gc-card-label { font-size: 14px; }
          .gc-nav-btn { width: 34px; height: 34px; }
        }

        /* ── ≥ 750px — tablet ── */
        @media (min-width: 750px) {
          .gc-heading { font-size: 22px; }
          .gc-heading-row { margin-bottom: 24px; }
          .gc-card {
            padding: 24px 16px 18px;
            min-height: 150px;
            border-radius: 14px;
          }
          .gc-card-img-wrap { max-width: 64px; margin-bottom: 12px; }
          .gc-card-label { font-size: 15px; }
          .gc-card-tag { font-size: 10px; padding: 4px 7px; }
          .gc-nav-btn { width: 36px; height: 36px; }
        }

        /* ── ≥ 992px — small desktop ── */
        @media (min-width: 992px) {
          .gc-heading { font-size: 26px; }
          .gc-heading-row { margin-bottom: 28px; gap: 16px; }
          .gc-card {
            padding: 28px 20px 22px;
            min-height: 170px;
          }
          .gc-card-img-wrap { max-width: 72px; margin-bottom: 14px; }
          .gc-card-label { font-size: 16px; }
          .gc-card-tag { font-size: 11px; padding: 5px 8px; }
          .gc-nav-btn { width: 40px; height: 40px; }
          .gc-nav-btn svg { width: 18px; height: 18px; }
        }

        /* ── ≥ 1200px — large desktop ── */
        @media (min-width: 1200px) {
          .gc-heading { font-size: 28px; }
          .gc-card { padding: 32px 24px 24px; min-height: 190px; }
          .gc-card-img-wrap { max-width: 80px; margin-bottom: 16px; }
          .gc-card-label { font-size: 17px; }
        }
      `}</style>
    </section>
  );
};

export default HomeCategories;