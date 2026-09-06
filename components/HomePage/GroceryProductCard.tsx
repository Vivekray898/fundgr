// src/features/grocery-shop/components/GroceryProductCard.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import { useCompareStore } from '@/store/compareStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types/product';
import {
  Heart,
  GitCompare,
  Eye,
  ShoppingBag,
  Check,
} from 'lucide-react';

function IconHeart({ size = 18 }: { size?: number }) {
  return <Heart size={size} />;
}

function IconCompare({ size = 18 }: { size?: number }) {
  return <GitCompare size={size} />;
}

function IconEye({ size = 18 }: { size?: number }) {
  return <Eye size={size} />;
}

function IconBag({ size = 16 }: { size?: number }) {
  return <ShoppingBag size={size} />;
}

function IconCheck({ size = 18 }: { size?: number }) {
  return <Check size={size} />;
}

function useCountdown(active: boolean, countdownEnd?: string) {
  const [time, setTime] = useState({ days: 0, hrs: 0, min: 0, sec: 0 });
  
  useEffect(() => {
    if (!active || !countdownEnd) return;
    
    const target = new Date(countdownEnd).getTime();
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hrs: Math.floor((diff % 86400000) / 3600000),
        min: Math.floor((diff % 3600000) / 60000),
        sec: Math.floor((diff % 60000) / 1000),
      });
    };
    
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [active, countdownEnd]);
  
  return time;
}

interface GroceryProductCardProps {
  product: Product;
  /** Explicit countdown toggle. Falls back to `index === 0` when not provided. */
  showCountdown?: boolean;
  /** Used to auto-show countdown on the first item when `showCountdown` is undefined. */
  index?: number;
  /** Base href for the product detail page. Default: `/grocery/product`. */
  hrefBase?: string;
}

