import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLenis } from "./smooth-scroll";

// The main page sequence — scrolling past the end of one jumps into the next,
// mirroring a continuous single-page scroll experience across real routes.
const ROUTE_ORDER = ["/home", "/about", "/skills", "/projects", "/experience", "/contact"];

const WHEEL_THRESHOLD = 12;
const TOUCH_THRESHOLD = 60;
const EDGE_TOLERANCE = 4;
const UNLOCK_DELAY = 650;

// Continuous "scroll past the end" navigation between the main pages.
export function useScrollPageNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const lockedRef = useRef(true);
  const touchStartYRef = useRef(0);

  useEffect(() => {
    const index = ROUTE_ORDER.indexOf(pathname);
    if (index === -1) return;

    // Land at the top of the new page and give it a beat before it can trigger another jump.
    lockedRef.current = true;
    getLenis()?.scrollTo(0, { immediate: true });
    const unlockTimer = setTimeout(() => {
      lockedRef.current = false;
    }, UNLOCK_DELAY);

    function atBoundary() {
      const doc = document.documentElement;
      const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - EDGE_TOLERANCE;
      const atTop = window.scrollY <= EDGE_TOLERANCE;
      return { atBottom, atTop };
    }

    function goTo(delta: 1 | -1) {
      const next = index + delta;
      if (next < 0 || next >= ROUTE_ORDER.length) return;
      lockedRef.current = true;
      navigate(ROUTE_ORDER[next]);
    }

    function handleWheel(e: WheelEvent) {
      if (lockedRef.current) return;
      const { atBottom, atTop } = atBoundary();
      if (e.deltaY > WHEEL_THRESHOLD && atBottom) goTo(1);
      else if (e.deltaY < -WHEEL_THRESHOLD && atTop) goTo(-1);
    }

    function handleTouchStart(e: TouchEvent) {
      touchStartYRef.current = e.touches[0]?.clientY ?? 0;
    }

    function handleTouchMove(e: TouchEvent) {
      if (lockedRef.current) return;
      const currentY = e.touches[0]?.clientY ?? 0;
      const delta = touchStartYRef.current - currentY;
      const { atBottom, atTop } = atBoundary();
      if (delta > TOUCH_THRESHOLD && atBottom) goTo(1);
      else if (delta < -TOUCH_THRESHOLD && atTop) goTo(-1);
    }

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      clearTimeout(unlockTimer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [pathname, navigate]);
}
