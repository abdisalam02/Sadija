import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, X, RotateCcw, Type } from 'lucide-react';
import {
  DEFAULT_TYPE_ID,
  TYPE_FONTS_HREF,
  TYPE_OPTIONS,
  applyTypeOption,
  clearStoredTypeId,
  findTypeOption,
  readStoredTypeId,
  storeTypeId,
  TypeOption,
} from '../config/typeOptions';

/**
 * Dev-only type audition panel, opened with ?lab=type.
 *
 * It writes CSS variables rather than touching components, so what you see is
 * the genuine page — the dock, the nav, the cards, the footer — re-typeset
 * live. Nothing here ships to normal visitors.
 */
export const TypeLab: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [activeId, setActiveId] = useState<string>(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('font');
    if (findTypeOption(fromUrl)) return fromUrl as string;
    return readStoredTypeId() ?? DEFAULT_TYPE_ID;
  });

  const active = useMemo(
    () => findTypeOption(activeId) ?? TYPE_OPTIONS[0],
    [activeId]
  );

  // Only the lab pays for the extra families.
  useEffect(() => {
    const id = 'sadija-type-lab-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = TYPE_FONTS_HREF;
    document.head.appendChild(link);
  }, []);

  const select = useCallback((option: TypeOption) => {
    setActiveId(option.id);
    applyTypeOption(option);
    storeTypeId(option.id);

    const url = new URL(window.location.href);
    url.searchParams.set('font', option.id);
    window.history.replaceState({}, '', url);
  }, []);

  const reset = useCallback(() => {
    const fallback = TYPE_OPTIONS.find((option) => option.id === DEFAULT_TYPE_ID)!;
    setActiveId(fallback.id);
    applyTypeOption(fallback);
    clearStoredTypeId();

    const url = new URL(window.location.href);
    url.searchParams.delete('font');
    window.history.replaceState({}, '', url);
  }, []);

  // Apply whatever was stored/requested once the families have arrived.
  useEffect(() => {
    applyTypeOption(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const index = Number(event.key);
      if (index >= 1 && index <= TYPE_OPTIONS.length) {
        select(TYPE_OPTIONS[index - 1]);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [select]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-[80] flex items-center gap-2 rounded-full border border-neutral-300/70 bg-white/90 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-700 shadow-lg backdrop-blur-xl hover:bg-white"
      >
        <Type className="h-3.5 w-3.5" />
        <span className="max-w-[180px] truncate normal-case tracking-normal">{active.label}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-[80] w-[min(340px,calc(100vw-2rem))] max-h-[min(78vh,640px)] overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200/80 bg-white/95 shadow-[0_24px_60px_-24px_rgba(15,15,20,0.45)] backdrop-blur-xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200/70 bg-white/95 px-4 py-3 backdrop-blur-xl">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            Type lab
          </p>
          <p className="text-[13px] font-semibold text-neutral-900">{active.label}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={reset}
            title="Reset to production pairing"
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setOpen(false)}
            title="Hide panel"
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Live specimen — reads the same variables the page does. */}
      <div className="border-b border-neutral-200/70 px-4 pb-4 pt-4">
        <p
          className="uppercase leading-[0.9] text-neutral-900"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: 'var(--display-tracking)',
          }}
        >
          Sadija
        </p>
        <p
          className="mt-2 text-[11px] uppercase tracking-[0.22em] text-neutral-500"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Oslo, Norway
        </p>
        <p
          className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-600"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Exploring modest luxury silhouettes, neutral tailoring, and contemporary
          Scandinavian aesthetics.
        </p>
      </div>

      <div className="p-2">
        {TYPE_OPTIONS.map((option, index) => {
          const selected = option.id === active.id;
          return (
            <button
              key={option.id}
              onClick={() => select(option)}
              className={`flex w-full items-start gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                selected ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'
              }`}
            >
              <span
                className={`mt-0.5 w-4 shrink-0 text-[10px] font-semibold tabular-nums ${
                  selected ? 'text-white/50' : 'text-neutral-400'
                }`}
              >
                {index + 1}
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={`block text-[12.5px] font-semibold ${
                    selected ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {option.label}
                </span>
                <span
                  className={`mt-0.5 block text-[11px] leading-snug ${
                    selected ? 'text-white/60' : 'text-neutral-500'
                  }`}
                >
                  {option.note}
                </span>
              </span>

              <span className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
                <span
                  className={`text-[19px] leading-none ${
                    selected ? 'text-white' : 'text-neutral-900'
                  }`}
                  style={{
                    fontFamily: option.display,
                    fontWeight: 800,
                    letterSpacing: option.tracking,
                  }}
                >
                  Sd
                </span>
                <span
                  className={`text-[10px] leading-none ${
                    selected ? 'text-white/60' : 'text-neutral-400'
                  }`}
                  style={{ fontFamily: option.body, fontWeight: 500 }}
                >
                  Aa
                </span>
              </span>

              {selected && <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-white/80" />}
            </button>
          );
        })}
      </div>

      <p className="border-t border-neutral-200/70 px-4 py-2.5 text-[10px] text-neutral-400">
        Press 1–8 to flip. Only visible with <span className="font-mono">?lab=type</span>.
      </p>
    </div>
  );
};

export default TypeLab;
