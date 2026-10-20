import React, { useState } from 'react';
import {
  Sparkles,
  Type,
  Minimize2,
  Check,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { HeroTextStyle, TransitionEffect, StudioSettings, StageTransform } from '../types';

export interface LookTransforms {
  [key: string]: StageTransform;
}

// User-chosen scale coordinates preserved exactly as tuned
export const DEFAULT_TRANSFORMS: LookTransforms = {
  global: { scale: 1.2, x: 0, y: 0 },
  'look-1': { scale: 1.45, x: 0, y: 0 },   // User chosen 1.45x
  'look-2': { scale: 1.25, x: 0, y: -20 },
  'look-3': { scale: 1.25, x: -50, y: 0 },
  'look-4': { scale: 1.18, x: 0, y: 0 },   // User chosen 1.18x
};

export const DEFAULT_STUDIO_SETTINGS: StudioSettings = {
  textStyle: 'crisp-white',       // Default to Crisp White so text is immediately readable
  transitionEffect: 'smooth-melt', // Default to simultaneous seamless crossfade
};

interface StudioEffectsProps {
  settings: StudioSettings;
  onChange: (settings: StudioSettings) => void;
  onReset: () => void;
}

export const ImageTuner: React.FC<StudioEffectsProps> = ({
  settings,
  onChange,
  onReset,
}) => {
  // Start open so user can immediately pick their preferred text and switch effects
  const [isOpen, setIsOpen] = useState(true);

  const textOptions: { id: HeroTextStyle; label: string; desc: string }[] = [
    {
      id: 'crisp-white',
      label: 'Crisp White',
      desc: 'High-contrast stark white text with soft editorial drop shadow',
    },
    {
      id: 'frosted-capsule',
      label: 'Glass Capsule',
      desc: 'Architectural frosted translucent glass card behind text',
    },
    {
      id: 'ambient-scrim',
      label: 'Ambient Scrim',
      desc: 'Soft gradient backdrop that lightens behind dark letters',
    },
    {
      id: 'charcoal-classic',
      label: 'Charcoal Classic',
      desc: 'Original minimalist dark ink typography',
    },
  ];

  const transitionOptions: { id: TransitionEffect; label: string; desc: string }[] = [
    {
      id: 'smooth-melt',
      label: 'Smooth Melt',
      desc: 'Simultaneous 850ms layered crossfade without blank flashes',
    },
    {
      id: 'slow-dissolve',
      label: 'Slow Dissolve',
      desc: 'Gentle 1.15s ambient dissolve like a gallery projection',
    },
    {
      id: 'parallax-drift',
      label: 'Parallax Drift',
      desc: 'Subtle 14px vertical glide paired with smooth opacity',
    },
    {
      id: 'editorial-snap',
      label: 'Editorial Snap',
      desc: 'Snappy 350ms switch for an avant-garde editorial lookbook',
    },
  ];

  return (
    <>
      {/* Minimized Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Studio Effects & Styling"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900/95 text-white text-xs font-medium shadow-2xl backdrop-blur-md border border-white/20 active:scale-95 transition-all hover:bg-black"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-syne tracking-tight">Studio Effects</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-neutral-300 capitalize">
              {settings.textStyle.replace('-', ' ')}
            </span>
          </button>
        </div>
      )}

      {/* Tactile Mobile-First Effects Panel */}
      {isOpen && (
        <aside
          role="region"
          aria-label="Studio Effects and Styling Options"
          className="fixed bottom-0 inset-x-0 sm:bottom-4 sm:right-4 sm:left-auto sm:w-[380px] z-50 rounded-t-3xl sm:rounded-3xl bg-neutral-950/95 text-white p-4 sm:p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.35)] sm:shadow-2xl border-t sm:border border-white/15 backdrop-blur-2xl transition-all pointer-events-auto max-h-[85dvh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-syne font-bold text-xs uppercase tracking-wider text-white">
                  Studio Effects & Styling
                </h3>
                <span className="text-[10px] text-amber-300 block">
                  Scale locked at 1.45x / Responsive
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onReset}
                title="Reset to recommended defaults"
                className="p-1.5 rounded-lg bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20 transition-colors text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[10px]">Reset</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize controller"
                className="p-1.5 rounded-lg bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20 transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 1. HERO TEXT VISIBILITY OPTIONS (Fix Look 1 Readability) */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                Hero Text Readability Style
              </span>
              <span className="text-[10px] text-neutral-400">Tap to preview</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              {textOptions.map((opt) => {
                const isActive = settings.textStyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange({ ...settings, textStyle: opt.id })}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isActive
                        ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-md scale-[1.02]'
                        : 'bg-white/5 border-white/10 text-neutral-200 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-syne font-bold text-xs">{opt.label}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-neutral-950" />}
                    </div>
                    <span
                      className={`text-[10px] line-clamp-2 leading-tight ${
                        isActive ? 'text-neutral-800' : 'text-neutral-400'
                      }`}
                    >
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. IMAGE TRANSITION EFFECTS (Fix Rough Switching) */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Image Switch Transition
              </span>
              <span className="text-[10px] text-neutral-400">Scroll to test</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              {transitionOptions.map((opt) => {
                const isActive = settings.transitionEffect === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange({ ...settings, transitionEffect: opt.id })}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isActive
                        ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-md scale-[1.02]'
                        : 'bg-white/5 border-white/10 text-neutral-200 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-syne font-bold text-xs">{opt.label}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-neutral-950" />}
                    </div>
                    <span
                      className={`text-[10px] line-clamp-2 leading-tight ${
                        isActive ? 'text-neutral-800' : 'text-neutral-400'
                      }`}
                    >
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary / Confirmation */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Settings saved automatically</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-amber-400 hover:underline font-medium"
            >
              Hide Controls
            </button>
          </div>
        </aside>
      )}
    </>
  );
};
