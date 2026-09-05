import { motion, useScroll, useSpring } from "framer-motion";
import { useLocation } from "react-router-dom";
import { SCENE_ROUTE_ORDER } from "./3d/scene-context";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const { pathname } = useLocation();
  const stageIndex = SCENE_ROUTE_ORDER.indexOf(pathname);
  const stageLabel = stageIndex !== -1 ? `${String(stageIndex + 1).padStart(2, "0")}/${String(SCENE_ROUTE_ORDER.length).padStart(2, "0")}` : "";

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex flex-col pointer-events-none">
      <motion.div
        className="h-[2px] bg-primary origin-left"
        style={{ scaleX: smoothProgress }}
      />
      {stageLabel && (
        <span className="self-end mt-1 mr-3 font-mono text-[10px] tracking-widest text-muted-foreground/70 select-none">
          {stageLabel}
        </span>
      )}
    </div>
  );
}
