"use client"

import { useState, useEffect } from "react"

export function StartupAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"text" | "expand" | "done">("text")

  useEffect(() => {
    // Phase 1: Show text
    const textTimer = setTimeout(() => {
      setPhase("expand")
    }, 1200)

    // Phase 2: Expand and reveal
    const expandTimer = setTimeout(() => {
      setPhase("done")
      onComplete()
    }, 2000)

    return () => {
      clearTimeout(textTimer)
      clearTimeout(expandTimer)
    }
  }, [onComplete])

  if (phase === "done") return null

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-black transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        phase === "expand" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Name reveal */}
        <div className="overflow-hidden">
          <h1
            className={`font-serif text-3xl font-normal text-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:text-5xl ${
              phase === "text" ? "translate-y-0" : "-translate-y-full"
            }`}
            style={{
              transitionDelay: "0ms",
            }}
          >
            sam sauer
          </h1>
        </div>

        {/* Tagline */}
        <div className="overflow-hidden">
          <p
            className={`font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-white/40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              phase === "text" ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            }`}
            style={{
              transitionDelay: "100ms",
            }}
          >
            developer & photographer
          </p>
        </div>

        {/* Loading line */}
        <div className="absolute -bottom-8 h-px w-24 overflow-hidden bg-white/10">
          <div
            className={`h-full bg-white transition-all duration-1000 ease-linear ${
              phase === "text" ? "w-full" : "w-0"
            }`}
            style={{
              transitionDelay: phase === "text" ? "200ms" : "0ms",
            }}
          />
        </div>
      </div>
    </div>
  )
}
