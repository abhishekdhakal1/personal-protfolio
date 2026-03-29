import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Float,
} from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Terminal, Sparkles, Zap } from "lucide-react";

// Circuit Board Component
function CircuitBoard({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const circuitPaths = useMemo(() => {
    const paths = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      paths.push({
        start: new THREE.Vector3(Math.cos(angle) * 2, Math.sin(angle) * 2, 0),
        end: new THREE.Vector3(Math.cos(angle) * 3, Math.sin(angle) * 3, 0),
      });
    }
    return paths;
  }, []);

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Circuit traces */}
      {circuitPaths.map((path, index) => (
        <group key={index}>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={
                  new Float32Array([
                    path.start.x,
                    path.start.y,
                    path.start.z,
                    path.end.x,
                    path.end.y,
                    path.end.z,
                  ])
                }
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#06b6d4"
              linewidth={2}
              transparent
              opacity={0.8}
            />
          </line>

          {/* Signal nodes */}
          <mesh position={path.end}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>

          {/* Animated signal */}
          <mesh position={path.end}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#3b82f6" />
          </mesh>
        </group>
      ))}

      {/* Central chip */}
      <Float speed={2} rotationIntensity={0.5}>
        <mesh>
          <boxGeometry args={[1, 0.2, 1]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Waveform Visualization
function Waveform({ position }: { position: [number, number, number] }) {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position
        .array as Float32Array;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < positions.length / 3; i++) {
        const x = (i / (positions.length / 3)) * 4 - 2;
        const y = Math.sin(x * 2 + time * 2) * 0.3;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = 0;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 50; i++) {
      pts.push(new THREE.Vector3((i / 50) * 4 - 2, 0, 0));
    }
    return pts;
  }, []);

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
          />
        </bufferGeometry>
        <pointsMaterial color="#06b6d4" size={0.1} transparent opacity={0.8} />
      </points>
    </group>
  );
}

// Floating Particles
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  const particles = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 200; i++) {
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
        ),
      );
    }
    return pts;
  }, []);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.flatMap((p) => [p.x, p.y, p.z]))}
        />
      </bufferGeometry>
      <pointsMaterial color="#06b6d4" size={0.02} transparent opacity={0.6} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />

      {/* 3D Objects */}
      <CircuitBoard position={[0, -2, 0]} />
      <Waveform position={[-3, 2, -2]} />
      <Waveform position={[3, 2, -2]} />

      {/* Particles */}
      <FloatingParticles />

      {/* Environment */}
      <Environment preset="city" />
    </>
  );
}

export function Hero3D() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Loading screen */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Terminal className="w-8 h-8 text-white" />
            </div>
            <p className="text-cyan-400 text-lg font-medium">
              Initializing 3D Environment...
            </p>
          </motion.div>
        </div>
      )}

      {/* 3D Canvas */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${isLoading ? "opacity-0" : "opacity-100"}`}
      >
        <Canvas camera={{ position: [0, 0, 10] }}>
          <Scene />
        </Canvas>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-center max-w-4xl mx-auto px-6 pointer-events-auto"
          >
            {/* Profile Card */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-cyan-500/30 p-1">
                  <div className="w-full h-full bg-slate-900/50 rounded-xl flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5">
                      <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-cyan-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-cyan-500/20 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>

            {/* Title and Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Abhishek Dhakal
              </h1>

              <motion.div
                className="flex items-center justify-center gap-2"
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                transition={{ delay: 3, duration: 1 }}
              >
                <Zap className="w-6 h-6 text-cyan-400" />
                <p className="text-xl md:text-2xl text-cyan-300">
                  Electronics, Communication & Information Engineering
                </p>
                <Zap className="w-6 h-6 text-cyan-400" />
              </motion.div>

              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Bridging hardware and software to create next-generation
                cyber-physical systems. Architecting the digital future with
                quantum-inspired algorithms and neuromorphic computing.
              </p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.5 }}
                className="flex flex-wrap gap-4 justify-center mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300"
                >
                  <Terminal className="w-4 h-4 mr-2" />
                  View Projects
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border border-cyan-500/50 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-500/10 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get In Touch
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 4, duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-cyan-400">
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-cyan-400 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
