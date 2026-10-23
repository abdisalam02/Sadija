import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from 'framer-motion';
import { DockMode } from '../config/animationConfig';

interface DockGeometry {
  name: string;
  startLeft: number;
  startTop: number;
  startWidth: number;
  startHeight: number;
  targetLeft: number;
  targetTop: number;
  distance: number;
  scale: number;
  fontSize: number;
  fontWeight: number;
  letterSpacing: string;
  lineHeight: string;
  fontFamily: string;
}

interface DockingNameProps {
  scrollY: MotionValue<number>;
  name: string;
  onReady?: () => void;
  navOffset?: number;
  startColor?: string;
  startShadow?: string;
  mode?: DockMode;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/**
 * The mobile hero name carries a soft text-shadow for legibility over the
 * photograph. Once it heads into the nav that shadow reads as a glow, so we
 * scale the shadow (offset, blur and alpha) down to nothing as it docks.
 */
const SHADOW_RE =
  /^(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+rgba?\(([^)]+)\)$/;

const fadeShadow = (shadow: string, fade: number) => {
  const match = shadow.match(SHADOW_RE);
  if (!match) return shadow;

  const amount = 1 - clamp01(fade);
  const [x, y, blur] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const [r, g, b, a = 1] = match[4].split(',').map((part) => Number(part.trim()));

  return `${x * amount}px ${y * amount}px ${blur * amount}px rgba(${r}, ${g}, ${b}, ${
    a * amount
  })`;
};

const parseHex = (color: string) => {
  const match = color.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (!match) return null;
  const hex = match[1].length === 3 ? match[1].split('').map((c) => c + c).join('') : match[1];
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
};

/** Linear sRGB mix, matching what the native CSS keyframes do. */
const mixColor = (from: string, to: string, t: number) => {
  const a = parseHex(from);
  const b = parseHex(to);
  if (!a || !b) return from;
  const mix = a.map((channel, index) => Math.round(channel + (b[index] - channel) * clamp01(t)));
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;
};

const useFadingShadow = (progress: MotionValue<number>, shadow: string) =>
  useTransform(progress, (value) => fadeShadow(shadow, (value - 0.58) / 0.34));

/**
 * A fixed clone of the hero wordmark that docks into the nav as the page
 * scrolls. The original h1 stays in the flow for accessibility/layout.
 *
 * mode A: one continuous scroll-driven spring (position + scale together).
 * mode B: follows the page, then a time-based spring docks it into the nav.
 * mode C: follows at full size, then collapses from just below the nav.
 * mode D: native CSS scroll-driven timeline (no JS per-frame transforms).
 * mode E: no clone; the in-flow hero name crossfades into the nav brand.
 */
export const DockingName: React.FC<DockingNameProps> = ({
  scrollY,
  name,
  onReady,
  navOffset = 20,
  startColor = '#3d3d3d',
  startShadow = '0 0 0 rgba(0,0,0,0)',
  mode = 'A',
}) => {
  const [geometry, setGeometry] = useState<DockGeometry | null>(null);
  const [measured, setMeasured] = useState(false);

  const measure = useCallback(() => {
    const text = document.getElementById('hero-name-text');
    const heading = document.getElementById('client-name-title');
    const navBrand = document.getElementById('nav-brand');
    const scroller = document.getElementById('app-scroll');

    if (!text || !heading || !navBrand) return;

    const textRect = text.getBoundingClientRect();
    const brandRect = navBrand.getBoundingClientRect();
    if (textRect.width <= 0 || brandRect.width <= 0) return;

    const scrollTop = scroller?.scrollTop ?? window.scrollY;
    const computed = window.getComputedStyle(heading);
    const brandComputed = window.getComputedStyle(navBrand);
    const heroFontSize = parseFloat(computed.fontSize);
    const brandFontSize = parseFloat(brandComputed.fontSize) || 14;
    const scale = brandFontSize / heroFontSize;

    const startTop = textRect.top + scrollTop;
    // navY starts by navOffset; by the time the name docks the header is at y=0.
    const targetTop = brandRect.top + navOffset + (brandRect.height - textRect.height * scale) / 2;

    setGeometry({
      name,
      startLeft: textRect.left,
      startTop,
      startWidth: textRect.width,
      startHeight: textRect.height,
      targetLeft: brandRect.left,
      targetTop,
      distance: Math.max(60, startTop - targetTop),
      scale,
      fontSize: heroFontSize,
      fontWeight: Number(computed.fontWeight) || 800,
      letterSpacing: computed.letterSpacing === 'normal' ? '0em' : computed.letterSpacing,
      lineHeight: computed.lineHeight,
      fontFamily: computed.fontFamily,
    });
    setMeasured(true);
    onReady?.();
  }, [name, navOffset, onReady]);

  useEffect(() => {
    let cancelled = false;

    const runMeasure = () => {
      if (!cancelled) measure();
    };

    const timer = window.setTimeout(runMeasure, 900);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) window.setTimeout(runMeasure, 850);
      });
    }

    window.addEventListener('resize', runMeasure);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener('resize', runMeasure);
    };
  }, [measure]);

  if (!geometry) return null;

  const shared = {
    geometry,
    scrollY,
    ready: measured,
    startColor,
    startShadow,
  };

  if (mode === 'E') return null;
  if (mode === 'D') return <DockD {...shared} />;
  if (mode === 'B') return <DockTimed {...shared} mode="B" zone={110} colorMode="mixed" spring={B_SPRING} />;
  if (mode === 'C') return <DockTimed {...shared} mode="C" zone={20} colorMode="mixed" spring={C_SPRING} />;
  return <DockA {...shared} />;
};

