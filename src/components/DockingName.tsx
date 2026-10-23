import React, { useCallback, useEffect, useState } from 'react';
import { motion, MotionValue, useSpring, useTransform } from 'framer-motion';

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
}

/**
 * A fixed clone of the hero wordmark that travels into the nav as the page
 * scrolls. The original h1 stays in the flow for accessibility/layout; this
 * clone is the visible name from the hero all the way into the nav.
 */
export const DockingName: React.FC<DockingNameProps> = ({
  scrollY,
  name,
  onReady,
  navOffset = 20,
  startColor = '#3d3d3d',
  startShadow = '0 0 0 rgba(0,0,0,0)',
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

    // Wait for the hero's entrance animation and the display font to settle.
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

  return (
    <DockClone
      geometry={geometry}
      scrollY={scrollY}
      ready={measured}
      startColor={startColor}
      startShadow={startShadow}
    />
  );
};

const DockClone: React.FC<{
  geometry: DockGeometry;
  scrollY: MotionValue<number>;
  ready: boolean;
  startColor: string;
  startShadow: string;
}> = ({ geometry, scrollY, ready, startColor, startShadow }) => {
  const distance = geometry.distance;
  const progress = useTransform(scrollY, (value) =>
    Math.max(0, Math.min(1, value / distance))
  );
  // A gentle spring on the scale/x keeps the shrink smooth, especially on
  // touch momentum and when the scroll comes to rest frame by frame.
  const smoothProgress = useSpring(progress, {
    stiffness: 150,
    damping: 28,
    mass: 0.6,
    restDelta: 0.001,
  });

  const x = useTransform(
    smoothProgress,
    [0, 1],
    [0, geometry.targetLeft - geometry.startLeft]
  );
  const y = useTransform(scrollY, (value) => -Math.min(Math.max(value, 0), distance));
  const scale = useTransform(smoothProgress, [0, 1], [1, geometry.scale]);

  const colorStart = Math.max(8, distance * 0.15);
  const colorEnd = Math.max(colorStart + 1, distance * 0.9);
  const color = useTransform(scrollY, [colorStart, colorEnd], [startColor, '#141518']);

  if (!ready) return null;

  return (
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
};
