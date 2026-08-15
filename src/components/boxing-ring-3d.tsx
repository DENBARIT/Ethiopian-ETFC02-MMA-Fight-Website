"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, MeshReflectorMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { BoxingCardMatchup } from "@/lib/boxing-fight-card-content";

// Yellow-and-white ring: brass ropes against a white post/canvas, pulled
// from the same theme palette as the cage in mma-octagon-cage.tsx.
const COLORS = {
  obsidian: "#0c0b0a",
  limestone: "#e6e2d8",
  brass: "#e4b33c",
};

// SIZE is picked so the ring's corner-to-center distance (HALF * sqrt(2))
// lands on the same 2.05 the octagon cage uses for its own radius — same
// on-screen footprint as mma-octagon-cage.tsx once the camera below
// matches its fov/distance too.
const SIZE = 2.9;
const HALF = SIZE / 2;
const POST_HEIGHT = 1.5;
const ROPE_COUNT = 4;
const FLOOR_SIZE = SIZE + 0.9;
const CARD_WIDTH = 1.55;
const CARD_HEIGHT = 1.7;
// The camera only ever sweeps this edge's angular span (see CameraRig), so
// the card is built facing the same fixed direction rather than billboarding
// — it never needs to read correctly from any other angle. Front edge is
// the +Z side of the square platform.
const FRONT_AZIMUTH = Math.PI / 2;

type Point3 = readonly [number, number, number];

// A thin cylinder stretched and rotated between two points — same technique
// as the octagon cage's fence struts.
function Strut({
  from,
  to,
  color,
  radius = 0.03,
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
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, length, 10]} />
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.4} />
    </mesh>
  );
}

function Ring() {
  const corners: Point3[] = [
    [HALF, 0, HALF],
    [HALF, 0, -HALF],
    [-HALF, 0, HALF],
    [-HALF, 0, -HALF],
  ];

  const ropeHeights = useMemo(
    () => Array.from({ length: ROPE_COUNT }, (_, i) => 0.28 + (i * (POST_HEIGHT - 0.5)) / (ROPE_COUNT - 1)),
    [],
  );

  return (
    <group>
      {corners.map(([x, , z]) => (
        <mesh key={`post-${x}-${z}`} position={[x, POST_HEIGHT / 2, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, POST_HEIGHT, 12]} />
          <meshStandardMaterial color={COLORS.limestone} metalness={0.15} roughness={0.45} />
        </mesh>
      ))}

      {ropeHeights.map((y) => (
        <group key={y}>
          <Strut from={[-HALF, y, HALF]} to={[HALF, y, HALF]} color={COLORS.brass} />
          <Strut from={[-HALF, y, -HALF]} to={[HALF, y, -HALF]} color={COLORS.brass} />
          <Strut from={[HALF, y, -HALF]} to={[HALF, y, HALF]} color={COLORS.brass} />
          <Strut from={[-HALF, y, -HALF]} to={[-HALF, y, HALF]} color={COLORS.brass} />
        </group>
      ))}
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
      <MeshReflectorMaterial
        blur={[260, 90]}
        resolution={512}
        mixBlur={1}
        mixStrength={20}
        roughness={0.9}
        depthScale={1}
        minDepthThreshold={0.85}
        maxDepthThreshold={1.2}
        color={COLORS.limestone}
        metalness={0.15}
      />
    </mesh>
  );
}

// Poster texture standing at the center of the ring — single-image
// matchups just render statically; a second image (if ever added) would
// crossfade the same way the MMA card texture does.
function CardPlane({ matchup }: { matchup: BoxingCardMatchup }) {
  const textures = useTexture(matchup.images.map((image) => image.src));

  return (
    <group position={[0, 0, 0]} rotation={[0, Math.PI / 2 - FRONT_AZIMUTH, 0]}>
      <mesh position={[0, CARD_HEIGHT / 2, -0.02]} rotation={[-0.06, 0, 0]}>
        <planeGeometry args={[CARD_WIDTH + 0.16, CARD_HEIGHT + 0.16]} />
        <meshStandardMaterial color={COLORS.brass} opacity={0.85} transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, CARD_HEIGHT / 2, 0]} rotation={[-0.06, 0, 0]} castShadow>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshStandardMaterial
          map={textures[0]}
          transparent
          toneMapped={false}
          roughness={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function CardPlaceholder() {
  return (
    <group position={[0, 0, 0]} rotation={[0, Math.PI / 2 - FRONT_AZIMUTH, 0]}>
      <mesh position={[0, CARD_HEIGHT / 2, 0]} rotation={[-0.06, 0, 0]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshStandardMaterial color={COLORS.obsidian} opacity={0.6} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// A slow, narrow sweep centered on the ring's front edge — broadcast-stable
// framing while the near ropes/posts still drift across the card. Same
// approach as the octagon cage's CameraRig.
function CameraRig({ reduceMotion }: { reduceMotion: boolean }) {
  const { camera } = useThree();
  const elapsed = useRef(0);
  const distance = 4.6;
  const camY = 1.35;
  const targetY = 0.55;
  const amplitude = reduceMotion ? 0 : 0.22;

  useFrame((_, delta) => {
    elapsed.current += delta;
    const azimuth = FRONT_AZIMUTH + Math.sin(elapsed.current * 0.12) * amplitude;
    camera.position.set(Math.cos(azimuth) * distance, camY, Math.sin(azimuth) * distance);
    camera.lookAt(0, targetY, 0);
  });

  return null;
}

interface BoxingRing3DProps {
  matchup: BoxingCardMatchup;
  reduceMotion: boolean;
  /** See mma-octagon-cage.tsx — the caller remounts (via a changing `key`)
   * if the WebGL context ever dies mid-session. */
  onContextLost?: () => void;
}

export function BoxingRing3D({ matchup, reduceMotion, onContextLost }: BoxingRing3DProps) {
  return (
    <Canvas
      camera={{ fov: 70, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
            onContextLost?.();
          },
          { once: true },
        );
      }}
    >
      <CameraRig reduceMotion={reduceMotion} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.5, 5, 3]} intensity={1.4} castShadow />
      <directionalLight position={[-3, 2.5, -3.5]} intensity={0.35} color={COLORS.limestone} />
      <pointLight position={[0, 2.1, 1.6]} intensity={0.6} color={COLORS.brass} distance={6} />

      <Floor />
      <Ring />
      <Suspense fallback={<CardPlaceholder />}>
        <CardPlane key={matchup.id} matchup={matchup} />
      </Suspense>
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.55}
        scale={FLOOR_SIZE * 1.3}
        blur={2.4}
        far={2.2}
        resolution={512}
        color="#000000"
      />
    </Canvas>
  );
}

export default BoxingRing3D;
