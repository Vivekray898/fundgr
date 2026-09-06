'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function IconPlay({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

function IconClose({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z" />
    </svg>
  );
}

function IconArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
    </svg>
  );
}

function IconArrowUpRight({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z" />
    </svg>
  );
}

const tabs = [
  {
    id: 'indoor-plants',
    title: 'The Indoor Plants',
    description: 'Hand-picked indoor plants that thrive in any light and any space. From trailing pothos to statement monstera, our indoor collection brings life and calm to every corner of your home.',
    mediaType: 'image' as const,
    mediaSrc: '/plant-and-garden/tab/tab1.webp',
  },
  {
    id: 'outdoor-garden',
    title: 'Outdoor Garden Range',
    description: 'Premium outdoor plants, pots, and garden accessories designed to transform your backyard or balcony into a lush, green retreat — whatever the season.',
    mediaType: 'image' as const,
    mediaSrc: '/plant-and-garden/tab/tab2.webp',
  },
  {
    id: 'seeds-bulbs',
    title: 'Seeds & Bulbs',
    description: 'Grow your dream garden from scratch with our hand-selected seeds and bulbs, chosen for reliable germination and vibrant results season after season.',
    mediaType: 'image' as const,
    mediaSrc: '/plant-and-garden/tab/tab3.webp',
  },
];

const YOUTUBE_ID = '_9VUPq3SxOc';

