// components/HomePage/GroceryFullBanner.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useFullBanner } from '@/components/hooks/useFullBanner';

function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

export function GroceryFullBanner() {
  const { data: banner, isLoading } = useFullBanner();

  // Show loading state
  if (isLoading) {
    return (
      <section className="gfb-section">
        <div className="container-main">
          <div 
            className="gfb-wrap" 
            style={{ 
              backgroundColor: '#f0f0f0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <p style={{ color: '#999' }}>Loading banner...</p>
          </div>
        </div>
      </section>
    );
  }

  // If no banner from Sanity, don't render anything
  if (!banner) {
    return null;
  }

  return (
    <section className="gfb-section">
      <div className="container-main">
        <div className="gfb-wrap">
          <Image
            src={banner.image}
            alt={banner.title.replace('\n', ' ')}
            fill
            className="gfb-image"
            style={{ objectFit: 'cover' }}
            sizes="(min-width: 992px) 90vw, 100vw"
            priority={false}
          />

          <div className="gfb-content">
            <h2 className="gfb-title">{banner.title}</h2>
            <p className="gfb-description">{banner.description}</p>
            <Link href={banner.href} className="gfb-btn">
              {banner.cta}
              <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .gfb-section {
          width: 100%;
        }

        .gfb-wrap {
          position: relative;
          display: block;
          width: 100%;
          height: 380px;
          border-radius: 18px;
          overflow: hidden;
        }

        .gfb-image {
          transition: transform 700ms ease;
        }
        .gfb-wrap:hover .gfb-image {
          transform: scale(1.03);
        }

        .gfb-content {
          position: absolute;
          top: 50%;
          left: 24px;
          transform: translateY(-50%);
          z-index: 2;
          max-width: 75%;
        }
        .gfb-title {
          font-size: 24px;
          font-weight: 700;
          color: #0f3620;
          line-height: 1.22;
          margin: 0 0 12px;
          letter-spacing: -0.4px;
          white-space: pre-line;
        }
        .gfb-description {
          font-size: 13px;
          color: #27472a;
          line-height: 1.6;
          margin: 0 0 16px;
          max-width: 380px;
        }
        .gfb-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #0f3620;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 22px;
          border-radius: 40px;
          text-decoration: none;
          transition: background-color 250ms ease, transform 250ms ease, box-shadow 250ms ease;
        }
        .gfb-btn:hover {
          background-color: #072110;
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(0,0,0,0.18);
        }

        @media (min-width: 750px) {
          .gfb-wrap { height: 520px; }
          .gfb-content { left: 40px; max-width: 55%; }
          .gfb-title { font-size: 36px; margin-bottom: 18px; letter-spacing: -0.6px; }
          .gfb-description { font-size: 14px; line-height: 1.7; margin-bottom: 24px; }
          .gfb-btn { padding: 12px 28px; font-size: 14px; }
        }

        @media (min-width: 992px) {
          .gfb-wrap { height: 720px; }
          .gfb-content { left: 55px; max-width: 34%; }
          .gfb-title { font-size: 48px; margin-bottom: 24px; letter-spacing: -0.8px; }
          .gfb-description { font-size: 16px; margin-bottom: 32px; }
          .gfb-btn { padding: 14px 32px; font-size: 15px; }
        }

        @media (min-width: 1200px) {
          .gfb-title { font-size: 56px; }
          .gfb-description { font-size: 17px; }
        }
      `}</style>
    </section>
  );
}