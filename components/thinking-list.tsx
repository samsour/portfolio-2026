"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

interface Article {
  rkey: string
  publishedAt: string
  title: string
  description: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toLowerCase()
}

export function ThinkingList({ articles }: { articles: Article[] }) {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.05 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="grid gap-12 md:gap-16">
      {articles.map((article, i) => (
        <Link
          key={article.rkey}
          href={`/thinking/${article.rkey}`}
          className="group block border-b border-black/10 pb-12 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/30 md:pb-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            transitionDelay: `${i * 120}ms`,
          }}
        >
          <p className="mb-3 font-[family-name:var(--font-pixel)] text-[10px] text-black/30 dark:text-white/30">
            {formatDate(article.publishedAt)}
          </p>
          <h2 className="mb-3 font-serif text-xl font-normal text-black transition-opacity group-hover:opacity-80 dark:text-white md:text-2xl">
            {article.title}
          </h2>
          <p className="max-w-xl font-sans text-sm leading-relaxed text-black/40 dark:text-white/40">
            {article.description}
          </p>
        </Link>
      ))}
    </div>
  )
}
