"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { PLANETS, PlanetData } from "@/data/planets";

interface StorySceneProps {
  progress: number; // 0 to 1 scroll story timeline progress
  currentPlanetIndex: number;
}

// ---------------------------------------------------------------------------
// Module-level deterministic particle data (avoids Math.random in render)
// ---------------------------------------------------------------------------

const CINEMATIC_STARFIELD_COUNT = 2600;

const CINEMATIC_STARFIELD_DATA = (() => {
  const count = CINEMATIC_STARFIELD_COUNT;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const palette = [
    new THREE.Color("#ffffff"),
    new THREE.Color("#93c5fd"),
    new THREE.Color("#c084fc"),
    new THREE.Color("#67e8f9"),
  ];

  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random using LCG seeded by index
    const seed1 = (i * 9301 + 49297) % 233280;
    const seed2 = ((i + 1000) * 9301 + 49297) % 233280;
    const seed3 = ((i + 2000) * 9301 + 49297) % 233280;

    const rNorm1 = seed1 / 233280;
    const rNorm2 = seed2 / 233280;
    const rNorm3 = seed3 / 233280;

    const radius = 50 + rNorm1 * 150;
    const theta = 2 * Math.PI * rNorm2;
    const phi = Math.acos(2 * rNorm3 - 1);

    pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = radius * Math.cos(phi);

    const chosen = palette[i % palette.length];
    col[i * 3] = chosen.r;
    col[i * 3 + 1] = chosen.g;
    col[i * 3 + 2] = chosen.b;
  }

  return { pos, col };
})();

// Module-level ring particle data for StoryPlanetaryRings defaults
// (inner=2.4, outer=4.2 — components can vary, so we generate inside useMemo
//  but with deterministic PRNG, avoiding Math.random in render path)

function StarfieldBackground() {
  const pointsRef = useRef<THREE.Points>(null!);
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[CINEMATIC_STARFIELD_DATA.pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[CINEMATIC_STARFIELD_DATA.col, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.2}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function StoryPlanetaryRings({
  innerRadius = 2.4,
  outerRadius = 4.2,
  color = "#93c5fd",
}: {
  innerRadius?: number;
  outerRadius?: number;
  color?: string;
}) {
  const ringRef = useRef<THREE.Points>(null!);

  // Deterministic generation — no Math.random() in render
  const [pos, ringColors] = useMemo(() => {
    const particleCount = 2000;
    const p = new Float32Array(particleCount * 3);
    const c = new Float32Array(particleCount * 3);
    const baseCol = new THREE.Color(color);

    for (let i = 0; i < particleCount; i++) {
      const seed1 = (i * 9301 + 49297) % 233280;
      const seed2 = ((i + 3000) * 9301 + 49297) % 233280;
      const seed3 = ((i + 6000) * 9301 + 49297) % 233280;

      const rNorm1 = seed1 / 233280;
      const rNorm2 = seed2 / 233280;
      const rNorm3 = seed3 / 233280;

      const rad = innerRadius + rNorm1 * (outerRadius - innerRadius);
      const angle = rNorm2 * Math.PI * 2;
      const yOffset = (rNorm3 - 0.5) * 0.06;

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
      ringRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group rotation={[1.1, 0.4, -0.2]}>
      <points ref={ringRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[ringColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function StoryCelestialBody({
  planet,
  progress,
}: {
  planet: PlanetData;
  progress: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
    if (haloRef.current) {
      haloRef.current.rotation.y -= delta * 0.06;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.25} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.85, 64, 64]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.emissive}
          emissiveIntensity={0.45 + progress * 0.3}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      <mesh ref={haloRef} scale={1.1}>
        <sphereGeometry args={[1.85, 32, 32]} />
        <meshStandardMaterial
          color={planet.glowColor}
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {planet.ring && (
        <StoryPlanetaryRings
          innerRadius={planet.ringInner ?? 2.4}
          outerRadius={planet.ringOuter ?? 4.2}
          color={planet.ringColor ?? planet.glowColor}
        />
      )}
    </Float>
  );
}

function StoryCameraDirector({ progress }: { progress: number }) {
  const targetVec = useMemo(() => new THREE.Vector3(), []);
  const lookAtVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    // Stage 1 (0 -> 0.25 Arrival): Front-facing majestic vista
    // Stage 2 (0.25 -> 0.5 Discovery): Sweeping orbital fly-by
    // Stage 3 (0.5 -> 0.75 Systems): Close inspection angle
    // Stage 4 (0.75 -> 1.0 Deep Space): Expansive high-angle cosmic horizon
    let tx = 0;
    let ty = 0.5;
    let tz = 7.5;
    let lx = 0;
    let ly = 0;
    const lz = 0;

    if (progress < 0.25) {
      const p = progress / 0.25;
      tx = THREE.MathUtils.lerp(0, 2.2, p);
      ty = THREE.MathUtils.lerp(0.4, 1.2, p);
      tz = THREE.MathUtils.lerp(8.0, 6.2, p);
    } else if (progress < 0.5) {
      const p = (progress - 0.25) / 0.25;
      tx = THREE.MathUtils.lerp(2.2, -2.8, p);
      ty = THREE.MathUtils.lerp(1.2, -0.6, p);
      tz = THREE.MathUtils.lerp(6.2, 5.2, p);
      lx = THREE.MathUtils.lerp(0, 0.4, p);
    } else if (progress < 0.75) {
      const p = (progress - 0.5) / 0.25;
      tx = THREE.MathUtils.lerp(-2.8, 1.8, p);
      ty = THREE.MathUtils.lerp(-0.6, 0.8, p);
      tz = THREE.MathUtils.lerp(5.2, 4.6, p);
      lx = THREE.MathUtils.lerp(0.4, 0, p);
    } else {
      const p = (progress - 0.75) / 0.25;
      tx = THREE.MathUtils.lerp(1.8, 0, p);
      ty = THREE.MathUtils.lerp(0.8, 2.4, p);
      tz = THREE.MathUtils.lerp(4.6, 8.8, p);
      ly = THREE.MathUtils.lerp(0, -0.5, p);
    }

    targetVec.set(tx, ty, tz);
    lookAtVec.set(lx, ly, lz);

    state.camera.position.lerp(targetVec, delta * 3.2);
    state.camera.lookAt(lookAtVec);
  });

  return null;
}

export default function CinematicStoryCanvas({
  progress,
  currentPlanetIndex,
}: StorySceneProps) {
  const planet = PLANETS[currentPlanetIndex % PLANETS.length];

  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0.5, 7.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[7, 5, 6]} intensity={2.6} color="#ffffff" />
        <pointLight
          position={[-6, -4, -4]}
          intensity={1.2}
          color={planet.glowColor}
        />

        <StarfieldBackground />

        <StoryCelestialBody planet={planet} progress={progress} />

        <StoryCameraDirector progress={progress} />
      </Canvas>
    </div>
  );
}
