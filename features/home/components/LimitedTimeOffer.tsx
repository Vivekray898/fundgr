'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function IconArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

const pad = (n: number) => String(n).padStart(2, '0');

function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2029-01-01T00:00:00').getTime();
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000)  / 60_000),
        seconds: Math.floor((diff % 60_000)      / 1_000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="lto-countdown">
      {[
        { val: String(time.days), label: 'Days' },
        { val: pad(time.hours),   label: 'Hrs'  },
        { val: pad(time.minutes), label: 'Min'  },
        { val: pad(time.seconds), label: 'Sec'  },
      ].map(({ val, label }) => (
        <div key={label} className="lto-cd-cell">
          <span className="lto-cd-val">{val}</span>
          <span className="lto-cd-lbl">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function LimitedTimeOffer() {
  return (
    <section className="lto-section">
      <div className="container-main">
        <div className="lto-grid">

          <h2 className="lto-heading">
            Limited Time Offer With Up To 40%
            <br />
            Off On Your Favorite Products!
          </h2>

          <CountdownTimer />

          <div className="lto-cta-wrap">
            <Link
              href="/shop"
              className="lto-cta"
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fc5732'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#000'; }}
            >
              Shop now
              <IconArrowRight size={17} />
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        /* ── Section ── */
        .lto-section {
          background-color: rgb(248, 250, 251);
          padding: 48px 0;
        }

        /* ── Mobile: stacked column ── */
        .lto-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
        }
        .lto-heading {
          font-size: clamp(20px, 5vw, 32px);
          font-weight: 600;
          color: #222;
          line-height: 1.4;
        }

        /* ── Countdown: fixed-size cells (no layout shift) ── */
        .lto-countdown {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .lto-cd-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid #d4d4d4;
          border-radius: 4px;
          /* Fixed dimensions so number changes never resize the box */
          width: 60px;
          height: 58px;
          box-sizing: border-box;
          flex-shrink: 0;
        }
        .lto-cd-val {
          font-size: 19px;
          font-weight: 600;
          color: #222;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .lto-cd-lbl {
          font-size: 11px;
          font-weight: 400;
          color: #888;
          margin-top: 4px;
          line-height: 1;
        }

        /* ── CTA button ── */
        .lto-cta-wrap { display: flex; justify-content: center; }
        .lto-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #000;
          color: #fff;
          font-size: 15px;
          font-weight: 500;
          padding: 14px 28px;
          border-radius: 40px;
          text-decoration: none;
          transition: background-color 250ms ease;
          white-space: nowrap;
        }

        /* ── Desktop: 3-column — heading | countdown | button ── */
        @media (min-width: 992px) {
          .lto-section {
            padding: 0;
            height: 250px;
            display: flex;
            align-items: center;
          }
          /*
           * 2fr auto 1fr:
           * - heading column is twice the button column → heading gets more room
           * - countdown sits in its natural width between them
           * - the wider left column shifts countdown visually to the right
           */
          .lto-grid {
            display: grid;
            grid-template-columns: 2fr auto 1fr;
            align-items: center;
            text-align: left;
            gap: 36px;
          }
          .lto-heading {
            font-size: 32px;
            font-weight: 600;
            line-height: 1.4;
          }
          .lto-cta-wrap { justify-content: flex-end; }
          .lto-cta { font-size: 17px; padding: 16px 32px; }
          /* Slightly larger cells on desktop */
          .lto-cd-cell { width: 66px; height: 64px; }
          .lto-cd-val  { font-size: 21px; }
          .lto-cd-lbl  { font-size: 12px; }
        }

        /* ── Small phones ── */
        @media (max-width: 480px) {
          .lto-countdown { gap: 6px; }
          .lto-cd-cell { width: 52px; height: 52px; }
          .lto-cd-val  { font-size: 16px; }
          .lto-cd-lbl  { font-size: 10px; }
        }
      `}</style>
    </section>
  );
}
