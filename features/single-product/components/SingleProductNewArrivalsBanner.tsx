'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

function IconArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

function IconPlay({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

const VIDEO_SRC = '/single -product/vedio/vedio-1.mp4';
const VIDEO_THUMB = '/single -product/promo-banner-img/promo-baner-1.avif';

const thumbs = [
  { src: '/single -product/products/products-1.webp', alt: 'AirPods Galaxy Pro' },
  { src: '/single -product/products/products-3.webp', alt: 'AirPods Infinite Max' },
  { src: '/single -product/products/products-5.webp', alt: 'AirPods Pro 2' },
];

export function SingleProductNewArrivalsBanner() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play().catch(() => {});
    }
  }, [isPlaying]);

  return (
    <section className="spna-section">
      <div className="container-main">
        <div
          className="spna-card"
          style={{
            backgroundColor: '#1a6fe8',
            borderRadius: 16,
            overflow: 'hidden',
            height: 220,
            display: 'flex',
            alignItems: 'center',
            paddingInline: 'clamp(20px, 2vw, 40px)',
          }}
        >
          <div className="spna-row">

            {/* ── LEFT: video + New Arrivals ── */}
            <div className="spna-left">
              <div
                className="spna-video"
                style={{
                  position: 'relative',
                  width: 300,
                  height: 160,
                  borderRadius: 12,
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: '#000',
                }}
              >
                {!isPlaying ? (
                  <>
                    <Image
                      src={VIDEO_THUMB}
                      alt="New arrivals video preview"
                      fill
                      sizes="300px"
                      style={{ objectFit: 'cover' }}
                    />
                    <button
                      className="spna-play"
                      onClick={() => setIsPlaying(true)}
                      aria-label="Play video"
                    >
                      <IconPlay size={26} />
                    </button>
                  </>
                ) : (
                  <video
                    ref={videoRef}
                    src={VIDEO_SRC}
                    controls
                    playsInline
                    onEnded={() => setIsPlaying(false)}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                )}
              </div>

              <div className="spna-text">
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: '#fff',
                    margin: '0 0 10px',
                    letterSpacing: '-0.2px',
                  }}
                >
                  New Arrivals
                </h3>
                <p
                  className="spna-desc"
                  style={{
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.85)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Discover new arrivals with a 15% discount on fresh products!
                </p>
              </div>
            </div>

            {/* ── RIGHT: three images + Weekend Deal ── */}
            <div className="spna-right">
              <div className="spna-thumbs">
                {thumbs.map((t) => (
                  <span key={t.src} className="spna-thumb">
                    <Image
                      src={t.src}
                      alt={t.alt}
                      fill
                      sizes="80px"
                      style={{ objectFit: 'contain' }}
                    />
                  </span>
                ))}
              </div>

              <div className="spna-text">
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: '0 0 8px' }}>
                  Special Weekend Deal
                </h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: '0 0 8px' }}>
                  Save an Extra 20%!
                </p>
                <Link
                  href="/shop"
                  className="spna-cta"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#fff',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                    transition: 'opacity 200ms ease',
                  }}
                >
                  <span>Shop Now</span>
                  <IconArrowRight />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .spna-row {
          display: flex;
          align-items: center;
          gap: clamp(20px, 2.4vw, 40px);
          width: 100%;
        }

        .spna-left {
          flex: 1 1 0;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: clamp(16px, 1.6vw, 28px);
        }

        .spna-right {
          flex: 1 1 0;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: clamp(20px, 2vw, 32px);
          justify-content: flex-end;
        }

        .spna-thumbs {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .spna-thumb {
          position: relative;
          width: 80px;
          height: 80px;
          background: #fff;
          border-radius: 6px;
          overflow: hidden;
          padding: 8px;
          box-sizing: border-box;
          display: block;
        }

        .spna-text { min-width: 0; }

        .spna-cta:hover { opacity: 0.8; }

        .spna-desc {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Play button */
        .spna-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
          border: 2px solid rgba(255, 255, 255, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          padding-left: 4px;
          backdrop-filter: blur(2px);
          transition: background 220ms ease, transform 220ms ease;
          cursor: pointer;
        }
        .spna-video:hover .spna-play {
          background: rgba(255, 255, 255, 0.32);
          transform: translate(-50%, -50%) scale(1.06);
        }

        /* Tablet */
        @media (max-width: 991px) {
          .spna-card {
            height: auto !important;
            padding: 28px clamp(16px, 3vw, 32px) !important;
          }
          .spna-row {
            flex-direction: column;
            align-items: stretch;
            gap: 28px;
          }
          .spna-right { justify-content: flex-start; }
        }

        /* Mobile */
        @media (max-width: 749px) {
          .spna-row {
            flex-direction: column;
            align-items: center;
            gap: 20px;
            text-align: center;
          }
          .spna-left,
          .spna-right {
            flex-direction: column;
            align-items: center;
            gap: 14px;
            width: 100%;
          }
          .spna-thumbs { justify-content: center; }
          .spna-text   { text-align: center; }
          .spna-video  {
            width: 100% !important;
            max-width: 100% !important;
            height: clamp(160px, 45vw, 220px) !important;
          }
        }
      `}</style>
    </section>
  );
}
