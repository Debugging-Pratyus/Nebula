"use client";

import React, { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { SOLAR_PLANETS, SolarPlanet, SUN_DATA } from "@/data/solarSystem";

export type EnvironmentMode = "milkyway" | "deepspace" | "orion";

interface SolarSystemSceneProps {
  selectedPlanetId: string | null;
  onSelectPlanet: (planetId: string) => void;
  speedMultiplier?: number;
  showOrbits?: boolean;
  showLabels?: boolean;
  environmentMode?: EnvironmentMode;
  resetViewTrigger?: number;
}

// Deep space background with environment palette options
function DynamicSpaceBackground({ mode }: { mode: EnvironmentMode }) {
  const texture = useTexture("/textures/milkyway.jpg");

  const [tintColor, rotationSpeed] = useMemo(() => {
    switch (mode) {
      case "orion":
        return [new THREE.Color("#d8b4fe"), 0.0008];
      case "deepspace":
        return [new THREE.Color("#38bdf8"), 0.0004];
      default:
        return [new THREE.Color("#ffffff"), 0.0006];
    }
  }, [mode]);

  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[450, 48, 48]} />
      <meshBasicMaterial
        map={texture}
        color={tintColor}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  );
}

// Deterministic layered star particles to satisfy pure render requirements
const DUST_PARTICLES_DATA = (() => {
  const count = 1200;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const palette = [
    new THREE.Color("#93c5fd"),
    new THREE.Color("#fef08a"),
    new THREE.Color("#fed7aa"),
    new THREE.Color("#e0e7ff"),
  ];

  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random distribution
    const seed = (i * 9301 + 49297) % 233280;
    const rNorm = seed / 233280;
    const radius = 90 + rNorm * 220;
    const theta = (i / count) * Math.PI * 2 * 7;
    const phi = Math.acos(2 * ((i * 17) % count) / count - 1);

    pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = radius * Math.cos(phi);

    const picked = palette[i % palette.length];
    col[i * 3] = picked.r;
    col[i * 3 + 1] = picked.g;
    col[i * 3 + 2] = picked.b;
  }
  return { pos, col };
})();

function LayeredSpaceDust() {
  const pointsRef = useRef<THREE.Points>(null!);
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[DUST_PARTICLES_DATA.pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[DUST_PARTICLES_DATA.col, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.6}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Textured Sun with Photosphere & Controlled Glow
function SolarCore({ onSelect }: { onSelect: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const coronaRef = useRef<THREE.Mesh>(null!);
  const sunTexture = useTexture(SUN_DATA.texturePath);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= delta * 0.015;
    }
  });

  return (
    <group onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* Central Luminous Sun Globe with Surface Texture */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[4.2, 64, 64]} />
        <meshBasicMaterial map={sunTexture} toneMapped={false} />
      </mesh>

      {/* Atmospheric / Corona Glow */}
      <mesh ref={coronaRef} scale={1.2}>
        <sphereGeometry args={[4.2, 32, 32]} />
        <meshBasicMaterial
          color="#ff7700"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Point light naturally radiating outwards across the solar system */}
      <pointLight position={[0, 0, 0]} intensity={5.2} distance={220} decay={1.1} color="#fffaf0" />
    </group>
  );
}

// Subtle, elegant planetary orbit paths
function OrbitRingPath({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.06, radius + 0.06, 128]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.12} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Helper: remap RingGeometry UVs so the texture maps radially
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

// Proportionate, elegant Saturn Ring Disc with correct radial UV mapping
function SaturnRingMesh({ innerRadius, outerRadius }: { innerRadius: number; outerRadius: number }) {
  const ringTexture = useTexture("/textures/saturn_ring.png");

  const geom = useMemo(
    () => makeRingGeometry(innerRadius, outerRadius),
    [innerRadius, outerRadius]
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={geom} attach="geometry" />
      <meshStandardMaterial
        map={ringTexture}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
        roughness={0.8}
      />
    </mesh>
  );
}

// Textured Planet Body
function TexturedPlanetBody({
  planet,
  isSelected,
  hovered,
}: {
  planet: SolarPlanet;
  isSelected: boolean;
  hovered: boolean;
}) {
  const texture = useTexture(planet.texturePath);

  return (
    <>
      <sphereGeometry args={[planet.sizeRadius, 48, 48]} />
      <meshStandardMaterial
        map={texture}
        emissive={planet.emissive}
        emissiveIntensity={isSelected ? 0.45 : hovered ? 0.3 : 0.08}
        roughness={planet.roughness}
        metalness={planet.metalness}
      />
    </>
  );
}

