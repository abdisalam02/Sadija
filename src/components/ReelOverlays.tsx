import React from 'react';

/* ── Mathematical Easing Helpers ────────────────────────────────────────── */

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const easeOutExpo = (t: number) => {
  const x = clamp01(t);
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
};

export const easeInOutCubic = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/* ── Timeline & Incremental Top Story Beats ─────────────────────────────── */

export const REEL_DURATION = 34.0;

export interface StoryBeat {
  start: number;
  end: number;
  text: string;
}

export const STORY_BEATS: StoryBeat[] = [
  {
    start: 0.0,
    end: 7.0,
    text: 'This client had a Linktree. It felt too basic.',
  },
  {
    start: 7.0,
    end: 14.5,
    text: 'I got creative freedom so I replaced it with this custom design.',
  },
  {
    start: 14.5,
    end: 24.4,
    text: 'Shows latest YouTube vids, Spotify playlists.',
  },
];

// Scene jump markers for keys 1-4
export const REEL_CHECKPOINTS = [0.0, 7.0, 14.5, 24.4];

/* ── 1. Simulated Touch Ripple Cursor (Inside 390x844 Phone Screen) ─────── */

export interface TouchCursorState {
  x: number;
  y: number;
  visible: boolean;
  pressed: boolean;
  rippleProgress: number;
}

export const TouchRippleCursor: React.FC<{ state: TouchCursorState }> = ({ state }) => {
  if (!state.visible) return null;

  const scale = state.pressed ? 0.78 : 1;
  const showRipple = state.rippleProgress > 0 && state.rippleProgress < 1;
  const rippleScale = 0.85 + state.rippleProgress * 1.9;
  const rippleOpacity = (1 - state.rippleProgress) * 0.7;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-[72]"
      style={{
        transform: `translate3d(${state.x}px, ${state.y}px, 0)`,
      }}
    >
      {showRipple && (
        <div
          className="absolute -left-6 -top-6 w-12 h-12 rounded-full border-[1.5px] border-[#111113]"
          style={{
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
          }}
        />
      )}

      <div
        className="relative -left-4 -top-4 w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transition: 'transform 110ms cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'rgba(17, 17, 19, 0.72)',
          border: '1.5px solid rgba(255, 255, 255, 0.92)',
          boxShadow: '0 6px 18px rgba(17, 17, 19, 0.25)',
        }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
    </div>
  );
};

/* ── 2. Top Incremental Story Caption (Bit-by-Bit Word Reveal) ──────────── */

export const TopAdCaption: React.FC<{
  elapsed: number;
  showHud: boolean;
}> = ({ elapsed, showHud }) => {
  if (!showHud || elapsed >= 24.4) {
    return <div className="h-[158px] shrink-0" />;
  }

  const activeBeat =
    STORY_BEATS.find((b) => elapsed >= b.start && elapsed < b.end) ||
    STORY_BEATS[STORY_BEATS.length - 1];

  const localT = elapsed - activeBeat.start;
  const beatDuration = activeBeat.end - activeBeat.start;

  // Smooth fade-out at the very end of each beat
  const fadeOut = 1 - easeInOutCubic((localT - (beatDuration - 0.38)) / 0.38);

  const words = activeBeat.text.split(' ');

  return (
    <div
      className="w-full h-[158px] shrink-0 px-7 pt-[106px] pb-1 flex items-center justify-center text-center select-none z-20"
      style={{
        opacity: clamp01(fadeOut),
        fontFamily:
          "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
      }}
    >
      <h2 className="font-extrabold text-[18px] leading-[1.24] tracking-[-0.028em] text-[#111113] max-w-[332px] mx-auto flex flex-wrap justify-center gap-x-[5px] gap-y-[2px]">
        {words.map((word, idx) => {
          // Stagger each word bit-by-bit across the first ~0.75s of the beat
          const wordDelay = idx * 0.065;
          const wordP = easeOutExpo((localT - wordDelay) / 0.36);
          return (
            <span
              key={`${activeBeat.start}-${idx}`}
              style={{
                opacity: wordP,
                transform: `translate3d(0, ${(1 - wordP) * 7}px, 0)`,
              }}
              className="inline-block"
            >
              {word}
            </span>
          );
        })}
      </h2>
    </div>
  );
};

/* ── 3. Finale: Check it out -> Link Glides Up -> by -> Signature (24.4s – 30.0s) */

