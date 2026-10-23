import React, { useState } from 'react';
import { DockMode } from '../config/animationConfig';

const MODES: DockMode[] = ['A', 'B', 'C', 'D', 'E'];

/**
 * Lab-only switcher for comparing the five hero-name dock behaviours.
 * Rendered when the page is opened with ?lab=dock. Collapsed to a small
 * corner pill so it doesn't cover the wordmark while evaluating.
 */
export const DockLabSwitcher: React.FC<{ current: DockMode }> = ({ current }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-[80] flex flex-col-reverse items-start gap-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Change hero name dock preview"
        className="rounded-full border border-white/15 bg-neutral-950/85 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md"
      >
        Dock {current}
      </button>

      {open && (
        <div
          aria-label="Hero name dock preview"
          className="flex flex-col items-stretch gap-1 rounded-2xl border border-white/15 bg-neutral-950/85 p-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          {MODES.map((mode) => (
            <a
              key={mode}
              href={`?lab=dock&dock=${mode.toLowerCase()}`}
              aria-current={mode === current ? 'page' : undefined}
              className={`grid h-7 min-w-7 place-items-center rounded-xl px-2 transition-colors ${
                mode === current
                  ? 'bg-white text-neutral-950'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              {mode}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
