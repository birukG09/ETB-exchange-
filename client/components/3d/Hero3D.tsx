import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  MeshDistortMaterial,
  Float,
  Center,
  Stars,
  PerspectiveCamera,
  Environment,
  Sparkles,
  Box,
  Cylinder,
  Torus,
} from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

// Floating Bitcoin Symbol
function FloatingBitcoin({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 8]} />
        <meshStandardMaterial
          color="#F7B84B"
          metalness={0.8}
          roughness={0.2}
          emissive="#F7B84B"
          emissiveIntensity={0.1}
        />
        <Center>
          <mesh position={[0, 0, 0.11]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color="#FFF"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </Center>
      </mesh>
    </Float>
  );
}

// Ethiopian Birr (ETB) Currency Symbol
function FloatingETB({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = -state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.5 + 1) * 0.4;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 3) * 0.1,
      );
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.8}>
      <group position={position}>
        {/* Glow effect */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial color="#00A651" transparent opacity={0.1} />
        </mesh>

        {/* Main ETB coin */}
        <mesh ref={meshRef}>
          <cylinderGeometry args={[1, 1, 0.25, 12]} />
          <meshStandardMaterial
            color="#00A651"
            metalness={0.9}
            roughness={0.1}
            emissive="#00A651"
            emissiveIntensity={0.15}
          />
          <Center>
            <group position={[0, 0, 0.13]}>
              {/* E */}
              <mesh position={[-0.4, 0, 0]}>
                <boxGeometry args={[0.15, 0.6, 0.08]} />
                <meshStandardMaterial
                  color="#FCDC00"
                  metalness={1}
                  roughness={0.05}
                  emissive="#FCDC00"
                  emissiveIntensity={0.2}
                />
              </mesh>
              {/* T */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.15, 0.6, 0.08]} />
                <meshStandardMaterial
                  color="#FCDC00"
                  metalness={1}
                  roughness={0.05}
                  emissive="#FCDC00"
                  emissiveIntensity={0.2}
                />
              </mesh>
              {/* B */}
              <mesh position={[0.4, 0, 0]}>
                <boxGeometry args={[0.15, 0.6, 0.08]} />
                <meshStandardMaterial
                  color="#FCDC00"
                  metalness={1}
                  roughness={0.05}
                  emissive="#FCDC00"
                  emissiveIntensity={0.2}
                />
              </mesh>
            </group>
          </Center>
        </mesh>

        {/* Ethiopian flag colors ring */}
        <Torus args={[1.2, 0.05, 8, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#FCDC00"
            metalness={0.8}
            roughness={0.2}
          />
        </Torus>
      </group>
    </Float>
  );
}

// US Dollar (USD) Currency Symbol
function FloatingUSD({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const billRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.6;
      meshRef.current.position.y =
        position[1] + Math.cos(state.clock.elapsedTime * 2.5) * 0.35;
    }
    if (billRef.current) {
      billRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      billRef.current.position.x =
        Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <group position={position}>
        {/* USD coin */}
        <mesh ref={meshRef}>
          <cylinderGeometry args={[0.9, 0.9, 0.2, 16]} />
          <meshStandardMaterial
            color="#1B5E20"
            metalness={0.7}
            roughness={0.3}
            emissive="#2E7D32"
            emissiveIntensity={0.1}
          />
          <Center>
            <group position={[0, 0, 0.11]}>
              {/* Dollar sign represented as geometric shapes */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.06, 8]} />
                <meshStandardMaterial
                  color="#FFF"
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              <mesh position={[0, 0.1, 0.03]}>
                <boxGeometry args={[0.05, 0.4, 0.06]} />
                <meshStandardMaterial
                  color="#FFF"
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            </group>
          </Center>
        </mesh>

        {/* Floating dollar bill */}
        <mesh ref={billRef} position={[2, 0.5, 0]}>
          <boxGeometry args={[1.8, 0.8, 0.02]} />
          <meshStandardMaterial
            color="#1B5E20"
            metalness={0.3}
            roughness={0.7}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Ethereum Symbol
function FloatingEthereum({
  position,
}: {
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = -state.clock.elapsedTime * 0.3;
      meshRef.current.position.y =
        position[1] + Math.cos(state.clock.elapsedTime * 1.5) * 0.4;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.7}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1, 1.4, 0.2]} />
        <meshStandardMaterial
          color="#627EEA"
          metalness={0.7}
          roughness={0.3}
          emissive="#627EEA"
          emissiveIntensity={0.15}
        />
        <Center>
          <group position={[0, 0, 0.11]}>
            {/* Ethereum Ξ symbol represented as geometric shapes */}
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.6, 0.08, 0.05]} />
              <meshStandardMaterial
                color="#FFF"
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.4, 0.08, 0.05]} />
              <meshStandardMaterial
                color="#FFF"
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[0.6, 0.08, 0.05]} />
              <meshStandardMaterial
                color="#FFF"
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          </group>
        </Center>
      </mesh>
    </Float>
  );
}

