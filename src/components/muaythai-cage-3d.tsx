"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, MeshReflectorMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { MuayThaiCardMatchup } from "@/lib/muaythai-fight-card-content";

// Same octagon fence as mma-octagon-cage.tsx, recolored yellow-and-white
// per the reference photo (public/who-will-win/muaythai-cage.png) — brass
// rails and a white fence/floor instead of MMA's black posts.
const COLORS = {
  limestone: "#e6e2d8",
  brass: "#e4b33c",
};

const SIDES = 8;
const RADIUS = 2.05;
const POST_HEIGHT = 1.75;
const FLOOR_RADIUS = RADIUS + 0.35;
const CARD_WIDTH = 1.8;
const CARD_HEIGHT = 1.55;
// The camera only ever sweeps this edge's angular span (see CameraRig), so
// the card is built facing the same fixed direction rather than billboarding
// — it never needs to read correctly from any other angle.
const FRONT_ANGLE = Math.PI / SIDES;

type Point3 = readonly [number, number, number];

function postPoint(i: number, y: number): Point3 {
  const angle = (i / SIDES) * Math.PI * 2;
  return [Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS];
}

// A thin cylinder stretched and rotated between two points — same technique
// as the octagon cage's fence struts.
function Strut({
  from,
  to,
  color,
  radius = 0.025,
  opacity = 1,
}: {
  from: Point3;
  to: Point3;
  color: string;
  radius?: number;
  opacity?: number;
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
      <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
}

function Octagon() {
  const indices = useMemo(() => Array.from({ length: SIDES }, (_, i) => i), []);

  return (
    <group>
      {indices.map((i) => (
        <mesh key={`post-${i}`} position={postPoint(i, POST_HEIGHT / 2)} castShadow>
          <cylinderGeometry args={[0.045, 0.045, POST_HEIGHT, 10]} />
          <meshStandardMaterial color={COLORS.limestone} metalness={0.2} roughness={0.45} />
        </mesh>
      ))}

      {indices.map((i) => {
        const next = (i + 1) % SIDES;
        const bottomA = postPoint(i, 0.02);
        const bottomB = postPoint(next, 0.02);
        const midA = postPoint(i, POST_HEIGHT * 0.55);
        const midB = postPoint(next, POST_HEIGHT * 0.55);
        const topA = postPoint(i, POST_HEIGHT);
        const topB = postPoint(next, POST_HEIGHT);
        return (
          <group key={`panel-${i}`}>
            <Strut from={bottomA} to={bottomB} color={COLORS.brass} radius={0.02} opacity={0.6} />
            <Strut from={midA} to={midB} color={COLORS.brass} radius={0.016} opacity={0.45} />
            <Strut from={topA} to={topB} color={COLORS.brass} radius={0.02} opacity={0.7} />
            {/* Diagonal cross — the chain-link fence read, white and
                deliberately translucent so it partially occludes rather
                than hides. */}
            <Strut from={bottomA} to={topB} color={COLORS.limestone} radius={0.012} opacity={0.28} />
            <Strut from={bottomB} to={topA} color={COLORS.limestone} radius={0.012} opacity={0.28} />
          </group>
        );
      })}
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[FLOOR_RADIUS, SIDES]} />
      <MeshReflectorMaterial
        blur={[280, 90]}
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

// Poster texture standing at the center of the cage floor — single-image
// matchups just render statically; a second image (if ever added) would
// crossfade the same way the MMA card texture does.
function CardPlane({ matchup }: { matchup: MuayThaiCardMatchup }) {
  const textures = useTexture(matchup.images.map((image) => image.src));

  return (
    <group position={[0, 0, 0]} rotation={[0, Math.PI / 2 - FRONT_ANGLE, 0]}>
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
    <group position={[0, 0, 0]} rotation={[0, Math.PI / 2 - FRONT_ANGLE, 0]}>
      <mesh position={[0, CARD_HEIGHT / 2, 0]} rotation={[-0.06, 0, 0]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshStandardMaterial color={COLORS.limestone} opacity={0.4} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Same slow, narrow sweep centered on the front edge as the octagon cage —
// broadcast-stable framing while the near struts still drift across the card.
function CameraRig({ reduceMotion }: { reduceMotion: boolean }) {
  const { camera } = useThree();
  const elapsed = useRef(0);
  const distance = 4.6;
  const camY = 1.35;
  const targetY = 0.55;
  const amplitude = reduceMotion ? 0 : 0.24;

  useFrame((_, delta) => {
    elapsed.current += delta;
    const azimuth = FRONT_ANGLE + Math.sin(elapsed.current * 0.12) * amplitude;
    camera.position.set(Math.cos(azimuth) * distance, camY, Math.sin(azimuth) * distance);
    camera.lookAt(0, targetY, 0);
  });

  return null;
}

interface MuayThaiCage3DProps {
  matchup: MuayThaiCardMatchup;
  reduceMotion: boolean;
  /** See mma-octagon-cage.tsx — the caller remounts (via a changing `key`)
   * if the WebGL context ever dies mid-session. */
  onContextLost?: () => void;
}

export function MuayThaiCage3D({ matchup, reduceMotion, onContextLost }: MuayThaiCage3DProps) {
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
      <ambientLight intensity={0.6} />
      <directionalLight position={[2.5, 5, 3]} intensity={1.4} castShadow />
      <directionalLight position={[-3, 2.5, -3.5]} intensity={0.4} color={COLORS.limestone} />
      <pointLight position={[0, 2.1, 1.6]} intensity={0.6} color={COLORS.brass} distance={6} />

      <Floor />
      <Octagon />
      <Suspense fallback={<CardPlaceholder />}>
        <CardPlane key={matchup.id} matchup={matchup} />
      </Suspense>
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.5}
        scale={FLOOR_RADIUS * 2.3}
        blur={2.4}
        far={2.2}
        resolution={512}
        color="#000000"
      />
    </Canvas>
  );
}

export default MuayThaiCage3D;
