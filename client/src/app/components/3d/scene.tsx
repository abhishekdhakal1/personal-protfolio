import { Canvas } from "@react-three/fiber";
import { CameraRig, MouseLight } from "./camera-rig";
import { ShaderBackdrop } from "./shader-backdrop";
import { ParticleField } from "./particle-field";
import { FloatingObjects } from "./floating-objects";

// The persistent WebGL world — mounted exactly once for the app's lifetime so
// its animation loop, geometry and GL context are never torn down on route
// changes. Route changes instead update SceneState.stage (see scene-context),
// which every component here reads each frame to smoothly transition.
export function Scene() {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <ambientLight intensity={0.55} />
      <MouseLight />
      <ShaderBackdrop />
      <CameraRig />
      <ParticleField />
      <FloatingObjects />
    </Canvas>
  );
}
