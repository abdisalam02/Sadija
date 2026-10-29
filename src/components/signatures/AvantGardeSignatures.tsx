import React, { useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { CreatorConfig } from '../../config/creatorConfig';

interface SignatureProps {
  creator?: Partial<CreatorConfig>;
  className?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   21. Nothing OS Dot-Matrix LED Array
   Cyber-minimalist dark pill, exposed telemetry, and sweeping Nothing red (#D71921)
   and white dot-matrix wave on hover.
───────────────────────────────────────────────────────────────────────────── */
export const NothingDotMatrixCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={creator.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative block select-none rounded-2xl border border-neutral-800 bg-[#0D0D0F] p-3 text-white transition-all duration-300 ${className}`}
      style={{
        width: '280px',
        boxShadow: isHovered
          ? '0 0 20px rgba(215,25,33,0.18), 0 4px 12px rgba(0,0,0,0.6)'
          : '0 2px 8px rgba(0,0,0,0.5)',
      }}
    >
      {/* Exposed Telemetry Header */}
      <div className="flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.22em] text-neutral-400">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
              isHovered ? 'bg-[#D71921] shadow-[0_0_6px_#D71921]' : 'bg-neutral-600'
            }`}
          />
          <span>59.91°N · OSLO</span>
        </div>
        <span>NOTHING (R)</span>
      </div>

      {/* Main Body: Dot-Matrix LED Pattern */}
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-neutral-500">
            ENGINEERED BY
          </span>
          <span className="font-syne text-[13px] font-black uppercase tracking-tight text-white group-hover:text-[#D71921] transition-colors">
            {creator.name}
          </span>
          <span className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-neutral-400">
            {creator.domain} ↗
          </span>
        </div>

        {/* 4x4 Micro LED Matrix Grid */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded bg-black/60 border border-neutral-800">
          {[...Array(16)].map((_, i) => {
            const isLit = isHovered ? (i % 2 === 0 || i % 3 === 0) : i === 0 || i === 5 || i === 10 || i === 15;
            const isRed = i % 4 === 0;
            return (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                  isLit
                    ? isRed
                      ? 'bg-[#D71921] shadow-[0_0_4px_#D71921]'
                      : 'bg-white shadow-[0_0_4px_#fff]'
                    : 'bg-neutral-800'
                }`}
              />
            );
          })}
        </div>
      </div>
    </a>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   22. The "Peel-Back" Street Art / Skate Sticker
   Slap sticker with high-contrast street art typography. Top-right corner dynamically
   peels backward in 3D on hover revealing bright neon under-layer with link!
───────────────────────────────────────────────────────────────────────────── */
export const PeelStickerCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={creator.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative block select-none ${className}`}
      style={{ width: '270px' }}
    >
      {/* Neon Under-Layer (Revealed when corner peels) */}
      <div
        className="absolute inset-0 rounded-[3px] bg-[#E2F952] p-2 flex flex-col justify-end items-end text-neutral-900 font-mono text-[8px] font-black uppercase tracking-wider"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <span className="bg-black text-[#E2F952] px-1.5 py-0.5 rounded-[2px] shadow-sm">
          ↗ VISIT PORTFOLIO
        </span>
      </div>

      {/* Main Sticker Face (Clipped or peels away) */}
      <div
        className="relative overflow-hidden rounded-[3px] bg-white border border-neutral-300 text-neutral-900 transition-all duration-300 ease-out"
        style={{
          boxShadow: isHovered
            ? '0 6px 14px rgba(0,0,0,0.14)'
            : '0 2px 6px rgba(0,0,0,0.08)',
          clipPath: isHovered
            ? 'polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 0 100%)'
            : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        }}
      >
        {/* Top Header: HELLO MY NAME IS */}
        <div className="bg-[#E63946] px-3 py-1 text-center font-syne text-[8.5px] font-black uppercase tracking-widest text-white">
          HELLO // BUILT BY
        </div>

        {/* Sticker Center */}
        <div className="px-3 py-2 text-center">
          <div className="font-syne text-[14px] font-extrabold uppercase tracking-tight text-neutral-900">
            {creator.name}
          </div>
          <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-neutral-500">
            {creator.domain}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-200 bg-neutral-50 px-2 py-0.5 flex justify-between font-mono text-[6px] uppercase tracking-wider text-neutral-400">
          <span>ORIGINAL STICKER</span>
          <span>OSLO · {creator.year}</span>
        </div>
      </div>

      {/* Folded Peel Corner with Realistic Drop Shadow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute right-0 top-0 transition-all duration-300 ease-out ${
          isHovered ? 'h-8 w-8 opacity-100' : 'h-0 w-0 opacity-0'
        }`}
      >
        {/* Corner Peel Flap */}
        <div
          className="h-full w-full bg-gradient-to-bl from-neutral-200 to-neutral-300 shadow-[-2px_2px_4px_rgba(0,0,0,0.25)]"
          style={{
            clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
          }}
        />
      </div>
    </a>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   23. Japanese Vinyl "Obi Strip" & Vermilion Hanko Seal
   Crisp warm washi rice-paper sash with ultra-fine 1px structural grid lines,
   specification numbers, and traditional carved vermilion Hanko seal SVG (印).
