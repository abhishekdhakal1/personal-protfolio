import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useSceneState } from "./scene-context";

// Per-chapter camera target (position); the rig continuously damps toward
// this + a mouse-parallax offset + a scroll-driven forward dolly.
const STAGE_CAMERA: [number, number, number][] = [
  [0, 0, 5],       // Home
  [1.3, 0.35, 4.3], // About
  [-1.4, 0.3, 4.6], // Skills
  [0, -0.5, 5.6],   // Projects
  [1.5, -0.2, 5.0], // Experience
  [0, 0.15, 4.2],   // Contact — calmer, closer
];

// Lives inside <Canvas>; has no visual output of its own. Continuously moves
// the real Three.js camera every frame — this is the "real animation loop".
export function CameraRig() {
  const sceneRef = useSceneState();

  useFrame((state, delta) => {
    const { mouseX, mouseY, stage, scrollProgress } = sceneRef.current;
    const base = STAGE_CAMERA[stage] ?? STAGE_CAMERA[0];

    const targetX = base[0] + mouseX * 0.6;
    const targetY = base[1] + mouseY * 0.35 - scrollProgress * 0.3;
    const targetZ = base[2] - scrollProgress * 0.8;

    const smoothing = 2.4;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, smoothing, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, smoothing, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, smoothing, delta);
    state.camera.lookAt(mouseX * 0.3, mouseY * 0.2, 0);
  });

  return null;
}

// A point light that drifts toward the pointer, giving the scene a light
// source that visibly reacts to mouse movement.
export function MouseLight() {
  const sceneRef = useSceneState();
  useFrame((state, delta) => {
    const light = state.scene.getObjectByName("mouse-point-light") as THREE.PointLight | undefined;
    if (!light) return;
    const { mouseX, mouseY } = sceneRef.current;
    light.position.x = THREE.MathUtils.damp(light.position.x, mouseX * 3, 2, delta);
    light.position.y = THREE.MathUtils.damp(light.position.y, mouseY * 2, 2, delta);
  });
  return <pointLight name="mouse-point-light" position={[0, 0, 2.5]} intensity={12} color="#00ADB5" distance={8} />;
}
