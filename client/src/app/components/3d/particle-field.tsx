import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneState } from "./scene-context";

// Per-chapter particle spread — the field visibly "breathes" between pages,
// converging calmly on Contact per the requested storytelling arc.
const STAGE_SPREAD = [1, 1.1, 1.25, 1.35, 1.15, 0.7];

interface Particle {
  x: number;
  y: number;
  z: number;
  phase: number;
  speed: number;
}

// A real Three.js BufferGeometry particle system: every particle drifts on an
// organic sine path, is pushed away from the mouse, and the whole field's
// spread/rotation reacts to the current page and scroll position.
function ParticlePoints({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const sceneRef = useSceneState();
  const spreadRef = useRef(1);

  const particles = useMemo<Particle[]>(() => {
    const arr: Particle[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 8 - 2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
      });
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    const t = state.clock.getElapsedTime();
    const { mouseX, mouseY, stage } = sceneRef.current;
    const mouseWorldX = mouseX * 4;
    const mouseWorldY = mouseY * 2.6;

    spreadRef.current = THREE.MathUtils.damp(spreadRef.current, STAGE_SPREAD[stage] ?? 1, 1.5, delta);
    const spread = spreadRef.current;

    const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      let x = p.x * spread + Math.sin(t * p.speed + p.phase) * 0.2;
      let y = p.y * spread + Math.cos(t * p.speed * 0.8 + p.phase) * 0.2;
      const z = p.z * spread;

      // Subtle repulsion — particles near the cursor push outward.
      const dx = x - mouseWorldX;
      const dy = y - mouseWorldY;
      const distSq = dx * dx + dy * dy;
      if (distSq < 2.5) {
        const dist = Math.sqrt(distSq) || 0.001;
        const push = (2.5 - distSq) * 0.12;
        x += (dx / dist) * push;
        y += (dy / dist) * push;
      }

      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;

    points.rotation.y = t * 0.015 + mouseX * 0.12;
    points.rotation.x = -mouseY * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.026}
        color="#00ADB5"
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </points>
  );
}

export function ParticleField() {
  const [count, setCount] = useState(() => (window.innerWidth < 768 ? 260 : 850));

  useEffect(() => {
    const update = () => setCount(window.innerWidth < 768 ? 260 : 850);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return <ParticlePoints count={count} />;
}
