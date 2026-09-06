// src/features/products/components/ProductDetailContent.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { useProducts } from '@/features/products/hooks/useProducts';
import { formatPrice } from '@/utils/formatPrice';
import { calculateDiscount } from '@/utils/calculateDiscount';
import { FeaturedSlider } from '@/features/home/components/FeaturedSlider';
import { GroceryFeaturedSlider } from '@/features/grocery-shop/components/GroceryFeaturedSlider';
import { TrustBadges } from '@/components/shared/TrustBadges';
import { HomeProductCard } from '@/features/home/components/HomeProductCard';
import { GroceryProductCard } from '@/features/grocery-shop/components/GroceryProductCard';
import type { Product } from '@/types/product';

// ─────────────────────────────────────────────
// Import sub-components
// ─────────────────────────────────────────────
import {
  IconBag,
  IconChevronDown,
  IconArrowLeft,
  IconArrowRight,
  ProductGallery,
  ProductInfoAccordion,
  FaqAccordion,
  PairsWellWith,
} from './ProductDetailSubComponents';

/* ══════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════ */

interface ProductDetailContentProps {
  /** The product data to display */
  product: Product;
  /** Base href for related product cards. Default: "/products". */
  productHrefBase?: string;
  /** Which product card design to render for related/recently viewed. Default: "home". */
  cardVariant?: 'home' | 'grocery';
}

