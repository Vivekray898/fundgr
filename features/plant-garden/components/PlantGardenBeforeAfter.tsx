'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

export function PlantGardenBeforeAfter() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    updatePosition(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <section className="pg-before-after">
      <div className="container-main" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 700, color: '#111', marginBottom: 'clamp(20px, 2.5vw, 36px)' }}>
          Before &amp; After
        </h2>

        <div
          ref={containerRef}
          className="pg-ba-container"
          onMouseMove={onMouseMove}
          onMouseUp={() => { dragging.current = false; }}
          onMouseLeave={() => { dragging.current = false; }}
          onTouchMove={onTouchMove}
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(260px, 45vw, 600px)',
            overflow: 'hidden',
            cursor: 'ew-resize',
            userSelect: 'none',
          }}
        >
          {/* After (bottom layer — full width) */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <Image
              src="/plant-and-garden/before-after/after.webp"
              alt="After"
              fill
              style={{ objectFit: 'cover' }}
              sizes="100vw"
            />
          </div>

          {/* Before (top layer — clipped) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `inset(0 ${100 - position}% 0 0)`,
              transition: dragging.current ? 'none' : 'clip-path 0ms',
            }}
          >
            <Image
              src="/plant-and-garden/before-after/before.webp"
              alt="Before"
              fill
              style={{ objectFit: 'cover' }}
              sizes="100vw"
            />
          </div>

          {/* Divider line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${position}%`,
              width: '2px',
              background: 'rgba(255,255,255,0.8)',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}
          />

          {/* Drag handle */}
          <div
            onMouseDown={(e) => { dragging.current = true; e.preventDefault(); }}
            onTouchStart={() => { dragging.current = true; }}
            onTouchEnd={() => { dragging.current = false; }}
            style={{
              position: 'absolute',
              top: '50%',
              left: `${position}%`,
              transform: 'translate(-50%, -50%)',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'ew-resize',
              color: '#555',
              zIndex: 10,
            }}
          >
            {/* Grip bars */}
            <svg viewBox="0 0 16 16" fill="currentColor" width={16} height={16}>
              <rect x="2" y="4" width="1.5" height="8" rx="0.75" />
              <rect x="5.25" y="4" width="1.5" height="8" rx="0.75" />
              <rect x="8.5" y="4" width="1.5" height="8" rx="0.75" />
              <rect x="11.75" y="4" width="1.5" height="8" rx="0.75" />
            </svg>
          </div>

          {/* Labels */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px', pointerEvents: 'none' }}>
            Before
          </div>
          <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px', pointerEvents: 'none' }}>
            After
          </div>
        </div>
      </div>
    </section>
  );
}
