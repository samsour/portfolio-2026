"use client"

import { useEffect, useState } from "react"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const updateCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
          target.tagName === "A" ||
          target.tagName === "BUTTON"
      )
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("mouseover", updateCursor)
    document.body.addEventListener("mouseenter", handleMouseEnter)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("mouseover", updateCursor)
      document.body.removeEventListener("mouseenter", handleMouseEnter)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // Only show custom cursor on desktop
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return null
  }

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="pointer-events-none fixed z-[100] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary mix-blend-difference transition-transform duration-100 md:block"
        style={{
          left: position.x,
          top: position.y,
          opacity: isVisible ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${isPointer ? 2.5 : 1})`,
        }}
      />
      {/* Cursor ring */}
      <div
        className="pointer-events-none fixed z-[100] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50 mix-blend-difference transition-all duration-300 md:block"
        style={{
          left: position.x,
          top: position.y,
          opacity: isVisible ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
        }}
      />
    </>
  )
}
