import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handlePointerEnter = () => setIsPointer(true);
    const handlePointerLeave = () => setIsPointer(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    const handleElementMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, [role="button"], input, textarea, select')) {
        setIsPointer(true);
      }
    };

    const handleElementMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, [role="button"], input, textarea, select')) {
        setIsPointer(false);
      }
    };

    document.addEventListener('mouseover', handleElementMouseEnter);
    document.addEventListener('mouseout', handleElementMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleElementMouseEnter);
      document.removeEventListener('mouseout', handleElementMouseLeave);
    };
  }, [cursorX, cursorY]);

  // Hide on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed w-8 h-8 rounded-full border-2 border-cyan-400 pointer-events-none z-50 mix-blend-difference"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          opacity: isVisible ? 1 : 0,
          scale: isPointer ? 1.5 : 1,
        }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          translateX: useSpring(cursorX, { damping: 40, stiffness: 1000 }),
          translateY: useSpring(cursorY, { damping: 40, stiffness: 1000 }),
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Trail effect */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-4 h-4 rounded-full bg-cyan-400/20 pointer-events-none z-40"
          style={{
            translateX: useSpring(cursorX, { 
              damping: 25, 
              stiffness: 700 - i * 100,
              delay: i * 0.05
            }),
            translateY: useSpring(cursorY, { 
              damping: 25, 
              stiffness: 700 - i * 100,
              delay: i * 0.05
            }),
            opacity: isVisible ? 0.3 - i * 0.1 : 0,
            scale: 1 + i * 0.2,
          }}
        />
      ))}
    </>
  );
}
