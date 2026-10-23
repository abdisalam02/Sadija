import React from 'react';
import { useCreator } from '../../context/CreatorContext';
import { CreatorConfig } from '../../config/creatorConfig';

interface SignatureProps {
  creator?: Partial<CreatorConfig>;
  className?: string;
}

const CreditLink: React.FC<{
  creator: CreatorConfig;
  className?: string;
  children: React.ReactNode;
}> = ({ creator, className = '', children }) => (
  <a
    href={creator.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${creator.name} — ${creator.domain}`}
    title="Preview only"
    onClick={(event) => event.preventDefault()}
    className={`group block text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 ${className}`}
  >
    {children}
  </a>
);

/* 01 — Mac System 1 becomes a print proof window */
export const ProofWindowCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  return (
    <CreditLink creator={creator} className={`w-[210px] border border-neutral-300 bg-[#fcfbf8] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-0.5 ${className}`}>
      <span className="flex items-center justify-between border-b border-neutral-200 px-2 py-1 font-mono text-[6.5px] uppercase tracking-[0.18em] text-neutral-400">
        <span>{creator.name} / proof</span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 border border-neutral-400 transition-colors group-hover:bg-neutral-900" />
          <span className="h-1.5 w-1.5 border border-neutral-300" />
        </span>
      </span>
      <span className="flex items-center justify-between px-2.5 py-2.5">
        <span className="font-syne text-[11px] font-extrabold uppercase tracking-[0.12em] text-neutral-800">
          {creator.name}
        </span>
        <span className="font-mono text-[6.5px] uppercase tracking-[0.14em] text-neutral-400">
          {creator.domain} ↗
        </span>
      </span>
      <span className="flex justify-between border-t border-neutral-200 px-2 py-1 font-mono text-[6px] uppercase tracking-[0.16em] text-neutral-400">
        <span>{creator.location}</span>
        <span>Sheet 01 / 01</span>
      </span>
    </CreditLink>
  );
};

/* 02 — Atomic Purple PCB becomes a hairline circuit card */
export const CircuitCardCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  return (
    <CreditLink creator={creator} className={`flex w-[210px] items-center gap-3 ${className}`}>
      <svg viewBox="0 0 50 34" className="h-9 w-12 flex-none text-neutral-400" fill="none" stroke="currentColor" strokeWidth="0.8">
        <path d="M2 29H14V8H30V22H48M14 8V2M30 22V31M40 22V8H48" />
        <circle cx="2" cy="29" r="1.6" className="fill-[#fcfbf8]" />
        <circle cx="14" cy="8" r="1.6" className="fill-[#fcfbf8]" />
        <circle cx="30" cy="22" r="1.6" className="fill-[#fcfbf8]" />
        <circle cx="48" cy="29" r="1.6" className="fill-[#fcfbf8]" />
        <circle cx="48" cy="22" r="1.8" className="fill-emerald-600/70 transition-colors group-hover:fill-emerald-600" />
      </svg>
      <span className="flex flex-col gap-0.5">
        <span className="font-syne text-[12px] font-extrabold uppercase tracking-tight text-neutral-800">
          {creator.name}
        </span>
        <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-neutral-400">
          {creator.domain} ↗
        </span>
        <span className="font-mono text-[5.5px] uppercase tracking-[0.16em] text-neutral-300">
          Rev. {creator.year} / {creator.location}
        </span>
      </span>
    </CreditLink>
  );
};

/* 03 — HiFi VFD becomes a black-glass audio strip */
export const VfdStripCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  return (
    <CreditLink creator={creator} className={`inline-flex items-center gap-3 rounded-[3px] border border-black/80 bg-[#15161a] px-3 py-2 text-white shadow-sm ${className}`}>
      <span className="flex flex-col gap-0.5">
        <span className="font-mono text-[6px] uppercase tracking-[0.2em] text-emerald-400/60">
          {creator.name} / audio
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-400">
          {creator.domain} ↗
        </span>
      </span>
      <span className="flex h-4 items-end gap-[2px] transition-opacity group-hover:animate-pulse">
        {[4, 8, 6, 13, 5, 10, 7, 3].map((height, i) => (
          <span
            key={i}
            style={{ height }}
            className="w-[2px] bg-emerald-400/80"
          />
        ))}
      </span>
    </CreditLink>
  );
};

