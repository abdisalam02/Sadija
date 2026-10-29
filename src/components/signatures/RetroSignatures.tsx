import React, { useEffect, useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { CreatorConfig } from '../../config/creatorConfig';

interface SignatureProps {
  creator?: Partial<CreatorConfig>;
  className?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   13. The 1984 Macintosh System 1 / CRT Retro Window
   Authentic 1-bit Mac window with titlebar pinstripes, close box & hard shadow.
   Includes interactive [ CRT Mode ] button switching to curved phosphor scanlines.
───────────────────────────────────────────────────────────────────────────── */
export const MacSystem1Credit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  const [crtMode, setCrtMode] = useState(false);
  const [pressedClose, setPressedClose] = useState(false);

  return (
    <div
      className={`group relative select-none font-mono text-[10px] transition-all duration-300 ${className}`}
      style={{ width: '280px' }}
    >
      <div
        className={`relative overflow-hidden rounded-[2px] border-2 transition-all duration-300 ${
          crtMode
            ? 'border-[#154726] bg-[#031408] text-[#33ff66] shadow-[0_0_15px_rgba(51,255,102,0.3),3px_3px_0px_#000]'
            : 'border-black bg-white text-black shadow-[3px_3px_0px_#000000]'
        }`}
      >
        {/* Title Bar */}
        <div
          className={`flex h-[20px] items-center justify-between border-b-2 px-1.5 ${
            crtMode
              ? 'border-[#154726] bg-[#05210d]'
              : 'border-black bg-[repeating-linear-gradient(to_bottom,#000_0px,#000_1px,#fff_1px,#fff_2px)]'
          }`}
        >
          {/* Close Box */}
          <button
            type="button"
            aria-label="Close or reset"
            onMouseDown={() => setPressedClose(true)}
            onMouseUp={() => setPressedClose(false)}
            onClick={() => setCrtMode((prev) => !prev)}
            className={`flex h-[11px] w-[11px] items-center justify-center border border-black bg-white transition-transform ${
              pressedClose ? 'scale-90 bg-black' : ''
            }`}
            title="Click to toggle display mode"
          >
            {pressedClose && <span className="h-[5px] w-[5px] bg-black" />}
          </button>

          {/* Window Title Pill */}
          <div className="mx-1 px-1.5 bg-white text-black border-x border-black font-bold tracking-wider text-[8.5px] uppercase">
            {crtMode ? 'CRT // TTY:01' : `Finder // ${creator.shortName}`}
          </div>

          {/* Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCrtMode((prev) => !prev);
            }}
            className={`px-1 py-[1px] text-[7.5px] font-bold uppercase tracking-wider transition-colors ${
              crtMode
                ? 'bg-[#33ff66] text-black hover:bg-[#4dff79]'
                : 'bg-black text-white hover:bg-neutral-800'
            }`}
          >
            {crtMode ? '1-BIT' : 'CRT'}
          </button>
        </div>

        {/* Window Body */}
        <div className="relative p-2.5">
          {/* Scanline overlay for CRT mode */}
          {crtMode && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,0.6)_0px,rgba(0,0,0,0.6)_1.5px,transparent_1.5px,transparent_3px)] opacity-70"
            />
          )}

          <div className="relative z-0 flex items-center justify-between gap-2.5">
            {/* 1-bit Mac / Retro Icon */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-colors ${
                crtMode
                  ? 'border-[#33ff66] bg-[#05210d] text-[#33ff66]'
                  : 'border-black bg-neutral-100 text-black group-hover:bg-black group-hover:text-white'
              }`}
            >
              {crtMode ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M2 4h20v13H2V4zm2 2v9h16V6H4zm4 13h8v2H8v-2z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M4 2h16v16H4V2zm2 2v12h12V4H6zm2 3h8v2H8V7zm0 4h5v2H8v-2zm-3 8h14v2H5v-2z" />
                </svg>
              )}
            </div>

            {/* Typography & Creator Details */}
            <div className="flex flex-1 flex-col">
              <span
                className={`text-[7.5px] font-bold uppercase tracking-[0.2em] ${
                  crtMode ? 'text-[#33ff66]/70' : 'text-neutral-500'
                }`}
              >
                Crafted by
              </span>
              <a
                href={creator.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-syne text-[13px] font-extrabold uppercase tracking-tight transition-colors hover:underline ${
                  crtMode
                    ? 'text-[#33ff66] drop-shadow-[0_0_6px_rgba(51,255,102,0.8)]'
                    : 'text-black'
                }`}
              >
                {creator.name}
              </a>
              <span
                className={`text-[8px] uppercase tracking-[0.16em] ${
                  crtMode ? 'text-[#33ff66]/80' : 'text-neutral-600'
                }`}
              >
                {creator.domain} ↗
              </span>
            </div>

            {/* Status indicator */}
            <div className="text-right">
              <span
                className={`inline-block border px-1 py-0.5 text-[7px] font-bold uppercase ${
                  crtMode
                    ? 'border-[#33ff66] bg-[#0d3816] text-[#33ff66]'
                    : 'border-black bg-neutral-100 text-black'
                }`}
              >
                1984
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   14. 90s "Atomic Purple" Translucent GameBoy PCB
   Clear smoked purple shell, gold immersion PCB traces, IC chip, SMD LED power switch.
