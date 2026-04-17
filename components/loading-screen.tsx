"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setIsComplete(true), 500)
      setTimeout(() => setIsHidden(true), 1500)
    }
  }, [progress])

  if (isHidden) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-all duration-1000",
        isComplete && "opacity-0"
      )}
    >
      {/* Animated logo */}
      <div className="relative mb-12">
        <div
          className={cn(
            "flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/20 transition-all duration-500",
            isComplete && "scale-150 opacity-0"
          )}
        >
          <div className="absolute inset-2 animate-spin rounded-full border-t-2 border-primary" />
          <span className="font-mono text-3xl font-bold text-primary">J</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-48">
        <div className="mb-2 flex justify-between font-mono text-xs text-muted-foreground">
          <span>Loading</span>
          <span>{Math.min(100, Math.round(progress))}%</span>
        </div>
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>

      {/* Loading text */}
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Crafting Experience
      </p>
    </div>
  )
}
