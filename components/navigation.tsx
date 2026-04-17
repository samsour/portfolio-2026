"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "photos", href: "/photos" },
    { label: "thinking", href: "/thinking" },
  ]

  return (
    <>
      <nav
        className={cn(
          "fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-all duration-500 md:px-12",
          scrolled ? "bg-white/80 backdrop-blur-sm dark:bg-black/80" : "bg-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="group">
          <span className="font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-black transition-opacity hover:opacity-60 dark:text-white">
            samsour.de
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-sans text-xs tracking-[0.15em] text-black/50 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              "h-px w-5 bg-black transition-all duration-300 dark:bg-white",
              menuOpen && "translate-y-[4px] rotate-45"
            )}
          />
          <span
            className={cn(
              "h-px w-5 bg-black transition-all duration-300 dark:bg-white",
              menuOpen && "-translate-y-[3px] -rotate-45"
            )}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-white transition-all duration-500 dark:bg-black md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {navItems.map((item, i) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="font-serif text-2xl font-normal text-black transition-opacity hover:opacity-60 dark:text-white"
            style={{
              transitionDelay: menuOpen ? `${i * 75}ms` : "0ms",
              transform: menuOpen ? "translateY(0)" : "translateY(15px)",
              opacity: menuOpen ? 1 : 0,
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  )
}