export const CenterSignatureFinale: React.FC<{ elapsed: number }> = ({ elapsed }) => {
  if (elapsed < 24.35) return null;

  // 1. Clean fade to #f6f5f2 paper backdrop (24.35s -> 24.8s)
  const curtainProgress = easeInOutCubic((elapsed - 24.35) / 0.45);

  // 2. Step 1: "Check it out yourself" staggered word reveal (24.55s -> 25.1s)
  const checkWords = ['Check', 'it', 'out', 'yourself'];

  // 3. Step 2: "sadija.info" unboxed navy link animation (25.1s -> 25.75s)
  const linkTextProgress = easeOutExpo((elapsed - 25.1) / 0.42);
  const linkUnderlineProgress = easeInOutCubic((elapsed - 25.26) / 0.42);
  const linkIconProgress = easeOutExpo((elapsed - 25.18) / 0.38);

  // 4. Step 3: Link block glides up to make space for "by" and signature (25.95s -> 26.65s)
  const moveUpProgress = easeInOutCubic((elapsed - 25.95) / 0.65);
  const moveUpY = -moveUpProgress * 44;

  // 5. "by" smoothly fades and slides into the opened space (26.4s -> 26.9s)
  const byEnter = easeOutExpo((elapsed - 26.4) / 0.45);

  // 6. Live handwriting progression of "A. Gure" from left to right (26.7s -> 28.0s)
  const signWriteProgress = easeInOutCubic((elapsed - 26.7) / 1.25);
  const clipRightPercent = (1 - signWriteProgress) * 100;

  // 7. Flourish underline stroke right as the name finishes signing (27.8s -> 28.5s)
  const underlineProgress = easeOutExpo((elapsed - 27.8) / 0.65);

  // 8. Subtle domain link beneath signature (28.15s -> 28.75s)
  const domainProgress = easeOutExpo((elapsed - 28.15) / 0.55);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[80] flex flex-col items-center justify-center px-8 select-none"
      style={{
        opacity: curtainProgress,
        backgroundColor: '#f6f5f2',
        color: '#111113',
      }}
    >
      <div className="flex flex-col items-center text-center w-full max-w-[340px]">
        {/* Link Block: "Check it out yourself" + "sadija.info" (glides up to make space) */}
        <div
          className="flex flex-col items-center"
          style={{
            transform: `translate3d(0, ${moveUpY}px, 0)`,
            fontFamily:
              "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
          }}
        >
          {/* Step 1: "Check it out yourself" with neat staggered typography animation */}
          <div className="flex items-center gap-[4.5px] font-medium text-[13px] tracking-[-0.01em] text-[#66666e] mb-1.5">
            {checkWords.map((word, idx) => {
              const wordP = easeOutExpo((elapsed - 24.55 - idx * 0.08) / 0.35);
              return (
                <span
                  key={word}
                  style={{
                    opacity: wordP,
                    transform: `translate3d(0, ${(1 - wordP) * 7}px, 0)`,
                  }}
                  className="inline-block"
                >
                  {word}
                </span>
              );
            })}
          </div>

          {/* Step 2: "sadija.info" pure link animation (Unboxed, Navy Blue with leading link icon) */}
          <div
            className="relative inline-flex flex-col items-center cursor-pointer mt-0.5 text-[#183153]"
            style={{
              opacity: linkTextProgress,
              transform: `translate3d(0, ${(1 - linkTextProgress) * 8}px, 0)`,
            }}
          >
            <div className="inline-flex items-center gap-2 text-[23px] font-bold tracking-tight text-[#183153]">
              {/* Chain Link icon in front of the URL */}
              <svg
                className="w-[18px] h-[18px] text-[#183153] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.35"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: linkIconProgress,
                  transform: `scale(${0.8 + linkIconProgress * 0.2})`,
                }}
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>sadija.info</span>
            </div>

            {/* Dynamic Link Underline drawing smoothly from left to right in Navy Blue */}
            <div className="w-full h-[2px] bg-[#183153]/20 rounded-full mt-1 overflow-hidden">
              <div
                className="w-full h-full bg-[#183153] origin-left"
                style={{
                  transform: `scaleX(${linkUnderlineProgress})`,
                  transformOrigin: 'left center',
                }}
              />
            </div>
          </div>
        </div>

        {/* Space opened below for "by" and signature */}
        <div
          className="flex flex-col items-center"
          style={{
            marginTop: `${moveUpProgress * 8}px`,
          }}
        >
          {/* "by" label */}
          <div
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#888890] mt-3.5 mb-0.5"
            style={{
              opacity: byEnter,
              transform: `translate3d(0, ${(1 - byEnter) * 8}px, 0)`,
            }}
          >
            by
          </div>

          {/* Live-Signed Handwritten Signature */}
          <div
            className="relative flex flex-col items-center"
            style={{
              opacity: byEnter,
            }}
          >
            <div className="relative px-4 py-1">
              <div
                className="text-[82px] text-[#111113] leading-none select-none whitespace-nowrap"
                style={{
                  fontFamily: "'Mrs Saint Delafield', cursive",
                  clipPath: `inset(-15% ${clipRightPercent}% -15% 0%)`,
                }}
              >
                A. Gure
              </div>

              {/* Live ink nib point traveling while signing */}
              {signWriteProgress > 0.02 && signWriteProgress < 0.98 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#111113]"
                  style={{
                    left: `${12 + signWriteProgress * 78}%`,
                    opacity: 0.75,
                  }}
                />
              )}
            </div>

            {/* Fluid Hand-Drawn Ink Flourish Underline */}
            <svg viewBox="0 0 230 20" className="w-52 h-4 overflow-visible -mt-3">
              <path
                d="M 16 12 Q 82 3, 148 11 T 214 7"
                fill="none"
                stroke="#111113"
                strokeWidth="1.85"
                strokeLinecap="round"
                strokeDasharray="230"
                strokeDashoffset={230 * (1 - underlineProgress)}
              />
            </svg>
          </div>

          {/* agure.space link beneath signature */}
          <div
            className="font-mono text-[10.5px] tracking-[0.2em] text-[#66666e]/85 lowercase mt-3"
            style={{
              opacity: domainProgress,
              transform: `translate3d(0, ${(1 - domainProgress) * 6}px, 0)`,
            }}
          >
            agure.space
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── 4. Instagram / TikTok Danger & Safe Zones Visual Guide ──────────────── */

