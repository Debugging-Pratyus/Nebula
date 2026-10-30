"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/data/planets";

// ---------------------------------------------------------------------------
// Module-level deterministic starfield data (no Math.random in render path)
// ---------------------------------------------------------------------------

const PLANET_CANVAS_STAR_COUNT = 2200;

const PLANET_STARFIELD_DATA = (() => {
  const count = PLANET_CANVAS_STAR_COUNT;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const colorPalette = [
    new THREE.Color("#ffffff"),
    new THREE.Color("#93c5fd"),
    new THREE.Color("#c084fc"),
    new THREE.Color("#fef08a"),
  ];

  for (let i = 0; i < count; i++) {
    const seed1 = (i * 9301 + 49297) % 233280;
    const seed2 = ((i + 1500) * 9301 + 49297) % 233280;
    const seed3 = ((i + 3000) * 9301 + 49297) % 233280;

    const rNorm1 = seed1 / 233280;
    const rNorm2 = seed2 / 233280;
    const rNorm3 = seed3 / 233280;

    const radius = 60 + rNorm1 * 120;
    const theta = 2 * Math.PI * rNorm2;
    const phi = Math.acos(2 * rNorm3 - 1);

    pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = radius * Math.cos(phi);

    const picked = colorPalette[i % colorPalette.length];
    col[i * 3] = picked.r;
    col[i * 3 + 1] = picked.g;
    col[i * 3 + 2] = picked.b;
  }

  return { pos, col };
})();

function Starfield() {
  const pointsRef = useRef<THREE.Points>(null!);
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[PLANET_STARFIELD_DATA.pos, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[PLANET_STARFIELD_DATA.col, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.1}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function PlanetaryRings({
  innerRadius = 2.4,
  outerRadius = 4.0,
  color = "#93c5fd",
}: {
  innerRadius?: number;
  outerRadius?: number;
  color?: string;
}) {
  const ringRef = useRef<THREE.Mesh>(null!);

  // Deterministic generation — no Math.random() in render path
  const [pos, ringColors] = useMemo(() => {
    const particleCount = 1800;
    const p = new Float32Array(particleCount * 3);
    const c = new Float32Array(particleCount * 3);
    const baseCol = new THREE.Color(color);

    for (let i = 0; i < particleCount; i++) {
      const seed1 = (i * 9301 + 49297) % 233280;
      const seed2 = ((i + 2500) * 9301 + 49297) % 233280;
      const seed3 = ((i + 5000) * 9301 + 49297) % 233280;

      const rNorm1 = seed1 / 233280;
      const rNorm2 = seed2 / 233280;
      const rNorm3 = seed3 / 233280;

      const rad = innerRadius + rNorm1 * (outerRadius - innerRadius);
      const angle = rNorm2 * Math.PI * 2;
      const yOffset = (rNorm3 - 0.5) * 0.08;

      p[i * 3] = Math.cos(angle) * rad;
      p[i * 3 + 1] = yOffset;
      p[i * 3 + 2] = Math.sin(angle) * rad;

      const shade = baseCol.clone().multiplyScalar(0.7 + rNorm1 * 0.6);
      c[i * 3] = shade.r;
      c[i * 3 + 1] = shade.g;
      c[i * 3 + 2] = shade.b;
    }
    return [p, c];
  }, [innerRadius, outerRadius, color]);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.04;
    }
  });

  return (
    <group rotation={[1.1, 0.35, -0.2]}>
      <points ref={ringRef as unknown as React.RefObject<THREE.Points>}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[ringColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.75}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function CelestialBody({
  planet,
  isHovered,
  onPointerOver,
  onPointerOut,
  onClick,
}: {
  planet: PlanetData;
  isHovered: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const atmosphereRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= delta * 0.04;
    }
  });

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={() => onPointerOut()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        {/* Main Planet Sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.8, 64, 64]} />
          <meshStandardMaterial
            color={planet.color}
            emissive={planet.emissive}
            emissiveIntensity={isHovered ? 0.7 : 0.35}
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>

        {/* Ethereal Glow Atmosphere */}
        <mesh ref={atmosphereRef} scale={1.08}>
          <sphereGeometry args={[1.8, 32, 32]} />
          <meshStandardMaterial
            color={planet.glowColor}
            transparent
            opacity={isHovered ? 0.28 : 0.14}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Rings if applicable */}
        {planet.ring && (
          <PlanetaryRings
            innerRadius={planet.ringInner ?? 2.3}
            outerRadius={planet.ringOuter ?? 3.8}
            color={planet.ringColor ?? planet.glowColor}
          />
        )}
      </Float>
    </group>
  );
}

function CameraRig({ isInteracting }: { isInteracting: boolean }) {
  const { camera } = useThree();
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!isInteracting) {
      // Gentle cinematic breathing motion
      const t = state.clock.getElapsedTime();
      const targetX = Math.sin(t * 0.2) * 0.6;
      const targetY = 0.5 + Math.cos(t * 0.25) * 0.4;
      const targetZ = 6.8 + Math.sin(t * 0.15) * 0.4;

      vec.set(targetX, targetY, targetZ);
      camera.position.lerp(vec, delta * 1.5);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

export default function PlanetCanvas({
  planet,
  onPlanetClick,
}: {
  planet: PlanetData;
  onPlanetClick?: () => void;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isInteracting, setIsInteracting] = React.useState(false);

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0.4, 7], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        className="cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[6, 4, 5]} intensity={2.4} color="#ffffff" />
        <pointLight
          position={[-6, -3, -4]}
          intensity={0.8}
          color={planet.glowColor}
        />

        <Starfield />

        <CelestialBody
          planet={planet}
          isHovered={isHovered}
          onPointerOver={() => setIsHovered(true)}
          onPointerOut={() => setIsHovered(false)}
          onClick={() => onPlanetClick?.()}
        />

        <CameraRig isInteracting={isInteracting} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
          onStart={() => setIsInteracting(true)}
          onEnd={() => setIsInteracting(false)}
        />
      </Canvas>
    </div>
  );
}
