"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Discipline } from "@/lib/who-will-win-content";

// Pulled from the theme's base palette in globals.css. three.js materials
// need real color values, not CSS custom properties, so these are hardcoded
// rather than read from the DOM — the arena won't re-theme on the site's
// light/dark toggle the way the rest of the page does.
const COLORS = {
  obsidian: "#0c0b0a",
  limestone: "#e6e2d8",
  brass: "#e4b33c",
  kush: "#0b7a3f",
  blood: "#b4232a",
};

type Point3 = readonly [number, number, number];

// A thin cylinder stretched and rotated between two points — used for both
// the ring ropes and the cage's diagonal fence struts.
function Strut({
  from,
  to,
  color,
  radius = 0.025,
}: {
  from: Point3;
  to: Point3;
  color: string;
  radius?: number;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const direction = end.clone().sub(start);
    const len = direction.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize(),
    );
    return { position: start.lerp(end, 0.5), quaternion: quat, length: len };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function RingPlatform({
  size = 3.2,
  postColor,
  ropeColor,
  floorColor,
  ropeCount,
}: {
  size?: number;
  postColor: string;
  ropeColor: string;
  floorColor: string;
  ropeCount: number;
}) {
  const half = size / 2;
  const postHeight = 1.5;

  const ropeHeights = useMemo(
    () =>
      Array.from({ length: ropeCount }, (_, i) =>
        ropeCount === 1 ? postHeight * 0.6 : 0.32 + (i * (postHeight - 0.55)) / (ropeCount - 1),
      ),
    [ropeCount, postHeight],
  );

  const corners: Point3[] = [
    [half, 0, half],
    [half, 0, -half],
    [-half, 0, half],
    [-half, 0, -half],
  ];

  return (
    <group>
      <mesh position={[0, -0.16, 0]}>
        <boxGeometry args={[size + 0.7, 0.3, size + 0.7]} />
        <meshStandardMaterial color={COLORS.obsidian} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {corners.map(([x, , z]) => (
        <mesh key={`${x}-${z}`} position={[x, postHeight / 2, z]}>
          <cylinderGeometry args={[0.06, 0.06, postHeight, 12]} />
          <meshStandardMaterial color={postColor} />
        </mesh>
      ))}

      {ropeHeights.map((y) => (
        <group key={y}>
          <Strut from={[-half, y, half]} to={[half, y, half]} color={ropeColor} />
          <Strut from={[-half, y, -half]} to={[half, y, -half]} color={ropeColor} />
          <Strut from={[half, y, -half]} to={[half, y, half]} color={ropeColor} />
          <Strut from={[-half, y, -half]} to={[-half, y, half]} color={ropeColor} />
        </group>
      ))}
    </group>
  );
}

function BoxingRing() {
  return (
    <RingPlatform postColor={COLORS.blood} ropeColor={COLORS.limestone} floorColor={COLORS.blood} ropeCount={4} />
  );
}

function MuayThaiRing() {
  return (
    <RingPlatform postColor={COLORS.kush} ropeColor={COLORS.brass} floorColor={COLORS.kush} ropeCount={3} />
  );
}

function Arena({ discipline }: { discipline: Exclude<Discipline, "mma"> }) {
  return (
    <group position={[0, -0.7, 0]}>{discipline === "boxing" ? <BoxingRing /> : <MuayThaiRing />}</group>
  );
}

// MMA uses a real cage photo (see mma-cage-scene.tsx) instead of a
// procedural scene, so this only ever renders boxing or Muay Thai.
export function FightArena3D({ discipline }: { discipline: Exclude<Discipline, "mma"> }) {
  return (
    <Canvas camera={{ position: [3.6, 2.3, 3.6], fov: 42 }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />
      <directionalLight position={[-4, 3, -3]} intensity={0.35} />
      <Arena discipline={discipline} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={2.2}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}

export default FightArena3D;
