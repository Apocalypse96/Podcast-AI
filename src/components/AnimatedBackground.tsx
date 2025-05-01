"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { motion } from "framer-motion";

const AnimatedSphere = ({
  position,
  color,
  speed,
  distort,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * speed * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.3;
  });

  return (
    <Sphere args={[1, 64, 64]} position={position} ref={meshRef}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={speed}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

const AnimatedBackground = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-[-20]" // Lower z-index to ensure it stays behind all content
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />

        {/* Adjusted positions to be more visible around the form */}
        <AnimatedSphere
          position={[-6, 3, -5]}
          color="#9333ea"
          speed={0.5}
          distort={0.4}
        />
        <AnimatedSphere
          position={[6, -3, -8]}
          color="#4f46e5"
          speed={0.3}
          distort={0.6}
        />
        <AnimatedSphere
          position={[0, -5, -12]}
          color="#8b5cf6"
          speed={0.2}
          distort={0.5}
        />
        {/* Additional spheres for better visual distribution */}
        <AnimatedSphere
          position={[8, 5, -15]}
          color="#6366f1"
          speed={0.25}
          distort={0.3}
        />
        <AnimatedSphere
          position={[-7, -4, -10]}
          color="#a855f7"
          speed={0.35}
          distort={0.45}
        />
      </Canvas>
    </motion.div>
  );
};

export default AnimatedBackground;