// Animated Currency Sphere
function CurrencySphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (materialRef.current) {
      materialRef.current.distort =
        0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2.5, 64, 64]} position={[0, 0, -8]}>
      <MeshDistortMaterial
        ref={materialRef}
        color="#5E8CBA"
        roughness={0.1}
        metalness={0.8}
        distort={0.4}
        speed={1.5}
        emissive="#5E8CBA"
        emissiveIntensity={0.1}
      />
    </Sphere>
  );
}

// Animated Exchange Rate Display
function ExchangeRateDisplay({
  position,
}: {
  position: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [currentRate, setCurrentRate] = useState(135.5);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }

    // Simulate rate fluctuation
    if (Math.floor(state.clock.elapsedTime * 2) % 3 === 0) {
      setCurrentRate(135.5 + Math.sin(state.clock.elapsedTime * 0.3) * 2);
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        {/* Display panel background */}
        <mesh>
          <boxGeometry args={[4, 1.5, 0.1]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Rate display as geometric elements */}
        <Center>
          <group position={[0, 0.2, 0.06]}>
            {/* USD symbol */}
            <mesh position={[-1.5, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} />
              <meshStandardMaterial
                color="#00A651"
                metalness={0.8}
                roughness={0.2}
                emissive="#00A651"
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* Equals bars */}
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.3, 0.02, 0.02]} />
              <meshStandardMaterial
                color="#00A651"
                metalness={0.8}
                roughness={0.2}
                emissive="#00A651"
                emissiveIntensity={0.3}
              />
            </mesh>
            <mesh position={[0, -0.05, 0]}>
              <boxGeometry args={[0.3, 0.02, 0.02]} />
              <meshStandardMaterial
                color="#00A651"
                metalness={0.8}
                roughness={0.2}
                emissive="#00A651"
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* ETB representation */}
            <mesh position={[1.5, 0, 0]}>
              <boxGeometry args={[0.4, 0.2, 0.02]} />
              <meshStandardMaterial
                color="#00A651"
                metalness={0.8}
                roughness={0.2}
                emissive="#00A651"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        </Center>

        {/* Trending arrow */}
        <mesh position={[1.5, -0.3, 0.06]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshStandardMaterial
            color="#4CAF50"
            metalness={0.7}
            roughness={0.3}
            emissive="#4CAF50"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Ethiopian Flag-themed Geometry
function EthiopianFlag({ position }: { position: [number, number, number] }) {
  const flagRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (flagRef.current) {
      flagRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      flagRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.2) * 0.2;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={flagRef} position={position}>
        {/* Green stripe */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2, 0.4, 0.05]} />
          <meshStandardMaterial
            color="#00A651"
            metalness={0.6}
            roughness={0.4}
            emissive="#00A651"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Yellow stripe */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 0.4, 0.05]} />
          <meshStandardMaterial
            color="#FCDC00"
            metalness={0.6}
            roughness={0.4}
            emissive="#FCDC00"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Red stripe */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[2, 0.4, 0.05]} />
          <meshStandardMaterial
            color="#EF2118"
            metalness={0.6}
            roughness={0.4}
            emissive="#EF2118"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Central star effect */}
        <Sparkles count={20} scale={2} size={3} speed={0.8} color="#FCDC00" />
      </group>
    </Float>
  );
}

// Financial Data Particles
function DataParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#997AB8"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Chart Bars Animation
function AnimatedChart({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh;
        mesh.scale.y =
          1 + Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 0.3;
      });
    }
  });

  const bars = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      height: Math.random() * 2 + 1,
      position: [i * 0.4 - 1.4, 0, 0] as [number, number, number],
      color: i % 2 === 0 ? "#6BB77B" : "#997AB8",
    }));
  }, []);

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        {bars.map((bar, index) => (
          <Box
            key={index}
            args={[0.3, bar.height, 0.3]}
            position={[bar.position[0], bar.height / 2, bar.position[2]]}
          >
            <meshStandardMaterial
              color={bar.color}
              metalness={0.6}
              roughness={0.4}
              emissive={bar.color}
              emissiveIntensity={0.1}
            />
          </Box>
        ))}
      </group>
    </Float>
  );
}

