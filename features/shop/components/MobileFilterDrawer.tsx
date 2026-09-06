'use client';

import { useEffect, useRef, useState } from 'react';
import { SORT_OPTIONS } from '@/lib/constants';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { PriceRangeSlider } from './PriceRangeSlider';
import type { FiltersData } from '@/types/common';

/* ── Icons ── */

function IconFilter({ size = 20 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function IconClose({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z" />
    </svg>
  );
}

/* Provided arrow icon — used on main rows (points right) and as the
   sub-view back button (rotated 180°). Single-sourced so the two match. */
function IconArrow({ size = 14, flip = false }: { size?: number; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 14 10"
      fill="none"
      width={size}
      height={(size * 10) / 14}
      aria-hidden="true"
      focusable="false"
      style={{ transform: flip ? 'rotate(180deg)' : undefined, transition: 'transform 220ms ease-in-out' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconChevronDown({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
    </svg>
  );
}

/* ── Shared subcomponents ── */

function FilterCheckbox({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) {
  // Single button — no nested <input> + <label>. The previous setup fired
  // onChange twice per tap (once from the span's onClick, once from the
  // label delegating to the hidden input), which cancelled the toggle.
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 0', cursor: 'pointer', fontSize: '15px', color: '#222',
        background: 'none', border: 'none', textAlign: 'left',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          style={{
            width: '20px', height: '20px', border: `1.5px solid ${checked ? '#222' : '#c5c5c5'}`,
            borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: checked ? '#222' : '#fff', transition: 'all 180ms ease',
            flexShrink: 0,
          }}
        >
          {checked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        {label}
      </span>
      <span style={{ fontSize: '15px', color: '#555' }}>{count}</span>
    </button>
  );
}

/* ── Types ── */

type SubKey = 'availability' | 'price' | 'brand' | 'color' | 'size' | 'category';

interface PendingState {
  availability: string;
  brand: string;
  color: string;
  size: string;
  category: string;
  sort: string;
  priceRange: [number, number];
}

export interface MobileFilterApplyPayload {
  availability: string;
  brand: string;
  color: string;
  size: string;
  category: string;
  sort: string;
  minPrice: number;
  maxPrice: number;
}

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FiltersData | undefined;
  selected: {
    availability: string;
    brand: string;
    color: string;
    size: string;
    category: string;
    sort: string;
  };
  priceRange: [number, number];
  productCount: number;
  onApply: (payload: MobileFilterApplyPayload) => void;
  onRemoveAll: () => void;
  /** Theme colors forwarded from ShopPageContent so the price slider matches the desktop sidebar. */
  theme?: { accentColor: string; mutedColor: string; textColor: string };
}

/* ── Component ── */

export function MobileFilterDrawer({
  open,
  onClose,
  filters,
  selected,
  priceRange,
  productCount,
  onApply,
  onRemoveAll,
  theme,
}: MobileFilterDrawerProps) {
  const [view, setView] = useState<'main' | SubKey>('main');
  const [sortOpen, setSortOpen] = useState(false);
  const [pending, setPending] = useState<PendingState>({
    availability: selected.availability,
    brand: selected.brand,
    color: selected.color,
    size: selected.size,
    category: selected.category,
    sort: selected.sort,
    priceRange,
  });

  // Keep the latest selected/priceRange in refs so we can read fresh values
  // from the open-transition effect below without having to list them as
  // deps. priceRange arrives as a new array literal from the parent on
  // every render — including it directly would cause this effect to fire
  // (and wipe the user's in-flight selections) on every parent re-render.
  const selectedRef = useRef(selected);
  const priceRangeRef = useRef(priceRange);
  selectedRef.current = selected;
  priceRangeRef.current = priceRange;

  // Seed pending ONLY when the drawer transitions from closed to open —
  // not on any prop change while the drawer is already open.
  useEffect(() => {
    if (open) {
      setPending({
        availability: selectedRef.current.availability,
        brand: selectedRef.current.brand,
        color: selectedRef.current.color,
        size: selectedRef.current.size,
        category: selectedRef.current.category,
        sort: selectedRef.current.sort,
        priceRange: priceRangeRef.current,
      });
      setView('main');
      setSortOpen(false);
    }
  }, [open]);

  // Lock body scroll while open — uses the project's shared hook so
  // document.body gets the `.scroll-locked` class (same pattern as drawers
  // and modals elsewhere). Global CSS then hides MobileBottomNav while
  // locked so it can't peek through the drawer at the bottom.
  useLockBodyScroll(open);

  const handleApply = () => {
    onApply({
      availability: pending.availability,
      brand: pending.brand,
      color: pending.color,
      size: pending.size,
      category: pending.category,
      sort: pending.sort,
      minPrice: pending.priceRange[0],
      maxPrice: pending.priceRange[1],
    });
    onClose();
  };

  const handleRemoveAll = () => {
    setPending({
      availability: '',
      brand: '',
      color: '',
      size: '',
      category: '',
      sort: 'featured',
      priceRange: [filters?.priceRange.min ?? 0, filters?.priceRange.max ?? 100],
    });
    onRemoveAll();
    onClose();
  };

  const handleClearSub = (key: SubKey) => {
    setPending((p) => {
      if (key === 'price') {
        return { ...p, priceRange: [filters?.priceRange.min ?? 0, filters?.priceRange.max ?? 100] };
      }
      return { ...p, [key]: '' };
    });
  };

  const rows: { key: SubKey; label: string }[] = [
    { key: 'availability', label: 'Availability' },
    { key: 'price', label: 'Price' },
    { key: 'size', label: 'Size' },
    { key: 'brand', label: 'Brand' },
    { key: 'category', label: 'Category' },
    { key: 'color', label: 'Color' },
  ];

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === pending.sort)?.label ?? 'Featured';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden={!open}
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 320ms ease-in-out',
          zIndex: 1000,
        }}
      />

      {/* Drawer — slides in from the right, flush to all viewport edges.
          Using top/bottom:0 (plus 100dvh fallback on the class) guarantees
          the drawer covers the exact visible viewport — no bottom gap on
          devices where 100dvh under-measures, no chance of MobileBottomNav
          peeking through below the footer. */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filter and sort"
        className="mfd-drawer"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(400px, 100vw)',
          backgroundColor: '#fff',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 340ms ease-in-out',
          boxShadow: open ? '0 0 40px rgba(0,0,0,0.18)' : 'none',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ position: 'relative', padding: '14px 20px 12px', borderBottom: '1px solid #eee', textAlign: 'center', flex: '0 0 auto' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#222' }}>Filter and sort</h2>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>{productCount} products</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: '14px', right: '18px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#222', padding: '4px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Sliding pane (main ↔ sub) */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              width: '200%',
              height: '100%',
              transform: view === 'main' ? 'translateX(0)' : 'translateX(-50%)',
              transition: 'transform 340ms ease-in-out',
            }}
          >
            {/* ── Main view ── */}
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <nav style={{ padding: '2px 0', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                {rows.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setView(key)}
                    className="mfd-row"
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '15px', color: '#222', textAlign: 'left',
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background-color 160ms ease',
                    }}
                  >
                    {label}
                    <IconArrow size={14} />
                  </button>
                ))}

                {/* Sort by (inline, accordion-style expand) */}
                <div style={{ padding: '14px 20px 12px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px', color: '#222' }}>SORT BY</span>
                    <button
                      type="button"
                      onClick={() => setSortOpen((v) => !v)}
                      aria-expanded={sortOpen}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: 'none',
                        border: sortOpen ? '1px solid #222' : '1px solid transparent',
                        padding: '8px 12px', borderRadius: '4px',
                        cursor: 'pointer', fontSize: '15px', color: '#222',
                        transition: 'border-color 220ms ease-in-out',
                      }}
                    >
                      {activeSortLabel}
                      <span style={{ transition: 'transform 260ms ease-in-out', transform: sortOpen ? 'rotate(180deg)' : 'none', display: 'inline-flex' }}>
                        <IconChevronDown size={14} />
                      </span>
                    </button>
                  </div>

                  {/* Accordion: grid-template-rows 0fr → 1fr so the list
                      opens/closes smoothly and auto-sizes to content.
                      The list is anchored to the right (under the trigger)
                      and capped at ~240px so all options fit without any
                      internal scroll. */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: sortOpen ? '1fr' : '0fr',
                      opacity: sortOpen ? 1 : 0,
                      transition: 'grid-template-rows 320ms ease-in-out, opacity 260ms ease-in-out',
                      marginTop: sortOpen ? '10px' : '0',
                    }}
                  >
                    <div style={{ overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ width: '240px', maxWidth: '100%', border: '1px solid #222', borderRadius: '2px', backgroundColor: '#fff' }}>
                        {SORT_OPTIONS.map((o) => {
                          const active = pending.sort === o.value;
                          return (
                            <button
                              key={o.value}
                              type="button"
                              onClick={() => {
                                setPending((p) => ({ ...p, sort: o.value }));
                                setSortOpen(false);
                              }}
                              style={{
                                display: 'block', width: '100%',
                                padding: '6px 12px',
                                backgroundColor: active ? '#2546f0' : '#fff',
                                color: active ? '#fff' : '#222',
                                border: 'none', textAlign: 'left', cursor: 'pointer',
                                fontSize: '13px', lineHeight: 1.4,
                                transition: 'background-color 180ms ease-in-out, color 180ms ease-in-out',
                              }}
                            >
                              {o.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </nav>

              {/* Footer (main) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '12px 20px', borderTop: '1px solid #eee', backgroundColor: '#fff', flex: '0 0 auto' }}>
                <button type="button" onClick={handleRemoveAll} style={{ fontSize: '14px', color: '#222', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 500 }}>
                  Remove all
                </button>
                <button type="button" onClick={handleApply} className="mfd-apply-btn">
                  Apply
                </button>
              </div>
            </div>

            {/* ── Sub view ── */}
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flex: 1, padding: '14px 20px', overflow: 'hidden', minHeight: 0 }}>
                <button
                  type="button"
                  onClick={() => setView('main')}
                  aria-label="Back to filters"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#222', fontWeight: 500, marginBottom: '20px', padding: 0 }}
                >
                  <IconArrow size={14} flip />
                  {view !== 'main' && view.charAt(0).toUpperCase() + view.slice(1)}
                </button>

                {/* Content per sub-view. Render all, hide inactive. */}
                {filters && view === 'availability' && (
                  <div>
                    {([
                      { label: 'In stock', value: 'in-stock', count: filters.categories.reduce((s, c) => s + c.count, 0) },
                      { label: 'Out of stock', value: 'out-of-stock', count: 1 },
                    ]).map((o) => (
                      <FilterCheckbox
                        key={o.value}
                        label={o.label}
                        count={o.count}
                        checked={pending.availability === o.value}
                        onChange={() => setPending((p) => ({ ...p, availability: p.availability === o.value ? '' : o.value }))}
                      />
                    ))}
                  </div>
                )}

                {filters && view === 'price' && (
                  <PriceRangeSlider
                    min={filters.priceRange.min}
                    max={filters.priceRange.max}
                    value={pending.priceRange}
                    onChange={(r) => setPending((p) => ({ ...p, priceRange: r }))}
                    accentColor={theme?.accentColor}
                    mutedColor={theme?.mutedColor}
                    textColor={theme?.textColor}
                  />
                )}

                {filters && view === 'brand' && (
                  <div>
                    {filters.brands.map((b) => (
                      <FilterCheckbox
                        key={b.name}
                        label={b.name}
                        count={b.count}
                        checked={pending.brand === b.name}
                        onChange={() => setPending((p) => ({ ...p, brand: p.brand === b.name ? '' : b.name }))}
                      />
                    ))}
                  </div>
                )}

                {filters && view === 'category' && (
                  <div>
                    {filters.categories.map((c) => (
                      <FilterCheckbox
                        key={c.name}
                        label={c.name}
                        count={c.count}
                        checked={pending.category === c.name}
                        onChange={() => setPending((p) => ({ ...p, category: p.category === c.name ? '' : c.name }))}
                      />
                    ))}
                  </div>
                )}

                {filters && view === 'color' && (
                  <div>
                    {filters.colors.map((c) => (
                      <FilterCheckbox
                        key={c.name}
                        label={c.name}
                        count={c.count}
                        checked={pending.color === c.name}
                        onChange={() => setPending((p) => ({ ...p, color: p.color === c.name ? '' : c.name }))}
                      />
                    ))}
                  </div>
                )}

                {filters && view === 'size' && (
                  <div>
                    {filters.sizes.length === 0 ? (
                      <p style={{ fontSize: '14px', color: '#888' }}>No sizes available for this collection.</p>
                    ) : filters.sizes.map((s) => (
                      <FilterCheckbox
                        key={s.name}
                        label={s.name}
                        count={s.count}
                        checked={pending.size === s.name}
                        onChange={() => setPending((p) => ({ ...p, size: p.size === s.name ? '' : s.name }))}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer (sub) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '12px 20px', borderTop: '1px solid #eee', backgroundColor: '#fff', flex: '0 0 auto' }}>
                <button type="button" onClick={() => view !== 'main' && handleClearSub(view)} style={{ fontSize: '14px', color: '#222', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 500 }}>
                  Clear
                </button>
                <button type="button" onClick={() => setView('main')} className="mfd-apply-btn">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        /* Height is derived from top:0 + bottom:0 on the aside — no explicit
           height is set, otherwise CSS would over-constrain the box and make
           the browser honor the height while ignoring bottom, which can push
           the footer offscreen on viewports where 100vh > visible area. */
        .mfd-row:hover { background-color: #f9f9f9; }
        .mfd-apply-btn {
          min-width: 140px;
          padding: 13px 28px;
          background-color: #000;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 40px;
          cursor: pointer;
          transition: background-color 220ms ease;
        }
        .mfd-apply-btn:hover { background-color: #F15B41; }
      `}</style>
    </>
  );
}

export { IconFilter };
