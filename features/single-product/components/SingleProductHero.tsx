'use client';

import Image from 'next/image';
import Link from 'next/link';

export function SingleProductHero() {
  return (
    <section
      className="sph-section"
      style={{ position: 'relative', height: '780px', overflow: 'hidden' }}
    >
      {/* Image wrapper — absolute full-bleed bg on desktop; becomes a
          normal, sensibly-sized block above the content on mobile so the
          whole photo stays visible instead of being cropped to fill an
          oversized box. */}
      <div className="sph-img-wrap" style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/single -product/hero-slider/hero-banner-1.webp"
          alt="AirPods 4 — Experience Sound Like Never Before"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      {/* Text overlay — container-main provides gutters, inline position ensures SSR correctness */}
      <div
        className="sph-text-wrap container-main"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="sph-content"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '20px',
            maxWidth: '620px',
            animation: 'sphFadeIn 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
          }}
        >
          {/* "AirPods 4 $129" */}
          <p
            style={{
              fontSize: '18px',
              fontWeight: 400,
              color: 'rgba(17, 17, 17, 1)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            AirPods 4 $129
          </p>

          {/* "Experience Sound Like / Never Before" — exactly 2 lines via <br /> */}
          <h1
            style={{
              fontSize: '50px',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#111',
              margin: 0,
            }}
          >
            Experience{' '}
            <span style={{ color: '#1a6fe8' }}>Sound</span>{' '}
            Like
            <br />Never Before
          </h1>

          {/* "With Active Noise Cancellation $179" */}
          <p
            style={{
              fontSize: '18px',
              fontWeight: 400,
              color: 'rgba(17, 17, 17, 1)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            With Active Noise Cancellation $179
          </p>

          {/* "Shop Now" — all styles inline so they apply on SSR, no styled-jsx scoping risk */}
          <Link
            href="/shop"
            className="sph-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#1a6fe8',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              letterSpacing: '0.01em',
              padding: '15px 44px',
              borderRadius: '50px',
              textDecoration: 'none',
              minWidth: '175px',
              transition: 'background 0.25s ease, transform 0.2s ease',
            }}
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Plain <style> (no jsx) — only hover, @media overrides, and keyframes.
          All critical layout/color lives in inline styles above (SSR-safe). */}
      <style>{`
        @keyframes sphFadeIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sph-cta:hover {
          background: #1559c0 !important;
          transform: translateY(-1px);
        }
        @media (max-width: 991px) {
          .sph-section  { height: clamp(420px, 60vw, 640px) !important; }
          .sph-content  { max-width: 55% !important; }
          .sph-content h1 { font-size: clamp(30px, 4.5vw, 50px) !important; }
          .sph-content p  { font-size: clamp(14px, 2vw, 18px) !important; }
        }
        /* ── Mobile: image and content stack vertically instead of the
           content overlaying a cropped full-bleed photo — matches the
           other homepages' hero pattern. The image becomes a normal,
           un-cropped block-flow element with its own sensible height. ── */
        @media (max-width: 749px) {
          .sph-section {
            height: auto !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .sph-img-wrap {
            position: relative !important;
            inset: auto !important;
            width: 100% !important;
            height: clamp(240px, 58vw, 420px) !important;
            flex-shrink: 0 !important;
          }
          .sph-text-wrap {
            position: static !important;
            inset: auto !important;
            padding-top: 28px !important;
            padding-bottom: 32px !important;
          }
          .sph-content  { gap: 12px !important; max-width: 100% !important; }
          .sph-content h1 { font-size: clamp(20px, 5.5vw, 30px) !important; }
          .sph-content p  { font-size: clamp(12px, 3.2vw, 16px) !important; }
          .sph-cta {
            font-size: 13px !important;
            padding: 12px 28px !important;
            min-width: 130px !important;
          }
        }
      `}</style>
    </section>
  );
}
