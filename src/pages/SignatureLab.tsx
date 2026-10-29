import React, { useEffect, useState } from 'react';
import { MiniFooter } from '../components/SignatureLabOptions';
import { useUnlockDocumentScroll } from '../hooks/useUnlockDocumentScroll';
import { CreatorProvider, useCreatorContext } from '../context/CreatorContext';
import { WAVE_1_OPTIONS, WAVE_2_OPTIONS, SignatureOption } from './signatureLabData';
import { Sun, Moon, Sparkles, Sliders } from 'lucide-react';

const SignatureLabContent: React.FC = () => {
  useUnlockDocumentScroll();
  const { creator, updateCreator } = useCreatorContext();

  const [globalDark, setGlobalDark] = useState(false);
  const [cardDarkOverrides, setCardDarkOverrides] = useState<Record<string, boolean>>({});
  const [showConfig, setShowConfig] = useState(false);

  // Dynamic font for handwriting option #02
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap';
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  const toggleCardDark = (id: string) => {
    setCardDarkOverrides((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? globalDark),
    }));
  };

  const renderSignatureSection = (option: SignatureOption) => {
    const isDark = cardDarkOverrides[option.id] ?? globalDark;

    return (
      <section key={option.id} id={`sig-${option.number}`} className="scroll-mt-28">
        <div className="flex flex-wrap items-start justify-between gap-3 border-t border-black/10 pt-5">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] tabular-nums tracking-[0.18em] text-neutral-400">
                {option.number}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] ${
                  option.wave === 2
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-700'
                    : 'border-black/10 text-neutral-500'
                }`}
              >
                {option.category}
              </span>
              <h2 className="font-syne text-xl font-extrabold uppercase tracking-tight sm:text-2xl">
                {option.name}
              </h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              {option.description}
            </p>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-500">
              <span className="text-amber-600 font-bold mr-1.5">⚡ INTERACTION:</span>
              {option.note}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => toggleCardDark(option.id)}
              className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider text-neutral-600 hover:border-black/30 hover:text-neutral-900 transition-colors shadow-sm"
              title="Toggle preview background for this card"
            >
              {isDark ? <Sun className="h-3 w-3 text-amber-500" /> : <Moon className="h-3 w-3 text-neutral-500" />}
              <span>{isDark ? 'Dark Footer' : 'Light Footer'}</span>
            </button>

            <div className="flex max-w-none flex-wrap justify-start gap-x-3 gap-y-1 sm:max-w-[240px] sm:justify-end">
              {option.references.map((ref) => (
                <a
                  key={ref.href}
                  href={ref.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[8px] uppercase tracking-[0.12em] text-neutral-400 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900"
                >
                  {ref.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Live Footer Stage */}
        <div
          className={`relative mt-4 overflow-hidden rounded-xl border transition-colors duration-500 ${
            isDark
              ? 'border-neutral-800 bg-[#121214] text-white shadow-inner'
              : 'border-black/10 bg-[#fcfbf8] text-neutral-900'
          }`}
        >
          <img
            src="./img/look-3-trench-v2.webp"
            alt=""
            className={`pointer-events-none absolute -right-8 bottom-0 h-[170%] w-auto transition-opacity duration-500 ${
              isDark ? 'opacity-[0.03] invert' : 'opacity-[0.06]'
            }`}
          />
          <div className="relative">
            <MiniFooter dark={isDark}>
              <option.Component />
            </MiniFooter>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-dvh bg-[#efede7] text-[#141518] selection:bg-neutral-900 selection:text-white">
      {/* Sticky Header with Navigation and Master Controls */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fcfbf8]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-neutral-400">
              [ SIGNATURE LAB 2.0 ]
            </span>
            <h1 className="font-syne text-base font-extrabold tracking-tight sm:text-lg">
              24 Master Signatures
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Global Light/Dark Toggle */}
            <button
              type="button"
              onClick={() => setGlobalDark((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-neutral-700 hover:border-black/30 hover:text-neutral-900 transition-all shadow-sm"
              title="Toggle all preview cards between light and dark"
            >
              {globalDark ? <Sun className="h-3.5 w-3.5 text-amber-500" /> : <Moon className="h-3.5 w-3.5 text-neutral-600" />}
              <span>{globalDark ? 'All Dark' : 'All Light'}</span>
            </button>

            {/* Live Creator Config Pill */}
            <button
              type="button"
              onClick={() => setShowConfig((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-neutral-700 hover:border-black/30 hover:text-neutral-900 transition-all shadow-sm"
            >
              <Sliders className="h-3.5 w-3.5 text-neutral-500" />
              <span>Brand: {creator.name}</span>
            </button>

            <a
              href="/"
              className="ml-2 font-mono text-[9px] uppercase tracking-wider text-neutral-400 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
            >
              back to site
            </a>
          </div>
        </div>

        {/* Live Brand Config Drawer */}
        {showConfig && (
          <div className="border-t border-black/5 bg-[#F7F5EE] px-5 py-3 sm:px-8">
            <div className="mx-auto max-w-6xl flex flex-wrap items-center gap-4 text-xs">
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-neutral-500 font-bold">
                Configure Brand (Updates All 24 Live):
              </span>
              <label className="flex items-center gap-1.5 font-mono text-[9px]">
                <span className="text-neutral-400">Name:</span>
                <input
                  type="text"
                  value={creator.name}
                  onChange={(e) => updateCreator({ name: e.target.value })}
                  className="rounded border border-black/15 bg-white px-2 py-0.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                />
              </label>
              <label className="flex items-center gap-1.5 font-mono text-[9px]">
                <span className="text-neutral-400">Short:</span>
                <input
                  type="text"
                  value={creator.shortName}
                  onChange={(e) => updateCreator({ shortName: e.target.value.toUpperCase() })}
                  className="rounded border border-black/15 bg-white px-2 py-0.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                />
              </label>
              <label className="flex items-center gap-1.5 font-mono text-[9px]">
                <span className="text-neutral-400">Domain:</span>
                <input
                  type="text"
                  value={creator.domain}
                  onChange={(e) => updateCreator({ domain: e.target.value })}
                  className="rounded border border-black/15 bg-white px-2 py-0.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                />
              </label>
            </div>
          </div>
        )}

        {/* Navigation Quick Strip */}
        <div className="mx-auto flex max-w-6xl items-center gap-1.5 overflow-x-auto px-5 py-2 sm:px-8 border-t border-black/5 scrollbar-none">
          <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider text-amber-700 font-bold mr-1">
            <Sparkles className="h-2.5 w-2.5 text-amber-600" />
            Wave 2:
          </span>
          {WAVE_2_OPTIONS.map((opt) => (
            <a
              key={opt.id}
              href={`#sig-${opt.number}`}
              className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[8.5px] font-bold tabular-nums text-amber-800 hover:border-amber-500/60 hover:bg-amber-500/20"
            >
              {opt.number}
            </a>
          ))}

          <span className="mx-2 h-3 w-px bg-neutral-300" />

          <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 mr-1">
            Wave 1:
          </span>
          {WAVE_1_OPTIONS.map((opt) => (
            <a
              key={opt.id}
              href={`#sig-${opt.number}`}
              className="rounded-full border border-black/10 bg-white/60 px-2 py-0.5 font-mono text-[8.5px] tabular-nums text-neutral-600 hover:border-black/30 hover:text-neutral-900"
            >
              {opt.number}
            </a>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-5 pb-28 pt-10 sm:px-8">
        {/* Intro Banner */}
        <div className="border-b border-black/10 pb-8">
          <h2 className="font-syne text-2xl font-black uppercase tracking-tight sm:text-3xl">
            Website Creator Signature Lab
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600">
            A master collection of 24 distinct website creator signature studies, scaled to real footer proportions.
            Featuring custom inline SVGs (sawtooth paper cuts, circuit traces, Torx screw heads, wax seals, vinyl grooves),
            CSS lighting/textures (metallic gradients, CRT scanlines), and rich mouse-tracking micro-interactions.
          </p>
        </div>

        {/* WAVE 2: HIGH-CRAFT & RETRO COLLECTION (#13–#24) */}
        <div className="mt-12">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-white font-mono text-[10px] font-bold">
              ★
            </span>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-700 font-bold">
                NEW RELEASE
              </span>
              <h3 className="font-syne text-xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-2xl">
                Wave 2: High-Craft & Retro Collection (#13 – #24)
              </h3>
            </div>
          </div>
          <p className="mt-1 max-w-2xl text-xs text-neutral-500">
            Inspired by Teenage Engineering, 80s VFD audio decks, 90s clear polycarbonate gaming hardware,
            Awwwards brutalist receipt slips, and holographic anti-counterfeit foils.
          </p>

          <div className="mt-8 space-y-16">
            {WAVE_2_OPTIONS.map(renderSignatureSection)}
          </div>
        </div>

        {/* WAVE 1: MINIMALIST & EDITORIAL (#01–#12) */}
        <div className="mt-24 pt-10 border-t-2 border-black/10">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
              ORIGINAL STUDIES
            </span>
            <h3 className="font-syne text-xl font-extrabold uppercase tracking-tight text-neutral-700 sm:text-2xl">
              Wave 1: Minimalist & Editorial (#01 – #12)
            </h3>
          </div>
          <p className="mt-1 max-w-2xl text-xs text-neutral-500">
            The foundational 12 directions featuring typographic seals, handwritten ink scripts,
            split-flap tokens, and woven garment labels.
          </p>

          <div className="mt-8 space-y-16">
            {WAVE_1_OPTIONS.map(renderSignatureSection)}
          </div>
        </div>
      </main>
    </div>
  );
};

const SignatureLab: React.FC = () => {
  return (
    <CreatorProvider>
      <SignatureLabContent />
    </CreatorProvider>
  );
};

export default SignatureLab;
