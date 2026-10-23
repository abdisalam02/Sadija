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
 * A fixed clone of the hero wordmark that docks into the nav as the page
 * scrolls. The original h1 stays in the flow for accessibility/layout.
 *
 * mode A: one continuous scroll-driven spring (position + scale together).
 * mode B: follows the page, then a time-based spring docks it into the nav.
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

  return mode === 'B' ? <DockB {...shared} /> : <DockA {...shared} />;
};

/* ── shared wordmark ────────────────────────────────────────────────────── */

const DockWord: React.FC<{
  geometry: DockGeometry;
  x: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  color: MotionValue<string>;
  startShadow: string;
}> = ({ geometry, x, y, scale, color, startShadow }) => (
  <motion.span
    aria-hidden="true"
    data-docking-name
    style={{
      position: 'fixed',
      left: geometry.startLeft,
      top: geometry.startTop,
      x,
      y,
      scale,
      color,
      textShadow: startShadow,
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

  if (!ready) return null;

  return (
    <DockWord
      geometry={geometry}
      x={x}
      y={y}
      scale={scale}
      color={color}
      startShadow={startShadow}
    />
  );
};

/* ── B — page-follow then timed dock ────────────────────────────────────── */

const DockB: React.FC<DockVariantProps> = ({
  geometry,
  scrollY,
  ready,
  startColor,
  startShadow,
}) => {
  const distance = geometry.distance;
  const dockZone = Math.min(110, Math.max(24, distance * 0.32));
  const trigger = Math.max(0, distance - dockZone);
  const dockedRef = useRef(false);

  const dock = useSpring(0, {
    stiffness: 150,
    damping: 28,
    mass: 0.7,
    restDelta: 0.0005,
  });

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
      Math.max(clamp01((scroll - colorStart) / (colorEnd - colorStart)), dockValue)
  );
  const color = useTransform(colorMix, [0, 1], [startColor, '#141518']);

  if (!ready) return null;

  return (
    <DockWord
      geometry={geometry}
      x={x}
      y={y}
      scale={scale}
      color={color}
      startShadow={startShadow}
    />
  );
};
