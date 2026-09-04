import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLenis } from "../lib/smooth-scroll";

// Jump to the top of the page on every route change (page-based nav, not anchors).
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset via Lenis (not just native scrollTo) so its tracked scroll state stays in sync.
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
