"use client";

import React, { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { SolarPlanet } from "@/data/solarSystem";

interface DetailedPlanetSceneProps {
  planet: SolarPlanet;
}

// Deep Space Panorama for Close-up
function DetailedMilkyWaySky() {
  const texture = useTexture("/textures/milkyway.jpg");

  return (
    <mesh>
      <sphereGeometry args={[250, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} toneMapped={false} />
    </mesh>
  );
}

// Helper: remap RingGeometry UVs so the texture maps radially (inner→outer)
function makeRingGeometry(innerRadius: number, outerRadius: number): THREE.RingGeometry {
  const g = new THREE.RingGeometry(innerRadius, outerRadius, 128);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const r = Math.sqrt(x * x + y * y);
    uv.setXY(i, (r - innerRadius) / (outerRadius - innerRadius), 0.5);
  }
  uv.needsUpdate = true;
  return g;
}

// Proportional, thin, elegant Saturn Rings with correct radial UV mapping
function DetailedSaturnRings({
  innerRadius = 2.55,
  outerRadius = 4.6,
}: {
  innerRadius?: number;
  outerRadius?: number;
}) {
  const ringTexture = useTexture("/textures/saturn_ring.png");
  const ref = useRef<THREE.Mesh>(null!);

  const geom = useMemo(
    () => makeRingGeometry(innerRadius, outerRadius),
    [innerRadius, outerRadius]
  );

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={geom} attach="geometry" />
      <meshStandardMaterial
        map={ringTexture}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
        roughness={0.7}
      />
    </mesh>
  );
}

// Earth Multilayer: Day Map + Night City Lights + Moving Cloud Deck + Atmospheric Shell
function DetailedEarthGlobe({ planet }: { planet: SolarPlanet }) {
  const dayMap = useTexture("/textures/earth.jpg");
  const nightMap = useTexture("/textures/earth_night.jpg");
  const cloudsMap = useTexture("/textures/earth_clouds.jpg");

  const sphereRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * planet.rotationSpeed * 3;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * (planet.rotationSpeed * 3 + 0.015);
    }
  });

  return (
    <group rotation={[0, 0, (planet.axialTiltDeg * Math.PI) / 180]}>
      {/* 1. Earth Surface Globe: Day diffuse + Night illumination */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial
          map={dayMap}
          emissiveMap={nightMap}
          emissive={new THREE.Color("#ffe8a3")}
          emissiveIntensity={0.65}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* 2. Realistic Earth Cloud Layer */}
      <mesh ref={cloudsRef} scale={1.018}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.7}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Soft Atmospheric Rim Glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Uranus: Distinctive Ice Giant with high axial tilt & subtle methane stratification
function DetailedUranusGlobe({ planet }: { planet: SolarPlanet }) {
  const surfaceTexture = useTexture(planet.texturePath);
  const sphereRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * planet.rotationSpeed * 3;
    }
  });

  return (
    <group rotation={[0, 0, (planet.axialTiltDeg * Math.PI) / 180]}>
      {/* Uranus Surface — no color multiply so true texture shows through */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial
          map={surfaceTexture}
          roughness={0.75}
          metalness={0.05}
          emissive="#042f2e"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Atmospheric Haze (distinct pale cyan) */}
      <mesh scale={1.06}>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshBasicMaterial
          color="#2dd4bf"
          transparent
          opacity={0.20}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Thin Uranus Ring System — equatorial plane relative to tilted group */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.7, 64]} />
        <meshBasicMaterial
          color="#99f6e4"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Standard Single-Layer Textured Globe
function StandardTexturedGlobe({ planet }: { planet: SolarPlanet }) {
  const surfaceTexture = useTexture(planet.texturePath);

  const sphereRef = useRef<THREE.Mesh>(null!);
  const atmosphereRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * planet.rotationSpeed * 3;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= delta * 0.01;
    }
  });

  return (
    <group rotation={[0, 0, (planet.axialTiltDeg * Math.PI) / 180]}>
      {/* Textured Sphere Surface */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial
          map={surfaceTexture}
          emissive={planet.emissive}
          emissiveIntensity={0.2}
          roughness={planet.roughness}
          metalness={planet.metalness}
        />
      </mesh>

      {/* Atmospheric Rayleigh Scattering Glow */}
      <mesh ref={atmosphereRef} scale={1.06}>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshBasicMaterial
          color={planet.glowColor}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Saturn's Rings */}
      {planet.hasRings && planet.id === "saturn" && (
        <DetailedSaturnRings
          innerRadius={planet.ringInner ?? 2.55}
          outerRadius={planet.ringOuter ?? 4.6}
        />
      )}
    </group>
  );
}

function CloseUpCelestialGlobe({ planet }: { planet: SolarPlanet }) {
  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.3}>
      {planet.id === "earth" ? (
        <DetailedEarthGlobe planet={planet} />
      ) : planet.id === "uranus" ? (
        <DetailedUranusGlobe planet={planet} />
      ) : (
        <StandardTexturedGlobe planet={planet} />
      )}
    </Float>
  );
}

export default function DetailedPlanetCanvas({ planet }: DetailedPlanetSceneProps) {
  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0.4, 6.8], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        className="cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[7, 4, 6]} intensity={3.0} color="#ffffff" />
        <pointLight position={[-6, -3, -4]} intensity={0.6} color={planet.glowColor} />

        {/* Deep Space Milky Way Environment */}
        <Suspense fallback={null}>
          <DetailedMilkyWaySky />
        </Suspense>

        {/* Textured Planet Globe */}
        <Suspense fallback={<mesh><sphereGeometry args={[2, 32, 32]} /><meshStandardMaterial color={planet.color} /></mesh>}>
          <CloseUpCelestialGlobe planet={planet} />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          rotateSpeed={0.7}
          minDistance={3.8}
          maxDistance={12}
        />
      </Canvas>
    </div>
  );
}
