// components/HomePage/GroceryPromoBanners.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useBanners } from '@/components/hooks/useBanners';

export function GroceryPromoBanners() {
  const { data: banners, isLoading } = useBanners('promo');

  // If no promo banners from Sanity, don't render anything
  if (!banners || banners.length === 0) {
    return null;
  }

  // Use Sanity data for banners
  const displayBanners = banners.map((banner) => ({
    id: banner._id,
    tagline: banner.tagline || '',
    title: banner.title,
    cta: banner.cta,
    href: banner.href,
    image: banner.image,
  }));

  // Show loading state
  if (isLoading) {
    return (
      <section className="gpb-section">
        <div className="container-main">
          <div className="gpb-grid">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="gpb-card"
                style={{
                  backgroundColor: '#f5f5f5',
                  height: '280px',
                  borderRadius: '12px',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '28px',
                  left: '28px',
                  right: '28px',
                  maxWidth: '60%',
                }}>
                  <div style={{ width: '60%', height: '12px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '12px' }} />
                  <div style={{ width: '80%', height: '24px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '8px' }} />
                  <div style={{ width: '40%', height: '24px', backgroundColor: '#e0e0e0', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="gpb-section">
      <div className="container-main">
        <div className="gpb-grid">
          {displayBanners.map((banner) => (
            <Link key={banner.id} href={banner.href} className="gpb-card">
              <div className="gpb-image-wrap">
                <Image
                  src={banner.image}
                  alt={banner.title.replace('\n', ' ')}
                  fill
                  className="gpb-image"
                  style={{ objectFit: 'cover' }}
                  sizes="(min-width: 992px) 50vw, 100vw"
                  quality={75}
                />
              </div>
              <div className="gpb-content">
                {banner.tagline && (
                  <span className="gpb-tagline">{banner.tagline}</span>
                )}
                <h3 className="gpb-title">{banner.title}</h3>
                <span className="gpb-cta">{banner.cta}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        /* ── Mobile base ── */
        .gpb-section {
          display: block !important;
          width: 100% !important;
        }

        .gpb-grid {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 16px !important;
        }

        .gpb-card {
          position: relative !important;
          display: block !important;
          text-decoration: none !important;
          color: inherit !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          height: 280px !important;
          min-height: 280px !important;
          background-color: #f0f0f0 !important;
          transition: transform 350ms ease, box-shadow 350ms ease;
          width: 100% !important;
        }
        .gpb-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
        }

        .gpb-image-wrap {
          position: absolute !important;
          inset: 0 !important;
          z-index: 1 !important;
          width: 100% !important;
          height: 100% !important;
        }
        .gpb-image {
          transition: transform 700ms ease;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
        .gpb-card:hover .gpb-image {
          transform: scale(1.04);
        }

        .gpb-content {
          position: absolute !important;
          top: 28px !important;
          left: 28px !important;
          right: 28px !important;
          max-width: 60% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          z-index: 2 !important;
        }

        .gpb-tagline {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #222 !important;
          letter-spacing: 1.6px !important;
          margin-bottom: 12px !important;
          text-transform: uppercase !important;
          line-height: 1 !important;
          display: block !important;
        }

        .gpb-title {
          font-size: 22px !important;
          font-weight: 700 !important;
          color: #222 !important;
          line-height: 1.25 !important;
          margin-bottom: 22px !important;
          white-space: pre-line !important;
          letter-spacing: -0.2px !important;
        }

        .gpb-cta {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          color: #222 !important;
          background-color: #fff !important;
          padding: 11px 26px !important;
          border-radius: 30px !important;
          width: fit-content !important;
          letter-spacing: 0.1px !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06) !important;
          transition: background-color 280ms ease, color 280ms ease, box-shadow 280ms ease, transform 280ms ease !important;
        }
        .gpb-cta:hover {
          background-color: rgb(27, 128, 87) !important;
          color: #fff !important;
          box-shadow: 0 6px 16px rgba(27, 128, 87, 0.28) !important;
          transform: translateY(-1px) !important;
        }

        /* ── ≥ 750px — tablet ── */
        @media (min-width: 750px) {
          .gpb-card { height: 360px !important; min-height: 360px !important; }
          .gpb-content { top: 40px !important; left: 40px !important; right: 40px !important; }
          .gpb-title { font-size: 26px !important; margin-bottom: 24px !important; }
          .gpb-cta { padding: 12px 30px !important; font-size: 14px !important; }
        }

        /* ── ≥ 992px — small desktop: 2-col grid ── */
        @media (min-width: 992px) {
          .gpb-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .gpb-card { height: 450px !important; min-height: 450px !important; }
          .gpb-content { top: 48px !important; left: 48px !important; right: 48px !important; max-width: 55% !important; }
          .gpb-tagline { font-size: 13px !important; margin-bottom: 16px !important; }
          .gpb-title { font-size: 30px !important; margin-bottom: 28px !important; }
          .gpb-cta { padding: 13px 32px !important; font-size: 14px !important; }
        }

        /* ── ≥ 1200px ── */
        @media (min-width: 1200px) {
          .gpb-content { top: 56px !important; left: 56px !important; right: 56px !important; }
          .gpb-title { font-size: 34px !important; margin-bottom: 32px !important; letter-spacing: -0.4px !important; }
        }

        /* ── Single banner grid ── */
        .gpb-grid:has(.gpb-card:only-child) {
          grid-template-columns: 1fr !important;
        }
        .gpb-grid:has(.gpb-card:only-child) .gpb-card {
          max-width: 600px !important;
          margin: 0 auto !important;
        }

        @media (min-width: 992px) {
          .gpb-grid:has(.gpb-card:only-child) {
            grid-template-columns: 1fr !important;
            max-width: 600px !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
    </section>
  );
}