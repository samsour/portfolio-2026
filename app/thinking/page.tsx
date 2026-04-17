import { Navigation } from "@/components/navigation"
import { listDocuments, getPublicationDescription } from "@/lib/atproto"
import { ThinkingList } from "@/components/thinking-list"
import Link from "next/link"

export const metadata = {
  title: "thinking — sam sauer",
  description: "thoughts and articles on development, photography, and tech",
}

export default async function ThinkingPage() {
  const [articles, description] = await Promise.all([
    listDocuments(),
    getPublicationDescription(),
  ])

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
          {description && (
            <p className="mt-4 font-sans text-sm text-black/40 dark:text-white/40">
              {description}
            </p>
          )}
        </header>

        <ThinkingList articles={articles} />

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
