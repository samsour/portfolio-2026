"use client"

import dynamic from "next/dynamic"
import { Navigation } from "@/components/navigation"
import { StartupAnimation } from "@/components/startup-animation"
import { Suspense, useState } from "react"

// Dynamic import for Three.js to avoid SSR issues
const ThreeGallery = dynamic(
  () => import("@/components/three-gallery").then((mod) => mod.ThreeGallery),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="font-mono text-sm text-muted-foreground">Loading experience...</p>
        </div>
      </div>
    ),
  }
)

export default function HomePage() {
  const [animationDone, setAnimationDone] = useState(false)

  return (
    <main className="relative min-h-screen bg-background">
      {!animationDone && (
        <StartupAnimation onComplete={() => setAnimationDone(true)} />
      )}
      <Navigation />
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }>
        <ThreeGallery />
      </Suspense>
    </main>
  )
}
