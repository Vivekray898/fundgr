'use client';

import Link from 'next/link';
import { useState } from 'react';

const ACCENT = '#c96742';
const DARK = '#111111';

function ArrowDiag() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export function ResetPasswordPageContent() {
  const [email, setEmail] = useState('');

  return (
    <>
      <div className="rp-hero">
        <h1 className="rp-hero-title">Log in</h1>
      </div>

      <div className="container-main" style={{ paddingTop: '6rem', paddingBottom: '8rem' }}>
        <div className="rp-layout">

          {/* ── Left: Reset form ── */}
          <section>
            <h2 className="rp-heading">Reset your password</h2>
            <p className="rp-desc">We will send you an email to reset your password</p>
            <form className="rp-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email *"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="au-input"
              />
              <div>
                <Link href="/login" className="rp-cancel">Cancel</Link>
              </div>
              <div>
                <button type="submit" className="rp-submit">Reset password</button>
              </div>
            </form>
          </section>

          {/* ── Right: New user ── */}
          <section>
            <h2 className="rp-heading">I&apos;m new here</h2>
            <p className="rp-new-text">
              Sign up for early{' '}
              <span style={{ color: ACCENT }}>Sale</span>{' '}
              access plus tailored new arrivals, trends and promotions. To opt out,
              click unsubscribe in our emails.
            </p>
            <Link href="/register" className="rp-register-link">
              Register <ArrowDiag />
            </Link>
          </section>

        </div>
      </div>

      <style>{rpStyles}</style>
    </>
  );
}

const rpStyles = `
  /* ── Hero ── */
  .rp-hero {
    background: linear-gradient(135deg, #ffffff 0%, #fdf4f0 50%, #fde8df 100%);
    padding: 5.5rem 0;
    text-align: center;
  }
  .rp-hero-title {
    font-size: 4rem;
    font-weight: 400;
    color: var(--color-heading);
    letter-spacing: 0.01em;
  }

  /* ── Two-column layout ── */
  .rp-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8rem;
    align-items: start;
  }
  .rp-heading {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 1.6rem;
  }

  /* ── Description ── */
  .rp-desc {
    font-size: 1.35rem;
    color: #555;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  /* ── Form ── */
  .rp-form {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    max-width: 42rem;
  }
  .au-input {
    width: 100%;
    height: 4.8rem;
    border: 1px solid #d5d5d5;
    border-radius: 0.3rem;
    padding: 0 1.4rem;
    font-size: 1.4rem;
    color: var(--color-heading);
    background: #fff;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s;
  }
  .au-input:focus { border-color: #888; }
  .au-input::placeholder { color: #bbb; }

  /* ── Cancel / submit ── */
  .rp-cancel {
    font-size: 1.35rem;
    color: var(--color-heading);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .rp-cancel:hover { color: ${ACCENT}; }
  .rp-submit {
    height: 5rem;
    min-width: 20rem;
    background: ${DARK};
    color: #fff;
    font-size: 1.5rem;
    font-weight: 600;
    border: none;
    border-radius: 0.4rem;
    cursor: pointer;
    font-family: inherit;
    padding: 0 3.2rem;
    letter-spacing: 0.02em;
    transition: background 0.2s;
  }
  .rp-submit:hover { background: #333; }

  /* ── Right column ── */
  .rp-new-text {
    font-size: 1.35rem;
    color: #555;
    line-height: 1.65;
    margin-bottom: 1.6rem;
  }
  .rp-register-link {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-heading);
    text-decoration: underline;
    text-underline-offset: 3px;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
  .rp-register-link:hover { color: ${ACCENT}; }

  @media (max-width: 749px) {
    .rp-layout { grid-template-columns: 1fr; gap: 4rem; }
    .rp-hero-title { font-size: 3rem; }
  }
`;
