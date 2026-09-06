// src/features/grocery-shop/components/GroceryWeeklyDeals.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useBanners } from '../hooks/useBanners';

function IconArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

// Default fallback data
const DEFAULT_DATA = {
  title: 'Weekly Deals on Organic\nVegetables',
  description: 'Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or even provide a review.',
  cta: 'SHOP NOW',
  href: '/shop',
  image: '/grocery-shop/img-with-text/img-with-text1.webp',
};

export function GroceryWeeklyDeals() {
  const { data: banners, isLoading } = useBanners('weekly');

  // Get the first active weekly deal banner
  const banner = banners && banners.length > 0 ? banners[0] : null;

  // Use banner data if available, otherwise fallback to default
  const title = banner?.title || DEFAULT_DATA.title;
  const description = banner?.description || DEFAULT_DATA.description;
  const cta = banner?.cta || DEFAULT_DATA.cta;
  const href = banner?.href || DEFAULT_DATA.href;
  const image = banner?.image || DEFAULT_DATA.image;

  // Show loading skeleton
  if (isLoading) {
    return (
      <section className="gwd-section">
        <div className="gwd-grid">
          <div className="gwd-content">
            <div style={{ 
              width: '60%', 
              height: '40px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '4px', 
              marginBottom: '20px' 
            }} />
            <div style={{ 
              width: '80%', 
              height: '20px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '4px', 
              marginBottom: '12px' 
            }} />
            <div style={{ 
              width: '70%', 
              height: '20px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '4px', 
              marginBottom: '28px' 
            }} />
            <div style={{ 
              width: '150px', 
              height: '48px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '40px' 
            }} />
          </div>
          <div className="gwd-image-wrap" style={{ backgroundColor: '#e0e0e0' }} />
        </div>
      </section>
    );
  }

  return (
    <section className="gwd-section">
      <div className="gwd-grid">
        <div className="gwd-content">
          <h2 className="gwd-title">{title}</h2>
          <p className="gwd-description">{description}</p>
          <Link href={href} className="gwd-btn">
            {cta}
            <IconArrowRight size={18} />
          </Link>
        </div>

        <div className="gwd-image-wrap">
          <Image
            src={image}
            alt={title.replace('\n', ' ')}
            fill
            className="gwd-image"
            style={{ objectFit: 'cover' }}
            sizes="(min-width: 992px) 50vw, 100vw"
            quality={75}
          />
        </div>
      </div>

      <style>{`
        /* ── Full-width section (no boxed container) ── */
        .gwd-section {
          width: 100%;
          overflow: hidden;
        }

        /* ── Mobile base ── */
        .gwd-grid {
          display: grid;
          grid-template-columns: 1fr;
          align-items: stretch;
          background-color: #eef5ea;
          border-radius: 0;
          overflow: hidden;
          width: 100%;
        }

        .gwd-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 24px;
          min-width: 0;
          overflow: hidden;
        }

        .gwd-title {
          font-size: 26px;
          font-weight: 700;
          color: #1f3a1f;
          line-height: 1.25;
          margin-bottom: 20px;
          letter-spacing: -0.4px;
          white-space: pre-line;
        }

        .gwd-description {
          font-size: 15px;
          color: #555;
          line-height: 1.75;
          margin-bottom: 28px;
          max-width: 460px;
        }

        .gwd-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #1B8057;
          color: #fff;
          font-size: 15px;
          font-weight: 500;
          padding: 14px 32px;
          border-radius: 40px;
          text-decoration: none;
          letter-spacing: 0.4px;
          width: fit-content;
          transition: all 250ms ease;
          box-shadow: 0 2px 10px rgba(27, 128, 87, 0.25);
        }
        .gwd-btn:hover {
          background-color: #14623F;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(27, 128, 87, 0.35);
        }

        .gwd-image-wrap {
          position: relative;
          min-height: 320px;
          overflow: hidden;
          min-width: 0;
        }
        .gwd-image { transition: transform 700ms ease; }
        .gwd-grid:hover .gwd-image { transform: scale(1.05); }

        /* ── ≥ 750px — tablet ── */
        @media (min-width: 750px) {
          .gwd-content { padding: 56px 40px; }
          .gwd-title { font-size: 32px; margin-bottom: 22px; }
          .gwd-description { font-size: 16px; margin-bottom: 32px; }
          .gwd-btn { font-size: 16px; padding: 15px 34px; }
          .gwd-image-wrap { min-height: 420px; }
        }

        /* ── ≥ 992px — desktop: side-by-side, fixed 650px height ── */
        @media (min-width: 992px) {
          .gwd-grid {
            grid-template-columns: 1fr 1fr;
            height: 650px;
          }
          .gwd-content {
            padding-top: 0;
            padding-bottom: 0;
            padding-left: max(80px, calc((100vw - 153rem) / 2 + 3rem));
            padding-right: 80px;
          }
          .gwd-title { font-size: 40px; margin-bottom: 26px; }
          .gwd-description { font-size: 17px; margin-bottom: 36px; max-width: 480px; }
          .gwd-btn { font-size: 17px; padding: 16px 36px; gap: 12px; }
          .gwd-image-wrap { min-height: auto; height: 650px; }
        }

        /* ── ≥ 1200px — large desktop ── */
        @media (min-width: 1200px) {
          .gwd-content {
            padding-left: max(100px, calc((100vw - 153rem) / 2 + 4rem));
            padding-right: 100px;
          }
          .gwd-description { font-size: 18px; line-height: 1.8; }
        }
      `}</style>
    </section>
  );
}