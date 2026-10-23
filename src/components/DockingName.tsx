import React, { useCallback, useEffect, useState } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface DockGeometry {
  name: string;
  startLeft: number;
  startTop: number;
  startWidth: number;
  startHeight: number;
  targetLeft: number;
  targetTop: number;
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
}

/**
 * A fixed clone of the hero wordmark that travels into the nav as the page
 * scrolls. The original h1 stays in the flow for accessibility/layout; this
 * clone is the visible name from the hero all the way into the nav.
 */
export const DockingName: React.FC<DockingNameProps> = ({ scrollY, name, onReady }) => {
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

    setGeometry({
      name,
      startLeft: textRect.left,
      startTop: textRect.top + scrollTop,
      startWidth: textRect.width,
      startHeight: textRect.height,
      targetLeft: brandRect.left,
      // navY starts at -20px; by the time the name docks the header is at y=0.
      targetTop: brandRect.top + 20 + (brandRect.height - textRect.height * scale) / 2,
      scale,
      fontSize: heroFontSize,
      fontWeight: Number(computed.fontWeight) || 800,
      letterSpacing: computed.letterSpacing === 'normal' ? '0em' : computed.letterSpacing,
      lineHeight: computed.lineHeight,
      fontFamily: computed.fontFamily,
    });
    setMeasured(true);
    onReady?.();
  }, [name, onReady]);

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

  return <DockClone geometry={geometry} scrollY={scrollY} ready={measured} />;
};

const DockClone: React.FC<{
  geometry: DockGeometry;
  scrollY: MotionValue<number>;
  ready: boolean;
}> = ({ geometry, scrollY, ready }) => {
  // Ease the travel out so the name clears the hero cards early, then settles.
  const dock = useTransform(scrollY, (value) => {
    const t = Math.max(0, Math.min(1, value / 300));
    return 1 - Math.pow(1 - t, 3);
  });

  const x = useTransform(dock, [0, 1], [0, geometry.targetLeft - geometry.startLeft]);
  const y = useTransform(dock, [0, 1], [0, geometry.targetTop - geometry.startTop]);
  const scale = useTransform(dock, [0, 1], [1, geometry.scale]);
  const color = useTransform(scrollY, [0, 240], ['#3d3d3d', '#141518']);

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
      }}
      className="font-syne uppercase"
    >
      {geometry.name}
    </motion.span>
  );
};
