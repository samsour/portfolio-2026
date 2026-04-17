"use client";

import { useRef, useMemo, useState, useEffect, useCallback, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";

// Sparse masonry image cards - larger, fewer, more whitespace
const ImageCard = memo(function ImageCard({
  position,
  scale,
  index,
  brightness,
  isDark,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  index: number;
  brightness: number;
  isDark: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const initialPos = useRef(position);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.elapsedTime;

    // Very subtle floating
    ref.current.position.y =
      initialPos.current[1] + Math.sin(t * 0.2 + index * 0.6) * 0.04;
    ref.current.position.x =
      initialPos.current[0] + Math.cos(t * 0.15 + index * 0.4) * 0.02;

    // Minimal rotation
    ref.current.rotation.y =
      Math.sin(t * 0.1 + index) * 0.008 + (hovered ? 0.01 : 0);

    // Scale on hover
    const targetScale = hovered ? 1.02 : 1;
    ref.current.scale.x = THREE.MathUtils.lerp(
      ref.current.scale.x,
      scale[0] * targetScale,
      0.06
    );
    ref.current.scale.y = THREE.MathUtils.lerp(
      ref.current.scale.y,
      scale[1] * targetScale,
      0.06
    );
  });

  const color = useMemo(() => {
    const gray = isDark ? brightness : 1 - brightness;
    return new THREE.Color(gray, gray, gray);
  }, [brightness, isDark]);

  return (
    <mesh
      ref={ref}
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.12 : 0.03}
        roughness={0.5}
        metalness={0}
      />
    </mesh>
  );
});

// Very minimal particles
const Particles = memo(function Particles({ count = 20 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#ffffff"
        transparent
        opacity={0.15}
        sizeAttenuation
      />
    </points>
  );
});

// Camera controller
function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();

  useFrame(() => {
    const targetY = 2 - scrollProgress * 22;
    const targetZ = 10 + Math.sin(scrollProgress * Math.PI * 0.5) * 2;

    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03);
    camera.lookAt(0, camera.position.y - 2, 0);
  });

  return null;
}

// Sparse masonry layout - only 5 images with lots of whitespace
const Scene = memo(function Scene({
  scrollProgress,
  isDark,
}: {
  scrollProgress: number;
  isDark: boolean;
}) {
  const cards = useMemo(() => {
    return [
      {
        position: [-6, 2.5, -1] as [number, number, number],
        scale: [5, 3.5, 1] as [number, number, number],
        brightness: 0.2,
      },
      {
        position: [5, -3, 0] as [number, number, number],
        scale: [4, 5.5, 1] as [number, number, number],
        brightness: 0.15,
      },
      {
        position: [-4, -10, -0.5] as [number, number, number],
        scale: [5.5, 4, 1] as [number, number, number],
        brightness: 0.28,
      },
      {
        position: [6, -16, 0] as [number, number, number],
        scale: [4.5, 6, 1] as [number, number, number],
        brightness: 0.18,
      },
      {
        position: [-5, -22, -1] as [number, number, number],
        scale: [6, 4.5, 1] as [number, number, number],
        brightness: 0.25,
      },
    ];
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.4} />

      <CameraController scrollProgress={scrollProgress} />
      <Particles count={20} />

      {cards.map((card, i) => (
        <ImageCard key={i} {...card} index={i} isDark={isDark} />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -35, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={isDark ? "#000000" : "#fafafa"} roughness={1} metalness={0} />
      </mesh>
    </>
  );
});

// Canvas wrapper
function ThreeCanvas({ scrollProgress, isDark }: { scrollProgress: number; isDark: boolean }) {
  const bg = isDark ? "#000000" : "#fafafa";
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "default",
        preserveDrawingBuffer: true,
      }}
      camera={{ position: [0, 2, 10], fov: 55 }}
      dpr={[1, 1.5]}
      style={{ background: bg }}
      onCreated={({ gl }) => {
        gl.setClearColor(bg);
      }}
    >
      <fog attach="fog" args={[bg, 12, 40]} />
      <Scene scrollProgress={scrollProgress} isDark={isDark} />
    </Canvas>
  );
}

