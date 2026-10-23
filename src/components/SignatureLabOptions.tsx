import React, { useCallback, useEffect, useRef, useState } from 'react';

/* ── shared ─────────────────────────────────────────────────────────────── */

const Square: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span aria-hidden="true" className={`inline-block flex-none bg-current ${className}`} />
);

interface CreditButtonProps {
  label: string;
  className?: string;
  onPreview?: () => void;
  onPreviewEnd?: () => void;
  children: React.ReactNode;
}

const CreditButton: React.FC<CreditButtonProps> = ({
  label,
  className = '',
  onPreview,
  onPreviewEnd,
  children,
}) => (
  <button
    type="button"
    aria-label={label}
    title="Preview only"
    onClick={onPreview}
    onMouseEnter={onPreview}
    onMouseLeave={onPreviewEnd}
    onFocus={onPreview}
    onBlur={onPreviewEnd}
    className={`group text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 ${className}`}
  >
    {children}
  </button>
);

const MiniFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-[112px] items-center justify-between gap-6 px-5 py-8 sm:px-8">
    <span className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-400 sm:block">
      © 2026 SADIJA — OSLO
    </span>
    <div className="ml-auto flex items-center">{children}</div>
  </div>
);

/* ── 01 — atelier seal ──────────────────────────────────────────────────── */

export const SealCredit: React.FC = () => (
  <CreditButton label="A.Gure — agure.space" className="flex items-center gap-3.5">
    <span className="relative h-16 w-16 shrink-0 transition-transform duration-500 group-hover:scale-105">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full origin-center animate-[spin_30s_linear_infinite] motion-reduce:animate-none"
      >
        <defs>
          <path id="seal-path" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-neutral-500 font-mono text-[7.5px] uppercase">
          <textPath href="#seal-path" startOffset="0" textLength="228" lengthAdjust="spacing">
            A.GURE · AGURE.SPACE · AVAILABLE FOR SELECT PROJECTS ·
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="font-syne text-[15px] font-extrabold tracking-tight text-neutral-800">
          A
          <Square className="ml-[0.04em] h-[0.13em] w-[0.13em] origin-center transition-transform duration-500 group-hover:rotate-45" />
        </span>
      </span>
    </span>

    <span className="flex flex-col gap-1">
      <span className="font-syne text-[12px] font-bold tracking-tight text-neutral-700">A.Gure</span>
      <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-400">
        agure.space ↗
      </span>
    </span>
  </CreditButton>
);

/* ── 02 — ink signature ─────────────────────────────────────────────────── */

export const SignatureCredit: React.FC = () => (
  <CreditButton label="A.Gure — agure.space" className="flex flex-col items-end gap-0.5">
    <span className="font-signature text-[29px] leading-none text-neutral-600 transition-colors duration-300 group-hover:text-neutral-900">
      A. Gure
    </span>
    <svg viewBox="0 0 150 10" className="h-2.5 w-[132px] overflow-visible text-neutral-400">
      <path
        d="M2 7 C 30 2, 52 9, 78 5 S 122 2, 148 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="ink-underline"
      />
    </svg>
    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-400">
      agure.space ↗
    </span>
  </CreditButton>
);

/* ── 03 — split-flap token ──────────────────────────────────────────────── */

const SPLIT_TEXT = 'A.GURE';

const useFlipText = (target: string) => {
  const [chars, setChars] = useState(target.split(''));
  const busy = useRef(false);
  const timer = useRef<number | null>(null);

  const run = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ.';
    let tick = 0;
    const max = 10 + target.length * 2;

    timer.current = window.setInterval(() => {
      tick += 1;
      setChars(
        target
          .split('')
          .map((ch, i) => (tick < 5 + i * 2 ? pool[Math.floor(Math.random() * pool.length)] : ch))
      );
      if (tick >= max) {
        if (timer.current) window.clearInterval(timer.current);
        setChars(target.split(''));
        busy.current = false;
      }
    }, 65);
  }, [target]);

  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current);
    },
    []
  );

  return { chars, run };
};

export const SplitFlapCredit: React.FC = () => {
  const { chars, run } = useFlipText(SPLIT_TEXT);

  return (
    <CreditButton label="A.Gure — agure.space" onPreview={run} className="flex flex-col items-end gap-1.5">
      <span className="flex gap-[2px]">
        {chars.map((char, i) => (
          <span
            key={`${i}-${char}`}
            className="flap-tile flex h-5 w-[15px] items-center justify-center border border-black/10 bg-white/65 font-mono text-[10px] uppercase text-neutral-700 shadow-[inset_0_-2px_0_rgba(0,0,0,0.06)]"
          >
            {char}
          </span>
        ))}
      </span>
      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-400">
        agure.space ↗
      </span>
    </CreditButton>
  );
};

/* ── 04 — scramble decoder ──────────────────────────────────────────────── */