/* ── shared wordmark ────────────────────────────────────────────────────── */

const DockWord: React.FC<{
  geometry: DockGeometry;
  x: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  color: MotionValue<string>;
  textShadow: MotionValue<string>;
  mode: DockMode;
}> = ({ geometry, x, y, scale, color, textShadow, mode }) => (
  <motion.span
    aria-hidden="true"
    data-docking-name
    data-dock-mode={mode}
    style={{
      position: 'fixed',
      left: geometry.startLeft,
      top: geometry.startTop,
      x,
      y,
      scale,
      color,
      textShadow,
      fontSize: geometry.fontSize,
      fontWeight: geometry.fontWeight,
      letterSpacing: geometry.letterSpacing,
      lineHeight: geometry.lineHeight,
      fontFamily: geometry.fontFamily,
      transformOrigin: 'top left',
      pointerEvents: 'none',
      zIndex: 60,
      whiteSpace: 'nowrap',
      userSelect: 'none',
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      WebkitFontSmoothing: 'antialiased',
    }}
    className="font-syne uppercase"
  >
    {geometry.name}
  </motion.span>
);

interface DockVariantProps {
  geometry: DockGeometry;
  scrollY: MotionValue<number>;
  ready: boolean;
  startColor: string;
  startShadow: string;
}

/* ── A — one continuous spring ──────────────────────────────────────────── */

const DockA: React.FC<DockVariantProps> = ({
  geometry,
  scrollY,
  ready,
  startColor,
  startShadow,
}) => {
  const distance = geometry.distance;

  // A single spring means Y and scale settle on the same timeline. A fling
  // glides instead of snapping because the name trails the raw scroll value.
  const smoothScroll = useSpring(scrollY, {
    stiffness: 260,
    damping: 30,
    mass: 0.5,
    restDelta: 0.001,
  });

  const progress = useTransform(smoothScroll, (value) => clamp01(value / distance));
  const x = useTransform(
    progress,
    [0, 1],
    [0, geometry.targetLeft - geometry.startLeft]
  );
  const y = useTransform(smoothScroll, (value) => -Math.min(Math.max(value, 0), distance));
  const scale = useTransform(progress, [0, 1], [1, geometry.scale]);

  const colorStart = Math.max(8, distance * 0.15);
  const colorEnd = Math.max(colorStart + 1, distance * 0.9);
  const color = useTransform(smoothScroll, [colorStart, colorEnd], [startColor, '#141518']);
  const textShadow = useFadingShadow(progress, startShadow);

  if (!ready) return null;

  return (
    <DockWord
      geometry={geometry}
      x={x}
      y={y}
      scale={scale}
      color={color}
      textShadow={textShadow}
      mode="A"
    />
  );
};

/* ── B/C — page-follow then timed dock ──────────────────────────────────── */

const B_SPRING = { stiffness: 150, damping: 28, mass: 0.7, restDelta: 0.0005 };
const C_SPRING = { stiffness: 120, damping: 24, mass: 0.8, restDelta: 0.0005 };

const DockTimed: React.FC<
  DockVariantProps & {
    mode: 'B' | 'C';
    zone: number;
    colorMode: 'mixed' | 'dock';
    spring: { stiffness: number; damping: number; mass: number; restDelta: number };
  }
