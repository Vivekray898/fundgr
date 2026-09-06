'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PRODUCT = {
  title: 'Hearing Aid-Compatible AirPods',
  badges: ['Hearing Test', 'Hearing Aid'],
  price: 29.0,
  compareAtPrice: 35.0,
  rating: 4.8,
  reviewCount: 54,
  href: '/products/sp-hearing-aid-compatible',
  colors: [
    { name: 'White', value: '#f0f0f0' },
    { name: 'Black', value: '#1a1a1a' },
    { name: 'Blue', value: '#1a6fe8' },
  ],
  sizes: ['AirPods 4', 'AirPods Pro', 'AirPods Max'],
  images: [
    '/single -product/products/products-7.webp',
    '/single -product/products/products-1.webp',
    '/single -product/products/products-2.webp',
    '/single -product/products/products-3.webp',
    '/single -product/products/products-4.webp',
  ],
};

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? '#f5a623' : 'none'} stroke={filled ? 'none' : '#ccc'} strokeWidth={1.5} width={14} height={14}>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

export function SingleProductShowcase() {
  const [activeImg, setActiveImg] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [activeSize, setActiveSize] = useState(0);

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(PRODUCT.rating));

  return (
    <section className="spps-section">
      <div className="container-main spps-inner">
        {/* Left: image gallery */}
        <div className="spps-gallery">
          <div className="spps-main-img">
            <Image
              src={PRODUCT.images[activeImg]}
              alt={PRODUCT.title}
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 749px) 90vw, 42vw"
              priority
            />
          </div>
          <div className="spps-thumbs">
            {PRODUCT.images.map((src, i) => (
              <button
                key={i}
                className={`spps-thumb ${i === activeImg ? 'spps-thumb-active' : ''}`}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: product info */}
        <div className="spps-info">
          {/* Badges */}
          <div className="spps-badges">
            {PRODUCT.badges.map((b) => (
              <span key={b} className="spps-badge">{b}</span>
            ))}
          </div>

          <h2 className="spps-title">{PRODUCT.title}</h2>

          {/* Price */}
          <div className="spps-price-row">
            <span className="spps-price-compare">${PRODUCT.compareAtPrice.toFixed(2)}</span>
            <span className="spps-price">${PRODUCT.price.toFixed(2)}</span>
          </div>

          {/* Stars */}
          <div className="spps-stars">
            {stars.map((f, i) => <StarIcon key={i} filled={f} />)}
            <span className="spps-review-count">({PRODUCT.reviewCount} reviews)</span>
          </div>

          {/* Color picker */}
          <div className="spps-option-group">
            <p className="spps-option-label">Color: <strong>{PRODUCT.colors[activeColor].name}</strong></p>
            <div className="spps-colors">
              {PRODUCT.colors.map((c, i) => (
                <button
                  key={c.name}
                  className={`spps-color-swatch ${i === activeColor ? 'spps-color-active' : ''}`}
                  style={{ background: c.value }}
                  onClick={() => setActiveColor(i)}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size picker */}
          <div className="spps-option-group">
            <p className="spps-option-label">Model</p>
            <div className="spps-sizes">
              {PRODUCT.sizes.map((s, i) => (
                <button
                  key={s}
                  className={`spps-size-btn ${i === activeSize ? 'spps-size-active' : ''}`}
                  onClick={() => setActiveSize(i)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="spps-ctas">
            <button className="spps-btn-cart">
              <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} style={{ flexShrink: 0 }}>
                <path d="M4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V15H18.4399L20.4399 7H8.00488V5H21.7249C22.2772 5 22.7249 5.44772 22.7249 6C22.7249 6.08258 22.7149 6.16484 22.6951 6.24494L20.1951 16.245C20.0699 16.7399 19.6247 17.0828 19.115 17.0828H5.00488C4.4526 17.0828 4.00488 16.6351 4.00488 16.0828V16ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z" />
              </svg>
              Add to cart
            </button>
            <Link href={PRODUCT.href} className="spps-btn-buy">Buy it now</Link>
          </div>

          {/* Trust line */}
          <p className="spps-trust">🔒 Buying is always safe &amp; secure. Guaranteed safe checkout</p>

          {/* Availability */}
          <p className="spps-availability">
            <span className="spps-dot" />
            {PRODUCT.reviewCount} in stock
          </p>
        </div>
      </div>

      <style jsx>{`
        .spps-section {
          padding: clamp(48px, 6vw, 88px) 0;
          background: #fff;
        }
        .spps-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 4vw, 72px);
          align-items: start;
        }

        /* Gallery */
        .spps-gallery {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .spps-main-img {
          position: relative;
          height: clamp(280px, 36vw, 480px);
          border-radius: 12px;
          background: #f8f8f8;
          overflow: hidden;
        }
        .spps-thumbs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .spps-thumb {
          position: relative;
          width: 68px;
          height: 68px;
          border-radius: 8px;
          border: 2px solid transparent;
          background: #f4f4f4;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .spps-thumb-active {
          border-color: #1a6fe8;
        }

        /* Info */
        .spps-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .spps-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .spps-badge {
          font-size: 11px;
          font-weight: 600;
          background: #e8f0fe;
          color: #1a6fe8;
          padding: 3px 10px;
          border-radius: 20px;
        }
        .spps-title {
          font-size: clamp(18px, 2vw, 26px);
          font-weight: 700;
          color: #111;
          margin: 0;
          line-height: 1.25;
        }
        .spps-price-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .spps-price-compare {
          font-size: clamp(13px, 1.1vw, 16px);
          color: #999;
          text-decoration: line-through;
        }
        .spps-price {
          font-size: clamp(20px, 2vw, 28px);
          font-weight: 700;
          color: #e53935;
        }
        .spps-stars {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .spps-review-count {
          font-size: 12px;
          color: #888;
          margin-left: 6px;
        }
        .spps-option-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .spps-option-label {
          font-size: 13px;
          color: #555;
          margin: 0;
        }
        .spps-colors {
          display: flex;
          gap: 10px;
        }
        .spps-color-swatch {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          outline: 2px solid transparent;
          transition: outline-color 0.2s;
        }
        .spps-color-active {
          outline: 2px solid #1a6fe8;
          outline-offset: 2px;
        }
        .spps-sizes {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .spps-size-btn {
          font-size: 12px;
          padding: 6px 14px;
          border-radius: 6px;
          border: 1px solid #ddd;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .spps-size-active {
          border-color: #1a6fe8;
          background: #e8f0fe;
          color: #1a6fe8;
          font-weight: 600;
        }
        .spps-ctas {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 4px;
        }
        .spps-btn-cart {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          justify-content: center;
          background: #fff;
          border: 1px solid #1a6fe8;
          color: #1a6fe8;
          font-size: 14px;
          font-weight: 600;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          min-width: 140px;
        }
        .spps-btn-cart:hover {
          background: #1a6fe8;
          color: #fff;
        }
        .spps-btn-buy {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a6fe8;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          padding: 12px 20px;
          border-radius: 8px;
          text-decoration: none;
          min-width: 140px;
          transition: background 0.2s;
        }
        .spps-btn-buy:hover {
          background: #1559c0;
        }
        .spps-trust {
          font-size: 11px;
          color: #888;
          margin: 0;
        }
        .spps-availability {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #333;
          margin: 0;
        }
        .spps-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e53935;
          flex-shrink: 0;
        }

        @media (max-width: 749px) {
          .spps-inner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
