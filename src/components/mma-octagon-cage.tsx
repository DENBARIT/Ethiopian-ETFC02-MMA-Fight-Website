"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, MeshReflectorMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { FightCardMatchup } from "@/lib/mma-fight-card-content";

// Pulled from the theme's base palette in globals.css — three.js materials
// need real color values, not CSS custom properties (see fight-arena-3d.tsx
// for the same tradeoff on the boxing/Muay Thai rings).
const COLORS = {
  obsidian: "#0c0b0a",
  limestone: "#e6e2d8",
  brass: "#e4b33c",
};

const SIDES = 8;
const RADIUS = 2.05;
const POST_HEIGHT = 1.75;
const FLOOR_RADIUS = RADIUS + 0.35;
const CARD_WIDTH = 1.7;
const CARD_HEIGHT = 2.3;
// The camera only ever sweeps this edge's angular span (see CameraRig), so
// the card is built facing the same fixed direction rather than billboarding
// — it never needs to read correctly from any other angle.
const FRONT_ANGLE = Math.PI / SIDES;

type Point3 = readonly [number, number, number];

function postPoint(i: number, y: number): Point3 {
  const angle = (i / SIDES) * Math.PI * 2;
  return [Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS];
}

// A thin cylinder stretched and rotated between two points — the octagon's
// posts-and-diagonal-fence look, same technique as the boxing/Muay Thai
// rings' ropes.
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
          <meshStandardMaterial color={COLORS.obsidian} metalness={0.5} roughness={0.4} />
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
            <Strut from={bottomA} to={bottomB} color={COLORS.brass} radius={0.02} opacity={0.55} />
            <Strut from={midA} to={midB} color={COLORS.brass} radius={0.016} opacity={0.4} />
            <Strut from={topA} to={topB} color={COLORS.brass} radius={0.02} opacity={0.65} />
            {/* Diagonal cross — the chain-link fence read, deliberately
                translucent so it partially occludes rather than hides. */}
            <Strut from={bottomA} to={topB} color={COLORS.limestone} radius={0.012} opacity={0.22} />
            <Strut from={bottomB} to={topA} color={COLORS.limestone} radius={0.012} opacity={0.22} />
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
        mixStrength={22}
        roughness={0.9}
        depthScale={1}
        minDepthThreshold={0.85}
        maxDepthThreshold={1.2}
        color={COLORS.obsidian}
        metalness={0.35}
      />
    </mesh>
  );
}

// Card texture(s) swap on a timer for the main event (two shots), or stay
// static for a single-image matchup. Faded via material opacity in
// useFrame rather than React state, so the crossfade doesn't cause re-renders.
function CardPlane({ matchup, reduceMotion }: { matchup: FightCardMatchup; reduceMotion: boolean }) {
  const textures = useTexture(matchup.images.map((image) => image.src));
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const phase = useRef({ index: 0, timer: 0, fade: 1, fading: false });
  const fadeSeconds = reduceMotion ? 0.08 : 0.3;

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material || textures.length < 2) return;
    const state = phase.current;

    state.timer += delta;
    if (!state.fading && state.timer > 4.2) {
      state.fading = true;
      state.timer = 0;
    }

    if (state.fading) {
      state.fade = Math.max(0, state.fade - delta / fadeSeconds);
      if (state.fade === 0) {
        state.index = (state.index + 1) % textures.length;
        material.map = textures[state.index];
        material.needsUpdate = true;
        state.fading = false;
      }
    } else if (state.fade < 1) {
      state.fade = Math.min(1, state.fade + delta / fadeSeconds);
    }

    material.opacity = state.fade;
  });

  return (
    <group position={[0, 0, 0]} rotation={[0, Math.PI / 2 - FRONT_ANGLE, 0]}>
      {/* Backing frame — a slightly larger brass plane behind the poster
          fakes a bordered card without needing custom rounded geometry. */}
      <mesh position={[0, CARD_HEIGHT / 2, -0.02]} rotation={[-0.06, 0, 0]}>
        <planeGeometry args={[CARD_WIDTH + 0.16, CARD_HEIGHT + 0.16]} />
        <meshStandardMaterial color={COLORS.brass} opacity={0.85} transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, CARD_HEIGHT / 2, 0]} rotation={[-0.06, 0, 0]} castShadow>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshStandardMaterial
          ref={materialRef}
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
        <meshStandardMaterial color={COLORS.obsidian} opacity={0.6} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Rather than a full 360° orbit (which would eventually show the card
// edge-on or from behind), the camera holds a slow, narrow sweep centered
// on one octagon edge — always the "front" fence — so the framing stays
// broadcast-stable while the near struts still drift across the card.
function CameraRig({ reduceMotion }: { reduceMotion: boolean }) {
  const { camera } = useThree();
  const elapsed = useRef(0);
  const distance = 4.6;
  const camY = 1.35;
  // Lower than the card's own vertical center — tilts the camera down
  // enough to close the dead-air gap that was sitting above the cage,
  // while still keeping the near floor edge and card top both well inside
  // the frustum (checked against FOV/distance by hand, not just eyeballed).
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

interface MmaOctagonCageProps {
  matchup: FightCardMatchup;
  reduceMotion: boolean;
  /** Fires once if the WebGL context dies mid-session (e.g. GPU driver
   * reset, tab backgrounding). The canvas otherwise just freezes on
   * whatever was last drawn — the caller should remount this component
   * (via a changing `key`) to rebuild the context from scratch. */
  onContextLost?: () => void;
}

export function MmaOctagonCage({ matchup, reduceMotion, onContextLost }: MmaOctagonCageProps) {
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
      <Octagon />
      <Suspense fallback={<CardPlaceholder />}>
        <CardPlane key={matchup.id} matchup={matchup} reduceMotion={reduceMotion} />
      </Suspense>
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.55}
        scale={FLOOR_RADIUS * 2.3}
        blur={2.4}
        far={2.2}
        resolution={512}
        color="#000000"
      />
    </Canvas>
  );
}

export default MmaOctagonCage;
