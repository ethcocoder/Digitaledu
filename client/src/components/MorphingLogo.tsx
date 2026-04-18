import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Morphing Logo Component
 * 
 * Creates an interactive 3D scene with:
 * - Morphing geometric shapes
 * - Rotating sphere with gradient
 * - Smooth animations
 * - Responsive to mouse movement
 */

function LogoScene() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.3;
    }

    if (sphereRef.current) {
      sphereRef.current.scale.x = 1 + Math.sin(clock.elapsedTime * 0.8) * 0.1;
      sphereRef.current.scale.y = 1 + Math.cos(clock.elapsedTime * 0.8) * 0.1;
    }

    if (torusRef.current) {
      torusRef.current.rotation.x += 0.003;
      torusRef.current.rotation.z += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          color="#0A1128"
          emissive="#00D9FF"
          emissiveIntensity={0.3}
          wireframe={false}
        />
      </mesh>

      {/* Rotating Torus */}
      <mesh ref={torusRef}>
        <torusGeometry args={[1.5, 0.3, 32, 200]} />
        <meshPhongMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Outer Ring */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2, 0.15, 32, 200]} />
        <meshPhongMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Lighting */}
      <pointLight position={[5, 5, 5]} intensity={1} color="#00D9FF" />
      <pointLight position={[-5, -5, 5]} intensity={0.8} color="#FFD700" />
      <ambientLight intensity={0.5} />
    </group>
  );
}

export default function MorphingLogo() {
  return (
    <div className="w-full h-96 md:h-[500px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 75 }}
        className="w-full h-full"
      >
        <LogoScene />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}
