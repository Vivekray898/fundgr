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

export function RegisterPageContent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="rg-hero">
        <h1 className="rg-hero-title">Register</h1>
      </div>

      <div className="container-main" style={{ paddingTop: '6rem', paddingBottom: '8rem' }}>
        <div className="rg-wrap">
          <h2 className="rg-heading">Register</h2>
          <p className="rg-subtitle">
            Sign up for early{' '}
            <span style={{ color: ACCENT }}>Sale</span>{' '}
            access plus tailored new arrivals, trends and promotions. To opt out,
            click unsubscribe in our emails
          </p>

          <form className="rg-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="au-input"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="au-input"
            />
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <button type="submit" className="rg-submit">Register</button>
          </form>

          <div className="rg-login-row">
            <Link href="/login" className="rg-login-link">
              Already have an account? Log in here{' '}
              <ArrowDiag />
            </Link>
          </div>
        </div>
      </div>

      <style>{rgStyles}</style>
    </>
  );
}

const rgStyles = `
  /* ── Hero ── */
  .rg-hero {
    background: linear-gradient(135deg, #ffffff 0%, #fdf4f0 50%, #fde8df 100%);
    padding: 5.5rem 0;
    text-align: center;
  }
  .rg-hero-title {
    font-size: 4rem;
    font-weight: 400;
    color: var(--color-heading);
    letter-spacing: 0.01em;
  }

  /* ── Form wrapper ── */
  .rg-wrap {
    max-width: 440px;
    margin: 0 auto;
  }
  .rg-heading {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 1.2rem;
  }
  .rg-subtitle {
    font-size: 1.35rem;
    color: #555;
    line-height: 1.65;
    margin-bottom: 2.8rem;
  }

  /* ── Shared input styles ── */
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

  /* ── Form layout ── */
  .rg-form {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }

  /* ── Submit button ── */
  .rg-submit {
    width: 100%;
    height: 5rem;
    background: ${DARK};
    color: #fff;
    font-size: 1.5rem;
    font-weight: 600;
    border: none;
    border-radius: 0.4rem;
    cursor: pointer;
    font-family: inherit;
    letter-spacing: 0.02em;
    transition: background 0.2s;
    margin-top: 0.4rem;
  }
  .rg-submit:hover { background: #333; }

  /* ── Login link ── */
  .rg-login-row {
    text-align: center;
    margin-top: 2.4rem;
  }
  .rg-login-link {
    font-size: 1.4rem;
    color: var(--color-heading);
    text-decoration: underline;
    text-underline-offset: 3px;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
  .rg-login-link:hover { color: ${ACCENT}; }

  @media (max-width: 749px) {
    .rg-hero-title { font-size: 3rem; }
    .rg-wrap { max-width: 100%; }
  }
`;
