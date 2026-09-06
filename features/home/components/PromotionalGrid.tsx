'use client';

import Image from 'next/image';
import Link from 'next/link';

/* ── Remix Icon Arrow ── */
function IconArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

/* ── Shop Now text link ── */
function ShopNowLink() {
  return (
    <span
      className="shop-now-link"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '16px',
        fontWeight: 500,
        color: '#222',
      }}
    >
      Shop now
      <IconArrowRight size={14} />
    </span>
  );
}

export function PromotionalGrid() {
  return (
    <section>
      <div className="container-main">
        <div
          className="promo-grid-wrapper"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          {/* ═══════════════════════════════════════════
              LEFT SIDE — Large Banner (50%, 600px)
              ═══════════════════════════════════════════ */}
          <Link
            href="/shop"
            className="promo-card promo-grid-left"
            style={{
              position: 'relative',
              display: 'block',
              height: '600px',
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            {/* Background image */}
            <Image
              src="/fashion/banners/banners4.webp"
              alt="Top Fashion Deals"
              fill
              className="promo-card-img"
              style={{ objectFit: 'cover', objectPosition: 'right center', transition: 'transform 500ms ease' }}
              sizes="50vw"
            />

            {/* Content — 3 rows: badge top, title+desc center, button bottom */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                padding: '30px 36px',
                zIndex: 2,
              }}
            >
              {/* Top: POPULAR badge */}
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#fff',
                    color: '#222',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    padding: '7px 16px',
                  }}
                >
                  POPULAR
                </span>
              </div>

              {/* Center: Title + Description */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3
                  style={{
                    fontSize: '30px',
                    fontWeight: 700,
                    color: '#222',
                    lineHeight: 1.2,
                    marginBottom: '10px',
                  }}
                >
                  Top Fashion<br />Deals
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#555',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}
                >
                  SAVE UP TO $199 OFF, GET CHANCE!
                </p>
              </div>

              {/* Bottom: Button */}
              <div>
                <span className="promo-btn">
                  Shop Now
                  <IconArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>

          {/* ═══════════════════════════════════════════
              RIGHT SIDE — 2 rows
              ═══════════════════════════════════════════ */}
          <div className="promo-grid-right" style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '20px', height: '600px' }}>

            {/* ─── Top row: 2 equal cards ─── */}
            <div className="promo-grid-right-top" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

              {/* Trendy Eyewear */}
              <Link
                href="/shop?category=Accessories"
                className="promo-card"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <Image
                  src="/fashion/banners/banners5.webp"
                  alt="Trendy Eyewear"
                  fill
                  className="promo-card-img"
                  style={{ objectFit: 'cover', objectPosition: 'center', transition: 'transform 500ms ease' }}
                  sizes="25vw"
                />
                <div style={{ position: 'relative', zIndex: 2, padding: '24px 24px 0' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#222', lineHeight: 1.3 }}>
                    Trendy Eyewear
                  </h3>
                </div>
                <div style={{ position: 'relative', zIndex: 2, padding: '0 24px 24px' }}>
                  <ShopNowLink />
                </div>
              </Link>

              {/* Hottest Sneaker Trends */}
              <Link
                href="/shop?category=Activewear"
                className="promo-card"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <Image
                  src="/fashion/banners/banners6.webp"
                  alt="Hottest Sneaker Trends"
                  fill
                  className="promo-card-img"
                  style={{ objectFit: 'cover', objectPosition: 'center', transition: 'transform 500ms ease' }}
                  sizes="25vw"
                />
                <div style={{ position: 'relative', zIndex: 2, padding: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#222', lineHeight: 1.3, marginBottom: '6px' }}>
                    Hottest Sneaker Trends
                  </h3>
                  <ShopNowLink />
                </div>
              </Link>
            </div>

            {/* ─── Bottom row: Full-width card ─── */}
            <Link
              href="/shop?category=Accessories"
              className="promo-card"
              style={{
                position: 'relative',
                display: 'block',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Image
                src="/fashion/banners/banners7.webp"
                alt="Fashionable Bags"
                fill
                className="promo-card-img"
                style={{ objectFit: 'cover', objectPosition: 'center', transition: 'transform 500ms ease' }}
                sizes="50vw"
              />

              {/* Text on left */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  padding: '28px 32px',
                  maxWidth: '50%',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#222',
                      lineHeight: 1.3,
                      marginBottom: '10px',
                    }}
                  >
                    Fashionable Bags for<br />Every Day
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#555',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}
                  >
                    SAVE UP TO $199 OFF, GET CHANCE!
                  </p>
                </div>
                <div>
                  <ShopNowLink />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>

      {/* Hover effects */}
      <style>{`
        @media (max-width: 749px) {
          .promo-grid-wrapper { grid-template-columns: 1fr !important; }
          .promo-grid-left { height: clamp(230px, calc(89px + 44.2vw), 420px) !important; }
          .promo-grid-right { grid-template-rows: auto auto !important; height: auto !important; }
          .promo-grid-right-top { grid-template-columns: 1fr !important; }
          .promo-grid-right .promo-card { height: clamp(230px, calc(89px + 44.2vw), 420px) !important; }
          .promo-grid-left h3 { font-size: clamp(18px, 5vw, 28px) !important; }
          .promo-grid-right h3 { font-size: clamp(14px, 4vw, 22px) !important; }
        }
        @media (min-width: 750px) and (max-width: 991px) {
          .promo-grid-wrapper { grid-template-columns: 1fr !important; }
          .promo-grid-left { height: 420px !important; }
          .promo-grid-right { grid-template-rows: auto auto !important; height: auto !important; }
          .promo-grid-right .promo-card { height: 260px !important; }
        }

        .promo-card:hover .promo-card-img {
          transform: scale(1.05);
        }
        .promo-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #000;
          color: #fff;
          font-size: 15px;
          font-weight: 500;
          padding: 14px 28px;
          border-radius: 40px;
          transition: background-color 250ms ease;
        }
        .promo-btn:hover {
          background-color: #fc5732;
        }
      `}</style>
    </section>
  );
}
