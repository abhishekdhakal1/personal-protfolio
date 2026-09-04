import { motion, useReducedMotion } from "framer-motion";

interface Ball {
  size: number;
  top: string;
  left: string;
  opacity: number;
  duration: number;
  delay: number;
  xRange: number;
  yRange: number;
}

const BALLS: Ball[] = [
  { size: 260, top: "6%",  left: "6%",  opacity: 0.35, duration: 22, delay: 0, xRange: 130, yRange: 90 },
  { size: 160, top: "56%", left: "80%", opacity: 0.3,  duration: 18, delay: 2, xRange: -110, yRange: 80 },
  { size: 110, top: "26%", left: "54%", opacity: 0.22, duration: 26, delay: 4, xRange: 90, yRange: -110 },
  { size: 200, top: "76%", left: "16%", opacity: 0.22, duration: 30, delay: 1, xRange: -100, yRange: -70 },
  { size: 70,  top: "10%", left: "86%", opacity: 0.3,  duration: 16, delay: 3, xRange: -70, yRange: 100 },
];

// Ambient decorative background: glossy "rolling" spheres drifting behind every page.
export function AnimatedBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-background" />
      {BALLS.map((ball, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-sm"
          style={{
            width: ball.size,
            height: ball.size,
            top: ball.top,
            left: ball.left,
            opacity: ball.opacity,
            background:
              "radial-gradient(circle at 32% 28%, color-mix(in srgb, var(--primary) 60%, white) 0%, var(--primary) 45%, transparent 75%)",
          }}
          animate={
            reduceMotion
              ? undefined
              : { x: [0, ball.xRange, 0], y: [0, ball.yRange, 0], rotate: [0, 360] }
          }
          transition={{ duration: ball.duration, delay: ball.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

