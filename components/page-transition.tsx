"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"

interface TransitionContextType {
  isTransitioning: boolean
  transitionTo: (href: string) => void
  direction: "in" | "out"
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  transitionTo: () => {},
  direction: "in",
})

export const usePageTransition = () => useContext(TransitionContext)

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<"in" | "out">("in")
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const transitionTo = useCallback((href: string) => {
    if (href === pathname) return
    
    setDirection("out")
    setIsTransitioning(true)
    setPendingHref(href)
  }, [pathname])

  useEffect(() => {
    if (isTransitioning && pendingHref && direction === "out") {
      const timeout = setTimeout(() => {
        router.push(pendingHref)
      }, 600)
      return () => clearTimeout(timeout)
    }
  }, [isTransitioning, pendingHref, direction, router])

  useEffect(() => {
    if (pendingHref && pathname === pendingHref) {
      setDirection("in")
      setPendingHref(null)
      const timeout = setTimeout(() => {
        setIsTransitioning(false)
      }, 600)
      return () => clearTimeout(timeout)
    }
  }, [pathname, pendingHref])

  return (
    <TransitionContext.Provider value={{ isTransitioning, transitionTo, direction }}>
      {children}
    </TransitionContext.Provider>
  )
}

// Transition overlay component
export function TransitionOverlay() {
  const { isTransitioning, direction } = usePageTransition()

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[100] bg-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isTransitioning && direction === "out"
          ? "translate-y-0"
          : direction === "in" && isTransitioning
            ? "-translate-y-full"
            : "translate-y-full"
      }`}
    >
      <div className="flex h-full w-full items-center justify-center">
        <span className="font-[family-name:var(--font-pixel)] text-xs tracking-widest text-white/40">
          loading
        </span>
      </div>
    </div>
  )
}

// Custom link component that uses transitions
export function TransitionLink({
  href,
  children,
  className,
  ...props
}: {
  href: string
  children: ReactNode
  className?: string
  [key: string]: unknown
}) {
  const { transitionTo } = usePageTransition()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    transitionTo(href)
  }

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  )
}
