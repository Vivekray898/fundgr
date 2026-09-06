'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/* ── Arrow Icon ── */

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

/* ── Tab Data ── */

const tabs = [
  {
    id: 'bomber',
    title: 'The Bomber Jackets',
    description: 'A bomber jacket is a short, waist-length jacket with a fitted or elastic waistband and cuffs. Typically featuring a front zipper, the jacket is often made from leather.',
    mediaType: 'image' as const,
    mediaSrc: '/fashion/tab/tab1.webp',
  },
  {
    id: 'sweaters',
    title: 'Sweaters & Cardigans',
    description: 'Cozy and versatile sweaters and cardigans perfect for layering. Made from premium knit fabrics with modern silhouettes and classic comfort.',
    mediaType: 'video' as const,
    mediaSrc: 'https://www.youtube.com/embed/RgKAFK5djSk',
  },
  {
    id: 'corduroy',
    title: 'Corduroy Shirts',
    description: 'Classic corduroy shirts with a soft, ribbed texture. Perfect for casual and semi-formal occasions, offering both style and comfort in every season.',
    mediaType: 'image' as const,
    mediaSrc: '/fashion/tab/tab2.webp',
  },
];

/* ── Component ── */

export function TabContentSection() {
  const [activeTab, setActiveTab] = useState(0);
  const currentTab = tabs[activeTab];

  return (
    <section>
      <div className="container-main">
        <div className="tab-grid">

          {/* ═══ LEFT: Media (750px height) ═══ */}
          <div className="tab-media" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f5f5f5', borderRadius: '12px' }}>
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
                {tab.mediaType === 'image' ? (
                  <Image
                    src={tab.mediaSrc}
                    alt={tab.title}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    sizes="50vw"
                  />
                ) : (
                  <iframe
                    src={tab.mediaSrc}
                    title={tab.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ═══ RIGHT: Content (vertically centered, 750px) ═══ */}
          <div
            className="tab-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Tab list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', marginBottom: '32px' }}>
              {tabs.map((tab, i) => (
                <div
                  key={tab.id}
                  onMouseEnter={() => setActiveTab(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 0',
                    borderBottom: '1px solid #e5e5e5',
                    cursor: 'pointer',
                    transition: 'all 250ms ease',
                  }}
                >
                  <h3
                    style={{
                      fontSize: 'clamp(18px, 4vw, 28px)',
                      fontWeight: 600,
                      color: activeTab === i ? '#222' : '#888',
                      transition: 'color 250ms ease',
                    }}
                  >
                    {tab.title}
                  </h3>

                  <span
                    className="tab-arrow-btn"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: activeTab === i ? 'none' : '1.5px solid #e0e0e0',
                      backgroundColor: activeTab === i ? '#000' : 'transparent',
                      color: activeTab === i ? '#fff' : '#222',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 300ms ease',
                    }}
                  >
                    <IconArrowUpRight size={18} />
                  </span>
                </div>
              ))}
            </div>

            {/* Description — fades with tab change */}
            <div style={{ position: 'relative', minHeight: '80px', marginBottom: '32px' }}>
              {tabs.map((tab, i) => (
                <p
                  key={tab.id}
                  style={{
                    position: i === 0 ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    fontSize: '15px',
                    color: '#777',
                    lineHeight: 1.7,
                    transition: 'opacity 500ms ease, transform 500ms ease',
                    opacity: activeTab === i ? 1 : 0,
                    transform: activeTab === i ? 'translateY(0)' : 'translateY(8px)',
                    pointerEvents: activeTab === i ? 'auto' : 'none',
                  }}
                >
                  {tab.description}
                </p>
              ))}
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href="/shop"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#000',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 500,
                  padding: '14px 28px',
                  borderRadius: '40px',
                  textDecoration: 'none',
                  transition: 'background-color 250ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fc5732'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#000'; }}
              >
                Shop Collection
                <IconArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .tab-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        .tab-media {
          height: clamp(300px, 80vw, 500px);
        }
        .tab-content {
          padding: 32px 0 0;
        }

        @media (min-width: 750px) {
          .tab-media { height: 600px; }
          .tab-content { padding: 24px 0 0 40px; }
        }

        @media (min-width: 992px) {
          .tab-grid { grid-template-columns: 1fr 1fr; }
          .tab-media { height: 750px; }
          .tab-content { height: 750px; padding: 0 40px 0 60px; }
        }
      `}</style>
    </section>
  );
}
