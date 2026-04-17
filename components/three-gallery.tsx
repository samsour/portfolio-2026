"use client";

import { useRef, useMemo, useState, useEffect, useCallback, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";

// Sparse masonry image cards - larger, fewer, more whitespace
const ImageCard = memo(function ImageCard({
  position,
  scale,
  index,
  texture,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  index: number;
  texture: THREE.Texture;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const initialPos = useRef(position);

  useMemo(() => {
    if (!texture.image) return;
    const planeAspect = scale[0] / scale[1];
    const img = texture.image as HTMLImageElement;
    const texAspect = img.width / img.height;
    if (texAspect > planeAspect) {
      texture.repeat.set(planeAspect / texAspect, 1);
      texture.offset.set((1 - planeAspect / texAspect) / 2, 0);
    } else {
      texture.repeat.set(1, texAspect / planeAspect);
      texture.offset.set(0, (1 - texAspect / planeAspect) / 2);
    }
    texture.needsUpdate = true;
  }, [texture, scale]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y =
      initialPos.current[1] + Math.sin(t * 0.4 + index * 0.9) * 0.2;
    ref.current.position.x =
      initialPos.current[0] + Math.cos(t * 0.25 + index * 0.7) * 0.08;
    ref.current.rotation.z = Math.sin(t * 0.3 + index * 1.1) * 0.025;
    ref.current.rotation.y =
      Math.sin(t * 0.15 + index) * 0.015 + (hovered ? 0.01 : 0);
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

  return (
    <mesh
      ref={ref}
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} />
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

    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    camera.lookAt(0, camera.position.y - 2, 0);
  });

  return null;
}

// Sparse masonry layout - only 5 images with lots of whitespace
const TEXTURE_URLS = [
  "/images/london.webp",
  "/images/symm.webp",
  "/images/whirly.webp",
  "/images/gtr.webp",
  "/images/avatar-jp.webp",
];

const CARDS = [
  {
    position: [-6, 2.5, -1] as [number, number, number],
    scale: [5, 3.5, 1] as [number, number, number],
  },
  {
    position: [5, -3, 0] as [number, number, number],
    scale: [4, 5.5, 1] as [number, number, number],
  },
  {
    position: [-4, -10, -0.5] as [number, number, number],
    scale: [5.5, 4, 1] as [number, number, number],
  },
  {
    position: [6, -16, 0] as [number, number, number],
    scale: [4.5, 6, 1] as [number, number, number],
  },
  {
    position: [-8, -24, -3] as [number, number, number],
    scale: [6, 4.5, 1] as [number, number, number],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Scene = memo(function Scene({
  scrollProgress,
  isDark,
}: {
  scrollProgress: number;
  isDark: boolean;
}) {
  const shuffledUrls = useMemo(() => shuffle(TEXTURE_URLS), []);
  const textures = useTexture(shuffledUrls);

  return (
    <>
      <CameraController scrollProgress={scrollProgress} />
      <Particles count={20} />

      {CARDS.map((card, i) => (
        <ImageCard key={i} {...card} index={i} texture={textures[i]} />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -35, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color={isDark ? "#000000" : "#fafafa"}
          roughness={1}
          metalness={0}
        />
      </mesh>
    </>
  );
});

// Canvas wrapper
function ThreeCanvas({
  scrollProgress,
  isDark,
}: {
  scrollProgress: number;
  isDark: boolean;
}) {
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
  const [wdiInView, setWdiInView] = useState(false);
  const [socialInView, setSocialInView] = useState(false);
  const [aboutInView, setAboutInView] = useState(false);
  const [intoInView, setIntoInView] = useState(false);
  const [contactInView, setContactInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wdiRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const intoRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const observe = (el: HTMLDivElement | null, cb: () => void) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) cb();
        },
        { root, threshold: 0.2 }
      );
      obs.observe(el);
      return obs;
    };
    const o1 = observe(wdiRef.current, () => setWdiInView(true));
    const o2 = observe(socialRef.current, () => setSocialInView(true));
    const o3 = observe(aboutRef.current, () => setAboutInView(true));
    const o4 = observe(intoRef.current, () => setIntoInView(true));
    const o5 = observe(contactRef.current, () => setContactInView(true));
    return () => {
      o1?.disconnect();
      o2?.disconnect();
      o3?.disconnect();
      o4?.disconnect();
      o5?.disconnect();
    };
  }, [mounted]);

  const fadeUp = (inView: boolean, i: number, base = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.6s ease, transform 0.6s ease",
    transitionDelay: `${base + i * 150}ms`,
  });

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
            <h1 className="mb-6 font-serif text-4xl font-normal leading-[1.1] tracking-tight text-black dark:text-white md:text-6xl lg:text-7xl" style={fadeUp(mounted, 0, 200)}>
              <span className="text-balance">sam sauer</span>
            </h1>
            <p className="mx-auto max-w-md font-[family-name:var(--font-pixel)] text-[10px] leading-relaxed tracking-widest text-black/50 dark:text-white/50" style={fadeUp(mounted, 1, 200)}>
              creative developer, passionate photographer. building things at{" "}
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
          <div ref={aboutRef} className="max-w-md">
            <p className="mb-4 font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-black/40 dark:text-white/40" style={fadeUp(aboutInView, 0)}>
              since 2014
            </p>
            <h2 className="mb-6 font-serif text-3xl font-normal leading-tight text-black dark:text-white md:text-4xl" style={fadeUp(aboutInView, 1)}>
              11+ years of building things
            </h2>
            <p className="font-sans text-sm leading-relaxed text-black/50 dark:text-white/50 md:text-base" style={fadeUp(aboutInView, 2)}>
              currently running krekeny, crafting web applications and digital
              products. when i&apos;m not coding, you&apos;ll find me with a
              camera or exploring old tech.
            </p>
          </div>
        </section>

        {/* Currently into */}
        <section className="flex min-h-screen w-full items-center justify-end px-6 md:px-16 lg:px-24">
          <div ref={intoRef} className="max-w-md text-right">
            <p className="mb-4 font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-black/40 dark:text-white/40" style={fadeUp(intoInView, 0)}>
              currently into
            </p>
            <div className="space-y-4">
              <p className="font-sans text-sm leading-relaxed text-black/50 dark:text-white/50 md:text-base" style={fadeUp(intoInView, 1)}>
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
            <div ref={wdiRef} className="space-y-6">
              {[
                { title: "development", sub: "frontend-first, fullstack capable. js ecosystem, 3d, ci/cd" },
                {
                  title: "design / ux",
                  sub: "interfaces, systems, interactions",
                },
                {
                  title: "open source & atproto",
                  sub: "building decentralised social platforms on the atmosphere",
                },
                { title: "photo & videography", sub: "street, travel, moments" },
              ].map((item, i) => (
                <div
                  key={item.title}
                  style={{
                    opacity: wdiInView ? 1 : 0,
                    transform: wdiInView ? "translateY(0)" : "translateY(24px)",
                    transition: "opacity 0.6s ease, transform 0.6s ease",
                    transitionDelay: `${300 + i * 200}ms`,
                  }}
                >
                  <h3 className="font-serif text-xl font-normal text-black dark:text-white md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 font-sans text-sm text-black/40 dark:text-white/40">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 md:px-8">
          <div ref={contactRef} className="text-center">
            <p className="mb-4 font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-black/40 dark:text-white/40" style={fadeUp(contactInView, 0)}>
              say hi
            </p>
            <h2 className="mb-4 font-serif text-3xl font-normal text-black dark:text-white md:text-5xl" style={fadeUp(contactInView, 1)}>
              want to make something cool?
            </h2>
            <p className="mb-10 font-sans text-sm text-black/40 dark:text-white/40 md:text-base" style={fadeUp(contactInView, 2)}>
              always open to interesting projects and good conversations.
            </p>
            <div
              ref={socialRef}
              className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
            >
              {[
                { label: "email", href: "mailto:hi@samsour.de" },
                { label: "github", href: "https://github.com/samsour" },
                {
                  label: "instagram",
                  href: "https://instagram.com/qwerfeldein",
                },
                { label: "linkedin", href: "https://linkedin.com/in/samsauer" },
                {
                  label: "bluesky",
                  href: "https://bsky.app/profile/samsour.de",
                },
                { label: "tangled", href: "https://tangled.sh/@samsour.de" },
              ].map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={
                    link.href.startsWith("mailto")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="font-sans text-sm text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
                  style={{
                    opacity: socialInView ? 1 : 0,
                    transform: socialInView
                      ? "translateX(0)"
                      : "translateX(-16px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-6">
              <span className="cursor-not-allowed font-sans text-xs text-black/15 line-through dark:text-white/15">
                photos
              </span>
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
