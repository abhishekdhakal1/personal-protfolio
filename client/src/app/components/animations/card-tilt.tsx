import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CardTiltProps {
  children: React.ReactNode;
  className?: string;
  max?: number;
}

// Wraps any card in a cursor-tracked 3D tilt with spring-based settle,
// matching the tilt treatment already used on the hero photo.
export function CardTilt({ children, className, max = 8 }: CardTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 160, damping: 16 });
  const springY = useSpring(rotateY, { stiffness: 160, damping: 16 });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relX * max);
    rotateX.set(-relY * max);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
