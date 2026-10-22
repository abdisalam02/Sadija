import { useEffect, RefObject } from 'react';

/**
 * High-performance RAF lerp momentum scroll for desktop mouse wheels.
 * Leaves mobile touch devices with native 120Hz ProMotion touch scrolling.
 *
 * Scrolls the provided app-shell element (never the document) so mobile
 * browsers keep their address bar expanded and fixed/full-height artwork
 * cannot be shifted by the browser chrome collapsing.
 */
export function useSmoothScroll(scrollerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scroller = scrollerRef.current;

    // Only apply on desktop pointer devices with fine mouse/wheel input
    if (
      !scroller ||
      typeof window === 'undefined' ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }

    let targetY = scroller.scrollTop;
    let currentY = scroller.scrollTop;
    let isRunning = false;
    let rafId: number | null = null;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const update = () => {
      currentY = lerp(currentY, targetY, 0.085);
      scroller.scrollTop = Math.round(currentY * 10) / 10;

      if (Math.abs(targetY - currentY) > 0.5) {
        rafId = requestAnimationFrame(update);
      } else {
        scroller.scrollTop = targetY;
        isRunning = false;
        rafId = null;
      }
    };

    const onWheel = (e: WheelEvent) => {
      // Don't intercept browser pinch-zoom or modifier keys
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;

      e.preventDefault();
      const maxScroll = scroller.scrollHeight - scroller.clientHeight;
      targetY = Math.min(Math.max(0, targetY + e.deltaY * 0.9), maxScroll);

      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(update);
      }
    };

    const onNativeScroll = () => {
      if (!isRunning) {
        targetY = scroller.scrollTop;
        currentY = scroller.scrollTop;
      }
    };

    scroller.addEventListener('wheel', onWheel, { passive: false });
    scroller.addEventListener('scroll', onNativeScroll, { passive: true });

    return () => {
      scroller.removeEventListener('wheel', onWheel);
      scroller.removeEventListener('scroll', onNativeScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [scrollerRef]);
}
