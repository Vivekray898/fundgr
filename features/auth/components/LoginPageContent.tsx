'use client';

import Link from 'next/link';
import { useState } from 'react';

const ACCENT = '#c96742';
const DARK = '#111111';

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ArrowDiag() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export function LoginPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="li-hero">
        <h1 className="li-hero-title">Log in</h1>
      </div>

      <div className="container-main" style={{ paddingTop: '6rem', paddingBottom: '8rem' }}>
        <div className="li-layout">

          {/* ── Left: Login form ── */}
          <section>
            <h2 className="li-heading">Log in</h2>
            <form className="li-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email *"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="au-input"
              />
              <div className="au-pw-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password *"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="au-input au-pw-input"
                />
                <button
                  type="button"
                  className="au-eye-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <div>
                <Link href="/reset-password" className="li-forgot">
                  Forgot your password?
                </Link>
              </div>

              <div>
                <button type="submit" className="li-submit">Log in</button>
              </div>
            </form>
          </section>

          {/* ── Right: New user ── */}
          <section>
            <h2 className="li-heading">I&apos;m new here</h2>
            <p className="li-new-text">
              Sign up for early{' '}
              <span style={{ color: ACCENT }}>Sale</span>{' '}
              access plus tailored new arrivals, trends and promotions. To opt out,
              click unsubscribe in our emails.
            </p>
            <Link href="/register" className="li-register-link">
              Register <ArrowDiag />
            </Link>
          </section>

        </div>
      </div>

      <style>{liStyles}</style>
    </>
  );
}

const liStyles = `
  /* ── Hero ── */
  .li-hero {
    background: linear-gradient(135deg, #ffffff 0%, #fdf4f0 50%, #fde8df 100%);
    padding: 5.5rem 0;
    text-align: center;
  }
  .li-hero-title {
    font-size: 4rem;
    font-weight: 400;
    color: var(--color-heading);
    letter-spacing: 0.01em;
  }

  /* ── Two-column layout ── */
  .li-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8rem;
    align-items: start;
  }
  .li-heading {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 2rem;
  }

  /* ── Form ── */
  .li-form {
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
  .au-pw-wrap { position: relative; }
  .au-pw-input { padding-right: 4.8rem; }
  .au-eye-btn {
    position: absolute;
    right: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #aaa;
    display: flex;
    align-items: center;
    padding: 0.4rem;
    line-height: 1;
    transition: color 0.15s;
  }
  .au-eye-btn:hover { color: #555; }

  /* ── Forgot / submit ── */
  .li-forgot {
    font-size: 1.35rem;
    color: var(--color-heading);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .li-forgot:hover { color: ${ACCENT}; }
  .li-submit {
    height: 5rem;
    min-width: 16rem;
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
  .li-submit:hover { background: #333; }

  /* ── Right column ── */
  .li-new-text {
    font-size: 1.35rem;
    color: #555;
    line-height: 1.65;
    margin-bottom: 1.6rem;
  }
  .li-register-link {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-heading);
    text-decoration: underline;
    text-underline-offset: 3px;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
  .li-register-link:hover { color: ${ACCENT}; }

  @media (max-width: 749px) {
    .li-layout { grid-template-columns: 1fr; gap: 4rem; }
    .li-hero-title { font-size: 3rem; }
  }
`;
