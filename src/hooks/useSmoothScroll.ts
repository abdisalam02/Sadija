import { useEffect } from 'react';

/**
 * High-performance RAF lerp momentum scroll for desktop mouse wheels.
 * Leaves mobile touch devices with native 120Hz ProMotion touch scrolling.
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Only apply on desktop pointer devices with fine mouse/wheel input
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let isRunning = false;
    let rafId: number | null = null;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const update = () => {
      currentY = lerp(currentY, targetY, 0.085);
      window.scrollTo(0, Math.round(currentY * 10) / 10);

      if (Math.abs(targetY - currentY) > 0.5) {
        rafId = requestAnimationFrame(update);
      } else {
        window.scrollTo(0, targetY);
        isRunning = false;
        rafId = null;
      }
    };

    const onWheel = (e: WheelEvent) => {
      // Don't intercept browser pinch-zoom or modifier keys
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;

      e.preventDefault();
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetY = Math.min(Math.max(0, targetY + e.deltaY * 0.9), maxScroll);

      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(update);
      }
    };

    const onNativeScroll = () => {
      if (!isRunning) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onNativeScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}