───────────────────────────────────────────────────────────────────────────── */
export const AtomicPurplePcbCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={creator.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative block select-none overflow-hidden rounded-xl border border-purple-300/30 p-2.5 transition-all duration-500 ${className}`}
      style={{
        width: '280px',
        background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.72) 0%, rgba(59, 7, 100, 0.88) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: isHovered
          ? 'inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.6), 0 8px 24px rgba(147,51,234,0.35)'
          : 'inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -1px 2px rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.2)',
      }}
    >
      {/* 4 Corner Brass Mounting Screws */}
      <div className="pointer-events-none absolute left-1.5 top-1.5 h-2 w-2 rounded-full border border-amber-500/40 bg-gradient-to-br from-amber-200 to-amber-700 shadow-sm" />
      <div className="pointer-events-none absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-amber-500/40 bg-gradient-to-br from-amber-200 to-amber-700 shadow-sm" />
      <div className="pointer-events-none absolute bottom-1.5 left-1.5 h-2 w-2 rounded-full border border-amber-500/40 bg-gradient-to-br from-amber-200 to-amber-700 shadow-sm" />
      <div className="pointer-events-none absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full border border-amber-500/40 bg-gradient-to-br from-amber-200 to-amber-700 shadow-sm" />

      {/* PCB Gold Traces Background SVG */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60 transition-opacity duration-300 group-hover:opacity-85"
        viewBox="0 0 280 64"
      >
        <path
          d="M10 20 H50 L65 35 H110 L125 20 H200 L215 35 H270 M30 50 H80 L95 38 H160 L175 50 H250 M140 10 V30 M150 35 V55 M40 15 V45"
          fill="none"
          stroke={isHovered ? '#ffd700' : '#bfa14a'}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Solder Vias */}
        <circle cx="50" cy="20" r="2" fill="#ffd700" />
        <circle cx="110" cy="35" r="2" fill="#ffd700" />
        <circle cx="200" cy="20" r="2" fill="#ffd700" />
        <circle cx="80" cy="50" r="2" fill="#ffd700" />
        <circle cx="160" cy="38" r="2" fill="#ffd700" />
      </svg>

      {/* Content Layer */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-1">
        {/* Central IC Microchip */}
        <div className="relative flex h-10 w-24 shrink-0 flex-col justify-center rounded-[3px] border border-neutral-700/80 bg-neutral-900/95 px-1.5 py-1 shadow-inner">
          {/* IC IC Pins */}
          <div className="absolute -left-[3px] top-1 bottom-1 flex flex-col justify-between">
            <span className="h-[2px] w-[3px] bg-neutral-400" />
            <span className="h-[2px] w-[3px] bg-neutral-400" />
            <span className="h-[2px] w-[3px] bg-neutral-400" />
          </div>
          <div className="absolute -right-[3px] top-1 bottom-1 flex flex-col justify-between">
            <span className="h-[2px] w-[3px] bg-neutral-400" />
            <span className="h-[2px] w-[3px] bg-neutral-400" />
            <span className="h-[2px] w-[3px] bg-neutral-400" />
          </div>
          <span className="font-mono text-[7px] font-bold tracking-widest text-neutral-400">
            {creator.shortName}-IC
          </span>
          <span className="font-mono text-[6.5px] uppercase tracking-wider text-purple-300">
            {creator.domain}
          </span>
        </div>

        {/* Info Column */}
        <div className="flex flex-1 flex-col font-mono text-[9px]">
          <div className="flex items-center gap-1.5">
            {/* SMD LED */}
            <span
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                isHovered
                  ? 'bg-emerald-400 shadow-[0_0_10px_#10b981,0_0_3px_#fff]'
                  : 'bg-red-500/80 shadow-[0_0_6px_#ef4444]'
              }`}
            />
            <span className="text-[7.5px] font-bold uppercase tracking-wider text-purple-200">
              {isHovered ? 'PWR ON // 3.3V' : 'STANDBY'}
            </span>
          </div>

          <span className="font-syne text-[12px] font-bold text-white tracking-tight drop-shadow-sm">
            {creator.name}
          </span>
          <span className="text-[7.5px] uppercase tracking-[0.18em] text-purple-300/80">
            Oslo · Cartridge #{creator.year}
          </span>
        </div>

        {/* Nintendo style serial mark */}
        <div className="flex flex-col items-end font-mono text-[7px] text-purple-300/70">
          <span className="rounded border border-purple-400/30 px-1 py-0.5">DMG-01</span>
          <span className="mt-1 text-[8px] text-white">↗</span>
        </div>
      </div>
    </a>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   15. 80s Hi-Fi VFD (Vacuum Fluorescent Display) Deck
   Recessed pitch-black glass, brushed gunmetal bezel, cyan & amber segmented readout
   with dancing 8-bar audio spectrum analyzer.
