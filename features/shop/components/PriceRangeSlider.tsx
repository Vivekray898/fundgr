'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* ── Price Range Slider ──
   Single source of truth for every price slider in the project (desktop
   filter sidebar and mobile filter drawer both render this exact component)
   so there is no possibility of the two drifting apart in markup, CSS, or
   drag behavior. Colors are passed as props rather than read from
   ShopPageContent's ShopThemeCtx so this component has no dependency on
   where it's rendered from. */
export function PriceRangeSlider({
  min, max, value, onChange,
  accentColor = '#222', mutedColor = '#555', textColor = '#222',
}: {
  min: number; max: number; value: [number, number]; onChange: (v: [number, number]) => void;
  accentColor?: string; mutedColor?: string; textColor?: string;
}) {
  // `onChange` triggers a URL push + product refetch (see handlePriceChange),
  // which is far too expensive to run on every drag-frame — native range
  // inputs fire onChange continuously while dragging, so doing that work
  // per-pixel is what made the slider feel stuck/janky and made the page
  // stutter. Instead: drag updates this local state only (cheap, instant,
  // no navigation), and the expensive onChange is deferred until the drag
  // actually ends (pointerup/touchend/mouseup/keyup/blur).
  //
  // Earlier version of this fix also had a fixed 400ms debounce timer as a
  // fallback commit path. That timer doesn't know whether the pointer is
  // still down — if a user paused mid-drag for >400ms before continuing
  // (completely normal dragging behavior), the timer fired *while still
  // dragging*, triggering the exact page-jump/stutter this is supposed to
  // prevent. isPointerDownRef gates the fallback so it can only ever commit
  // once the pointer/touch has actually been released.
  const [local, setLocal] = useState<[number, number]>(value);
  const localRef = useRef(local);
  localRef.current = local;
  const isPointerDownRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-sync when the parent value changes from elsewhere (e.g. the "Remove
  // all" button or the price filter tag's ✕, which reset the range without
  // going through this slider's own drag).
  useEffect(() => {
    setLocal(value);
  }, [value[0], value[1]]);

  const flushCommit = useCallback(() => {
    isPointerDownRef.current = false;
    if (debounceRef.current) { clearTimeout(debounceRef.current); debounceRef.current = null; }
    onChange(localRef.current);
  }, [onChange]);

  const scheduleCommit = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      // Still dragging — do NOT commit (that's what caused the mid-drag
      // jump). The eventual release handler will flush the latest value.
      if (!isPointerDownRef.current) onChange(localRef.current);
    }, 400);
  }, [onChange]);

  // Percentage of the min↔max range each thumb sits at, used to position the
  // active (filled) track between them. The track itself is inset 14px each
  // side (half the 28px thumb) so it spans only the thumb-center travel
  // range — the fill has to use the same calc() so it lines up with the
  // thumbs exactly, at any container width and any price range.
  const span = max - min || 1;
  const leftPct = ((local[0] - min) / span) * 100;
  const rightPct = ((local[1] - min) / span) * 100;

  // Fires on release for every input method that has one — commits
  // instantly instead of waiting out the debounce fallback above.
  const releaseHandlers = {
    onPointerUp: flushCommit,
    onTouchEnd: flushCommit,
    onMouseUp: flushCommit,
    onKeyUp: flushCommit,
    onBlur: flushCommit,
    // Explicit pointer capture so a fast drag keeps tracking this thumb even
    // when the pointer briefly slips off its tiny hit area — without this,
    // the pointer can fall onto the sibling range input underneath (which
    // has pointer-events: none on everything but its own thumb) and the
    // drag appears to "get stuck" until the cursor re-enters the thumb.
    onPointerDown: (e: React.PointerEvent<HTMLInputElement>) => {
      isPointerDownRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
  };

  return (
    <div>
      <p style={{ fontSize: '14px', color: mutedColor, marginBottom: '18px' }}>The highest price is ${max.toFixed(2)}</p>

      {/* Slider container */}
      <div style={{ position: 'relative', height: '4px', margin: '28px 0 22px' }}>
        {/* Full-range track — dotted, spans the whole min↔max travel range.
            Left visible wherever the solid active bar below doesn't cover it
            (i.e. below the min thumb and above the max thumb). */}
        <div style={{
          position: 'absolute', top: '1px', left: '14px', right: '14px', height: '2px',
          backgroundImage: 'radial-gradient(circle, #999 1px, transparent 1.5px)',
          backgroundSize: '6px 2px', backgroundRepeat: 'repeat-x',
        }} />

        {/* Active track — solid, opaque, dynamically positioned/sized from the
            current (local, live-drag) value, so it always covers the dotted
            line exactly between the two thumbs. */}
        <div style={{
          position: 'absolute', top: '0', height: '4px',
          backgroundColor: accentColor, borderRadius: '2px',
          left: `calc(14px + (100% - 28px) * ${leftPct / 100})`,
          width: `calc((100% - 28px) * ${(rightPct - leftPct) / 100})`,
        }} />

        {/* Min range input — left+right constraints instead of width:calc so the browser
            computes the input width from geometry rather than a % reference */}
        <input
          type="range" min={min} max={max} value={local[0]}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            if (v < local[1]) { setLocal([v, local[1]]); scheduleCommit(); }
          }}
          className="price-slider-thumb"
          style={{ position: 'absolute', left: '14px', right: '14px', top: '50%', transform: 'translateY(-50%)', height: '28px', WebkitAppearance: 'none', appearance: 'none', background: 'transparent', pointerEvents: 'none', zIndex: 3, margin: 0 }}
          {...releaseHandlers}
        />

        {/* Max range input */}
        <input
          type="range" min={min} max={max} value={local[1]}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            if (v > local[0]) { setLocal([local[0], v]); scheduleCommit(); }
          }}
          className="price-slider-thumb"
          style={{ position: 'absolute', left: '14px', right: '14px', top: '50%', transform: 'translateY(-50%)', height: '28px', WebkitAppearance: 'none', appearance: 'none', background: 'transparent', pointerEvents: 'none', zIndex: 4, margin: 0 }}
          {...releaseHandlers}
        />
      </div>

      <p style={{ fontSize: '14px', fontWeight: 600, color: textColor }}>
        Price: <span style={{ fontWeight: 400, color: mutedColor }}>${local[0]} – ${local[1]}</span>
      </p>
    </div>
  );
}