> = ({ geometry, scrollY, ready, startColor, startShadow, mode, zone, colorMode, spring }) => {
  const distance = geometry.distance;
  const dockZone = Math.max(12, Math.min(zone, distance - 12));
  const trigger = Math.max(0, distance - dockZone);
  const dockedRef = useRef(false);

  const dock = useSpring(0, spring);

  useMotionValueEvent(scrollY, 'change', (value) => {
    if (!dockedRef.current && value >= trigger) {
      dockedRef.current = true;
      dock.set(1);
    } else if (dockedRef.current && value <= trigger - 12) {
      dockedRef.current = false;
      dock.set(0);
    }
  });

  useEffect(() => {
    if (scrollY.get() >= trigger) {
      dockedRef.current = true;
      dock.set(1);
    } else {
      dockedRef.current = false;
      dock.set(0);
    }
  }, [trigger, scrollY, dock]);

  // Before the dock zone, the name follows the page at full size.
  // Inside it, one time-based spring carries Y, X and scale into the nav.
  const y = useTransform([scrollY, dock], ([scroll, dockValue]: number[]) => {
    const follow = -Math.min(Math.max(scroll, 0), distance);
    if (dockValue <= 0.0005) return follow;

    const dockStartY = -trigger;
    const dockedY = -distance;
    return dockStartY + (dockedY - dockStartY) * dockValue;
  });

  const x = useTransform(dock, [0, 1], [0, geometry.targetLeft - geometry.startLeft]);
  const scale = useTransform(dock, [0, 1], [1, geometry.scale]);

  const colorStart = Math.max(8, distance * 0.15);
  const colorEnd = Math.max(colorStart + 1, distance * 0.9);
  const colorMix = useTransform(
    [scrollY, dock],
    ([scroll, dockValue]: number[]) =>
      colorMode === 'dock'
        ? dockValue
        : Math.max(clamp01((scroll - colorStart) / (colorEnd - colorStart)), dockValue)
  );
  const color = useTransform(colorMix, [0, 1], [startColor, '#141518']);
  const textShadow = useFadingShadow(colorMix, startShadow);

  if (!ready) return null;

  return (
    <DockWord
      geometry={geometry}
      x={x}
      y={y}
      scale={scale}
      color={color}
      textShadow={textShadow}
      mode={mode}
    />
  );
};

/* ── D — native CSS scroll-driven animation ─────────────────────────────── */

const DockD: React.FC<DockVariantProps> = (props) => {
  const { geometry, ready, startColor, startShadow } = props;

  const supported =
    typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: scroll()');
  if (!supported) return <DockDScrub {...props} />;
  if (!ready) return null;

  const vars = {
    '--dock-distance': `${geometry.distance}px`,
    '--dock-x': `${geometry.targetLeft - geometry.startLeft}px`,
    '--dock-y': `-${geometry.distance}px`,
    '--dock-scale': geometry.scale,
    '--dock-start-color': startColor,
    '--dock-start-shadow': startShadow,
  } as React.CSSProperties;

  return (
    <span
      aria-hidden="true"
      data-docking-name
      data-dock-mode="D"
      className="dock-css-word font-syne uppercase"
      style={{
        ...vars,
        left: geometry.startLeft,
        top: geometry.startTop,
        fontSize: geometry.fontSize,
        fontWeight: geometry.fontWeight,
        letterSpacing: geometry.letterSpacing,
        lineHeight: geometry.lineHeight,
        fontFamily: geometry.fontFamily,
      }}
    >
      {geometry.name}
    </span>
  );
};

/**
 * D without the native scroll timeline (Safari/Firefox): the exact same
 * linear scrub, but driven from the scroll MotionValue. No spring, so there
 * is no lag or bounce — it simply tracks the page like the compositor version.
 */
const DockDScrub: React.FC<DockVariantProps> = ({
  geometry,
  scrollY,
  ready,
  startColor,
  startShadow,
}) => {
  const distance = geometry.distance;
  const progress = useTransform(scrollY, (value) => clamp01(value / distance));
  const x = useTransform(
    progress,
    [0, 1],
    [0, geometry.targetLeft - geometry.startLeft]
  );
  const y = useTransform(scrollY, (value) => -Math.min(Math.max(value, 0), distance));
  const scale = useTransform(progress, [0, 1], [1, geometry.scale]);
  const color = useTransform(progress, (value) => mixColor(startColor, '#141518', value));
  const textShadow = useFadingShadow(progress, startShadow);

  if (!ready) return null;

  return (
    <DockWord
      geometry={geometry}
      x={x}
      y={y}
      scale={scale}
      color={color}
      textShadow={textShadow}
      mode="D"
    />
  );
};