// Individual Orbiting Planet with Real Texture Maps and Dynamic World Tracker
function RevolvingPlanet({
  planet,
  isSelected,
  onSelect,
  speedMultiplier = 1,
  showLabel = true,
  onPositionUpdate,
}: {
  planet: SolarPlanet;
  isSelected: boolean;
  onSelect: () => void;
  speedMultiplier?: number;
  showLabel?: boolean;
  onPositionUpdate?: (planetId: string, pos: THREE.Vector3) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const bodyRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = React.useState(false);
  const worldPos = useMemo(() => new THREE.Vector3(), []);

  // Staggered orbital starting angles
  const startAngle = useMemo(() => (planet.order * 1.25), [planet.order]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const currentAngle = startAngle + elapsed * planet.orbitSpeed * 0.25 * speedMultiplier;

    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(currentAngle) * planet.orbitRadius;
      groupRef.current.position.z = Math.sin(currentAngle) * planet.orbitRadius;

      if (isSelected && onPositionUpdate) {
        groupRef.current.getWorldPosition(worldPos);
        onPositionUpdate(planet.id, worldPos);
      }
    }

    if (bodyRef.current) {
      bodyRef.current.rotation.y += delta * planet.rotationSpeed * 5;
    }
  });

  return (
    <group ref={groupRef}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {/* Planet Sphere with real texture */}
        <mesh ref={bodyRef}>
          <Suspense fallback={<sphereGeometry args={[planet.sizeRadius, 32, 32]} />}>
            <TexturedPlanetBody planet={planet} isSelected={isSelected} hovered={hovered} />
          </Suspense>
        </mesh>

        {/* Atmospheric Rim Glow */}
        <mesh scale={1.12}>
          <sphereGeometry args={[planet.sizeRadius, 24, 24]} />
          <meshBasicMaterial
            color={planet.glowColor}
            transparent
            opacity={isSelected ? 0.35 : hovered ? 0.22 : 0.08}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Saturn Rings */}
        {planet.hasRings && planet.id === "saturn" && (
          <Suspense fallback={null}>
            <SaturnRingMesh
              innerRadius={planet.ringInner ?? 2.55}
              outerRadius={planet.ringOuter ?? 4.6}
            />
          </Suspense>
        )}

        {/* Floating Label in 3D Space */}
        {showLabel && (
          <Html
            position={[0, planet.sizeRadius + (planet.id === "mercury" ? 1.8 : 0.9), 0]}
            center
            distanceFactor={42}
            occlude={false}
            className="pointer-events-none select-none transition-opacity duration-300"
          >
            <div
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-widest uppercase backdrop-blur-md transition-all ${
                isSelected
                  ? "border-ice bg-ice/20 text-white shadow-[0_0_15px_rgba(94,231,255,0.6)]"
                  : hovered
                  ? "border-white/50 bg-black/80 text-ice"
                  : "border-white/10 bg-black/70 text-mist/90"
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: planet.glowColor }}
              />
              {planet.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

// True Dynamic World-Tracking Camera Rig
function SolarCameraRig({
  selectedPlanetId,
  planetTargetPos,
  resetViewTrigger,
  controlsRef,
  onArrived,
}: {
  selectedPlanetId: string | null;
  planetTargetPos: THREE.Vector3 | null;
  resetViewTrigger?: number;
  controlsRef: React.RefObject<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  onArrived: (arrived: boolean) => void;
}) {
  const { camera } = useThree();
  const desiredCamPos = useMemo(() => new THREE.Vector3(0, 48, 72), []);
  const desiredLookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const arrivedRef = useRef(false);

  useEffect(() => {
    // When resetting or clearing selection, re-center controls and reset arrived state
    if (!selectedPlanetId && controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
    }
    arrivedRef.current = false;
    onArrived(false);
  }, [selectedPlanetId, resetViewTrigger, controlsRef, onArrived]);

  useFrame((_, delta) => {
    if (!selectedPlanetId) {
      // Overview state: High-angle view looking directly at center Sol
      desiredCamPos.set(0, 48, 72);
      desiredLookAt.set(0, 0, 0);

      camera.position.lerp(desiredCamPos, delta * 2.2);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(desiredLookAt, delta * 2.2);
        controlsRef.current.update();
      } else {
        camera.lookAt(desiredLookAt);
      }
    } else if (planetTargetPos) {
      const targetPlanet = SOLAR_PLANETS.find((p) => p.id === selectedPlanetId);
      const framingDistance = (targetPlanet?.sizeRadius ?? 1) * 4.5 + 4;

      // Position camera offset relative to the target planet's moving world coordinate
      desiredCamPos.set(
        planetTargetPos.x + framingDistance * 0.8,
        planetTargetPos.y + framingDistance * 0.5,
        planetTargetPos.z + framingDistance * 1.1
      );
      desiredLookAt.copy(planetTargetPos);

      camera.position.lerp(desiredCamPos, delta * 3.5);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(desiredLookAt, delta * 3.5);
        controlsRef.current.update();
      } else {
        camera.lookAt(desiredLookAt);
      }

      // Check if camera has arrived close enough to desired position
      if (!arrivedRef.current) {
        const distToTarget = camera.position.distanceTo(desiredCamPos);
        if (distToTarget < 1.5) {
          arrivedRef.current = true;
          onArrived(true);
        }
      }
    }
  });

  return null;
}

