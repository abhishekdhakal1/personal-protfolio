import { createContext, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// The main page sequence — mirrors ROUTE_ORDER in lib/scroll-page-nav.tsx.
// Each index is a "chapter" the persistent 3D scene transitions through.
export const SCENE_ROUTE_ORDER = ["/home", "/about", "/skills", "/projects", "/experience", "/contact"];

export interface SceneState {
  mouseX: number; // normalized -1..1
  mouseY: number; // normalized -1..1
  stage: number; // index into SCENE_ROUTE_ORDER
  scrollProgress: number; // 0..1 within the current page
}

const SceneRefContext = createContext<React.MutableRefObject<SceneState> | null>(null);

// Provides a single mutable ref (not React state) so 3D components can read
// mouse/scroll/stage every animation frame without triggering re-renders.
export function SceneProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<SceneState>({ mouseX: 0, mouseY: 0, stage: 0, scrollProgress: 0 });
  const { pathname } = useLocation();

  useEffect(() => {
    const idx = SCENE_ROUTE_ORDER.indexOf(pathname);
    if (idx !== -1) ref.current.stage = idx;
  }, [pathname]);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      ref.current.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    function handleScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      ref.current.scrollProgress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <SceneRefContext.Provider value={ref}>{children}</SceneRefContext.Provider>;
}

export function useSceneState() {
  const ctx = useContext(SceneRefContext);
  if (!ctx) throw new Error("useSceneState must be used within a SceneProvider");
  return ctx;
}
