import { useEffect, useRef } from "react";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";

const AtmosphereMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color("#00ADB5"), uBase: new THREE.Color("#222831") },
  /* vertex */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment — cheap analytic flow-noise, no texture lookups */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uBase;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv - 0.5;
      float flow = sin(uv.x * 3.2 + uTime * 0.15) * cos(uv.y * 2.6 - uTime * 0.11);
      float drift = sin((uv.x + uv.y) * 4.0 - uTime * 0.08) * 0.5 + 0.5;
      float glow = smoothstep(1.0, 0.0, length(uv) * 1.25);
      float mixAmt = clamp(0.16 + flow * 0.07 + drift * 0.05 + glow * 0.22, 0.0, 1.0);
      vec3 color = mix(uBase, uColor, mixAmt);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ AtmosphereMaterial });

type AtmosphereMaterialImpl = THREE.ShaderMaterial & { uTime: number; uBase: THREE.Color; uColor: THREE.Color };

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Custom shaderMaterial registered via extend(); typed loosely since its
      // uniforms (uTime/uColor/uBase) aren't part of the base ShaderMaterial props.
      atmosphereMaterial: Partial<AtmosphereMaterialImpl> & { ref?: React.Ref<AtmosphereMaterialImpl> };
    }
  }
}

// Reads a CSS custom property and keeps a THREE.Color ref in sync, including
// across the dark/light class toggle on <html>.
function useCssColorRef(varName: string, fallback: string) {
  const colorRef = useRef(new THREE.Color(fallback));
  useEffect(() => {
    function update() {
      const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      if (val) colorRef.current.set(val);
    }
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [varName]);
  return colorRef;
}

// Full-bleed animated shader plane sitting far behind everything else in the
// scene — a real continuously-evolving background, not a CSS gradient.
export function ShaderBackdrop() {
  const matRef = useRef<AtmosphereMaterialImpl>(null);
  const baseColorRef = useCssColorRef("--background", "#222831");

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uTime = state.clock.getElapsedTime();
    matRef.current.uBase.copy(baseColorRef.current);
  });

  return (
    <mesh position={[0, 0, -8]} renderOrder={-1}>
      <planeGeometry args={[60, 40]} />
      <atmosphereMaterial ref={matRef} uColor={new THREE.Color("#00ADB5")} depthWrite={false} />
    </mesh>
  );
}