const useScrambleText = (from: string) => {
  const [text, setText] = useState(from);
  const busy = useRef(false);
  const timer = useRef<number | null>(null);

  const clear = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
  };

  const scrambleTo = useCallback(
    (target: string) => {
      if (busy.current) return;
      busy.current = true;
      clear();

      const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./';
      let frame = 0;
      const max = 16;

      timer.current = window.setInterval(() => {
        frame += 1;
        const revealed = Math.floor((frame / max) * target.length);
        setText(
          target
            .split('')
            .map((ch, i) => (i < revealed || ch === ' ' ? ch : pool[Math.floor(Math.random() * pool.length)]))
            .join('')
        );
        if (frame >= max) {
          clear();
          setText(target);
          busy.current = false;
        }
      }, 45);
    },
    []
  );

  const reset = useCallback(() => {
    clear();
    busy.current = false;
    setText(from);
  }, [from]);

  useEffect(
    () => () => {
      clear();
    },
    []
  );

  return { text, scrambleTo, reset };
};

export const ScrambleCredit: React.FC = () => {
  const { text, scrambleTo, reset } = useScrambleText('A.GURE');

  return (
    <CreditButton
      label="A.Gure — agure.space"
      onPreview={() => scrambleTo('AGURE.SPACE')}
      onPreviewEnd={reset}
      className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500"
    >
      <span className="text-neutral-300">[</span>
      <span className="inline-block w-[86px] tabular-nums text-neutral-700">
        {text}
        <span className="ml-0.5 animate-pulse text-neutral-400">▌</span>
      </span>
      <span className="text-neutral-300">]</span>
      <span className="text-[10px] text-neutral-400">↗</span>
    </CreditButton>
  );
};

/* ── 05 — magnetic monogram ─────────────────────────────────────────────── */

export const MagneticCredit: React.FC = () => {
  const wordRef = useRef<HTMLSpanElement>(null);
  const [shift, setShift] = useState({ x: 0, y: 0 });

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = wordRef.current?.getBoundingClientRect();
    if (!box) return;
    const dx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
    const dy = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
    setShift({
      x: Math.max(-1, Math.min(1, dx)) * 5,
      y: Math.max(-1, Math.min(1, dy)) * 3,
    });
  };

  const reset = () => setShift({ x: 0, y: 0 });

  return (
    <CreditButton label="A.Gure — agure.space" className="flex flex-col items-end gap-1">
      <div onPointerMove={handleMove} onPointerLeave={reset} className="py-1">
        <span
          ref={wordRef}
          className="inline-flex items-baseline font-syne text-[20px] font-extrabold uppercase leading-none tracking-[-0.03em] text-neutral-700 transition-transform duration-200 ease-out"
          style={{ transform: `translate(${shift.x}px, ${shift.y}px)` }}
        >
          A
          <Square className="mx-[0.03em] h-[0.13em] w-[0.13em] origin-center transition-transform duration-500 group-hover:rotate-45" />
          GURE
        </span>
      </div>
      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-400">
        agure.space ↗
      </span>
    </CreditButton>
  );
};

/* ── 06 — dot-matrix receipt ────────────────────────────────────────────── */

export const DotMatrixCredit: React.FC = () => (
  <CreditButton label="A.Gure — agure.space" className="flex flex-col items-end gap-1">
    <span className="dot-type font-syne text-[24px] font-extrabold uppercase leading-none tracking-[0.02em]">
      A.GURE
    </span>
    <span className="font-mono text-[7px] uppercase tracking-[0.24em] text-neutral-400">
      [ agure.space ] ↗
    </span>
  </CreditButton>
);

/* ── 07 — woven garment label ───────────────────────────────────────────── */

export const WovenLabelCredit: React.FC = () => (
  <CreditButton
    label="A.Gure — agure.space"
    className="rotate-[-1.5deg] transition-transform duration-500 group-hover:rotate-0 group-hover:-translate-y-0.5"
  >
    <span className="woven-label relative flex w-[158px] flex-col items-center gap-1 border border-dashed border-neutral-400/60 px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <span aria-hidden="true" className="absolute inset-[3px] border border-neutral-400/25" />
      <span className="relative font-syne text-[11px] font-extrabold tracking-[0.18em] text-neutral-800">
        A.GURE
      </span>
      <span className="relative font-mono text-[6px] uppercase tracking-[0.28em] text-neutral-500">
        agure.space
      </span>
      <span className="relative mt-0.5 flex items-center gap-2 font-mono text-[5.5px] uppercase tracking-[0.14em] text-neutral-400">
        <span>Oslo</span>
        <span className="h-px w-4 bg-neutral-300" />
        <span>100% cotton</span>
      </span>
    </span>
  </CreditButton>
);

/* ── 08 — barcode hang tag ──────────────────────────────────────────────── */

const BARS = [
  2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 1, 2, 2,
  1, 3, 1, 1, 2, 1,
];

