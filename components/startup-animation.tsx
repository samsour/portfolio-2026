"use client"

import { useState, useEffect, useRef } from "react"

const NAME_CHARS = "sam sauer".split("")
const TAGLINE = "creative developer"

type Phase = "counter" | "name" | "exit" | "done"

export function StartupAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("counter")
  const [counter, setCounter] = useState(0)
  const [visibleLetters, setVisibleLetters] = useState(0)
  const [taglineVisible, setTaglineVisible] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (phase !== "counter") return
    const interval = setInterval(() => {
      setCounter((prev) => {
        const next = Math.min(100, prev + Math.random() * 8 + 2)
        if (next >= 100) clearInterval(interval)
        return next
      })
    }, 50)
    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (counter < 100) return
    const t = setTimeout(() => setPhase("name"), 350)
    return () => clearTimeout(t)
  }, [counter])

  useEffect(() => {
    if (phase !== "name") return
    let i = 0
    const t = setInterval(() => {
      i++
      setVisibleLetters(i)
      if (i >= NAME_CHARS.length) clearInterval(t)
    }, 55)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (visibleLetters < NAME_CHARS.length) return
    const t1 = setTimeout(() => setTaglineVisible(true), 120)
    const t2 = setTimeout(() => setPhase("exit"), 750)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [visibleLetters])

  useEffect(() => {
    if (phase !== "exit") return
    const t = setTimeout(() => {
      setPhase("done")
      onCompleteRef.current()
    }, 950)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === "done") return null

  const isExiting = phase === "exit"

  return (
    <>
      {/* Top panel */}
      <div
        className="fixed left-0 right-0 top-0 z-[200] bg-black transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          bottom: "50%",
          transform: isExiting ? "translateY(-101%)" : "translateY(0)",
        }}
      />

      {/* Bottom panel */}
      <div
        className="fixed left-0 right-0 bottom-0 z-[200] bg-black transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          top: "50%",
          transform: isExiting ? "translateY(101%)" : "translateY(0)",
        }}
      />

      {/* Center content */}
      <div
        className={`fixed inset-0 z-[201] flex flex-col items-center justify-center transition-opacity duration-300 ease-in ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Counter */}
        <div
          className={`absolute flex flex-col items-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            phase === "counter"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-8 pointer-events-none"
          }`}
        >
          <span className="font-[family-name:var(--font-pixel)] text-6xl leading-none text-white tabular-nums md:text-8xl">
            {String(Math.round(counter)).padStart(3, "0")}
          </span>
          <span className="font-[family-name:var(--font-pixel)] text-[9px] tracking-[0.5em] text-white/30 uppercase">
            loading
          </span>
        </div>

        {/* Name */}
        <div
          className={`absolute flex flex-col items-center gap-5 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            phase === "name" || phase === "exit" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="overflow-hidden pb-2">
            <div className="flex">
              {NAME_CHARS.map((char, i) => (
                <span
                  key={i}
                  className="inline-block font-serif text-5xl font-normal text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:text-7xl"
                  style={{
                    transform: i < visibleLetters ? "translateY(0)" : "translateY(115%)",
                    transitionDelay: `${i * 35}ms`,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-hidden">
            <p
              className={`font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-[0.4em] text-white/40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                taglineVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`}
            >
              {TAGLINE}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