/* 04 — Teenage Engineering becomes a field spec plate */
export const FieldPlateCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  return (
    <CreditLink creator={creator} className={`flex w-[225px] items-stretch border border-neutral-300 bg-[#f3f1ea] text-neutral-700 shadow-[0_1px_1px_rgba(0,0,0,0.03)] ${className}`}>
      <span className="flex flex-1 flex-col justify-between gap-2 border-r border-neutral-300 px-2.5 py-2">
        <span className="font-syne text-[10px] font-extrabold uppercase tracking-[0.12em]">{creator.name}</span>
        <span className="font-mono text-[6px] uppercase tracking-[0.18em] text-neutral-400">{creator.role}</span>
      </span>
      <span className="flex flex-col items-center justify-center gap-1 border-r border-neutral-300 px-2">
        <span className="h-2 w-2 rounded-full border border-neutral-400 transition-colors group-hover:bg-neutral-900" />
        <span className="font-mono text-[5px] uppercase tracking-[0.12em] text-neutral-400">Oslo</span>
      </span>
      <span className="flex flex-col items-end justify-between px-2 py-2 font-mono text-[5.5px] uppercase tracking-[0.14em] text-neutral-400">
        <span>{creator.domain} ↗</span>
        <span>59.91N</span>
      </span>
    </CreditLink>
  );
};

/* 05 — Thermal receipt becomes a paper receipt with a black stamp */
export const ReceiptCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  return (
    <CreditLink creator={creator} className={`relative w-[165px] border-y border-dashed border-neutral-300 bg-[#fbf8f1] px-3 py-2.5 text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>
      <span className="flex justify-between font-mono text-[6px] uppercase tracking-[0.18em] text-neutral-400">
        <span>{creator.name}</span>
        <span>No. {creator.year}</span>
      </span>
      <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-900">
        {creator.domain}
      </span>
      <span className="mt-1 block font-mono text-[6px] uppercase tracking-[0.18em] text-neutral-400">
        Thank you / {creator.location}
      </span>
      <span className="mt-2 flex h-4 items-stretch gap-[2px] opacity-70">
        {[2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2].map((width, i) => (
          <span key={i} style={{ width }} className="bg-neutral-800" />
        ))}
      </span>
      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] border border-neutral-900/60 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.2em] text-neutral-900/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Approved
      </span>
    </CreditLink>
  );
};

/* 06 — Holographic foil becomes a silver foil label */
export const FoilLabelCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  return (
    <CreditLink creator={creator} className={`w-[135px] border border-neutral-300 bg-[#f3f1ea] p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>
      <span
        className="flex h-8 items-center justify-center bg-clip-text font-syne text-[15px] font-black uppercase tracking-[0.08em] text-transparent transition-[background-position] duration-700 group-hover:[background-position:100%_0]"
        style={{
          backgroundImage: 'linear-gradient(115deg, #5b5b5b 0%, #f0f0f0 35%, #6d6d6d 55%, #d9d9d9 75%, #6d6d6d 100%)',
          backgroundSize: '220% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
        }}
      >
        A.GURE
      </span>
      <span className="flex justify-between border-t border-neutral-300/70 pt-1 font-mono text-[5.5px] uppercase tracking-[0.16em] text-neutral-400">
        <span>{creator.domain}</span>
        <span>Foil / {creator.year}</span>
      </span>
    </CreditLink>
  );
};

/* 07 — Micro vinyl becomes a record and paper sleeve */
export const VinylSleeveCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  return (
    <CreditLink creator={creator} className={`flex w-[150px] items-center ${className}`}>
      <span className="relative z-10 flex h-11 w-11 flex-col justify-between border border-black/10 bg-[#f5f1e8] p-1 transition-transform duration-500 group-hover:-rotate-2">
        <span className="font-syne text-[6px] font-extrabold uppercase tracking-[0.06em] text-neutral-800">{creator.name}</span>
        <span className="font-mono text-[4.5px] uppercase tracking-[0.12em] text-neutral-400">{creator.domain}</span>
      </span>
      <span className="relative -ml-3 h-10 w-10 rounded-full bg-[#161616] shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:-translate-x-4 group-hover:rotate-180">
        <span className="absolute inset-[5px] rounded-full border border-white/10" />
        <span className="absolute inset-[9px] rounded-full border border-white/10" />
        <span className="absolute inset-[15px] rounded-full bg-[#fcfbf8]" />
      </span>
    </CreditLink>
  );
};

