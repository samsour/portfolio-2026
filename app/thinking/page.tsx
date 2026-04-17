import { Navigation } from "@/components/navigation"
import Link from "next/link"

export const metadata = {
  title: "thinking — sam sauer",
  description: "thoughts and articles on development, photography, and tech",
}

const articles = [
  {
    slug: "self-hosting-everything",
    title: "why i self-host everything now",
    date: "2024-12-15",
    excerpt: "on taking back control of my data and rediscovering the joy of running your own servers.",
  },
  {
    slug: "old-tech-new-appreciation",
    title: "old tech, new appreciation",
    date: "2024-11-28",
    excerpt: "dusting off the nintendo ds and ipod. why the old stuff just hits different.",
  },
  {
    slug: "photography-patience",
    title: "photography taught me patience",
    date: "2024-10-14",
    excerpt: "waiting for the right moment. how street photography changed how i see the world.",
  },
]

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toLowerCase()
}

export default function ThinkingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navigation />

      <div className="px-6 pb-24 pt-32 md:px-16 lg:px-24">
        <header className="mb-16">
          <p className="mb-4 font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-black/40 dark:text-white/40">
            words
          </p>
          <h1 className="font-serif text-4xl font-normal text-black dark:text-white md:text-5xl">
            thinking
          </h1>
        </header>

        <div className="grid gap-12 md:gap-16">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/thinking/${article.slug}`}
              className="group block border-b border-black/10 pb-12 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/30 md:pb-16"
            >
              <p className="mb-3 font-[family-name:var(--font-pixel)] text-[10px] text-black/30 dark:text-white/30">
                {formatDate(article.date)}
              </p>
              <h2 className="mb-3 font-serif text-xl font-normal text-black transition-opacity group-hover:opacity-80 dark:text-white md:text-2xl">
                {article.title}
              </h2>
              <p className="max-w-xl font-sans text-sm leading-relaxed text-black/40 dark:text-white/40">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-sans text-sm text-black/40 dark:text-white/40">
              no articles yet. thoughts incoming.
            </p>
          </div>
        )}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-white via-white/80 to-transparent px-6 py-6 dark:from-black dark:via-black/80 md:px-12">
        <Link href="/" className="font-sans text-xs text-black/30 transition-colors hover:text-black/60 dark:text-white/30 dark:hover:text-white/60">
          back home
        </Link>
        <p className="font-sans text-xs text-black/20 dark:text-white/20">
          © {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  )
}