export function PlantGardenTabSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setVideoOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [videoOpen]);

  return (
    <section className="pg-tab-section">
      <div className="container-main">
        <div className="pg-tab-grid">

          {/* ═══ LEFT — stacked media layers, one per tab ═══ */}
          <div className="pg-tab-media">
            {tabs.map((tab, i) => (
              <div
                key={tab.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  transition: 'opacity 600ms ease, transform 600ms ease',
                  opacity: activeTab === i ? 1 : 0,
                  transform: activeTab === i ? 'scale(1)' : 'scale(1.03)',
                  pointerEvents: activeTab === i ? 'auto' : 'none',
                  zIndex: activeTab === i ? 2 : 1,
                }}
              >
                <Image
                  src={tab.mediaSrc}
                  alt={tab.title}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  sizes="(max-width: 749px) 100vw, 50vw"
                  priority={i === 0}
                />
                {i === 2 && (
                  <button
                    type="button"
                    className="pg-tab-play-btn"
                    onClick={() => setVideoOpen(true)}
                    aria-label="Play video"
                  >
                    <IconPlay size={32} />
                  </button>
                )}
              </div>
            ))}

            {/* In-place video layer — sits inside the media column */}
            <div
              className="pg-tab-video-layer"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                opacity: videoOpen ? 1 : 0,
                pointerEvents: videoOpen ? 'auto' : 'none',
                transition: 'opacity 300ms ease',
                background: '#000',
              }}
            >
              {videoOpen && (
                <iframe
                  src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
                  title="Garden video"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                />
              )}
              <button
                type="button"
                className="pg-tab-video-close"
                onClick={() => setVideoOpen(false)}
                aria-label="Close video"
              >
                <IconClose size={18} />
              </button>
            </div>
          </div>

          {/* ═══ RIGHT — vertically centred content ═══ */}
          <div className="pg-tab-content">

            {/* Tab rows — hover triggers setActiveTab(i) */}
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '32px' }}>
              {tabs.map((tab, i) => (
                <div
                  key={tab.id}
                  onMouseEnter={() => setActiveTab(i)}
                  className="pg-tab-row"
                >
                  <h3 className={`pg-tab-title${activeTab === i ? ' is-active' : ''}`}>
                    {tab.title}
                  </h3>
                  <span className={`pg-tab-arrow-btn${activeTab === i ? ' is-active' : ''}`}>
                    <IconArrowUpRight size={18} />
                  </span>
                </div>
              ))}
            </div>

            {/* Description — stacked; i===0 stays position:relative to hold container height */}
            <div style={{ position: 'relative', minHeight: '80px', marginBottom: '32px' }}>
              {tabs.map((tab, i) => (
                <p
                  key={tab.id}
                  className="pg-tab-desc"
                  style={{
                    position: i === 0 ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    opacity: activeTab === i ? 1 : 0,
                    transform: activeTab === i ? 'translateY(0)' : 'translateY(8px)',
                    pointerEvents: activeTab === i ? 'auto' : 'none',
                  }}
                >
                  {tab.description}
                </p>
              ))}
            </div>

            {/* CTA */}
            <div>
              <Link href="/plant-garden/shop" className="pg-tab-cta">
                Shop Collection
                <IconArrowRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        /* ── Base (desktop-first, 750px height) ── */
        .pg-tab-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }
        .pg-tab-media {
          position: relative;
          height: 750px;
          overflow: hidden;
          background-color: #f5f5f5;
          border-radius: 12px;
        }
        .pg-tab-content {
          height: 750px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 60px;
          padding-right: 40px;
        }

        /* Tab rows */
        .pg-tab-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          border-bottom: 1px solid #e5e5e5;
          cursor: pointer;
          transition: all 250ms ease;
        }
        .pg-tab-title {
          font-size: 28px;
          font-weight: 600;
          color: #888;
          transition: color 250ms ease;
        }
        .pg-tab-title.is-active { color: #222; }

        /* Arrow button */
        .pg-tab-arrow-btn {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 50%;
          border: 1.5px solid #e0e0e0;
          background-color: transparent;
          color: #222;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 300ms ease;
        }
        .pg-tab-arrow-btn.is-active {
          background-color: #3a7d44;
          border-color: #3a7d44;
          color: #fff;
        }

        /* Description */
        .pg-tab-desc {
          font-size: 15px;
          color: #777;
          line-height: 1.7;
          margin: 0;
          transition: opacity 500ms ease, transform 500ms ease;
        }

        /* CTA pill */
        .pg-tab-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #111;
          color: #fff;
          font-size: 15px;
          font-weight: 500;
          padding: 14px 28px;
          border-radius: 40px;
          text-decoration: none;
          transition: background-color 250ms ease;
        }
        .pg-tab-cta:hover { background-color: #3a7d44; }

        /* ── ≤749px — single column stack ── */
        @media (max-width: 749px) {
          .pg-tab-grid { grid-template-columns: 1fr; }
          .pg-tab-media {
            height: clamp(260px, 55vw, 420px);
            border-radius: 8px;
          }
          .pg-tab-content {
            height: auto;
            padding-left: 0;
            padding-right: 0;
            padding-top: 24px;
          }
          .pg-tab-title { font-size: clamp(18px, 4.5vw, 24px); }
          .pg-tab-desc { font-size: 14px; }
        }

        /* ── 750–991px tablet — tighten right-column padding ── */
        @media (min-width: 750px) and (max-width: 991px) {
          .pg-tab-content {
            padding-left: 32px;
            padding-right: 20px;
          }
          .pg-tab-title { font-size: 22px; }
        }

        /* Play button overlay */
        .pg-tab-play-btn {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 3;
        }
        .pg-tab-play-btn::before {
          content: '';
          position: absolute;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          transition: transform 250ms ease, background 250ms ease;
        }
        .pg-tab-play-btn svg {
          position: relative;
          z-index: 1;
          color: #111;
          transition: color 250ms ease;
        }
        .pg-tab-play-btn:hover::before {
          transform: scale(1.1);
          background: #3a7d44;
        }
        .pg-tab-play-btn:hover svg { color: #fff; }

        /* In-place video close button */
        .pg-tab-video-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.5);
          background: rgba(0,0,0,0.45);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 11;
          transition: background 250ms ease, border-color 250ms ease;
        }
        .pg-tab-video-close:hover {
          background: #3a7d44;
          border-color: #3a7d44;
        }
      `}</style>
    </section>
  );
}