export function ProductDetailContent({
  product,
  productHrefBase = '/products',
  cardVariant = 'home',
}: ProductDetailContentProps) {
  const { addItem } = useCartStore();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();

  // Fetch related products for "Pairs well with" and "Recently viewed"
  const { data: relatedData } = useProducts({ limit: 10, sort: 'best-selling' });

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [stickyCartVisible, setStickyCartVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const addToCartRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const footerObserverRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(product.sizes[0] || '');
    }
  }, [product]);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(footer);
    footerObserverRef.current = observer;
    return () => observer.disconnect();
  }, []);

  const addToCartCallbackRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (node) {
      addToCartRef.current = node;
      const observer = new IntersectionObserver(
        ([entry]) => setStickyCartVisible(!entry.isIntersecting),
        { threshold: 0 }
      );
      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  if (!product) {
    return (<div className="container-main" style={{ padding: '60px 0', textAlign: 'center', fontSize: '16px', color: '#888' }}>Product not found</div>);
  }

  const activeColor = selectedColor || product.colors[0]?.name || '';
  const activeSize = selectedSize || product.sizes[0] || '';
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const relatedProducts = relatedData?.products?.slice(0, 6) || [];

  // ─────────────────────────────────────────────
  // ✅ Build accordion items from Sanity data
  // ─────────────────────────────────────────────
  const accordionItems = (product.accordionSections || [])
    .filter(section => section.enabled !== false)
    .map(section => ({
      title: section.title,
      content: section.content || (section.title === 'Description' ? product.description : ''),
    }));

  // ─────────────────────────────────────────────
  // ✅ Build FAQ items from Sanity data
  // ─────────────────────────────────────────────
  const faqItems = (product.faqSections || [])
    .filter(faq => faq.enabled !== false)
    .map(faq => ({
      question: faq.question,
      answer: faq.answer,
    }));

  const handleWishlistClick = () => {
    setWishlistLoading(true);
    setTimeout(() => {
      toggleWishlist({ productId: product.id, name: product.name, price: product.price, compareAtPrice: product.compareAtPrice, image: product.images[0]?.src || '', image2: product.images[1]?.src || '', slug: product.slug, badge: product.badge, colors: product.colors.map(c => ({ name: c.name, value: c.value })), vendor: product.vendor });
      setWishlistLoading(false);
    }, 500);
  };

  const handleCompareClick = () => {
    setCompareLoading(true);
    setTimeout(() => {
      toggleCompare(product);
      setCompareLoading(false);
    }, 500);
  };

  const handleAddToCart = () => {
    const variant = product.variants.find(v => v.color === activeColor && v.size === activeSize) || product.variants[0];
    if (!variant) return;
    setAddingToCart(true);
    setTimeout(() => {
      addItem({ productId: product.id, variantId: variant.id, name: product.name, slug: product.slug, image: variant.image, color: activeColor, size: activeSize, price: product.price, compareAtPrice: product.compareAtPrice, quantity, vendor: product.vendor });
      setAddingToCart(false);
    }, 800);
  };

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="container-main" style={{ paddingBlock: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <Link href="/" style={{ color: '#777', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Home</Link>
          <span style={{ color: '#bbb', fontSize: '11px' }}>›</span>
          <span style={{ color: '#222' }}>{product.name}</span>
        </div>
      </div>

      {/* ── Product Section ── */}
      <div className="container-main pdp-product-section">
        <div className="pdp-product-grid">

          <div className="pdp-product-gallery-col">
            <div className="pdp-gallery-sticky">
              <ProductGallery images={product.images} onActiveChange={setActiveGalleryIndex} />
            </div>
          </div>

          <div className="pdp-product-info">
            <div>
              <p className="pdp-info-vendor" style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>{product.vendor}</p>
              <h1 className="pdp-info-title" style={{ fontSize: '32px', fontWeight: 600, color: '#222', marginBottom: '12px' }}>{product.name}</h1>

              <div className="pdp-info-rating" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                {Array.from({ length: 5 }).map((_, i) => (<span key={i} className="pdp-info-star" style={{ fontSize: '16px', color: i < Math.floor(product.rating) ? '#F5C518' : '#ddd' }}>★</span>))}
                <span className="pdp-info-review-count" style={{ fontSize: '14px', color: '#888' }}>{product.reviewCount} Reviews</span>
              </div>

              <div className="pdp-info-price-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                {product.compareAtPrice && <span className="pdp-info-compare-at" style={{ fontSize: '18px', color: '#999', textDecoration: 'line-through' }}>{formatPrice(product.compareAtPrice)}</span>}
                <span className="pdp-info-price" style={{ fontSize: '24px', fontWeight: 700, color: '#222' }}>{formatPrice(product.price)}</span>
                {product.badge === 'sale' && <span style={{ backgroundColor: '#F15B41', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '3px' }}>Sale</span>}
                {discount > 0 && <span style={{ backgroundColor: '#222', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '3px' }}>-{discount}%</span>}
              </div>

              <p className="pdp-info-description" style={{ fontSize: '15px', color: '#666', lineHeight: 1.7, marginBottom: '24px' }}>{product.description}</p>

              {product.colors.length > 0 && (
                <div className="pdp-info-color" style={{ marginBottom: '20px' }}>
                  <p className="pdp-info-field-label" style={{ fontSize: '15px', fontWeight: 600, color: '#222', marginBottom: '10px' }}>Color: <span style={{ fontWeight: 400, color: '#555' }}>{activeColor}</span></p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {product.colors.map((c) => (
                      <button key={c.name} onClick={() => setSelectedColor(c.name)} className="pdp-info-color-swatch" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: c.value, border: activeColor === c.name ? '3px solid #222' : '2px solid #e0e0e0', cursor: 'pointer', transition: 'border-color 200ms ease' }} aria-label={c.name} />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes.length > 0 && (
                <div className="pdp-info-size" style={{ marginBottom: '20px' }}>
                  <p className="pdp-info-field-label" style={{ fontSize: '15px', fontWeight: 600, color: '#222', marginBottom: '10px' }}>Size: <span style={{ fontWeight: 400, color: '#555' }}>{activeSize}</span></p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.sizes.map((s) => (
                      <button key={s} onClick={() => setSelectedSize(s)} className="pdp-info-size-btn" style={{ minWidth: '44px', height: '44px', padding: '0 14px', borderRadius: '4px', fontSize: '14px', fontWeight: 500, border: activeSize === s ? '2px solid #222' : '1px solid #e0e0e0', backgroundColor: activeSize === s ? '#222' : '#fff', color: activeSize === s ? '#fff' : '#222', cursor: 'pointer', transition: 'all 200ms ease' }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={addToCartCallbackRef} className="pdp-info-qty-block" style={{ marginBottom: '16px' }}>
                <p className="pdp-info-field-label" style={{ fontSize: '15px', fontWeight: 600, color: '#222', marginBottom: '10px' }}>Quantity</p>
                <div className="pdp-info-qty-row" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className="pdp-qty-stepper" style={{ display: 'inline-flex', border: '1px solid #e5e5e5', borderRadius: '4px' }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="pdp-qty-step-btn" style={{ width: '40px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#222' }}>−</button>
                    <span className="pdp-qty-value" style={{ width: '40px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 500, borderLeft: '1px solid #e5e5e5', borderRight: '1px solid #e5e5e5' }}>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="pdp-qty-step-btn" style={{ width: '40px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#222' }}>+</button>
                  </div>
                  <button onClick={handleAddToCart} disabled={addingToCart} className="pdp-add-to-cart-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px 0', backgroundColor: addingToCart ? '#555' : '#222', color: '#fff', fontSize: '16px', fontWeight: 600, border: 'none', borderRadius: '0', cursor: addingToCart ? 'wait' : 'pointer', transition: 'background-color 250ms ease', opacity: addingToCart ? 0.8 : 1 }}
                    onMouseEnter={(e) => { if (!addingToCart) e.currentTarget.style.backgroundColor = '#F15B41'; }}
                    onMouseLeave={(e) => { if (!addingToCart) e.currentTarget.style.backgroundColor = '#222'; }}
                  >{addingToCart ? 'Adding...' : <><IconBag size={18} /> Add to cart</>}</button>
                </div>
              </div>

              <button className="pdp-buy-now-btn" style={{ width: '100%', padding: '14px 0', backgroundColor: '#fff', color: '#222', fontSize: '16px', fontWeight: 600, border: '1.5px solid #222', borderRadius: '0', cursor: 'pointer', marginBottom: '20px', transition: 'all 250ms ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#222'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#222'; }}
              >Buy it now</button>

              <div className="pdp-info-actions-row" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                <button
                  onClick={handleWishlistClick}
                  disabled={wishlistLoading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: wishlistLoading ? 'wait' : 'pointer', color: inWishlist ? '#F15B41' : '#555', fontSize: '16px', padding: 0, transition: 'color 200ms ease', opacity: wishlistLoading ? 0.5 : 1 }}
                >
                  {wishlistLoading ? (
                    <span className="pdp-btn-spinner" style={{ width: '18px', height: '18px' }} />
                  ) : inWishlist ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18">
                      <path fill="currentColor" d="M417.84 448a15.94 15.94 0 01-11.35-4.72L40.65 75.26a16 16 0 0122.7-22.56l365.83 368a16 16 0 01-11.34 27.3zM364.92 80c-48.09 0-80 29.55-96.92 51-16.88-21.48-48.83-51-96.92-51a107.37 107.37 0 00-31 4.55L168 112c22.26 0 45.81 9 63.94 26.67a123 123 0 0121.75 28.47 16 16 0 0028.6 0 123 123 0 0121.77-28.51C322.19 121 342.66 112 364.92 112c43.15 0 78.62 36.33 79.07 81 .54 53.69-22.75 99.55-57.38 139.52l22.63 22.77c3-3.44 5.7-6.64 8.14-9.6 40-48.75 59.15-98.8 58.61-153C475.37 130.52 425.54 80 364.92 80zM268 432C180.38 372.51 91 297.6 92 193a83.69 83.69 0 012.24-18.39L69 149.14a115.1 115.1 0 00-9 43.49c-.54 54.22 18.63 104.27 58.61 153 18.77 22.87 52.8 59.45 131.39 112.8a31.84 31.84 0 0036 0c20.35-13.81 37.7-26.5 52.58-38.11l-22.66-22.81C300.25 409.6 284.09 421.05 268 432z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18">
                      <path fill="currentColor" d="M462.3 62.7c-54.5-46.4-136-38.7-186.6 13.5L256 96.6l-19.7-20.3C195.5 34.1 113.2 8.7 49.7 62.7c-62.8 53.6-66.1 149.8-9.9 207.8l193.5 199.8c6.2 6.4 14.4 9.7 22.6 9.7 8.2 0 16.4-3.2 22.6-9.7L472 270.5c56.4-58 53.1-154.2-9.7-207.8zm-13.1 185.6L256.4 448.1 62.8 248.3c-38.4-39.6-46.4-115.1 7.7-161.2 54.8-46.8 119.2-12.9 142.8 11.5l42.7 44.1 42.7-44.1c23.2-24 88.2-58 142.8-11.5 54 46 46.1 121.5 7.7 161.2z" />
                    </svg>
                  )}
                  {wishlistLoading ? 'Loading...' : inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
                <button
                  onClick={handleCompareClick}
                  disabled={compareLoading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: compareLoading ? 'wait' : 'pointer', color: inCompare ? '#F15B41' : '#555', fontSize: '16px', padding: 0, transition: 'color 200ms ease', opacity: compareLoading ? 0.5 : 1 }}
                >
                  {compareLoading ? (
                    <span className="pdp-btn-spinner" style={{ width: '18px', height: '18px' }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="17" y1="3" x2="17" y2="21" />
                      <path d="M10 18l-3 3l-3 -3" />
                      <line x1="7" y1="21" x2="7" y2="3" />
                      <path d="M20 6l-3 -3l-3 3" />
                    </svg>
                  )}
                  {compareLoading ? 'Loading...' : inCompare ? 'Remove from Compare' : 'Add to Compare'}
                </button>
              </div>

              {/* ── Share ── */}
              <div className="pdp-share-row" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', position: 'relative' }}>
                <button
                  onClick={() => { const url = encodeURIComponent(window.location.href); window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400'); }}
                  className="pdp-share-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '14px', padding: 0, transition: 'color 200ms ease' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" /></svg>
                  Facebook
                </button>

                <button
                  onClick={() => { const url = encodeURIComponent(window.location.href); const text = encodeURIComponent(product.name); window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400'); }}
                  className="pdp-share-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '14px', padding: 0, transition: 'color 200ms ease' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  Twitter
                </button>

                <button
                  onClick={() => { const url = encodeURIComponent(window.location.href); const media = encodeURIComponent(window.location.origin + (product.images[0]?.src || '')); const desc = encodeURIComponent(product.name); window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${desc}`, '_blank', 'width=600,height=400'); }}
                  className="pdp-share-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '14px', padding: 0, transition: 'color 200ms ease' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9.04 21.54C10 21.83 10.97 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 15.72 3.97 18.97 6.91 20.73C6.81 19.71 6.19 17.15 6.19 17.15L7.85 10.34C7.85 10.34 7.41 9.47 7.41 8.18C7.41 6.15 8.59 4.63 10.06 4.63C11.3 4.63 11.9 5.56 11.9 6.68C11.9 7.94 11.11 9.84 10.69 11.59C10.34 13.06 11.44 14.26 12.89 14.26C15.52 14.26 17.13 10.91 17.13 7.32C17.13 4.46 15.15 2.42 12.08 2.42C8.5 2.42 6.31 5.09 6.31 8.03C6.31 9.13 6.63 9.85 7.16 10.41C7.39 10.67 7.43 10.78 7.35 11.08L7.06 12.23C6.97 12.58 6.72 12.68 6.4 12.54C4.48 11.7 3.54 9.63 3.54 7.74C3.54 4.03 6.52 0.15 12.42 0.15C17.15 0.15 20.28 3.66 20.28 7.42C20.28 12.28 17.46 15.94 13.42 15.94C11.93 15.94 10.53 15.14 10.06 14.23L9.21 17.53C8.93 18.6 8.27 19.94 7.78 20.78C8.81 21.09 9.9 21.26 11.03 21.26" /></svg>
                  Pin it
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href });
                    } else {
                      setShareMenuOpen(!shareMenuOpen);
                    }
                  }}
                  className="pdp-share-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '14px', padding: 0, transition: 'color 200ms ease' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                  Share
                </button>

                {shareMenuOpen && (
                  <div
                    className="pdp-share-dropdown"
                    style={{
                      position: 'absolute', top: 'calc(100% + 10px)', left: 0, zIndex: 100,
                      backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '20px 24px',
                      width: '320px',
                      animation: 'pdpShareDropIn 250ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#222' }}>Share link</span>
                      <button onClick={() => setShareMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', padding: '2px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f7f7f7', borderRadius: '6px', marginBottom: '18px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, position: 'relative', backgroundColor: '#eee' }}>
                        <Image src={product.images[0]?.src || ''} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="44px" />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name} - {formatPrice(product.price)}</p>
                        <p style={{ fontSize: '11px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{typeof window !== 'undefined' ? window.location.href : ''}</p>
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>Share using</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                      {[
                        { name: 'Nearby Sharing', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" /></svg>), action: () => { if (navigator.share) navigator.share({ title: product.name, url: window.location.href }); } },
                        { name: 'WhatsApp', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>), action: () => { window.open(`https://wa.me/?text=${encodeURIComponent(product.name + ' ' + window.location.href)}`, '_blank'); } },
                        { name: 'Phone call', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>), action: () => {} },
                        { name: 'Gmail', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EA4335" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>), action: () => { window.open(`mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(window.location.href)}`, '_blank'); } },
                        { name: 'Facebook', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" /></svg>), action: () => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400'); } },
                        { name: 'LinkedIn', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>), action: () => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400'); } },
                        { name: 'Twitter', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="#555"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>), action: () => { window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`, '_blank', 'width=600,height=400'); } },
                        { name: 'Copy link', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>), action: () => { navigator.clipboard.writeText(window.location.href); setShareMenuOpen(false); } },
                      ].map((item) => (
                        <button key={item.name} onClick={() => { item.action(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 4px', borderRadius: '8px', transition: 'background-color 150ms ease' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          {item.icon}
                          <span style={{ fontSize: '11px', color: '#555', whiteSpace: 'nowrap' }}>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {relatedProducts.length > 0 && <PairsWellWith products={relatedProducts} productHrefBase={productHrefBase} />}

              <div className="pdp-info-links" style={{ borderTop: '1px solid #e5e5e5', marginTop: '24px', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '6px' }}>
                <button className="pdp-info-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '14px', color: '#222', fontWeight: 400 }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M18.9836 5.32852L14.6715 1.01638L1.01638 14.6715L5.32852 18.9836L18.9836 5.32852ZM15.3902 0.297691C14.9933 -0.0992303 14.3497 -0.0992303 13.9528 0.297691L0.297691 13.9528C-0.0992301 14.3497 -0.0992305 14.9932 0.297691 15.3902L4.60983 19.7023C5.00675 20.0992 5.65029 20.0992 6.04721 19.7023L19.7023 6.04721C20.0992 5.65029 20.0992 5.00675 19.7023 4.60983L15.3902 0.297691Z" fillRule="evenodd" />
                    <path d="M11.7863 2.67056C11.9848 2.4721 12.3065 2.4721 12.505 2.67056L14.4237 4.58927C14.6222 4.78774 14.6222 5.1095 14.4237 5.30796C14.2252 5.50642 13.9035 5.50642 13.705 5.30796L11.7863 3.38925C11.5878 3.19079 11.5878 2.86902 11.7863 2.67056Z" />
                    <path d="M8.93891 5.36331C9.13737 5.16485 9.45914 5.16485 9.6576 5.36331L11.5763 7.28202C11.7748 7.48048 11.7748 7.80225 11.5763 8.00071C11.3779 8.19917 11.0561 8.19917 10.8576 8.00071L8.93891 6.082C8.74045 5.88354 8.74045 5.56177 8.93891 5.36331Z" />
                    <path d="M6.24307 8.20742C6.44153 8.00896 6.76329 8.00896 6.96175 8.20742L8.88047 10.1261C9.07893 10.3246 9.07893 10.6464 8.88047 10.8448C8.68201 11.0433 8.36024 11.0433 8.16178 10.8448L6.24307 8.92611C6.0446 8.72765 6.0446 8.40588 6.24307 8.20742Z" />
                    <path d="M3.37296 10.8776C3.57142 10.6791 3.89319 10.6791 4.09165 10.8776L6.01036 12.7963C6.20882 12.9948 6.20882 13.3165 6.01036 13.515C5.8119 13.7134 5.49013 13.7134 5.29167 13.515L3.37296 11.5963C3.1745 11.3978 3.1745 11.076 3.37296 10.8776Z" />
                  </svg>
                  Size Guide
                </button>
                <button onClick={() => setAskModalOpen(true)} className="pdp-info-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '14px', color: '#222', fontWeight: 400 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  Ask About This product
                </button>
              </div>

              {/* ── ✅ Dynamic Accordion from Sanity ── */}
              {product.showAccordion !== false && accordionItems.length > 0 && (
                <div className="pdp-info-accordion-wrap" style={{ marginTop: '16px' }}>
                  <ProductInfoAccordion items={accordionItems} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Customer Reviews ── */}
      <div className="container-main pdp-reviews-section">
        <h2 style={{ fontSize: 'clamp(22px, 2.4vw, 28px)', fontWeight: 600, color: '#222', textAlign: 'center', marginBottom: 'clamp(22px, 2.4vw, 30px)' }}>Customer Reviews</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: 'clamp(22px, 2.4vw, 30px)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {Array.from({ length: 5 }).map((_, i) => (<span key={i} style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', color: i < Math.floor(product.rating) ? '#F5C518' : '#ddd' }}>★</span>))}
              <span style={{ fontSize: 'clamp(14px, 1.3vw, 16px)', fontWeight: 600, color: '#222', marginLeft: '6px' }}>{product.rating} out of 5</span>
            </div>
            <p style={{ fontSize: 'clamp(13px, 1.2vw, 14px)', color: '#888', marginTop: '4px' }}>Based on {product.reviewCount} reviews</p>
          </div>
          <button style={{ padding: 'clamp(10px, 1vw, 12px) clamp(20px, 2.3vw, 28px)', border: '1.5px solid #222', backgroundColor: '#fff', color: '#222', fontSize: 'clamp(13px, 1.25vw, 15px)', fontWeight: 500, cursor: 'pointer', transition: 'all 250ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#222'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#222'; }}
          >Write a review</button>
        </div>
        {product.reviews.map((review) => (
          <div key={review.id} style={{ borderTop: '1px solid #e5e5e5', padding: 'clamp(16px, 1.7vw, 20px) 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '3px' }}>{Array.from({ length: 5 }).map((_, i) => (<span key={i} style={{ fontSize: 'clamp(13px, 1.2vw, 14px)', color: i < review.rating ? '#F5C518' : '#ddd' }}>★</span>))}</div>
              <span style={{ fontSize: 'clamp(12px, 1.1vw, 13px)', color: '#888' }}>{review.date}</span>
            </div>
            <h4 style={{ fontSize: 'clamp(14px, 1.4vw, 16px)', fontWeight: 600, color: '#222', marginBottom: '6px' }}>{review.title}</h4>
            <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: '#555', lineHeight: 1.6 }}>{review.body}</p>
            <p style={{ fontSize: 'clamp(12px, 1.1vw, 13px)', color: '#888', marginTop: '8px' }}>— {review.author} {review.verified && '✓ Verified'}</p>
          </div>
        ))}
      </div>

      {/* ── You May Also Like ── */}
      <div className="pdp-related-section">
        {cardVariant === 'grocery' ? (
          <GroceryFeaturedSlider />
        ) : (
          <FeaturedSlider
            cardVariant={cardVariant}
            productHrefBase={productHrefBase}
          />
        )}
      </div>

      {/* ── Trust Badges ── */}
      <div className="pdp-trust-section" style={{ marginTop: '80px' }}><TrustBadges /></div>

      {/* ── ✅ Dynamic FAQ Section ── */}
      {faqItems.length > 0 && (
        <div className="container-main pdp-faq-section">
          <div className="pdp-faq-header">
            <h2 className="pdp-faq-title">F.A.Q.</h2>
            <p className="pdp-faq-subtitle">Explore additional details in our FAQ section</p>
          </div>
          <div className="pdp-faq-grid">
            <div className="pdp-faq-left">
              <FaqAccordion items={faqItems} />
            </div>
            <div className="pdp-faq-right">
              <Image
                src={cardVariant === 'grocery' ? '/grocery-shop/faq/faq1.webp' : '/fashion/banners/banners9.webp'}
                alt="FAQ section"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="(max-width: 991px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Recently Viewed ── */}
      <div className="container-main pdp-recently-section">
        <h2 style={{ fontSize: 'clamp(22px, 2.4vw, 28px)', fontWeight: 600, color: '#222', textAlign: 'center', marginBottom: 'clamp(22px, 2.4vw, 30px)' }}>Recently viewed product</h2>
        {relatedData && (
          <div className="pdp-recently-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(14px, 1.8vw, 24px)' }}>
            {relatedData.products.slice(0, 4).map((p, i) => (
              cardVariant === 'grocery' ? (
                <GroceryProductCard key={p.id} product={p} index={i} hrefBase={productHrefBase} />
              ) : (
                <HomeProductCard key={p.id} product={p} index={i} hrefBase={productHrefBase} />
              )
            ))}
          </div>
        )}
      </div>

      {/* ── Ask About This Product Modal ── */}
      {askModalOpen && (
        <div
          className="pdp-ask-overlay"
          onClick={() => setAskModalOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 99999,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            animation: 'pdpOverlayFadeIn 300ms ease forwards',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="pdp-ask-modal"
            style={{
              backgroundColor: '#fff', width: '100%',
              position: 'relative',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              animation: 'pdpModalSlideDown 350ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          >
            <button
              onClick={() => setAskModalOpen(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#888', padding: '4px', display: 'flex',
                transition: 'color 200ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#222'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>

            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#222', marginBottom: '16px' }}>Have a question?</h2>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.6, marginBottom: '28px' }}>Thanks for contacting us. We&apos;ll get back to you as soon as possible.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="pdp-ask-fields-row" style={{ display: 'grid', gap: '14px' }}>
                <input type="text" placeholder="Name *" className="pdp-ask-input" style={{ width: '100%', padding: '12px 14px', fontSize: '14px', border: '1px solid #ddd', outline: 'none', color: '#222', backgroundColor: '#fff', transition: 'border-color 200ms ease' }} />
                <input type="email" placeholder="Email *" className="pdp-ask-input" style={{ width: '100%', padding: '12px 14px', fontSize: '14px', border: '1px solid #ddd', outline: 'none', color: '#222', backgroundColor: '#fff', transition: 'border-color 200ms ease' }} />
              </div>
              <input type="tel" placeholder="Phone *" className="pdp-ask-input" style={{ width: '100%', padding: '12px 14px', fontSize: '14px', border: '1px solid #ddd', outline: 'none', color: '#222', backgroundColor: '#fff', transition: 'border-color 200ms ease' }} />
              <textarea placeholder="Write Message *" rows={4} className="pdp-ask-input" style={{ width: '100%', padding: '12px 14px', fontSize: '14px', border: '1px solid #ddd', outline: 'none', color: '#222', backgroundColor: '#fff', resize: 'vertical', transition: 'border-color 200ms ease' }} />
              <div>
                <button
                  className="pdp-ask-send"
                  style={{
                    padding: '12px 36px', fontSize: '14px', fontWeight: 600,
                    backgroundColor: '#222', color: '#fff', border: 'none',
                    cursor: 'pointer', transition: 'background-color 200ms ease',
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pdp-sticky-spacer" />

      <div
        className="pdp-sticky-bar"
        style={{
          position: 'fixed', left: 0, right: 0, zIndex: 9998,
          backgroundColor: '#fff', borderTop: '1px solid #e5e5e5',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.06)',
          transform: (stickyCartVisible && !footerVisible) ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="container-main pdp-sticky-inner">
          <div className="pdp-sticky-product" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 1.1vw, 14px)', minWidth: 0 }}>
            <div style={{ width: 'clamp(52px, 6vw, 80px)', height: 'clamp(58px, 7vw, 90px)', overflow: 'hidden', position: 'relative', backgroundColor: '#f5f5f5', flexShrink: 0, borderRadius: '4px' }}>
              <Image src={product.images[activeGalleryIndex]?.src || product.images[0]?.src || ''} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 1200px) 70px, 80px" />
            </div>
            <span className="pdp-sticky-name" style={{ fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 600, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
          </div>

          <select
            className="pdp-sticky-variant"
            value={`${activeColor} / ${activeSize}`}
            onChange={() => {}}
            style={{ padding: 'clamp(9px, 1vw, 12px) clamp(24px, 2.5vw, 34px) clamp(9px, 1vw, 12px) clamp(12px, 1.3vw, 16px)', fontSize: 'clamp(12px, 1.1vw, 13px)', border: '1px solid #e0e0e0', borderRadius: '6px', color: '#222', backgroundColor: '#fff', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' viewBox=\'0 0 10 6\'%3E%3Cpath fill=\'%23555\' d=\'M5 6L0 0h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', backgroundSize: '10px 6px' }}
          >
            <option>{activeColor.toLowerCase()} / {activeSize.toLowerCase()} - {formatPrice(product.price)}</option>
          </select>

          <div className="pdp-sticky-qty" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 'clamp(32px, 3.4vw, 40px)', height: 'clamp(38px, 4vw, 46px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'clamp(15px, 1.6vw, 18px)', color: '#555' }}>−</button>
            <span style={{ width: 'clamp(30px, 3vw, 36px)', height: 'clamp(38px, 4vw, 46px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 500, borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', color: '#222' }}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} style={{ width: 'clamp(32px, 3.4vw, 40px)', height: 'clamp(38px, 4vw, 46px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'clamp(15px, 1.6vw, 18px)', color: '#555' }}>+</button>
          </div>

          <button className="pdp-sticky-atc" onClick={handleAddToCart} disabled={addingToCart} style={{ backgroundColor: addingToCart ? '#555' : '#222', color: '#fff', fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 600, border: 'none', cursor: addingToCart ? 'wait' : 'pointer', transition: 'background-color 200ms ease', whiteSpace: 'nowrap' }}
            onMouseEnter={(e) => { if (!addingToCart) e.currentTarget.style.backgroundColor = '#F15B41'; }}
            onMouseLeave={(e) => { if (!addingToCart) e.currentTarget.style.backgroundColor = '#222'; }}
          >{addingToCart ? 'Adding...' : 'Add to cart'}</button>

          <button className="pdp-sticky-buy" style={{ backgroundColor: '#fff', color: '#222', fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 600, border: '1.5px solid #222', cursor: 'pointer', transition: 'all 200ms ease', whiteSpace: 'nowrap' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#222'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#222'; }}
          >Buy it now</button>
        </div>
      </div>

      <style>{`
        /* Recently Viewed: 3-up at the 992–1199 breakpoint */
        @media (min-width: 992px) and (max-width: 1199px) {
          .pdp-recently-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }

        .pdp-thumb-vertical::-webkit-scrollbar { width: 0; display: none; }
        .pdp-thumb-vertical { scrollbar-width: none; }

        .pdp-swiper-arrow {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 10;
          width: 36px; height: 36px; border-radius: 0; border: 1px solid #e0e0e0;
          background: #fff; color: #222; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: background-color 200ms ease, color 200ms ease, opacity 200ms ease;
        }
        .pdp-swiper-arrow:hover { background: #222; color: #fff; border-color: #222; }
        .pdp-swiper-arrow.swiper-button-disabled { opacity: 0.3; cursor: default; }
        .pdp-swiper-arrow.swiper-button-disabled:hover { background: #fff; color: #222; border-color: #e0e0e0; }
        .pdp-swiper-prev { left: 16px; }
        .pdp-swiper-next { right: 16px; }

        .swiper-button-next, .swiper-button-prev { display: none !important; }

        .pdp-gallery-swiper, .pdp-gallery-swiper .swiper-wrapper, .pdp-gallery-swiper .swiper-slide {
          height: 100% !important;
        }

        .pdp-info-link:hover {
          color: #F15B41 !important;
        }

        .pdp-pairs-quick-add:hover {
          background-color: #222 !important;
          color: #fff !important;
        }

        @keyframes pdpLightboxIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pdpLightboxFade {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .pdp-lightbox-arrow:hover {
          background: rgba(255,255,255,0.25) !important;
        }
        .pdp-lightbox-close:hover {
          opacity: 0.6;
        }

        @keyframes pdpOverlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pdpModalSlideDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pdp-ask-input:focus {
          border-color: #222 !important;
        }
        .pdp-ask-input::placeholder {
          color: #aaa;
        }

        .pdp-ask-send:hover {
          background-color: #F15B41 !important;
        }

        .pdp-btn-spinner {
          display: inline-block;
          border: 2px solid #ddd;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: pdpSpinBtn 500ms linear infinite;
        }
        @keyframes pdpSpinBtn {
          to { transform: rotate(360deg); }
        }

        .pdp-share-btn {
          text-decoration: underline !important;
          text-underline-offset: 3px !important;
          text-decoration-color: #ccc !important;
        }
        .pdp-share-btn:hover {
          color: #222 !important;
          text-decoration-color: #222 !important;
        }

        @keyframes pdpShareDropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .pdp-product-section {
          padding-bottom: 80px;
          overflow: visible;
        }
        .pdp-product-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(24px, 3.6vw, 50px);
          align-items: start;
          overflow: visible;
        }
        .pdp-product-gallery-col {
          align-self: stretch;
          overflow: visible;
          z-index: 10;
        }
        .pdp-gallery-sticky {
          position: sticky;
          top: 110px;
        }
        .pdp-product-info {
          position: relative;
          z-index: 1;
        }
        .pdp-gallery-flex { display: flex; gap: 16px; }
        .pdp-thumb-wrap { width: 90px; flex-shrink: 0; position: relative; }
        .pdp-main-col { flex: 1; position: relative; }
        .pdp-thumb-arrow { display: none; }

        @media (max-width: 991px) {
          .pdp-product-section {
            padding-bottom: clamp(40px, 8vw, 60px);
            overflow-x: hidden !important;
          }
          .pdp-product-grid {
            grid-template-columns: 1fr;
            gap: clamp(20px, 5vw, 32px);
            min-width: 0;
          }
          .pdp-product-gallery-col,
          .pdp-product-info {
            min-width: 0 !important;
          }
          .pdp-product-gallery-col {
            align-self: auto;
            z-index: auto;
          }
          .pdp-gallery-sticky {
            position: static;
            top: auto;
          }
          .pdp-gallery-flex {
            flex-direction: column-reverse;
            gap: 12px;
            min-width: 0;
          }
          .pdp-thumb-wrap {
            width: 100%;
            min-width: 0;
            max-width: 100%;
            position: relative;
          }
          .pdp-main-col {
            min-width: 0 !important;
            max-width: 100% !important;
          }
          .pdp-thumb-vertical {
            flex-direction: row !important;
            max-height: none !important;
            overflow-y: hidden !important;
            overflow-x: auto;
            gap: 8px !important;
            padding: 0 36px;
            scroll-behavior: smooth;
          }
          .pdp-thumb-btn {
            width: clamp(70px, 18vw, 100px) !important;
            height: auto !important;
          }
          .pdp-thumb-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 1px solid #e0e0e0;
            background: #fff;
            color: #222;
            cursor: pointer;
            z-index: 5;
            padding: 0;
            transition: background-color 180ms ease, color 180ms ease;
          }
          .pdp-thumb-arrow:hover { background: #222; color: #fff; border-color: #222; }
          .pdp-thumb-arrow-prev { left: 0; }
          .pdp-thumb-arrow-next { right: 0; }
          .pdp-main-image-wrap {
            height: clamp(400px, calc(70vw + 176px), 700px);
          }
          .pdp-main-image-spacer { padding-bottom: 0 !important; }
          .pdp-zoom-lens, .pdp-zoom-panel { display: none !important; }
          .pdp-product-gallery-col .pdp-swiper-arrow {
            width: 32px;
            height: 32px;
          }
          .pdp-info-vendor {
            font-size: clamp(11px, 3.1vw, 12px) !important;
            letter-spacing: 1.2px !important;
            margin-bottom: 8px !important;
          }
          .pdp-info-title {
            font-size: clamp(22px, 6vw, 28px) !important;
            margin-bottom: 16px !important;
          }
          .pdp-info-rating { gap: 4px !important; margin-bottom: 20px !important; }
          .pdp-info-star { font-size: clamp(14px, 4vw, 16px) !important; }
          .pdp-info-review-count { font-size: clamp(12px, 3.4vw, 14px) !important; }
          .pdp-info-price-row {
            gap: clamp(8px, 2.2vw, 12px) !important;
            margin-bottom: 22px !important;
          }
          .pdp-info-compare-at { font-size: clamp(15px, 4.4vw, 18px) !important; }
          .pdp-info-price { font-size: clamp(20px, 5.4vw, 24px) !important; }
          .pdp-info-description {
            font-size: clamp(13px, 3.6vw, 15px) !important;
            line-height: 1.65 !important;
            margin-bottom: 26px !important;
          }
          .pdp-info-color, .pdp-info-size {
            margin-bottom: 24px !important;
          }
          .pdp-info-field-label {
            font-size: clamp(13px, 3.7vw, 15px) !important;
            margin-bottom: 12px !important;
          }
          .pdp-info-color-swatch {
            width: clamp(26px, 7.2vw, 32px) !important;
            height: clamp(26px, 7.2vw, 32px) !important;
          }
          .pdp-info-size-btn {
            min-width: clamp(38px, 10.8vw, 44px) !important;
            height: clamp(38px, 10.8vw, 44px) !important;
            padding: 0 clamp(10px, 3vw, 14px) !important;
            font-size: clamp(13px, 3.6vw, 14px) !important;
          }
          .pdp-info-qty-block { margin-bottom: 20px !important; }
          .pdp-info-qty-row { gap: clamp(10px, 2.8vw, 14px) !important; }
          .pdp-qty-stepper {
            border-radius: 999px !important;
          }
          .pdp-qty-step-btn {
            width: clamp(36px, 9.6vw, 40px) !important;
            height: clamp(40px, 11vw, 44px) !important;
            font-size: clamp(16px, 4.4vw, 18px) !important;
          }
          .pdp-qty-value {
            width: clamp(36px, 9.6vw, 40px) !important;
            height: clamp(40px, 11vw, 44px) !important;
            font-size: clamp(13px, 3.6vw, 15px) !important;
          }
          .pdp-add-to-cart-btn {
            border-radius: 999px !important;
            padding: clamp(12px, 3.2vw, 14px) 0 !important;
            font-size: clamp(14px, 3.8vw, 16px) !important;
          }
          .pdp-buy-now-btn {
            border-radius: 999px !important;
            padding: clamp(12px, 3.2vw, 14px) 0 !important;
            font-size: clamp(14px, 3.8vw, 16px) !important;
            margin-bottom: 24px !important;
          }
          .pdp-info-actions-row {
            gap: clamp(16px, 4.6vw, 24px) !important;
            margin-bottom: 24px !important;
            flex-wrap: wrap;
          }
          .pdp-share-row {
            gap: clamp(14px, 4vw, 20px) !important;
            margin-bottom: 28px !important;
            flex-wrap: wrap;
            row-gap: 12px;
          }
          .pdp-share-dropdown {
            width: min(320px, calc(100vw - 32px)) !important;
            padding: 16px 18px !important;
          }
          .pdp-info-links {
            margin-top: 24px !important;
            padding-top: 22px !important;
            gap: 16px !important;
          }
          .pdp-pairs-section {
            display: none !important;
          }
        }

        @media (max-width: 749px) {
          .pdp-thumb-wrap {
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .pdp-thumb-vertical {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            padding: 0 32px !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
          }
          .pdp-thumb-btn {
            flex: 0 0 calc((100vw - 128px) / 3) !important;
            width: calc((100vw - 128px) / 3) !important;
            max-width: calc((100vw - 128px) / 3) !important;
            height: auto !important;
            box-sizing: border-box !important;
          }
        }

        .pdp-faq-section {
          padding-block: clamp(48px, 6vw, 80px);
        }
        .pdp-faq-header {
          text-align: center;
          margin-bottom: clamp(28px, 3.5vw, 40px);
        }
        .pdp-faq-title {
          font-size: clamp(22px, 2.4vw, 28px);
          font-weight: 600;
          color: #222;
          margin-bottom: 8px;
        }
        .pdp-faq-subtitle {
          font-size: clamp(13px, 1.2vw, 14px);
          color: #888;
        }
        .pdp-faq-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          align-items: stretch;
        }
        .pdp-faq-left {
          padding-right: clamp(24px, 4vw, 60px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: clamp(560px, 62vw, 750px);
        }
        .pdp-faq-right {
          position: relative;
          height: clamp(560px, 62vw, 750px);
          overflow: hidden;
        }
        .pdp-faq-q-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: clamp(16px, 1.8vw, 22px) 0;
          font-size: clamp(18px, 2vw, 24px);
          font-weight: 600;
          color: #222;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: clamp(12px, 1.3vw, 16px);
        }
        .pdp-faq-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          position: relative;
        }
        .pdp-faq-icon { width: 20px; height: 20px; }
        .pdp-faq-answer-body {
          padding-bottom: clamp(16px, 1.8vw, 22px);
          font-size: clamp(13px, 1.2vw, 14px);
          color: #555;
          line-height: 1.7;
          white-space: pre-line;
        }

        @media (min-width: 992px) and (max-width: 1199px) {
          .pdp-faq-left { min-height: 600px; }
          .pdp-faq-right { height: 600px; }
        }

        @media (min-width: 750px) and (max-width: 991px) {
          .pdp-faq-section { padding-block: clamp(36px, 5vw, 48px); }
          .pdp-faq-header { margin-bottom: clamp(20px, 3vw, 28px); }
          .pdp-faq-title { font-size: clamp(20px, 2.6vw, 22px); }
          .pdp-faq-subtitle { font-size: clamp(13px, 1.5vw, 14px); }
          .pdp-faq-grid {
            grid-template-columns: 1fr;
            gap: clamp(20px, 3vw, 28px);
          }
          .pdp-faq-left {
            padding-right: 0;
            min-height: 0;
          }
          .pdp-faq-right { height: 600px; order: -1; }
          .pdp-faq-q-btn {
            padding: clamp(13px, 1.7vw, 16px) 0;
            font-size: clamp(17px, 2.2vw, 20px);
            gap: clamp(10px, 1.3vw, 14px);
          }
          .pdp-faq-answer-body {
            padding-bottom: clamp(13px, 1.7vw, 16px);
            font-size: clamp(13px, 1.5vw, 14px);
          }
        }

        @media (max-width: 749px) {
          .pdp-faq-section { padding-block: 0; }
          .pdp-faq-header { margin-bottom: clamp(16px, 4vw, 24px); }
          .pdp-faq-title { font-size: clamp(18px, 5vw, 22px); }
          .pdp-faq-subtitle { font-size: clamp(12px, 3.4vw, 14px); }
          .pdp-faq-grid {
            grid-template-columns: 1fr;
            gap: clamp(16px, 4vw, 24px);
          }
          .pdp-faq-left {
            padding-right: 0;
            min-height: 0;
          }
          .pdp-faq-right { height: 400px; order: -1; }
          .pdp-faq-q-btn {
            padding: clamp(12px, 3.4vw, 16px) 0;
            font-size: clamp(15px, 4.4vw, 18px);
            gap: clamp(8px, 2.5vw, 12px);
          }
          .pdp-faq-answer-body {
            padding-bottom: clamp(12px, 3.4vw, 16px);
            font-size: clamp(12px, 3.4vw, 14px);
          }
          .pdp-faq-icon-wrap {
            width: clamp(18px, 5vw, 22px);
            height: clamp(18px, 5vw, 22px);
          }
          .pdp-faq-icon {
            width: clamp(14px, 4.2vw, 18px);
            height: clamp(14px, 4.2vw, 18px);
          }
        }

        .pdp-ask-overlay { padding-top: 80px; }
        .pdp-ask-modal { max-width: 560px; padding: 36px 40px; }
        .pdp-ask-fields-row { grid-template-columns: 1fr 1fr; }

        .pdp-sticky-bar {
          bottom: 0;
          height: clamp(92px, 10vw, 120px);
          overflow: hidden;
        }
        .pdp-sticky-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(12px, 1.6vw, 24px);
          width: 100%;
          height: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .pdp-sticky-product { flex: 0 0 auto; min-width: 0; }
        .pdp-sticky-name { max-width: clamp(110px, 14vw, 180px); }
        .pdp-sticky-variant {
          margin-left: clamp(8px, 3vw, 76px);
          margin-right: clamp(8px, 3vw, 76px);
          min-width: clamp(130px, 14vw, 170px);
          max-width: 100%;
          flex-shrink: 1;
          box-sizing: border-box;
        }
        .pdp-sticky-qty { flex-shrink: 0; }
        .pdp-sticky-atc {
          padding: clamp(11px, 1.2vw, 14px) clamp(18px, 2.5vw, 30px);
          flex-shrink: 0;
        }
        .pdp-sticky-buy {
          padding: clamp(11px, 1.2vw, 14px) clamp(18px, 2.5vw, 30px);
          flex-shrink: 0;
        }
        .pdp-sticky-spacer { display: none; }

        .pdp-reviews-section { padding-bottom: clamp(48px, 6vw, 80px); }
        .pdp-recently-section { padding-bottom: clamp(48px, 6vw, 80px); }

        .pdp-trust-section > section {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }

        @media (min-width: 750px) and (max-width: 991px) {
          .pdp-recently-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .pdp-recently-grid .fc-card > div:not([class]) a { font-size: clamp(13px, 1.6vw, 15px) !important; }
          .pdp-recently-grid .fc-card > div:not([class]) span { font-size: clamp(12px, 1.4vw, 14px) !important; }
        }

        @media (max-width: 749px) {
          .pdp-ask-overlay { padding-top: clamp(20px, 5vw, 50px); }
          .pdp-ask-modal {
            max-width: calc(100% - 32px);
            padding: clamp(24px, 5vw, 36px) clamp(20px, 4vw, 32px);
          }
          .pdp-sticky-spacer { display: none; }
          .pdp-sticky-bar { display: none; }
          .pdp-recently-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: clamp(10px, 2.5vw, 16px) !important;
          }
          .pdp-recently-grid .fc-card > div:not([class]) a {
            font-size: clamp(11px, 3.4vw, 14px) !important;
          }
          .pdp-recently-grid .fc-card > div:not([class]) span {
            font-size: clamp(10px, 3vw, 13px) !important;
          }
          .pdp-recently-grid .fc-card > a:first-child {
            margin-bottom: clamp(8px, 2vw, 12px) !important;
          }
        }

        @media (max-width: 749px) {
          .pdp-product-section  { padding-bottom: 0; }
          .pdp-reviews-section  { padding-bottom: 0; margin-top: 60px; }
          .pdp-related-section  { margin-top: 60px; }
          .pdp-trust-section    { margin-top: 60px !important; }
          .pdp-faq-section      { margin-top: 60px; }
          .pdp-recently-section { padding-bottom: 60px; margin-top: 60px; }
        }

        @media (max-width: 499px) {
          .pdp-ask-fields-row { grid-template-columns: 1fr; }
          .pdp-ask-modal { max-width: 100%; }
        }
      `}</style>
    </>
  );
}