/* 08 — Solari board becomes a paper flip calendar */
export const FlipCalendarCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  return (
    <CreditLink creator={creator} className={`flex flex-col items-center ${className}`}>
      <span className="relative h-[46px] w-[122px] [perspective:500px]">
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 border border-neutral-300 bg-[#fbf8f1]">
          <span className="font-mono text-[5.5px] uppercase tracking-[0.2em] text-neutral-400">{creator.domain}</span>
          <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-neutral-600">Oslo / {creator.year}</span>
        </span>
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 border border-neutral-400 bg-[#f5f1e8] [backface-visibility:hidden] [transform-origin:top] transition-transform duration-500 group-hover:[transform:rotateX(-88deg)]">
          <span className="font-syne text-[17px] font-extrabold uppercase leading-none tracking-[0.08em] text-neutral-800">A.</span>
          <span className="font-mono text-[5.5px] uppercase tracking-[0.18em] text-neutral-400">Gure</span>
        </span>
      </span>
      <span className="mt-1 flex gap-3">
        <span className="h-1.5 w-1.5 rounded-full border border-neutral-400" />
        <span className="h-1.5 w-1.5 rounded-full border border-neutral-400" />
      </span>
    </CreditLink>
  );
};

/* 09 — Nothing dot-matrix becomes a punched card */
export const PunchCardCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  return (
    <CreditLink creator={creator} className={`w-[172px] border border-neutral-300 bg-[#f5f1e8] p-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${className}`}>
      <span className="flex justify-between font-mono text-[5.5px] uppercase tracking-[0.18em] text-neutral-400">
        <span>{creator.name}</span>
        <span>{creator.domain}</span>
      </span>
      <span className="mt-2 grid grid-cols-12 gap-[3px]">
        {Array.from({ length: 48 }).map((_, i) => {
          const filled = i % 9 === 0 || i % 13 === 0;
          return (
            <span
              key={i}
              style={{ transitionDelay: `${i * 4}ms` }}
              className={`h-[3px] w-[3px] rounded-full transition-colors duration-300 ${
                filled
                  ? 'bg-neutral-700'
                  : 'border border-neutral-300 group-hover:bg-neutral-500 group-hover:border-neutral-500'
              }`}
            />
          );
        })}
      </span>
      <span className="mt-2 flex justify-between font-mono text-[5px] uppercase tracking-[0.18em] text-neutral-400">
        <span>Punch / 01</span>
        <span>Oslo</span>
      </span>
    </CreditLink>
  );
};

/* 10 — Peel sticker becomes an off-white paper sticker */
export const PaperStickerCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  return (
    <CreditLink creator={creator} className={`relative flex w-[160px] rotate-[-2deg] items-center gap-2 border border-black/10 bg-[#f6f2e8] px-3 py-2 shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-transform duration-500 group-hover:rotate-0 group-hover:-translate-y-0.5 ${className}`}>
      <span className="h-2 w-2 rounded-full bg-neutral-900" />
      <span className="flex flex-col gap-0.5">
        <span className="font-syne text-[10px] font-extrabold uppercase tracking-[0.12em] text-neutral-800">{creator.name}</span>
        <span className="font-mono text-[5.5px] uppercase tracking-[0.16em] text-neutral-400">{creator.domain} ↗</span>
      </span>
      <span aria-hidden="true" className="absolute -right-px -top-px h-3 w-3 border-b border-l border-neutral-300 bg-[#fcfbf8] [transform:rotate(45deg)]" />
    </CreditLink>
  );
};

/* 11 — Japanese obi becomes a paper belly band */
export const ObiBandCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  return (
    <CreditLink creator={creator} className={`flex items-stretch ${className}`}>
      <span className="flex w-7 items-center justify-center border border-neutral-400 bg-[#f0ece1] py-2 [writing-mode:vertical-rl]">
        <span className="font-syne text-[7px] font-extrabold uppercase tracking-[0.2em] text-neutral-800">{creator.name}</span>
      </span>
      <span className="flex flex-col justify-center gap-0.5 border-y border-r border-neutral-400 bg-[#faf7f0] px-2.5 py-1.5">
        <span className="font-mono text-[6px] uppercase tracking-[0.18em] text-neutral-500">{creator.domain} ↗</span>
        <span className="font-mono text-[5px] uppercase tracking-[0.16em] text-neutral-400">{creator.location} / {creator.year}</span>
      </span>
    </CreditLink>
  );
};

/* 12 — Wax seal charter becomes a black wax seal */
export const WaxSealCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  return (
    <CreditLink creator={creator} className={`flex items-center gap-3 ${className}`}>
      <span className="relative flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#1d1c1a] shadow-[inset_0_1px_2px_rgba(255,255,255,0.18),inset_0_-2px_3px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
        <span className="font-syne text-[13px] font-extrabold text-[#e8e0d2]">A.</span>
        <span aria-hidden="true" className="absolute inset-[3px] rounded-full border border-white/10" />
      </span>
      <span className="flex flex-col gap-0.5 font-mono text-[6.5px] uppercase tracking-[0.18em]">
        <span className="text-neutral-600">Sealed by {creator.name}</span>
        <span className="text-neutral-400">{creator.domain} ↗</span>
      </span>
    </CreditLink>
  );
};
