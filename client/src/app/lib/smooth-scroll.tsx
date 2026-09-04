import { useEffect } from "react";
import Lenis from "lenis";

// Single shared instance so other hooks (e.g. scroll-page-nav) can read/drive it.
let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

// Inertia-based smooth scrolling for the whole site, synced to the rAF loop.
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisInstance = lenis;

    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