export const ReelSafeZoneGuide: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[65] select-none overflow-hidden"
    >
      {/* 1. Top Danger Zone (0px to 104px = 0px to 260px on 1080x1920 IG) */}
      <div className="absolute top-0 left-0 right-0 h-[104px] bg-red-500/[0.14] border-b-2 border-red-500/50 flex flex-col justify-end p-2">
        <div className="inline-flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-wider text-red-300 font-bold px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm w-fit border border-red-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span>❌ TOP DANGER (0–260px IG · Dynamic Island & Header)</span>
        </div>
      </div>

      {/* 2. Bottom Danger Zone (580px to 768px = 1450px to 1920px on 1080x1920 IG) */}
      <div className="absolute bottom-0 left-0 right-0 h-[188px] bg-red-500/[0.14] border-t-2 border-red-500/50 flex flex-col justify-start p-2">
        <div className="inline-flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-wider text-red-300 font-bold px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm w-fit border border-red-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span>❌ BOTTOM DANGER (1450–1920px IG · Captions & Audio)</span>
        </div>
      </div>

      {/* 3. Right Danger Zone (384px to 432px = 960px to 1080px on 1080x1920 IG) */}
      <div className="absolute top-[104px] bottom-[188px] right-0 w-[48px] bg-amber-500/[0.12] border-l-2 border-amber-500/40 flex items-center justify-center p-0.5">
        <span className="font-mono text-[8px] uppercase tracking-widest text-amber-300 font-bold -rotate-90 whitespace-nowrap bg-black/70 px-1.5 py-0.5 rounded border border-amber-500/40">
          ICONS (120px)
        </span>
      </div>

      {/* 4. 100% Safe Zone Boundary Outline (16px to 384px, 104px to 580px) */}
      <div className="absolute left-[16px] right-[48px] top-[104px] bottom-[188px] border-2 border-dashed border-emerald-400/60 rounded-xl pointer-events-none">
        <div className="absolute top-2 left-2 font-mono text-[8px] uppercase tracking-wider text-emerald-300 font-bold px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-emerald-500/40">
          ✅ 100% VISIBLE SAFE ZONE (260px–1450px)
        </div>
      </div>
    </div>
  );
};
