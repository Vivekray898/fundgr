// src/features/products/components/ProductDetailSubComponents.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useUIStore } from '@/store/uiStore';
import { formatPrice } from '@/utils/formatPrice';
import type { Product } from '@/types/product';

/* ══════════════════════════════════
   ICONS
   ══════════════════════════════════ */

export function IconBag({ size = 18 }: { size?: number }) {
  return (<svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M9 6H15C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6ZM7 6C7 3.23858 9.23858 1 12 1C14.7614 1 17 3.23858 17 6H20C20.5523 6 21 6.44772 21 7V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V7C3 6.44772 3.44772 6 4 6H7ZM5 8V20H19V8H5ZM9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10H17C17 12.7614 14.7614 15 12 15C9.23858 15 7 12.7614 7 10H9Z" /></svg>);
}

export function IconChevronDown({ size = 14 }: { size?: number }) {
  return (<svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" /></svg>);
}

export function IconArrowLeft({ size = 16 }: { size?: number }) {
  return (<svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" /></svg>);
}

export function IconArrowRight({ size = 16 }: { size?: number }) {
  return (<svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" /></svg>);
}

/* ══════════════════════════════════
   IMAGE GALLERY (with thumbnail slider)
   ══════════════════════════════════ */

export function ProductGallery({ images, onActiveChange }: { images: { id: string; src: string; alt: string }[]; onActiveChange?: (index: number) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [mainHeight, setMainHeight] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const lightboxSwiperRef = useRef<SwiperType | null>(null);
  const thumbContainerRef = useRef<HTMLDivElement>(null);
  const mainWrapRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const handleThumbClick = (index: number) => {
    setActiveIndex(index);
    onActiveChange?.(index);
    swiperRef.current?.slideTo(index);
  };

  const handleThumbScroll = (direction: 'prev' | 'next') => {
    if (!thumbContainerRef.current) return;
    const amount = thumbContainerRef.current.clientWidth * 0.7;
    thumbContainerRef.current.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const el = mainWrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setMainHeight(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!thumbContainerRef.current) return;
    const activeThumb = thumbContainerRef.current.children[activeIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeIndex]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setZooming(false);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const lightboxPrev = () => {
    const newIdx = (lightboxIndex - 1 + images.length) % images.length;
    setLightboxIndex(newIdx);
    lightboxSwiperRef.current?.slideTo(newIdx);
  };

  const lightboxNext = () => {
    const newIdx = (lightboxIndex + 1) % images.length;
    setLightboxIndex(newIdx);
    lightboxSwiperRef.current?.slideTo(newIdx);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  return (
    <div className="pdp-gallery-flex">
      {images.length > 1 && (
        <div className="pdp-thumb-wrap">
          <button
            type="button"
            aria-label="Previous thumbnails"
            className="pdp-thumb-arrow pdp-thumb-arrow-prev"
            onClick={() => handleThumbScroll('prev')}
          >
            <IconArrowLeft size={14} />
          </button>
          <div
            ref={thumbContainerRef}
            className="pdp-thumb-vertical"
            style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: mainHeight > 0 ? `${mainHeight}px` : '700px', overflowY: 'auto' }}
          >
            {images.map((img, i) => (
              <button key={img.id} onClick={() => handleThumbClick(i)} className="pdp-thumb-btn" style={{
                position: 'relative', width: '100%', aspectRatio: '3 / 4',
                overflow: 'hidden', flexShrink: 0,
                border: activeIndex === i ? '2px solid #222' : '2px solid transparent',
                cursor: 'pointer', backgroundColor: '#f5f5f5', padding: 0,
                transition: 'border-color 200ms ease',
              }}>
                <Image src={img.src} alt={img.alt} fill style={{ objectFit: 'cover' }} sizes="(max-width: 749px) 100px, 90px" />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next thumbnails"
            className="pdp-thumb-arrow pdp-thumb-arrow-next"
            onClick={() => handleThumbScroll('next')}
          >
            <IconArrowRight size={14} />
          </button>
        </div>
      )}

      <div className="pdp-main-col">
        <div
          ref={mainWrapRef}
          onMouseEnter={() => setZooming(true)}
          onMouseLeave={() => setZooming(false)}
          onMouseMove={handleMouseMove}
          className="pdp-main-image-wrap"
          style={{ position: 'relative', width: '100%', backgroundColor: '#f5f5f5', overflow: 'hidden', cursor: zooming ? 'crosshair' : 'default' }}
        >
          <div className="pdp-main-image-spacer" style={{ width: '100%', paddingBottom: '133.33%' }} />

          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: '.pdp-swiper-prev',
                nextEl: '.pdp-swiper-next',
              }}
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
              onSlideChange={(swiper) => { setActiveIndex(swiper.activeIndex); onActiveChange?.(swiper.activeIndex); }}
              className="pdp-gallery-swiper"
              style={{ width: '100%', height: '100%' }}
              speed={400}
            >
              {images.map((img, idx) => (
                <SwiperSlide key={img.id} style={{ width: '100%', height: '100%' }}>
                  <img
                    src={img.src} alt={img.alt}
                    onClick={() => openLightbox(idx)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <button className="pdp-swiper-prev pdp-swiper-arrow" aria-label="Previous image"
            onMouseEnter={() => setZooming(false)} onMouseLeave={() => setZooming(true)}>
            <IconArrowLeft size={16} />
          </button>
          <button className="pdp-swiper-next pdp-swiper-arrow" aria-label="Next image"
            onMouseEnter={() => setZooming(false)} onMouseLeave={() => setZooming(true)}>
            <IconArrowRight size={16} />
          </button>

          {zooming && (
            <div className="pdp-zoom-lens" style={{
              position: 'absolute', width: '120px', height: '120px',
              border: '1.5px solid rgba(0,0,0,0.15)', backgroundColor: 'rgba(255,255,255,0.2)',
              pointerEvents: 'none', zIndex: 10,
              left: `clamp(0px, calc(${zoomPos.x}% - 60px), calc(100% - 120px))`,
              top: `clamp(0px, calc(${zoomPos.y}% - 60px), calc(100% - 120px))`,
            }} />
          )}
        </div>

        {zooming && images[activeIndex] && (
          <div className="pdp-zoom-panel" style={{
            position: 'absolute',
            top: 0,
            left: 'calc(100% + 30px)',
            width: '520px',
            height: `${Math.min(520, mainHeight)}px`,
            backgroundColor: '#fff', overflow: 'hidden', zIndex: 9999,
            border: '1px solid #e5e5e5', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: '100%', height: '520px',
              backgroundImage: `url("${encodeURI(images[activeIndex].src)}")`,
              backgroundSize: '250%',
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundRepeat: 'no-repeat',
            }} />
          </div>
        )}
      </div>

      {lightboxOpen && typeof document !== 'undefined' && createPortal(
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'pdpLightboxIn 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <span style={{ position: 'absolute', top: '18px', left: '24px', color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: 500, zIndex: 10 }}>
            {lightboxIndex + 1} / {images.length}
          </span>

          <button onClick={closeLightbox} className="pdp-lightbox-close" style={{ position: 'absolute', top: '14px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: '8px', display: 'flex', zIndex: 10 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>

          <button onClick={(e) => { e.stopPropagation(); lightboxPrev(); }} className="pdp-lightbox-arrow" style={{
            position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
            width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer',
            transition: 'background-color 200ms ease',
          }}>
            <IconArrowLeft size={22} />
          </button>

          <button onClick={(e) => { e.stopPropagation(); lightboxNext(); }} className="pdp-lightbox-arrow" style={{
            position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
            width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer',
            transition: 'background-color 200ms ease',
          }}>
            <IconArrowRight size={22} />
          </button>

          <img
            key={images[lightboxIndex]?.id}
            src={images[lightboxIndex]?.src || ''}
            alt={images[lightboxIndex]?.alt || ''}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 'calc(100vw - 140px)', maxHeight: 'calc(100vh - 40px)',
              objectFit: 'contain', display: 'block',
              animation: 'pdpLightboxFade 250ms ease',
            }}
          />
        </div>,
        document.body
      )}
    </div>
  );
}

/* ══════════════════════════════════
   PRODUCT INFO ACCORDION (right panel — dynamic from Sanity)
   ══════════════════════════════════ */

export function ProductInfoAccordion({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  const [openIndex, setOpenIndex] = useState(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (items.length === 0) return null;

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const isFirst = i === 0;
        return (
          <div key={i} style={{ borderTop: isFirst ? '1px solid #e5e5e5' : 'none', borderBottom: '1px solid #e5e5e5' }}>
            <button
              onClick={() => toggle(i)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '20px 0', fontSize: '20px', fontWeight: 600,
                color: '#222', background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              {item.title}
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>
                <svg aria-hidden="true" focusable="false" role="presentation" viewBox="0 0 10 6" width="12" height="12">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor" />
                </svg>
              </span>
            </button>
            <div
              ref={(el) => { contentRefs.current[i] = el; }}
              style={{
                maxHeight: isOpen ? `${contentRefs.current[i]?.scrollHeight || 1000}px` : '0',
                overflow: 'hidden',
                transition: 'max-height 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div style={{ paddingBottom: '22px', fontSize: '15px', color: '#555', lineHeight: 1.7 }}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════
   FAQ ACCORDION (product page — 50/50 layout)
   ══════════════════════════════════ */

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (items.length === 0) return null;

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const isFirst = i === 0;
        const isLast = i === items.length - 1;
        return (
          <div key={i} style={{ borderTop: isFirst ? 'none' : '1px solid #e5e5e5', borderBottom: isLast ? 'none' : undefined }}>
            <button
              onClick={() => toggle(i)}
              className="pdp-faq-q-btn"
            >
              <span style={{ flex: 1 }}>{item.question}</span>
              <span className="pdp-faq-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" viewBox="0 0 10 10"
                  className="pdp-faq-icon"
                  style={{ position: 'absolute', transition: 'opacity 350ms ease, transform 350ms ease', opacity: isOpen ? 0 : 1, transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z" fill="currentColor" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" viewBox="0 0 10 2"
                  className="pdp-faq-icon"
                  style={{ position: 'absolute', transition: 'opacity 350ms ease, transform 350ms ease', opacity: isOpen ? 1 : 0, transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z" fill="currentColor" />
                </svg>
              </span>
            </button>
            <div
              ref={(el) => { faqRefs.current[i] = el; }}
              style={{
                maxHeight: isOpen ? `${faqRefs.current[i]?.scrollHeight || 500}px` : '0',
                opacity: isOpen ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              <div className="pdp-faq-answer-body">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════
   PAIRS WELL WITH SLIDER
   ══════════════════════════════════ */

export function PairsWellWith({ products, productHrefBase = '/products' }: { products: Product[]; productHrefBase?: string }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const { openQuickView } = useUIStore();
  const chunkSize = 3;
  const slides: Product[][] = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    slides.push(products.slice(i, i + chunkSize));
  }
  const totalDots = slides.length;

  return (
    <div className="pdp-pairs-section" style={{ borderTop: '1px solid #e5e5e5', paddingTop: '24px' }}>
      <h3 className="pdp-pairs-title" style={{ fontSize: '18px', fontWeight: 600, color: '#222', marginBottom: '16px' }}>Pairs well with</h3>

      <div className="pdp-pairs-track-wrap" style={{ overflow: 'hidden' }}>
        <div className="pdp-pairs-track" style={{ display: 'flex', transition: 'transform 500ms ease', transform: `translateX(-${activeSlide * 100}%)` }}>
          {slides.map((group, gi) => (
            <div key={gi} className="pdp-pairs-slide" style={{ flex: '0 0 100%', display: 'flex', flexDirection: 'column', gap: '0' }}>
              {group.map((p) => (
                <div key={p.id} className="pdp-pairs-row" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Link href={`${productHrefBase}/${p.slug}`} style={{ width: '70px', height: '85px', position: 'relative', overflow: 'hidden', backgroundColor: '#f5f5f5', flexShrink: 0, display: 'block' }}>
                    <Image src={p.images[0]?.src || ''} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="70px" />
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`${productHrefBase}/${p.slug}`} style={{ fontSize: '15px', fontWeight: 600, color: '#222', textDecoration: 'none', display: 'block', marginBottom: '4px' }}>
                      {p.name}
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {p.compareAtPrice && <span style={{ fontSize: '13px', color: '#999', textDecoration: 'line-through' }}>{formatPrice(p.compareAtPrice)}</span>}
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#222' }}>{formatPrice(p.price)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openQuickView(p)}
                    className="pdp-pairs-quick-add"
                    style={{
                      padding: '10px 20px', fontSize: '13px', fontWeight: 600,
                      color: '#222', backgroundColor: '#fff',
                      border: '1.5px solid #222', cursor: 'pointer',
                      transition: 'all 200ms ease', flexShrink: 0,
                    }}
                  >
                    Quick Add
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {totalDots > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
          {Array.from({ length: totalDots }).map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)} aria-label={`Slide ${i + 1}`} style={{
              width: activeSlide === i ? '18px' : '10px', height: activeSlide === i ? '18px' : '10px',
              borderRadius: '50%', border: activeSlide === i ? '1.5px solid #222' : 'none',
              backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0, cursor: 'pointer', transition: 'all 300ms ease',
            }}>
              <span style={{ width: activeSlide === i ? '8px' : '10px', height: activeSlide === i ? '8px' : '10px', borderRadius: '50%', backgroundColor: activeSlide === i ? '#222' : '#bbb', display: 'block', transition: 'all 300ms ease' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}