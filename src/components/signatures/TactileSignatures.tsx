import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { CreatorConfig } from '../../config/creatorConfig';

interface SignatureProps {
  creator?: Partial<CreatorConfig>;
  className?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   17. The Torn Thermal Receipt Stub
   Sawtooth torn paper edge SVG, faded thermal receipt typography, vertical barcode,
   and snappy rubber stamp [ APPROVED // BY CREATOR ] on hover.
───────────────────────────────────────────────────────────────────────────── */
export const ThermalReceiptCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={creator.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative block select-none bg-[#FAF7F0] text-[#22211E] font-mono shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
      style={{ width: '270px' }}
    >
      {/* Top Sawtooth Torn Edge SVG */}
      <svg
        viewBox="0 0 270 6"
        className="absolute -top-[5px] left-0 w-full text-[#FAF7F0] fill-current"
        preserveAspectRatio="none"
      >
        <path d="M0,6 L5,0 L10,6 L15,0 L20,6 L25,0 L30,6 L35,0 L40,6 L45,0 L50,6 L55,0 L60,6 L65,0 L70,6 L75,0 L80,6 L85,0 L90,6 L95,0 L100,6 L105,0 L110,6 L115,0 L120,6 L125,0 L130,6 L135,0 L140,6 L145,0 L150,6 L155,0 L160,6 L165,0 L170,6 L175,0 L180,6 L185,0 L190,6 L195,0 L200,6 L205,0 L210,6 L215,0 L220,6 L225,0 L230,6 L235,0 L240,6 L245,0 L250,6 L255,0 L260,6 L265,0 L270,6 Z" />
      </svg>

      {/* Receipt Body */}
      <div className="relative px-3.5 py-2.5 text-[8.5px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dashed border-neutral-300 pb-1 text-[7px] text-neutral-500">
          <span>RECEIPT #{creator.year}-01</span>
          <span>AUTH: VERIFIED</span>
        </div>

        {/* Itemized Line */}
        <div className="mt-1.5 flex items-center justify-between">
          <div>
            <div className="font-syne text-[11px] font-extrabold uppercase tracking-tight text-neutral-900">
              {creator.name}
            </div>
            <div className="text-[7.5px] uppercase tracking-wider text-neutral-500">
              {creator.domain} ↗
            </div>
          </div>
          <div className="text-right text-[7.5px] text-neutral-500">
            <div>QTY: 1.00</div>
            <div className="font-bold text-neutral-800">BESPOKE</div>
          </div>
        </div>

        {/* Barcode Strip */}
        <div className="mt-2 flex items-center justify-between border-t border-dashed border-neutral-300 pt-1">
          <svg viewBox="0 0 140 14" className="h-3 w-32 fill-current text-neutral-800">
            <rect x="0" y="0" width="2" height="14" />
            <rect x="4" y="0" width="1" height="14" />
            <rect x="7" y="0" width="3" height="14" />
            <rect x="12" y="0" width="1" height="14" />
            <rect x="15" y="0" width="2" height="14" />
            <rect x="19" y="0" width="4" height="14" />
            <rect x="25" y="0" width="1" height="14" />
            <rect x="28" y="0" width="2" height="14" />
            <rect x="32" y="0" width="1" height="14" />
            <rect x="35" y="0" width="3" height="14" />
            <rect x="40" y="0" width="2" height="14" />
            <rect x="44" y="0" width="1" height="14" />
            <rect x="47" y="0" width="3" height="14" />
            <rect x="52" y="0" width="2" height="14" />
            <rect x="56" y="0" width="1" height="14" />
            <rect x="59" y="0" width="2" height="14" />
            <rect x="63" y="0" width="4" height="14" />
            <rect x="69" y="0" width="1" height="14" />
            <rect x="72" y="0" width="2" height="14" />
            <rect x="76" y="0" width="3" height="14" />
            <rect x="81" y="0" width="1" height="14" />
            <rect x="84" y="0" width="2" height="14" />
            <rect x="88" y="0" width="1" height="14" />
            <rect x="91" y="0" width="3" height="14" />
            <rect x="96" y="0" width="2" height="14" />
            <rect x="100" y="0" width="1" height="14" />
            <rect x="103" y="0" width="3" height="14" />
            <rect x="108" y="0" width="2" height="14" />
            <rect x="112" y="0" width="4" height="14" />
            <rect x="118" y="0" width="1" height="14" />
            <rect x="122" y="0" width="2" height="14" />
            <rect x="126" y="0" width="2" height="14" />
            <rect x="130" y="0" width="1" height="14" />
            <rect x="133" y="0" width="3" height="14" />
            <rect x="138" y="0" width="2" height="14" />
          </svg>
          <span className="text-[6.5px] uppercase tracking-widest text-neutral-400">THANK YOU</span>
        </div>

        {/* Distressed Red Ink Rubber Stamp Overlay */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out ${
            isHovered
              ? 'scale-100 rotate-[-8deg] opacity-90'
              : 'scale-125 rotate-[-15deg] opacity-0'
          }`}
        >
          <div className="rounded border-2 border-red-700/80 px-2.5 py-0.5 text-center font-mono text-[9px] font-black uppercase tracking-widest text-red-700/85 shadow-[0_0_2px_rgba(185,28,28,0.4)]">
            APPROVED // {creator.shortName}
          </div>
        </div>
      </div>

      {/* Bottom Sawtooth Torn Edge SVG */}
      <svg
        viewBox="0 0 270 6"
        className="absolute -bottom-[5px] left-0 w-full text-[#FAF7F0] fill-current"
        preserveAspectRatio="none"
      >
        <path d="M0,0 L5,6 L10,0 L15,6 L20,0 L25,6 L30,0 L35,6 L40,0 L45,6 L50,0 L55,6 L60,0 L65,6 L70,0 L75,6 L80,0 L85,6 L90,0 L95,6 L100,0 L105,6 L110,0 L115,6 L120,0 L125,6 L130,0 L135,6 L140,0 L145,6 L150,0 L155,6 L160,0 L165,6 L170,0 L175,6 L180,0 L185,6 L190,0 L195,6 L200,0 L205,6 L210,0 L215,6 L220,0 L225,6 L230,0 L235,6 L240,0 L245,6 L250,0 L255,6 L260,0 L265,6 L270,0 Z" />
      </svg>
    </a>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   18. Holographic Foil Anti-Counterfeit Security Sticker
   Die-cut metallic security sticker with micro-guilloche SVG, 3D mouse tilt,
   and dynamic shifting rainbow foil glare.
───────────────────────────────────────────────────────────────────────────── */
export const HolographicFoilCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [coords, setCoords] = useState({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, angle: 45 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 12;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);

    setCoords({ rotX, rotY, glareX, glareY, angle });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, angle: 45 });
  };

  return (
    <a
      ref={cardRef}
      href={creator.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`group relative block select-none overflow-hidden rounded-lg border border-neutral-300/80 bg-neutral-200 p-2.5 transition-transform duration-100 ease-out ${className}`}
      style={{
        width: '280px',
        transform: `perspective(600px) rotateX(${coords.rotX}deg) rotateY(${coords.rotY}deg)`,
        boxShadow: isHovered
          ? '0 8px 20px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.8)'
          : '0 2px 6px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.6)',
      }}
    >
      {/* Dynamic Rainbow Holographic Foil Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.75 : 0.35,
          background: `conic-gradient(from ${coords.angle}deg at ${coords.glareX}% ${coords.glareY}%, #ff0080, #ff8c00, #ffee00, #40e0d0, #1e90ff, #9932cc, #ff0080)`,
          mixBlendMode: 'color-dodge',
        }}
      />

      {/* Metallic Specular Sweep */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/20 via-white/50 to-transparent opacity-60"
      />

      {/* Micro-Guilloche Security Pattern SVG */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40 mix-blend-multiply"
        viewBox="0 0 280 60"
      >
        <path
          d="M0 30 Q 35 0, 70 30 T 140 30 T 210 30 T 280 30 M0 30 Q 35 60, 70 30 T 140 30 T 210 30 T 280 30 M15 30 Q 50 5, 85 30 T 155 30 T 225 30 T 295 30 M15 30 Q 50 55, 85 30 T 155 30 T 225 30 T 295 30"
          fill="none"
          stroke="#4b5563"
          strokeWidth="0.5"
        />
        <circle cx="240" cy="30" r="16" fill="none" stroke="#4b5563" strokeWidth="0.5" />
        <circle cx="240" cy="30" r="11" fill="none" stroke="#4b5563" strokeWidth="0.5" />
      </svg>

      {/* Hologram Details */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-neutral-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>AUTHENTIC ARTIFACT</span>
          </div>
          <span className="font-syne text-[13px] font-extrabold uppercase tracking-tight text-neutral-900 drop-shadow-sm">
            {creator.name}
          </span>
          <span className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-neutral-600">
            {creator.domain} ↗
          </span>
        </div>

        {/* Hologram Badge */}
        <div className="flex flex-col items-end font-mono text-[7px] text-neutral-700">
          <span className="rounded border border-neutral-400/60 bg-white/40 px-1 py-0.5 font-bold">
            SEC-#{creator.year}
          </span>
          <span className="mt-1 text-[6px] tracking-widest uppercase text-neutral-600">
            ORIGINAL
          </span>
        </div>
      </div>
    </a>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   19. The Interactive Micro-Vinyl Record & Jacket
   Square album cover sleeve, Swiss typography, with glossy black vinyl LP
   that slides 60% out and spins continuously on hover!
───────────────────────────────────────────────────────────────────────────── */
export const MicroVinylCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={creator.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex select-none items-center gap-3 py-1 ${className}`}
      style={{ width: '280px' }}
    >
      {/* Vinyl LP Jacket & Slide Container */}
      <div className="relative h-12 w-12 shrink-0">
        {/* Black Vinyl LP Record (under jacket, slides out & spins) */}
        <div
          aria-hidden="true"
          className={`absolute left-0 top-0 h-12 w-12 rounded-full transition-transform duration-500 ease-out ${
            isHovered ? 'translate-x-6' : 'translate-x-0'
          }`}
        >
          <div
            className={`relative flex h-full w-full items-center justify-center rounded-full bg-[#111113] shadow-md ${
              isHovered ? 'animate-[spin_3s_linear_infinite]' : ''
            }`}
            style={{
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              background:
                'radial-gradient(circle, #2a2a2e 0%, #111113 40%, #1a1a1e 70%, #0d0d0f 100%)',
            }}
          >
            {/* Concentric Vinyl Grooves SVG */}
            <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full opacity-40">
              <circle cx="24" cy="24" r="21" fill="none" stroke="#fff" strokeWidth="0.4" />
              <circle cx="24" cy="24" r="18" fill="none" stroke="#fff" strokeWidth="0.4" />
              <circle cx="24" cy="24" r="15" fill="none" stroke="#fff" strokeWidth="0.4" />
              <circle cx="24" cy="24" r="12" fill="none" stroke="#fff" strokeWidth="0.4" />
            </svg>

            {/* Center Label */}
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-700 bg-red-600 text-white shadow-inner">
              <span className="font-mono text-[4.5px] font-bold uppercase">{creator.shortName.slice(0, 3)}</span>
            </div>
            {/* Center Spindle Hole */}
            <span className="absolute h-1.5 w-1.5 rounded-full bg-neutral-900" />
          </div>
        </div>

        {/* Cardboard Vinyl Jacket Sleeve (Sits on top) */}
        <div
          className="relative z-10 flex h-12 w-12 flex-col justify-between border border-neutral-800 bg-[#1e1e24] p-1 text-white shadow-sm"
          style={{
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          <div className="flex items-center justify-between font-mono text-[5.5px] uppercase tracking-wider text-neutral-400">
            <span>33 RPM</span>
            <span>LP</span>
          </div>
          <div className="text-center font-syne text-[8px] font-black uppercase tracking-tight text-white">
            {creator.shortName}
          </div>
          <div className="font-mono text-[4.5px] text-neutral-400 uppercase tracking-widest text-right">
            SIDE A
          </div>
        </div>
      </div>

      {/* Typography metadata column */}
      <div className="flex flex-1 flex-col pl-4">
        <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-neutral-500">
          PRODUCED BY
        </span>
        <span className="font-syne text-[13px] font-bold uppercase tracking-tight text-neutral-900 group-hover:text-red-600 transition-colors">
          {creator.name}
        </span>
        <span className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-neutral-400">
          {creator.domain} ↗
        </span>
      </div>
    </a>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   20. Mechanical Split-Flap Departure Board (Solari Board)
   Dark charcoal flip-tiles with center split hinge lines, side notches, and rapid
   clattering character cycling animation locking into creator name.
───────────────────────────────────────────────────────────────────────────── */
export const SplitFlapSolariCredit: React.FC<SignatureProps> = ({ creator: propCreator, className = '' }) => {
  const creator = useCreator(propCreator);
  const targetWord = (creator.shortName || 'AGURE').padEnd(7, ' ').slice(0, 7);
  const [tiles, setTiles] = useState(targetWord.split(''));
  const busy = useRef(false);
  const timer = useRef<number | null>(null);

  const runFlap = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -*';
    let tick = 0;
    const max = 14;

    timer.current = window.setInterval(() => {
      tick += 1;
      setTiles(
        targetWord
          .split('')
          .map((char, idx) => (tick < 4 + idx * 2 ? pool[Math.floor(Math.random() * pool.length)] : char))
      );
      if (tick >= max) {
        if (timer.current) clearInterval(timer.current);
        setTiles(targetWord.split(''));
        busy.current = false;
      }
    }, 55);
  }, [targetWord]);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    []
  );

  return (
    <a
      href={creator.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={runFlap}
      onClick={runFlap}
      className={`group relative flex select-none flex-col items-end gap-1.5 p-1 ${className}`}
      style={{ width: '280px' }}
    >
      <div className="flex items-center justify-between w-full font-mono text-[7px] uppercase tracking-[0.2em] text-neutral-400">
        <span>SOLARI // TERMINAL</span>
        <span>GATE 26</span>
      </div>

      {/* Row of Charcoal Mechanical Split-Flap Tiles */}
      <div className="flex items-center gap-[3px]">
        {tiles.map((char, idx) => (
          <div
            key={idx}
            className="relative flex h-8 w-6 flex-col items-center justify-center rounded-[2px] bg-[#161618] font-mono text-[13px] font-bold text-[#FAF6EE] shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          >
            {/* Center Horizontal Split Hinge Line */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/80 z-10" />

            {/* Side Hinge Notches */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-[2px] bg-neutral-900 rounded-r-sm z-20" />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 h-1 w-[2px] bg-neutral-900 rounded-l-sm z-20" />

            {/* Upper Half Subtle Shine, Lower Half Subtle Shadow */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-white/[0.04]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-black/[0.15]" />

            {/* Tile Glyph */}
            <span className="relative z-0 select-none leading-none">{char}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 font-mono text-[7.5px] uppercase tracking-[0.2em] text-neutral-400">
        <span>{creator.domain}</span>
        <span>↗</span>
      </div>
    </a>
  );
};
