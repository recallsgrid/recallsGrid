import { useEffect } from 'react';

/**
 * Lightweight Lenis-style inertial smooth scroll.
 * Lerps the window scroll toward a target driven by wheel input.
 * Falls back to native scrolling on touch devices.
 */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let current = window.scrollY;
    let target = window.scrollY;
    let rafId = 0;
    let running = false;

    const ease = 0.18;

    const clamp = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = Math.max(0, Math.min(target, max));
    };

    const loop = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.4) {
        current = target;
        running = false;
        window.scrollTo(0, current);
        return;
      }
      window.scrollTo(0, current);
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      // let modals / scrollable inner panels handle their own scroll
      const el = e.target as HTMLElement;
      if (el.closest('[data-lenis-prevent]')) return;
      e.preventDefault();
      current = window.scrollY;
      target = current + e.deltaY;
      clamp();
      start();
    };

    const onResize = () => {
      current = window.scrollY;
      target = window.scrollY;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);
}