───────────────────────────────────────────────────────────────────────────── */
export const JapaneseObiCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={creator.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex select-none items-center justify-between border border-neutral-300/80 bg-[#F9F7F1] p-2 text-neutral-900 transition-all duration-300 ${className}`}
      style={{
        width: '280px',
        boxShadow: isHovered
          ? '0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
          : '0 2px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      {/* Left Vertical Japanese Spine / Obi Stripe */}
      <div className="flex items-center gap-2 border-r border-neutral-300 pr-2">
        <span className="font-mono text-[7px] uppercase text-neutral-400 [writing-mode:vertical-rl] tracking-widest">
          ウェブ制作
        </span>
        <div className="flex flex-col font-mono text-[6.5px] uppercase tracking-wider text-neutral-500">
          <span>AG-JP</span>
          <span>{creator.year}</span>
        </div>
      </div>

      {/* Center Details */}
      <div className="flex flex-1 flex-col px-2.5">
        <span className="font-mono text-[6.5px] uppercase tracking-[0.2em] text-neutral-400">
          COLOPHON // OBI
        </span>
        <span className="font-syne text-[12px] font-black uppercase tracking-tight text-neutral-900">
          {creator.name}
        </span>
        <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-neutral-500">
          {creator.domain} ↗
        </span>
      </div>

      {/* Traditional Carved Vermilion Hanko Seal SVG (印) */}
      <div
        className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border border-[#C73E3A] transition-all duration-300 ${
          isHovered
            ? 'bg-[#C73E3A]/10 shadow-[0_0_10px_rgba(199,62,58,0.45)]'
            : 'bg-transparent'
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#C73E3A] fill-current">
          {/* Authentic stylized Japanese Hanko seal kanji "印" */}
          <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 3h5v2H8v-2zm0 3h8v2H8v-2z" />
        </svg>
      </div>
    </a>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   24. Embossed Crimson Wax Seal & Charter Ribbon
   Hyper-detailed custom SVG 3D embossed crimson wax seal with organic melted edge
   and monogram, sitting atop an unfurling notched silk charter ribbon.
───────────────────────────────────────────────────────────────────────────── */
export const WaxSealCharterCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={creator.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex select-none items-center py-1.5 ${className}`}
      style={{ width: '280px' }}
    >
      {/* Silk Charter Ribbon */}
      <div
        className={`relative flex items-center overflow-hidden border border-neutral-800 bg-[#14151a] text-neutral-100 py-1.5 pl-9 pr-3 shadow-md transition-all duration-500 ease-out ${
          isHovered ? 'w-full' : 'w-[230px]'
        }`}
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}
      >
        {/* Ribbon V-Cut Notched End */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-3 bg-[#14151a]"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 70% 50%, 100% 100%, 0 100%)',
          }}
        />

        <div className="flex flex-col font-mono text-[7px] uppercase tracking-wider">
          <span className="text-amber-300/80 tracking-[0.2em]">HANDCRAFTED BY</span>
          <span className="font-syne text-[11px] font-bold tracking-tight text-white">
            {creator.name}
          </span>
          <span className="text-[6.5px] text-neutral-400">{creator.domain} ↗</span>
        </div>
      </div>

      {/* 3D Embossed Crimson Wax Seal SVG (Floats on left end of ribbon) */}
      <div
        aria-hidden="true"
        className={`absolute left-0 top-1/2 -translate-y-1/2 transition-transform duration-500 ease-out ${
          isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
        }`}
      >
        <svg
          viewBox="0 0 44 44"
          className="h-10 w-10 drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
        >
          {/* Organic Melted Outer Wax Rim */}
          <path
            d="M22,2 C27,1 32,3 36,7 C40,11 43,16 42,21 C41,26 43,32 39,36 C35,40 29,43 23,42 C17,41 12,43 7,39 C2,35 1,29 2,23 C3,17 1,11 6,7 C11,3 17,3 22,2 Z"
            fill="url(#waxGradient)"
            stroke="#5c0b14"
            strokeWidth="0.8"
          />
          {/* Inner Recessed Circle */}
          <circle cx="22" cy="22" r="14" fill="#750d1a" stroke="#4a070f" strokeWidth="0.8" />
          {/* Inner Beaded Ring */}
          <circle cx="22" cy="22" r="12" fill="none" stroke="#a32030" strokeWidth="0.5" strokeDasharray="1,1.5" />
          {/* Monogram AG */}
          <text
            x="22"
            y="26"
            textAnchor="middle"
            fill="#e29578"
            fontSize="10"
            fontFamily="Syne, sans-serif"
            fontWeight="bold"
            letterSpacing="0.05em"
            style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }}
          >
            {creator.shortName.slice(0, 2)}
          </text>

          <defs>
            <radialGradient id="waxGradient" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#b32435" />
              <stop offset="60%" stopColor="#80101d" />
              <stop offset="100%" stopColor="#4d050d" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </a>
  );
};