// Main component
export function ThreeGallery() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const maxScroll =
        containerRef.current.scrollHeight - containerRef.current.clientHeight;
      const progress =
        maxScroll > 0 ? containerRef.current.scrollTop / maxScroll : 0;
      setScrollProgress(Math.min(progress, 1));
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container && mounted) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, mounted]);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-12 animate-pulse bg-white/40" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      {/* Three.js Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none" key="three-canvas">
        <ThreeCanvas scrollProgress={scrollProgress} isDark={isDark} />
      </div>

      {/* HTML Content */}
      <div
        ref={containerRef}
        className="relative z-10 h-screen overflow-y-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Hero */}
        <section className="flex h-screen w-full flex-col items-center justify-center px-6 md:px-8">
          <div className="max-w-3xl text-center">
            <h1 className="mb-6 font-serif text-4xl font-normal leading-[1.1] tracking-tight text-black dark:text-white md:text-6xl lg:text-7xl">
              <span className="text-balance">sam sauer</span>
            </h1>
            <p className="mx-auto max-w-md font-[family-name:var(--font-pixel)] text-[10px] leading-relaxed tracking-widest text-black/50 dark:text-white/50">
              developer & photographer. building things at{" "}
              <a
                href="https://krekeny.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/70 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white"
              >
                krekeny
              </a>
              .
            </p>
          </div>
          <div className="absolute bottom-16 flex flex-col items-center">
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-black/20 to-transparent dark:via-white/20" />
          </div>
        </section>

        {/* About */}
        <section className="flex min-h-screen w-full items-center px-6 md:px-16 lg:px-24">
          <div className="max-w-md">
            <p className="mb-4 font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-black/40 dark:text-white/40">
              since 2014
            </p>
            <h2 className="mb-6 font-serif text-3xl font-normal leading-tight text-black dark:text-white md:text-4xl">
              11+ years of building things
            </h2>
            <p className="font-sans text-sm leading-relaxed text-black/50 dark:text-white/50 md:text-base">
              currently running krekeny, crafting web applications and digital
              products. when i&apos;m not coding, you&apos;ll find me with a
              camera or exploring old tech.
            </p>
          </div>
        </section>

        {/* Currently into */}
        <section className="flex min-h-screen w-full items-center justify-end px-6 md:px-16 lg:px-24">
          <div className="max-w-md text-right">
            <p className="mb-4 font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-black/40 dark:text-white/40">
              currently into
            </p>
            <div className="space-y-4">
              <p className="font-sans text-sm leading-relaxed text-black/50 dark:text-white/50 md:text-base">
                self-hosting everything. returning to the nintendo ds and ipod
                era. listening to old linkin park songs on repeat. old tech just
                hits different.
              </p>
            </div>
          </div>
        </section>

        {/* What I do */}
        <section className="flex min-h-screen w-full items-center px-6 md:px-16 lg:px-24">
          <div className="max-w-md">
            <p className="mb-4 font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-black/40 dark:text-white/40">
              what i do
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-normal text-black dark:text-white md:text-2xl">
                  development
                </h3>
                <p className="mt-1 font-sans text-sm text-black/40 dark:text-white/40">
                  react, next.js, typescript
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl font-normal text-black dark:text-white md:text-2xl">
                  photography
                </h3>
                <p className="mt-1 font-sans text-sm text-black/40 dark:text-white/40">
                  street, travel, moments
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 md:px-8">
          <div className="text-center">
            <p className="mb-4 font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-black/40 dark:text-white/40">
              say hi
            </p>
            <h2 className="mb-4 font-serif text-3xl font-normal text-black dark:text-white md:text-5xl">
              want to make something cool?
            </h2>
            <p className="mb-10 font-sans text-sm text-black/40 dark:text-white/40 md:text-base">
              always open to interesting projects and good conversations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              <a
                href="mailto:hi@samsour.de"
                className="font-sans text-sm text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
              >
                email
              </a>
              <span className="text-black/20 dark:text-white/20">·</span>
              <a
                href="https://github.com/samsour"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
              >
                github
              </a>
              <span className="text-black/20 dark:text-white/20">·</span>
              <a
                href="https://instagram.com/samsour"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
              >
                instagram
              </a>
              <span className="text-black/20 dark:text-white/20">·</span>
              <a
                href="https://linkedin.com/in/samsour"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
              >
                linkedin
              </a>
              <span className="text-black/20 dark:text-white/20">·</span>
              <a
                href="https://bsky.app/profile/samsour.de"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
              >
                bluesky
              </a>
              <span className="text-black/20 dark:text-white/20">·</span>
              <a
                href="https://tangled.com/samsour"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
              >
                tangled
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-6">
              <Link
                href="/photos"
                className="font-sans text-xs text-black/30 transition-colors hover:text-black/60 dark:text-white/30 dark:hover:text-white/60"
              >
                photos
              </Link>
              <Link
                href="/thinking"
                className="font-sans text-xs text-black/30 transition-colors hover:text-black/60 dark:text-white/30 dark:hover:text-white/60"
              >
                thinking
              </Link>
            </div>
            <p className="font-sans text-xs text-black/20 dark:text-white/20">
              © {new Date().getFullYear()} sam sauer
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