export default function SolarSystemCanvas({
  selectedPlanetId,
  onSelectPlanet,
  speedMultiplier = 1,
  showOrbits = true,
  showLabels = true,
  environmentMode = "milkyway",
  resetViewTrigger = 0,
}: SolarSystemSceneProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null!);
  const [activePlanetWorldPos, setActivePlanetWorldPos] = React.useState<THREE.Vector3 | null>(null);

  // OrbitControls enabled state:
  // - false while camera is animating toward a selected planet
  // - true in overview mode or after camera arrives near the planet
  const [cameraArrived, setCameraArrived] = useState(true);
  // Derive orbitControlsEnabled: enable when no planet selected, or when camera has arrived
  const orbitControlsEnabled = !selectedPlanetId || cameraArrived;

  const handleCameraArrived = React.useCallback((arrived: boolean) => {
    setCameraArrived(arrived);
  }, []);

  const handlePositionUpdate = React.useCallback((planetId: string, pos: THREE.Vector3) => {
    if (planetId === selectedPlanetId) {
      setActivePlanetWorldPos((prev) => (prev ? prev.copy(pos) : pos.clone()));
    }
  }, [selectedPlanetId]);

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 48, 72], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        className="cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.28} />
        <directionalLight position={[0, 40, 0]} intensity={0.3} color="#ffffff" />

        {/* Dynamic Multi-Atmosphere Environment */}
        <Suspense fallback={null}>
          <DynamicSpaceBackground mode={environmentMode} />
        </Suspense>
        <LayeredSpaceDust />

        {/* Luminous Sun */}
        <Suspense fallback={null}>
          <SolarCore onSelect={() => onSelectPlanet("")} />
        </Suspense>

        {/* Orbit Rings and Revolving Planets */}
        {SOLAR_PLANETS.map((planet) => (
          <React.Fragment key={planet.id}>
            {showOrbits && <OrbitRingPath radius={planet.orbitRadius} />}
            <RevolvingPlanet
              planet={planet}
              isSelected={selectedPlanetId === planet.id}
              onSelect={() => onSelectPlanet(planet.id)}
              speedMultiplier={speedMultiplier}
              showLabel={showLabels}
              onPositionUpdate={handlePositionUpdate}
            />
          </React.Fragment>
        ))}

        <SolarCameraRig
          selectedPlanetId={selectedPlanetId}
          planetTargetPos={activePlanetWorldPos}
          resetViewTrigger={resetViewTrigger}
          controlsRef={controlsRef}
          onArrived={handleCameraArrived}
        />

        <OrbitControls
          ref={controlsRef}
          enabled={orbitControlsEnabled}
          enableZoom={true}
          enablePan={true}
          rotateSpeed={0.65}
          minDistance={6}
          maxDistance={180}
          maxPolarAngle={(5 * Math.PI) / 8}
        />
      </Canvas>
    </div>
  );
}