export const BarcodeCredit: React.FC = () => (
  <CreditButton
    label="A.Gure — agure.space"
    className="relative flex w-[152px] rotate-[1deg] flex-col gap-1 border border-black/10 bg-[#fbf8f1] px-2.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-500 group-hover:rotate-0 group-hover:-translate-y-0.5"
  >
    <span className="flex items-center justify-between font-mono text-[5.5px] uppercase tracking-[0.2em] text-neutral-500">
      <span>A.Gure</span>
      <span>Est. 2026</span>
    </span>

    <span className="relative flex h-5 items-stretch gap-[1px] overflow-hidden border-y border-dashed border-neutral-300/70 px-1 py-[2px]">
      {BARS.map((width, i) => (
        <span key={i} style={{ width }} className="h-full bg-neutral-900" />
      ))}
      <span className="absolute inset-y-0 left-0 w-px bg-[#a8432c] opacity-0 transition-[left,opacity] duration-700 ease-out group-hover:left-[calc(100%-1px)] group-hover:opacity-100" />
    </span>

    <span className="flex items-center justify-between font-mono text-[5.5px] uppercase tracking-[0.18em] text-neutral-500">
      <span>agure.space</span>
      <span>↗</span>
    </span>
  </CreditButton>
);

/* ── 09 — printer's registration mark ───────────────────────────────────── */

export const RegistrationCredit: React.FC = () => (
  <CreditButton label="A.Gure — agure.space" className="relative flex items-center gap-3 px-4 py-3">
    <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-neutral-300 transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
    <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-neutral-300 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-neutral-300 transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
    <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-neutral-300 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />

    <svg
      viewBox="0 0 32 32"
      className="h-7 w-7 text-neutral-400 transition-transform duration-700 group-hover:rotate-90"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
    >
      <circle cx="16" cy="16" r="6.5" />
      <path d="M16 2v9M16 21v9M2 16h9M21 16h9" />
    </svg>

    <span className="flex flex-col gap-0.5 font-mono uppercase">
      <span className="text-[9px] tracking-[0.2em] text-neutral-700">A.GURE</span>
      <span className="text-[7px] tracking-[0.18em] text-neutral-400">AGURE.SPACE ↗</span>
      <span className="text-[5.5px] tracking-[0.16em] text-neutral-300">Colour proof / 2026</span>
    </span>
  </CreditButton>
);

/* ── 10 — embossed seal ─────────────────────────────────────────────────── */

export const EmbossedSealCredit: React.FC = () => (
  <CreditButton label="A.Gure — agure.space" className="flex items-center gap-3">
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fcfbf8] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(0,0,0,0.12),0_1px_1px_rgba(0,0,0,0.06)] ring-1 ring-black/10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
      <span className="font-syne text-[12px] font-extrabold text-neutral-500">
        A
        <Square className="ml-[0.03em] h-[0.13em] w-[0.13em] origin-center transition-transform duration-500 group-hover:rotate-45" />
      </span>
    </span>

    <span className="flex flex-col gap-1 font-mono uppercase">
      <span className="text-[8px] tracking-[0.2em] text-neutral-600">Site by A.Gure</span>
      <span className="text-[8px] tracking-[0.18em] text-neutral-400">AGURE.SPACE ↗</span>
    </span>
  </CreditButton>
);

/* ── 11 — photo-filled type ─────────────────────────────────────────────── */

export const PhotoTypeCredit: React.FC = () => (
  <CreditButton label="A.Gure — agure.space" className="flex flex-col items-end gap-1">
    <span className="photo-type font-syne text-[27px] font-extrabold uppercase leading-none tracking-[-0.02em]">
      A.GURE
    </span>
    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-400">
      site by · agure.space ↗
    </span>
  </CreditButton>
);

/* ── 12 — ticket stub ───────────────────────────────────────────────────── */

export const TicketCredit: React.FC = () => (
  <CreditButton label="A.Gure — agure.space" className="flex items-stretch">
    <span className="flex w-[112px] flex-col justify-between gap-2 border border-black/15 bg-[#fbf8f1] px-2.5 py-2 transition-transform duration-500 group-hover:-translate-y-0.5">
      <span className="flex items-center justify-between font-syne text-[9px] font-extrabold tracking-[0.16em] text-neutral-800">
        <span>A.GURE</span>
        <span className="font-mono text-[5.5px] font-normal tracking-[0.16em] text-neutral-400">NO. 26</span>
      </span>
      <span className="font-mono text-[6px] uppercase tracking-[0.2em] text-neutral-500">
        agure.space
      </span>
    </span>

    <span className="relative flex w-7 items-center justify-center border-y border-r border-dashed border-neutral-400/60 bg-[#f7f2e8] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:rotate-3">
      <span aria-hidden="true" className="absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-neutral-400/60 bg-[#fcfbf8]" />
      <span className="mt-2 font-mono text-[5.5px] uppercase tracking-[0.16em] text-neutral-500 [writing-mode:vertical-rl]">
        Admit one
      </span>
    </span>
  </CreditButton>
);

export { MiniFooter };
