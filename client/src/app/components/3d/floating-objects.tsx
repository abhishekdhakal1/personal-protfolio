import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneState } from "./scene-context";

interface FloatingDef {
  position: [number, number, number];
  geometry: "torusKnot" | "icosahedron" | "box" | "sphere";
  scale: number;
  rotationSpeed: number;
  bobSpeed: number;
  bobAmount: number;
  activeStages: number[]; // which chapters this object is visible in
}

const OBJECTS: FloatingDef[] = [
  { position: [2.4, 0.8, -1.5], geometry: "torusKnot", scale: 0.55, rotationSpeed: 0.15, bobSpeed: 0.6, bobAmount: 0.2, activeStages: [0, 3] },
  { position: [-2.6, -0.4, -2], geometry: "icosahedron", scale: 0.7, rotationSpeed: 0.22, bobSpeed: 0.5, bobAmount: 0.25, activeStages: [0, 2] },
  { position: [1.8, -1.2, -2.4], geometry: "box", scale: 0.4, rotationSpeed: 0.3, bobSpeed: 0.8, bobAmount: 0.15, activeStages: [0, 4] },
  { position: [-1.6, 1.3, -1.8], geometry: "sphere", scale: 0.9, rotationSpeed: 0.08, bobSpeed: 0.4, bobAmount: 0.18, activeStages: [0, 5] },
];

function FloatingMesh({ def }: { def: FloatingDef }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const sceneRef = useSceneState();

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;
    const t = state.clock.getElapsedTime();
    const { mouseX, mouseY, stage } = sceneRef.current;

    mesh.rotation.x += delta * def.rotationSpeed;
    mesh.rotation.y += delta * def.rotationSpeed * 1.3;

    const bobY = Math.sin(t * def.bobSpeed + def.position[0]) * def.bobAmount;
    mesh.position.x = THREE.MathUtils.damp(mesh.position.x, def.position[0] + mouseX * 0.25, 2, delta);
    mesh.position.y = THREE.MathUtils.damp(mesh.position.y, def.position[1] + bobY + mouseY * 0.15, 2, delta);

    const targetOpacity = def.activeStages.includes(stage) ? 0.55 : 0.06;
    material.opacity = THREE.MathUtils.damp(material.opacity, targetOpacity, 2, delta);
  });

  return (
    <mesh ref={meshRef} position={def.position} scale={def.scale}>
      {def.geometry === "torusKnot" && <torusKnotGeometry args={[0.6, 0.18, 100, 16]} />}
      {def.geometry === "icosahedron" && <icosahedronGeometry args={[0.7, 0]} />}
      {def.geometry === "box" && <boxGeometry args={[0.8, 0.8, 0.8]} />}
      {def.geometry === "sphere" && <sphereGeometry args={[0.6, 24, 24]} />}
      <meshStandardMaterial
        ref={materialRef}
        color="#00ADB5"
        wireframe
        transparent
        opacity={0.06}
        emissive="#00ADB5"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

// A handful of abstract wireframe forms drifting in the depth of the scene,
// each tied to the chapters where it should be visible.
export function FloatingObjects() {
  return (
    <>
      {OBJECTS.map((def, i) => (
        <FloatingMesh key={i} def={def} />
      ))}
    </>
  );
}
