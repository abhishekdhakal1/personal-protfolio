import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Scene } from "./3d/scene";
import { SceneProvider } from "./3d/scene-context";
import { WebGLErrorBoundary } from "./webgl-error-boundary";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// The persistent cinematic backdrop: a real, continuously-animating Three.js
// world (shader atmosphere, mouse-reactive particles/camera/light, floating
// wireframe forms) that lives beneath every page. Falls back to a static
// gradient wash + grain when reduced-motion is requested or WebGL is
// unavailable, so the site never depends on it to be usable.
export function AnimatedBackground() {
  const reduceMotion = useReducedMotion();
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    if (reduceMotion || !hasWebGL()) return;
    const raf = requestAnimationFrame(() => setShowScene(true));
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-background" />

      {showScene ? (
        <SceneProvider>
          <WebGLErrorBoundary>
            <Scene />
          </WebGLErrorBoundary>
        </SceneProvider>
      ) : (
        <div
          className="absolute inset-0 opacity-70 dark:opacity-90"
          style={{
            background:
              "radial-gradient(60% 50% at 18% 12%, color-mix(in srgb, var(--primary) 14%, transparent) 0%, transparent 60%), radial-gradient(55% 45% at 85% 82%, color-mix(in srgb, var(--primary) 10%, transparent) 0%, transparent 65%)",
          }}
        />
      )}

      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay noise-layer" />
    </div>
  );
}