export function GroceryProductCard({
  product,
  showCountdown,
  index,
  hrefBase = '/grocery/product',
}: GroceryProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const hasCountdown = showCountdown ?? index === 0;
  const time = useCountdown(hasCountdown, product.countdownEnd);

  const { openQuickView } = useUIStore();
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const img1 = product.images[0]?.src ?? '';
  const img2 = product.images[1]?.src ?? img1;

  const badgeLabel =
    product.badge === 'sale' ? 'Sale'
    : product.badge === 'new' ? 'New'
    : product.badge === 'pre-order' ? 'Pre-order'
    : null;

  const productHref = `${hrefBase}/${product.slug}`;

  return (
    <div
      className="gfp-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={productHref} className="gfp-card-img-wrap" aria-label={product.name}>
        {badgeLabel && (
          <span className={`gfp-badge gfp-badge-${product.badge}`}>{badgeLabel}</span>
        )}
        <div className="gfp-img-inner">
          <Image
            src={img1}
            alt={product.name}
            fill
            style={{ objectFit: 'contain', transition: 'opacity 400ms ease', opacity: hovered ? 0 : 1 }}
            sizes="(min-width: 992px) 20vw, (min-width: 750px) 30vw, 45vw"
          />
          <Image
            src={img2}
            alt=""
            fill
            aria-hidden
            style={{ objectFit: 'contain', transition: 'opacity 400ms ease', opacity: hovered ? 1 : 0 }}
            sizes="(min-width: 992px) 20vw, (min-width: 750px) 30vw, 45vw"
          />
        </div>

        {hasCountdown && product.countdownEnd && (
          <div className="gfp-countdown">
            {[
              { v: time.days, l: 'Days' },
              { v: time.hrs, l: 'Hrs' },
              { v: time.min, l: 'Min' },
              { v: time.sec, l: 'Sec' },
            ].map((t) => (
              <div key={t.l} className="gfp-countdown-cell">
                <div className="gfp-countdown-v">{String(t.v).padStart(2, '0')}</div>
                <div className="gfp-countdown-l">{t.l}</div>
              </div>
            ))}
          </div>
        )}

        <div className="gfp-quick-actions">
          <div className="gfp-tooltip-wrap">
            <button
              aria-label="Wishlist"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  image: img1,
                  image2: img2,
                  slug: product.slug,
                  badge: product.badge,
                  colors: product.colors?.map((c) => ({ name: c.name, value: c.value })) || [],
                  vendor: product.vendor,
                });
              }}
              className={`gfp-action-btn ${inWishlist ? 'is-active' : ''}`}
            >
              <IconHeart size={18} />
            </button>
            <span className="gfp-tooltip">{inWishlist ? 'Already Wishlisted' : 'Wishlist'}</span>
          </div>
          <div className="gfp-tooltip-wrap">
            <button
              aria-label="Compare"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCompare(product);
              }}
              className={`gfp-action-btn ${inCompare ? 'is-active' : ''}`}
            >
              {inCompare ? <IconCheck size={18} /> : <IconCompare size={18} />}
            </button>
            <span className="gfp-tooltip">{inCompare ? 'Added' : 'Add to compare'}</span>
          </div>
          <div className="gfp-tooltip-wrap gfp-qv-wrap">
            <button
              aria-label="Quick view"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openQuickView(product);
              }}
              className="gfp-action-btn"
            >
              <IconEye size={18} />
            </button>
            <span className="gfp-tooltip">Quick view</span>
          </div>
        </div>
      </Link>

      <div className="gfp-mobile-actions">
        <button
          type="button"
          className="gfp-mob-btn"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickView(product); }}
          aria-label={`Add ${product.name} to cart`}
        >
          <IconBag size={18} />
        </button>
        <button
          type="button"
          className="gfp-mob-btn"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickView(product); }}
          aria-label={`Quick view ${product.name}`}
        >
          <IconEye size={18} />
        </button>
      </div>

      <div className="gfp-card-info">
        <Link href={productHref} className="gfp-card-name">{product.name}</Link>
        <div className="gfp-card-price">
          {product.compareAtPrice && (
            <span className="gfp-price-old">${product.compareAtPrice.toFixed(2)}</span>
          )}
          <span className={`gfp-price-new ${product.compareAtPrice ? 'is-sale' : ''}`}>
            ${product.price.toFixed(2)}
          </span>
        </div>
        <button
          className="gfp-quick-add"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openQuickView(product);
          }}
        >
          <IconBag size={20} />
          Quick Add
        </button>
      </div>

      <style>{`
        .gfp-card {
          position: relative;
          background-color: #fff;
          border: 1px solid #eee;
          border-radius: 10px;
          overflow: hidden;
          min-width: 0;
          transition: border-color 280ms ease;
        }
        .gfp-card:hover { border-color: #d8d8d8; }

        .gfp-card-img-wrap {
          display: block;
          position: relative;
          aspect-ratio: 1 / 1;
          background-color: #fff;
          overflow: hidden;
        }
        .gfp-img-inner {
          position: absolute;
          inset: 18px;
        }
        .gfp-img-inner img { transition: transform 500ms ease; }
        .gfp-card:hover .gfp-img-inner img { transform: scale(1.05); }

        .gfp-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 4px;
          z-index: 3;
          letter-spacing: 0.3px;
        }
        .gfp-badge-sale { background-color: #fef1e8; color: #d4822b; }
        .gfp-badge-new  { background-color: #2c6e3a; color: #fff; }
        .gfp-badge-pre-order { background-color: #eef2ff; color: #4338ca; }

        .gfp-countdown {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
          z-index: 3;
          transition: opacity 300ms ease;
        }
        .gfp-card:hover .gfp-countdown { opacity: 0; pointer-events: none; }
        .gfp-countdown-cell {
          background-color: #e5f3e8;
          color: #2c6e3a;
          border-radius: 4px;
          padding: 4px 7px;
          text-align: center;
          min-width: 34px;
          line-height: 1.2;
        }
        .gfp-countdown-v { font-size: 13px; font-weight: 700; }
        .gfp-countdown-l { font-size: 9px; opacity: 0.85; }

        .gfp-quick-actions {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 3;
          opacity: 0;
          transform: translateX(10px);
          transition: opacity 300ms ease, transform 300ms ease;
          pointer-events: none;
        }
        .gfp-card:hover .gfp-quick-actions {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
        }

        .gfp-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #fff;
          border: none;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 220ms ease, color 220ms ease, transform 220ms ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .gfp-action-btn:hover {
          background-color: #1B8057;
          color: #fff;
          transform: scale(1.08);
        }
        .gfp-action-btn.is-active {
          background-color: #1B8057;
          color: #fff;
        }

        .gfp-tooltip-wrap { position: relative; }
        .gfp-tooltip {
          position: absolute;
          right: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%) translateX(6px);
          background-color: #222;
          color: #fff;
          font-size: 11px;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 4px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 200ms ease, transform 200ms ease;
        }
        .gfp-tooltip-wrap:hover .gfp-tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        .gfp-card-info {
          padding: 12px 14px 14px;
          text-align: center;
        }
        .gfp-card-name {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: #222;
          margin-bottom: 6px;
          text-decoration: none;
          transition: color 200ms ease;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: -0.1px;
        }
        .gfp-card-name:hover { color: #1B8057; }

        .gfp-card-price {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .gfp-price-old {
          font-size: 12px;
          color: #aaa;
          text-decoration: line-through;
        }
        .gfp-price-new {
          font-size: 14px;
          font-weight: 700;
          color: #222;
        }
        .gfp-price-new.is-sale { color: #222; }

        .gfp-quick-add {
          width: 100%;
          height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 500;
          color: #2c6e3a;
          background-color: #dbeadd;
          padding: 0 18px;
          border-radius: 40px;
          border: none;
          cursor: pointer;
          transition: background-color 260ms ease, color 260ms ease;
        }
        .gfp-quick-add:hover {
          background-color: #14532d;
          color: #fff;
        }

        .gfp-mobile-actions { display: none; }

        @media (max-width: 749px) {
          .gfp-mobile-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-top: 1px solid #eee;
          }
          .gfp-mob-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 48px;
            background: transparent;
            border: none;
            color: #555;
            cursor: pointer;
            transition: color 200ms ease;
          }
          .gfp-mob-btn:first-child { border-right: 1px solid #eee; }
          .gfp-mob-btn:active { color: #1B8057; }
          .gfp-quick-actions {
            opacity: 1 !important;
            transform: translateX(0) !important;
            pointer-events: auto !important;
          }
          .gfp-qv-wrap { display: none; }
          .gfp-quick-add { display: none; }
        }

        @media (min-width: 750px) {
          .gfp-card-info { padding: 14px 16px 16px; }
          .gfp-card-name { font-size: 16px; }
          .gfp-price-new { font-size: 15px; }
        }

        @media (min-width: 992px) {
          .gfp-action-btn { width: 38px; height: 38px; }
          .gfp-quick-actions { top: 22px; right: 22px; gap: 14px; }
        }
      `}</style>
    </div>
  );
}