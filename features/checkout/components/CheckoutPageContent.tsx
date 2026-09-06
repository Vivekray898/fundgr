'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatPrice';

const ACCENT = '#c96742';
const DARK = '#111111';

const COUNTRIES = [
  { value: '', label: '---' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IN', label: 'India' },
  { value: 'JP', label: 'Japan' },
  { value: 'SG', label: 'Singapore' },
  { value: 'AE', label: 'United Arab Emirates' },
];

type PaymentMethod = 'bank' | 'cod';

function IcoCheck() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function CheckoutPageContent() {
  const { items, getSubtotal } = useCartStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const subtotal = getSubtotal();

  return (
    <>
      {/* ── Hero Banner ── */}
      <div className="co-hero">
        <h1 className="co-hero-title">Check Out</h1>
      </div>

      {/* ── Main Content ── */}
      <div className="container-main" style={{ paddingTop: '6rem', paddingBottom: '8rem' }}>
        <div className="co-layout">

          {/* ── LEFT: Billing Details ── */}
          <section>
            <h2 className="co-section-title">Billing details</h2>
            <div className="co-fields">

              {/* First + Last name */}
              <div className="co-row-2">
                <div className="co-field">
                  <label className="co-label">First Name<span className="co-req">*</span></label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Themesflat"
                    className="co-input"
                  />
                </div>
                <div className="co-field">
                  <label className="co-label">Last Name<span className="co-req">*</span></label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="co-input"
                  />
                </div>
              </div>

              {/* Country/Region */}
              <div className="co-field">
                <label className="co-label">Country/Region<span className="co-req">*</span></label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="co-select"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Town/City */}
              <div className="co-field">
                <label className="co-label">Town/City<span className="co-req">*</span></label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="co-input"
                />
              </div>

              {/* Address */}
              <div className="co-field">
                <label className="co-label">Address<span className="co-req">*</span></label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="co-input"
                />
              </div>

              {/* Phone Number */}
              <div className="co-field">
                <label className="co-label">Phone Number<span className="co-req">*</span></label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="co-input"
                />
              </div>

              {/* Email */}
              <div className="co-field">
                <label className="co-label">Email<span className="co-req">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="co-input"
                />
              </div>

              {/* Order notes */}
              <div className="co-field">
                <label className="co-label">Order notes (optional)<span className="co-req">*</span></label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="co-textarea"
                  rows={5}
                />
              </div>

            </div>
          </section>

          {/* ── RIGHT: Your Order ── */}
          <aside className="co-order-aside">
            <h2 className="co-section-title">Your order</h2>

            {/* Cart items card */}
            <div className="co-order-card">
              {items.length === 0 ? (
                <div className="co-empty-state">
                  <p className="co-empty-text">Your shop cart is empty</p>
                  <Link href="/shop" className="co-explore-btn">Explore Products!</Link>
                </div>
              ) : (
                <>
                  <div className="co-order-head">
                    <span>Product</span>
                    <span>Subtotal</span>
                  </div>
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="co-order-row">
                      <span className="co-order-name">
                        {item.name}{' '}
                        <span className="co-order-qty">× {item.quantity}</span>
                      </span>
                      <span className="co-order-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="co-order-subtotal">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Discount code — merged bottom edge of order card */}
            <div className="co-discount-row">
              <input
                type="text"
                placeholder="Discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="co-discount-input"
              />
              <button className="co-discount-apply">Apply</button>
            </div>

            {/* Total */}
            <div className="co-total-bar">
              <span className="co-total-label">Total</span>
              <span className="co-total-amount">{formatPrice(subtotal)}</span>
            </div>

            {/* Payment methods */}
            <div className="co-payment-wrap">
              {(
                [
                  { value: 'bank' as PaymentMethod, label: 'Direct bank transfer' },
                  { value: 'cod' as PaymentMethod, label: 'Cash on delivery' },
                ] as const
              ).map(({ value, label }) => (
                <label
                  key={value}
                  className="co-payment-opt"
                  onClick={() => setPaymentMethod(value)}
                >
                  <span className={`co-radio-dot${paymentMethod === value ? ' co-radio-on' : ''}`}>
                    {paymentMethod === value && <IcoCheck />}
                  </span>
                  <span className="co-payment-text">{label}</span>
                </label>
              ))}
            </div>

            {/* Privacy text */}
            <p className="co-privacy">
              Your personal data will be used to process your order, support your
              experience throughout this website, and for other purposes described in
              our{' '}
              <Link href="/pages/privacy-policy" className="co-link">
                privacy policy
              </Link>
              .
            </p>

            {/* Terms checkbox */}
            <label className="co-terms">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="co-terms-check"
              />
              <span>
                I have read and agree to the website{' '}
                <Link href="#" className="co-link">terms and conditions</Link>
              </span>
            </label>

            {/* Place order */}
            <button
              className="co-place-order"
              disabled={!agreeTerms}
            >
              Place order
            </button>

          </aside>
        </div>
      </div>

      <style>{coStyles}</style>
    </>
  );
}

/* ── Styles ──────────────────────────────────────────────────── */

const coStyles = `
  /* ── Hero ── */
  .co-hero {
    background: linear-gradient(135deg, #ffffff 0%, #fdf4f0 50%, #fde8df 100%);
    padding: 5.5rem 0;
    text-align: center;
  }
  .co-hero-title {
    font-size: 4rem;
    font-weight: 400;
    color: var(--color-heading);
    letter-spacing: 0.01em;
  }

  /* ── Two-column layout ── */
  .co-layout {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    gap: 5rem;
    align-items: start;
  }

  /* ── Section titles ── */
  .co-section-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 3rem;
  }

  /* ── Billing form ── */
  .co-fields { display: flex; flex-direction: column; gap: 2rem; }
  .co-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.8rem; }
  .co-field { display: flex; flex-direction: column; gap: 0.7rem; }
  .co-label {
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--color-heading);
  }
  .co-req { color: #e84d1c; margin-left: 0.15rem; }
  .co-input {
    width: 100%;
    height: 4.8rem;
    border: 1px solid #ddd;
    border-radius: 0.4rem;
    padding: 0 1.4rem;
    font-size: 1.4rem;
    color: var(--color-heading);
    background: #fff;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s;
  }
  .co-input::placeholder { color: #bbb; }
  .co-input:focus { border-color: #999; }
  .co-select {
    width: 100%;
    height: 4.8rem;
    border: 1px solid #ddd;
    border-radius: 0.4rem;
    padding: 0 1.4rem;
    font-size: 1.4rem;
    color: #555;
    background: #fff;
    outline: none;
    cursor: pointer;
    font-family: inherit;
    transition: border-color 0.2s;
  }
  .co-select:focus { border-color: #999; }
  .co-textarea {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 0.4rem;
    padding: 1.2rem 1.4rem;
    font-size: 1.4rem;
    color: var(--color-heading);
    background: #fff;
    outline: none;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
    min-height: 13rem;
    transition: border-color 0.2s;
  }
  .co-textarea:focus { border-color: #999; }

  /* ── Sticky aside ── */
  .co-order-aside {
    position: sticky;
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    scrollbar-width: none;
  }
  .co-order-aside::-webkit-scrollbar { display: none; }

  /* ── Order card (cart items) ── */
  .co-order-card {
    background: #f7f7f7;
    border: 1px solid #e5e5e5;
    border-radius: 0.6rem;
    overflow: hidden;
    margin-bottom: 1.6rem;
  }
  .co-empty-state {
    padding: 4rem 2.4rem;
    text-align: center;
  }
  .co-empty-text {
    font-size: 1.5rem;
    color: #666;
    margin-bottom: 2rem;
  }
  .co-explore-btn {
    display: block;
    background: ${DARK};
    color: #fff;
    font-size: 1.5rem;
    font-weight: 600;
    padding: 1.4rem 0;
    border-radius: 0.4rem;
    text-decoration: none;
    text-align: center;
    transition: background 0.2s;
  }
  .co-explore-btn:hover { background: #333; }
  .co-order-head {
    display: flex;
    justify-content: space-between;
    padding: 1.2rem 2rem;
    background: #fafafa;
    border-bottom: 1px solid #e0e0e0;
    font-size: 1.3rem;
    font-weight: 600;
    color: #666;
  }
  .co-order-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.2rem 2rem;
    border-bottom: 1px solid #f0f0f0;
    gap: 1rem;
  }
  .co-order-name {
    font-size: 1.35rem;
    color: var(--color-heading);
    flex: 1;
    line-height: 1.4;
  }
  .co-order-qty { color: #888; }
  .co-order-price {
    font-size: 1.35rem;
    font-weight: 500;
    color: var(--color-heading);
    white-space: nowrap;
  }
  .co-order-subtotal {
    display: flex;
    justify-content: space-between;
    padding: 1.2rem 2rem;
    background: #fafafa;
    border-top: 1px solid #e0e0e0;
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-heading);
  }

  /* ── Discount code ── */
  .co-discount-row {
    display: flex;
    border: 1px solid #e0e0e0;
    border-radius: 0.4rem;
    overflow: hidden;
    margin-bottom: 2rem;
  }
  .co-discount-input {
    flex: 1;
    height: 4.8rem;
    border: none;
    border-right: 1px solid #e0e0e0;
    padding: 0 1.6rem;
    font-size: 1.4rem;
    color: var(--color-heading);
    outline: none;
    font-family: inherit;
    background: #fff;
    min-width: 0;
  }
  .co-discount-input::placeholder { color: #aaa; }
  .co-discount-apply {
    background: ${DARK};
    color: #fff;
    font-size: 1.45rem;
    font-weight: 600;
    padding: 0 2.4rem;
    height: 4.8rem;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    font-family: inherit;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .co-discount-apply:hover { background: #333; }

  /* ── Total bar ── */
  .co-total-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.6rem 0 2rem;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 2.4rem;
  }
  .co-total-label {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-heading);
  }
  .co-total-amount {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-heading);
  }

  /* ── Payment methods ── */
  .co-payment-wrap {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-bottom: 2.2rem;
    padding-bottom: 2.2rem;
    border-bottom: 1px solid #e0e0e0;
  }
  .co-payment-opt {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    user-select: none;
  }
  .co-radio-dot {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 2px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #fff;
    transition: border-color 0.18s, background 0.18s;
  }
  .co-radio-on {
    background: #e84d1c;
    border-color: #e84d1c;
  }
  .co-payment-text {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--color-heading);
  }

  /* ── Privacy & terms ── */
  .co-privacy {
    font-size: 1.3rem;
    color: #666;
    line-height: 1.65;
    margin-bottom: 1.8rem;
  }
  .co-link {
    color: ${ACCENT};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .co-terms {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    font-size: 1.35rem;
    color: var(--color-body);
    cursor: pointer;
    margin-bottom: 2.6rem;
    line-height: 1.5;
  }
  .co-terms-check {
    width: 1.6rem;
    height: 1.6rem;
    flex-shrink: 0;
    margin-top: 0.1rem;
    cursor: pointer;
    accent-color: #e84d1c;
  }

  /* ── Place order button ── */
  .co-place-order {
    width: 100%;
    background: ${DARK};
    color: #fff;
    font-size: 1.55rem;
    font-weight: 600;
    height: 5.6rem;
    border: none;
    border-radius: 0.4rem;
    cursor: pointer;
    font-family: inherit;
    letter-spacing: 0.01em;
    transition: background 0.2s;
  }
  .co-place-order:hover:not(:disabled) { background: #333; }
  .co-place-order:disabled { opacity: 0.45; cursor: not-allowed; }

  /* ── Responsive ── */
  @media (max-width: 749px) {
    .co-layout { grid-template-columns: 1fr; gap: 4rem; }
    .co-row-2 { grid-template-columns: 1fr; }
    .co-hero-title { font-size: 3rem; }
  }
  @media (min-width: 750px) and (max-width: 1023px) {
    .co-layout { grid-template-columns: 1fr 1fr; gap: 3rem; }
  }
`;
