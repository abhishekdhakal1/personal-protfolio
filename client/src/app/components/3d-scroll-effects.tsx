import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import * as THREE from "three";

interface ScrollEffectsProps {
  children: React.ReactNode;
}

export function ScrollEffects({ children }: ScrollEffectsProps) {
  const { scrollYProgress } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  // Use MotionValues for mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const midgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -25]);

  // 3D tilt effect
  const rotateX = useSpring(
    useTransform(mouseY, [0, window.innerHeight], [5, -5]),
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, window.innerWidth], [-5, 5]),
  );

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Circuit trace effect
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "1";
    canvas.style.opacity = "0.1";
    document.body.appendChild(canvas);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationId: number;
    const drawCircuitTraces = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw animated circuit paths
      const time = Date.now() * 0.001;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 2;

      // Circuit path 1
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.2, canvas.height * 0.3);
      ctx.bezierCurveTo(
        canvas.width * 0.3 + Math.sin(time) * 20,
        canvas.height * 0.2,
        canvas.width * 0.5,
        canvas.height * 0.4,
        canvas.width * 0.6,
        canvas.height * 0.5 + Math.cos(time) * 20,
      );
      ctx.stroke();

      // Circuit path 2
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.7, canvas.height * 0.6);
      ctx.bezierCurveTo(
        canvas.width * 0.8 + Math.cos(time * 1.5) * 15,
        canvas.height * 0.5,
        canvas.width * 0.6,
        canvas.height * 0.7,
        canvas.width * 0.5,
        canvas.height * 0.8 + Math.sin(time * 1.5) * 15,
      );
      ctx.stroke();

      // Draw signal nodes
      ctx.fillStyle = "#06b6d4";
      for (let i = 0; i < 5; i++) {
        const x = canvas.width * 0.2 + i * canvas.width * 0.15;
        const y = canvas.height * 0.5 + Math.sin(time + i) * 20;
        const size = 3 + Math.sin(time * 2 + i) * 2;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.6;
      }

      animationId = requestAnimationFrame(drawCircuitTraces);
    };

    drawCircuitTraces();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Background Layer */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
        style={{ y: backgroundY }}
      />

      {/* Circuit Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(6,182,212,0.03)_50%,transparent_70%)] bg-[length:4rem_4rem]" />
      </div>

      {/* Midground Layer */}
      <motion.div className="relative z-10" style={{ y: midgroundY }}>
        {children}
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="fixed top-20 right-20 w-64 h-64 pointer-events-none"
        animate={{
          rotateY: rotateY,
          rotateX: rotateX,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-md rounded-2xl border border-cyan-500/20 p-6">
          <div className="text-cyan-400 text-sm font-mono">
            <div className="mb-2">// System Status</div>
            <div>▶ CPU: 42%</div>
            <div>▶ RAM: 2.1GB</div>
            <div>▶ GPU: 18%</div>
            <div>▶ Network: Online</div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 z-50"
        style={{ scaleX: scrollYProgress }}
        initial={{ scaleX: 0 }}
      />

      {/* Depth Layers */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-transparent via-slate-900/10 to-slate-900/20"
          style={{
            y: useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.1, 0.3]),
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-transparent via-slate-900/5 to-slate-900/10"
          style={{
            y: useTransform(
              scrollYProgress,
              [0, 0.3, 0.6, 1],
              [0, 0.05, 0.15, 0.4],
            ),
          }}
        />
      </div>

      {/* Particle Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
            style={{
              boxShadow: "0 0 10px rgba(6, 182, 212, 0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
