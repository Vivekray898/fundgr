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
                className="gpb-card gpb-skeleton"
                style={{
                  backgroundColor: '#f5f5f5',
                  height: '200px',
                  borderRadius: '12px',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  left: '24px',
                  right: '24px',
                }}>
                  <div style={{ width: '40%', height: '10px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '10px' }} />
                  <div style={{ width: '70%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '6px' }} />
                  <div style={{ width: '50%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const isSingleBanner = displayBanners.length === 1;

  return (
    <section className="gpb-section">
      <div className="container-main">
        <div className={`gpb-grid ${isSingleBanner ? 'gpb-grid-single' : ''}`}>
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
                  quality={95}
                  priority={displayBanners.indexOf(banner) < 2}
                />
              </div>
              <div className="gpb-content">
                {banner.tagline && <span className="gpb-tagline">{banner.tagline}</span>}
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
          padding: 0 0 8px 0 !important;
        }

        .gpb-grid {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 12px !important;
        }

        .gpb-card {
          position: relative !important;
          display: block !important;
          text-decoration: none !important;
          color: inherit !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          height: 200px !important;
          min-height: 200px !important;
          background-color: #f0f0f0 !important;
          transition: transform 350ms ease, box-shadow 350ms ease;
          width: 100% !important;
        }
        .gpb-card:hover {
          transform: translateY(-3px);
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
          top: 24px !important;
          left: 24px !important;
          right: 24px !important;
          max-width: 65% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          z-index: 2 !important;
        }

        .gpb-tagline {
          font-size: 10px !important;
          font-weight: 600 !important;
          color: #1B8057 !important;
          letter-spacing: 1.2px !important;
          margin-bottom: 6px !important;
          text-transform: uppercase !important;
          line-height: 1 !important;
          display: block !important;
          background: rgba(255,255,255,0.85) !important;
          padding: 3px 10px !important;
          border-radius: 12px !important;
          backdrop-filter: blur(4px) !important;
        }

        .gpb-title {
          font-size: 18px !important;
          font-weight: 700 !important;
          color: #1a1a1a !important;
          line-height: 1.2 !important;
          margin-bottom: 12px !important;
          white-space: pre-line !important;
          letter-spacing: -0.2px !important;
          text-shadow: 0 1px 2px rgba(255,255,255,0.3) !important;
        }

        .gpb-cta {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          color: #1a1a1a !important;
          background-color: rgba(255, 255, 255, 0.92) !important;
          padding: 8px 18px !important;
          border-radius: 30px !important;
          width: fit-content !important;
          letter-spacing: 0.3px !important;
          backdrop-filter: blur(4px) !important;
          transition: all 280ms ease !important;
          border: 1px solid rgba(255,255,255,0.3) !important;
        }
        .gpb-card:hover .gpb-cta {
          background-color: rgb(27, 128, 87) !important;
          color: #fff !important;
          border-color: rgb(27, 128, 87) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(27, 128, 87, 0.25) !important;
        }

        /* ── ≥ 750px — tablet ── */
        @media (min-width: 750px) {
          .gpb-grid { gap: 16px !important; }
          .gpb-card { height: 260px !important; min-height: 260px !important; }
          .gpb-content { top: 32px !important; left: 32px !important; right: 32px !important; max-width: 55% !important; }
          .gpb-tagline { font-size: 11px !important; padding: 4px 12px !important; }
          .gpb-title { font-size: 22px !important; margin-bottom: 14px !important; }
          .gpb-cta { font-size: 12px !important; padding: 9px 22px !important; }
        }

        /* ── ≥ 992px — desktop ── */
        @media (min-width: 992px) {
          .gpb-grid { 
            grid-template-columns: 1fr 1fr !important; 
            gap: 24px !important; 
          }
          .gpb-card { height: 340px !important; min-height: 340px !important; }
          .gpb-content { 
            top: 40px !important; 
            left: 40px !important; 
            right: 40px !important; 
            max-width: 50% !important; 
          }
          .gpb-tagline { 
            font-size: 12px !important; 
            padding: 4px 14px !important;
            margin-bottom: 8px !important;
          }
          .gpb-title { 
            font-size: 26px !important; 
            margin-bottom: 16px !important; 
          }
          .gpb-cta { 
            font-size: 13px !important; 
            padding: 10px 24px !important; 
          }
        }

        /* ── ≥ 1200px ── */
        @media (min-width: 1200px) {
          .gpb-card { height: 380px !important; min-height: 380px !important; }
          .gpb-content { top: 48px !important; left: 48px !important; right: 48px !important; max-width: 45% !important; }
          .gpb-title { font-size: 30px !important; margin-bottom: 18px !important; letter-spacing: -0.4px !important; }
          .gpb-cta { font-size: 14px !important; padding: 11px 28px !important; }
        }

        /* ── Single banner grid ── */
        .gpb-grid-single {
          grid-template-columns: 1fr !important;
          max-width: 800px !important;
          margin: 0 auto !important;
        }
        .gpb-grid-single .gpb-card {
          max-width: 100% !important;
          margin: 0 auto !important;
        }

        @media (min-width: 992px) {
          .gpb-grid-single .gpb-content {
            max-width: 45% !important;
          }
        }

        /* ── Skeleton loading ── */
        .gpb-skeleton {
          animation: gpbPulse 1.5s ease-in-out infinite !important;
        }
        .gpb-skeleton .gpb-content {
          max-width: 80% !important;
        }

        @keyframes gpbPulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}