───────────────────────────────────────────────────────────────────────────── */
export const HiFiVfdCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  const [isHovered, setIsHovered] = useState(false);
  const [eqLevels, setEqLevels] = useState([2, 4, 3, 5, 4, 2, 3, 1]);

  useEffect(() => {
    if (!isHovered) {
      setEqLevels([2, 4, 3, 5, 4, 2, 3, 1]);
      return;
    }
    const interval = window.setInterval(() => {
      setEqLevels(Array.from({ length: 8 }, () => Math.floor(Math.random() * 5) + 1));
    }, 110);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <a
      href={creator.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative block select-none rounded-md border border-neutral-700/80 bg-neutral-950 p-2.5 transition-all duration-300 ${className}`}
      style={{
        width: '290px',
        boxShadow:
          'inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -1px 2px rgba(0,0,0,0.8), 0 4px 14px rgba(0,0,0,0.4)',
      }}
    >
      {/* Recessed VFD Screen Window */}
      <div
        className="relative overflow-hidden rounded-[3px] border border-neutral-800 bg-[#02090b] px-2.5 py-2"
        style={{
          boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.95), 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Subtle VFD Filament Lines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_3px,rgba(0,245,212,0.04)_3px,rgba(0,245,212,0.04)_4px)]"
        />

        {/* Top telemetry badges */}
        <div className="flex items-center justify-between font-mono text-[7px] font-bold tracking-wider text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span className="text-[#00F5D4] drop-shadow-[0_0_4px_rgba(0,245,212,0.7)]">STEREO</span>
            <span>·</span>
            <span>DOLBY B-C</span>
          </div>
          <span className="text-[#FF6B00] drop-shadow-[0_0_4px_rgba(255,107,0,0.7)]">
            {isHovered ? 'LIVE EQ ▶' : 'DECK 1'}
          </span>
        </div>

        {/* Middle row: Spectrum Analyzer + Readout */}
        <div className="mt-1.5 flex items-center justify-between gap-3">
          {/* 8-Bar Mini Spectrum Analyzer */}
          <div className="flex h-6 items-end gap-[2px]">
            {eqLevels.map((lvl, idx) => (
              <div key={idx} className="flex flex-col gap-[1px]">
                {[5, 4, 3, 2, 1].map((bar) => {
                  const isActive = bar <= lvl;
                  const isPeak = bar >= 5;
                  return (
                    <span
                      key={bar}
                      className={`h-[2.5px] w-[3.5px] rounded-[0.5px] transition-colors duration-75 ${
                        isActive
                          ? isPeak
                            ? 'bg-[#FF6B00] shadow-[0_0_4px_#FF6B00]'
                            : 'bg-[#00F5D4] shadow-[0_0_4px_#00F5D4]'
                          : 'bg-neutral-900'
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* VFD Segmented Typography */}
          <div className="flex flex-1 flex-col font-mono">
            <div className="overflow-hidden whitespace-nowrap text-[12px] font-extrabold tracking-wider text-[#00F5D4] drop-shadow-[0_0_6px_rgba(0,245,212,0.8)]">
              {isHovered ? (
                <span className="animate-marquee inline-block">{`▶ BUILT BY ${creator.name} · ${creator.domain} · `}</span>
              ) : (
                <span>{creator.name}</span>
              )}
            </div>
            <span className="text-[7.5px] uppercase tracking-[0.2em] text-[#00F5D4]/60">
              {creator.domain} ↗
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   16. Teenage Engineering "Field" Hardware Module
   Anodized aluminum plate, 4 Torx screws, silkscreen micro-labels, tactile 3D mechanical
   orange push-button switch that physically depresses and lights up orange status LED.
───────────────────────────────────────────────────────────────────────────── */
export const TeenageFieldCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  const [pressed, setPressed] = useState(false);

  // SVG Torx screw head component
  const TorxScrew = ({ pos }: { pos: string }) => (
    <svg viewBox="0 0 16 16" className={`pointer-events-none absolute h-2.5 w-2.5 ${pos}`}>
      <circle cx="8" cy="8" r="7" fill="#C2BFB5" stroke="#9A968C" strokeWidth="1" />
      {/* 6-point star recess */}
      <path
        d="M8 3.5 L9 6.5 L12 6.5 L9.5 8.5 L10.5 11.5 L8 9.5 L5.5 11.5 L6.5 8.5 L4 6.5 L7 6.5 Z"
        fill="#54524C"
      />
    </svg>
  );

  return (
    <div
      className={`group relative select-none rounded-[6px] border border-[#BCB8AD] bg-[#E4E2DD] p-2.5 text-[#2B2925] transition-all duration-200 ${className}`}
      style={{
        width: '280px',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 1px rgba(0,0,0,0.1), 0 3px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* 4 Corner Torx Screws */}
      <TorxScrew pos="top-1.5 left-1.5" />
      <TorxScrew pos="top-1.5 right-1.5" />
      <TorxScrew pos="bottom-1.5 left-1.5" />
      <TorxScrew pos="bottom-1.5 right-1.5" />

      {/* Silkscreen micro headers */}
      <div className="flex items-center justify-between px-3 font-mono text-[7px] uppercase tracking-[0.2em] text-[#7A766B]">
        <span>TE-SIG01 // FIELD</span>
        <span>{creator.location}</span>
      </div>

      {/* Main Hardware Deck */}
      <div className="mt-1.5 flex items-center justify-between gap-3 px-2">
        {/* Creator Identity */}
        <div className="flex flex-col">
          <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#8C877B]">
            BUILT BY
          </span>
          <a
            href={creator.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-syne text-[14px] font-black uppercase tracking-tight text-[#1F1E1B] hover:text-[#FF4F00] transition-colors"
          >
            {creator.name}
          </a>
          <span className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-[#69655A]">
            {creator.domain} ↗
          </span>
        </div>

        {/* Mechanical Safety-Orange Push Button & Status LED */}
        <div className="flex items-center gap-2">
          {/* Recessed status LED */}
          <span
            className={`h-2 w-2 rounded-full border border-black/20 transition-all duration-200 ${
              pressed
                ? 'bg-[#FF4F00] shadow-[0_0_8px_#FF4F00,0_0_2px_#fff]'
                : 'bg-[#8F3F1B]/40'
            }`}
          />

          {/* 3D Push Button */}
          <button
            type="button"
            aria-label="Tactile switch"
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseEnter={() => setPressed(true)}
            onMouseLeave={() => setPressed(false)}
            className={`relative flex h-7 w-7 items-center justify-center rounded-full border border-[#D94200] bg-gradient-to-b from-[#FF5C14] to-[#E03E00] transition-transform duration-100 ${
              pressed
                ? 'translate-y-[2px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]'
                : 'shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-[2px]'
            }`}
          >
            <span className="h-2 w-2 rounded-full border border-white/40 bg-white/20" />
          </button>
        </div>
      </div>
    </div>
  );
};