// Currency Conversion Flow Animation
function CurrencyFlow({ position }: { position: [number, number, number] }) {
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const particleCount = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current && materialRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const x = i * 3;
        const y = i * 3 + 1;
        const z = i * 3 + 2;

        // Create flowing effect from USD to ETB
        positions[x] += Math.sin(state.clock.elapsedTime + i * 0.1) * 0.02;
        positions[y] = Math.sin(state.clock.elapsedTime + i * 0.1) * 2;

        // Reset particles that go too far
        if (positions[x] > 4) {
          positions[x] = -4;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;

      // Animate material opacity
      materialRef.current.opacity =
        0.3 + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <points ref={particlesRef} position={position}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={0.05}
          color="#00A651"
          transparent
          opacity={0.6}
          sizeAttenuation={true}
        />
      </points>
    </Float>
  );
}

// Main 3D Scene
function Scene() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 12);
  }, [camera]);

  return (
    <>
      {/* Environment Lighting */}
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} />

      {/* Ethiopian flag color lighting */}
      <pointLight position={[-8, 4, 2]} intensity={0.6} color="#00A651" />
      <pointLight position={[8, -4, 2]} intensity={0.6} color="#FCDC00" />
      <pointLight position={[0, 0, 8]} intensity={0.4} color="#EF2118" />

      {/* Currency accent lighting */}
      <pointLight position={[-5, 2, 5]} intensity={0.5} color="#1B5E20" />
      <pointLight position={[5, -2, 5]} intensity={0.5} color="#2E7D32" />

      {/* Background Elements */}
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Main Elements */}
      <CurrencySphere />
      <DataParticles />

      {/* Currency Symbols - Ethiopian Birr & USD Focus */}
      <FloatingETB position={[-5, 2, 1]} />
      <FloatingETB position={[5, -2, 3]} />
      <FloatingUSD position={[-3, -2, 2]} />
      <FloatingUSD position={[4, 3, 0]} />

      {/* Crypto Symbols */}
      <FloatingBitcoin position={[-2, 4, 1]} />
      <FloatingEthereum position={[2, -4, 2]} />

      {/* Ethiopian Theme Elements */}
      <EthiopianFlag position={[-7, 1, -2]} />
      <ExchangeRateDisplay position={[0, 5, -3]} />
      <CurrencyFlow position={[0, 0, 4]} />

      {/* Chart Visualizations */}
      <AnimatedChart position={[-6, -3, 1]} />
      <AnimatedChart position={[6, 2, -2]} />

      {/* Additional Elements */}
      <Sparkles count={150} scale={25} size={3} speed={0.6} color="#00A651" />
      <Sparkles count={100} scale={15} size={2} speed={0.8} color="#FCDC00" />
      <Sparkles count={80} scale={18} size={1.5} speed={0.4} color="#EF2118" />

      {/* Floating Rings */}
      <Float speed={0.5} rotationIntensity={0.3}>
        <Torus
          args={[3, 0.1, 16, 100]}
          position={[0, 0, -5]}
          rotation={[Math.PI / 4, 0, 0]}
        >
          <meshStandardMaterial
            color="#5E8CBA"
            transparent
            opacity={0.3}
            metalness={1}
            roughness={0}
          />
        </Torus>
      </Float>

      <Float speed={0.3} rotationIntensity={0.2}>
        <Torus
          args={[4, 0.08, 16, 100]}
          position={[0, 0, -6]}
          rotation={[-Math.PI / 6, 0, 0]}
        >
          <meshStandardMaterial
            color="#997AB8"
            transparent
            opacity={0.2}
            metalness={1}
            roughness={0}
          />
        </Torus>
      </Float>
    </>
  );
}

// Hero 3D Component
export function Hero3D() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        className="absolute inset-0"
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={60} />
        <Scene />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center space-y-8 max-w-4xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              ETB Exchange
            </h1>
            <div className="text-2xl md:text-4xl font-semibold text-white/90">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                Ethiopian
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="text-[#00A651]"
              >
                Birr
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                Exchange
              </motion.span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed"
          >
            Experience premium ETB-USD currency exchange with real-time rates,
            crypto integration, and advanced portfolio tracking in stunning 4K
            quality with Ethiopian pride.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 2.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pointer-events-auto"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(94, 140, 186, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-2xl text-lg shadow-2xl hover:shadow-primary/30 transition-all duration-300"
            >
              Start Trading Now
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                borderColor: "rgba(153, 122, 184, 0.8)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              Explore Features
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 3.2 }}
                className="text-3xl font-bold text-[#00A651] mb-2"
              >
                135.50
              </motion.div>
              <div className="text-white/60 text-sm">USD to ETB Rate</div>
            </div>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 3.4 }}
                className="text-3xl font-bold text-[#FCDC00] mb-2"
              >
                156.50
              </motion.div>
              <div className="text-white/60 text-sm">EUR to ETB Rate</div>
            </div>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 3.6 }}
                className="text-3xl font-bold text-[#EF2118] mb-2"
              >
                108K+
              </motion.div>
              <div className="text-white/60 text-sm">BTC Price (USD)</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 pointer-events-none" />

      {/* Animated Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
    </div>
  );
}
