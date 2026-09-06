'use client';

import Link from 'next/link';

export function SingleProductVideoBanner() {
  return (
    <section className="spvb-section">
      <div className="container-main">
        {/* Video box — constrained to the container width, not full-bleed */}
        <div
          className="spvb-box"
          style={{
            position: 'relative',
            height: 'clamp(380px, 44vw, 640px)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <video
            className="spvb-video"
            src="/single -product/vedio/vedio-1.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />

          {/* Centered content */}
          <div
            className="spvb-content"
            style={{
              position: 'relative',
              zIndex: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              textAlign: 'center',
              padding: 'clamp(24px, 3vw, 48px)',
              paddingBottom: '50px',
              gap: '18px',
            }}
          >
            <h2 className="spvb-title">AirPods Pro 2</h2>
            <p className="spvb-subtitle">
              Hearing Test, Hearing Aid, and Hearing Protection<br />
              features in a free software update.
            </p>
            <div className="spvb-ctas">
              <Link href="/products/sp-airpods-pro-2" className="spvb-btn spvb-btn-primary">Buy now</Link>
              <Link href="/shop" className="spvb-btn spvb-btn-secondary">Learn more</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Plain <style> — typography, buttons, hovers, responsive */}
      <style>{`
        .spvb-title {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }
        .spvb-subtitle {
          font-size: 17px;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          line-height: 1.6;
        }
        .spvb-ctas {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 4px;
        }
        .spvb-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 34px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .spvb-btn-primary {
          background: #1a6fe8;
          color: #fff;
        }
        .spvb-btn-primary:hover {
          background: #1559c0;
        }
        .spvb-btn-secondary {
          background: rgba(0, 0, 0, 0.45);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.35);
        }
        .spvb-btn-secondary:hover {
          background: rgba(0, 0, 0, 0.65);
          border-color: rgba(255, 255, 255, 0.6);
        }

        @media (max-width: 749px) {
          .spvb-title { font-size: 24px; }
          .spvb-subtitle { font-size: 14px; }
          .spvb-btn { padding: 12px 26px; font-size: 14px; }
        }
      `}</style>
    </section>
  );
}
