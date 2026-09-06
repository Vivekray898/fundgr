'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/features/products/hooks/useProducts';
import { HomeProductCard } from './HomeProductCard';
import { formatPrice } from '@/utils/formatPrice';

/* ── Nav Icons (same as Categories) ── */

function IconArrowLeftS({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
    </svg>
  );
}

function IconArrowRightS({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

/* ── Lookbook Pins ── */

const lookbookPins = [
  { id: 'pin-1', top: '15%', left: '40%', name: 'Striking Metallic Dress', price: 42.00, href: '/products/casual-chambray-shirt' },
  { id: 'pin-2', top: '35%', left: '12%', name: 'Classic Wrap Dress', price: 56.00, href: '/products/classic-wrap-dress' },
  { id: 'pin-3', top: '55%', left: '65%', name: 'Satin Symphony Skirt', price: 62.00, href: '/products/satin-symphony-skirt' },
  { id: 'pin-4', top: '75%', left: '45%', name: 'Red Maxi Dress', price: 38.00, href: '/products/red-maxi-dress' },
];

function LookbookPin({ pin }: { pin: typeof lookbookPins[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: 'absolute', top: pin.top, left: pin.left, zIndex: 5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        style={{
          width: '28px', height: '28px', borderRadius: '50%', border: '3px solid #fff',
          backgroundColor: hovered ? '#222' : 'rgba(0,0,0,0.5)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transition: 'background-color 250ms ease, transform 250ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff', display: 'block' }} />
      </button>

      <div
        style={{
          position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
          transform: `translateX(-50%) translateY(${hovered ? '0' : '6px'})`,
          backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          padding: '12px 16px', whiteSpace: 'nowrap',
          opacity: hovered ? 1 : 0, pointerEvents: hovered ? 'auto' : 'none',
          transition: 'opacity 250ms ease, transform 250ms ease', zIndex: 10,
        }}
      >
        <Link href={pin.href} style={{ textDecoration: 'none' }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#222', marginBottom: '2px' }}>{pin.name}</p>
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#F15B41' }}>{formatPrice(pin.price)}</p>
        </Link>
      </div>
    </div>
  );
}

/* ── Main Component ── */

export function ShopTheLook() {
  const { data } = useProducts({ limit: 20 });
  const allProducts = data?.products?.slice(8, 16) || [];

  const [currentPage, setCurrentPage] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const perPage = 2;
  const totalPages = Math.max(1, Math.ceil(allProducts.length / perPage));
  const visibleProducts = allProducts.slice(currentPage * perPage, currentPage * perPage + perPage);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    setAnimKey((k) => k + 1);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentPage((p) => (p - 1 + totalPages) % totalPages);
    setAnimKey((k) => k + 1);
  }, [totalPages]);

  const goNext = useCallback(() => {
    setCurrentPage((p) => (p + 1) % totalPages);
    setAnimKey((k) => k + 1);
  }, [totalPages]);

  return (
    <section className="stl-section">
      <div className="container-main">
        <div className="stl-grid" style={{ display: 'grid' }}>

          {/* ═══ LEFT ═══ */}
          <div>
            <div style={{ textAlign: 'left', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 600, color: '#222' }}>Shop the look</h2>
            </div>

            {/* Product cards with nav */}
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {visibleProducts.length > 0
                  ? visibleProducts.map((product, i) => (
                      <div key={`${product.id}-${animKey}`} className="stl-card-reveal" style={{ animationDelay: `${i * 100}ms` }}>
                        <HomeProductCard product={product} index={currentPage * perPage + i + 8} />
                      </div>
                    ))
                  : [1, 2].map((i) => (
                      <div key={i}>
                        <div className="animate-shimmer" style={{ aspectRatio: '3/4', borderRadius: '4px', marginBottom: '14px' }} />
                        <div className="animate-shimmer" style={{ height: '16px', width: '70%', margin: '0 auto 8px', borderRadius: '4px' }} />
                        <div className="animate-shimmer" style={{ height: '14px', width: '40%', margin: '0 auto', borderRadius: '4px' }} />
                      </div>
                    ))
                }
              </div>

              {/* Nav arrows — Categories style, appear on hover */}
              <button onClick={goPrev} aria-label="Previous" className="stl-nav-prev">
                <IconArrowLeftS size={20} />
              </button>
              <button onClick={goNext} aria-label="Next" className="stl-nav-next">
                <IconArrowRightS size={20} />
              </button>
            </div>

            {/* Pagination dots */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '28px' }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  aria-label={`Page ${i + 1}`}
                  style={{
                    width: currentPage === i ? '18px' : '10px',
                    height: currentPage === i ? '18px' : '10px',
                    borderRadius: '50%',
                    border: currentPage === i ? '1.5px solid #222' : 'none',
                    backgroundColor: 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, cursor: 'pointer', transition: 'all 300ms ease',
                  }}
                >
                  <span style={{
                    width: currentPage === i ? '8px' : '10px',
                    height: currentPage === i ? '8px' : '10px',
                    borderRadius: '50%',
                    backgroundColor: currentPage === i ? '#222' : '#bbb',
                    display: 'block', transition: 'all 300ms ease',
                  }} />
                </button>
              ))}
            </div>
          </div>

          {/* ═══ RIGHT: Lookbook Image ═══ */}
          <div className="stl-lookbook" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
            <Image
              src="/fashion/banners/banners8.png"
              alt="Shop the look"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
              sizes="50vw"
            />
            {lookbookPins.map((pin) => (
              <LookbookPin key={pin.id} pin={pin} />
            ))}
          </div>

        </div>
      </div>

      <style>{`
        .stl-grid {
          grid-template-columns: 1fr;
          gap: 32px;
        }
        .stl-lookbook {
          height: clamp(360px, 90vw, 600px);
        }

        @media (min-width: 992px) {
          .stl-grid { grid-template-columns: 1fr 1fr; gap: 24px; align-items: center; }
          .stl-lookbook { height: 1000px; }
        }

        .stl-card-reveal {
          animation: stlRevealUp 600ms ease-out both;
        }
        @keyframes stlRevealUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stl-nav-prev,
        .stl-nav-next {
          position: absolute;
          top: 40%;
          transform: translateY(-50%);
          z-index: 10;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid #e0e0e0;
          background-color: #fff;
          color: #222;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 400ms ease, transform 400ms ease, background-color 250ms ease, border-color 250ms ease, color 250ms ease;
        }
        .stl-nav-prev { left: 8px; transform: translateY(-50%); }
        .stl-nav-next { right: 8px; transform: translateY(-50%); }

        .stl-section:hover .stl-nav-prev { opacity: 1; }
        .stl-section:hover .stl-nav-next { opacity: 1; }

        .stl-nav-prev:hover,
        .stl-nav-next:hover { background-color: #000; border-color: #000; color: #fff; }
      `}</style>
    </section>
  );
}
