import { Navigation } from "@/components/navigation"
import { listDocuments, getDocument } from "@/lib/atproto"
import { RenderBlocks } from "@/components/atproto-blocks"
import Link from "next/link"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).toLowerCase()
}

export async function generateStaticParams() {
  const articles = await listDocuments()
  return articles.map((a) => ({ slug: a.rkey }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getDocument(slug)
  return {
    title: article ? `${article.title} — sam sauer` : "thinking — sam sauer",
    description: article?.description ?? "thoughts and musings",
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getDocument(slug)

  if (!article) {
    return (
      <main className="min-h-screen bg-white dark:bg-black">
        <Navigation />
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-2xl text-black dark:text-white">article not found</h1>
            <Link href="/thinking" className="font-sans text-sm text-black/50 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white">
              back to thinking
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navigation />

      <article className="mx-auto max-w-2xl px-6 pb-24 pt-32">
        <header className="mb-12">
          <Link href="/thinking" className="mb-8 inline-block font-sans text-xs text-black/30 transition-colors hover:text-black/60 dark:text-white/30 dark:hover:text-white/60">
            ← back to thinking
          </Link>
          <p className="mb-4 font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-black/40 dark:text-white/40">
            {formatDate(article.publishedAt)}
          </p>
          <h1 className="mb-4 font-serif text-3xl font-normal leading-tight text-black dark:text-white md:text-4xl">
            {article.title}
          </h1>
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="font-[family-name:var(--font-pixel)] text-[9px] tracking-widest text-black/30 dark:text-white/30">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <RenderBlocks blocks={article.blocks} />

        <div className="mt-16 border-t border-black/10 pt-10 dark:border-white/10">
          <p className="mb-4 font-[family-name:var(--font-pixel)] text-[9px] leading-relaxed tracking-widest text-black/30 dark:text-white/30">
            this post is part of the atmosphere — written and published using the{" "}
            <a
              href="https://standard.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-black/60 dark:hover:text-white/60"
            >
              standard site structure
            </a>
            {" "}and{" "}
            <a
              href="https://leaflet.pub"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-black/60 dark:hover:text-white/60"
            >
              leaflet
            </a>
            , stored on an atproto pds.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://sams.leaflet.pub${article.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-black/20 px-4 py-2 font-[family-name:var(--font-pixel)] text-[9px] tracking-widest text-black/50 transition-colors hover:border-black/50 hover:text-black dark:border-white/20 dark:text-white/50 dark:hover:border-white/50 dark:hover:text-white"
            >
              read on leaflet →
            </a>
            <a
              href={`https://pdsls.dev/${article.uri}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-black/20 px-4 py-2 font-[family-name:var(--font-pixel)] text-[9px] tracking-widest text-black/50 transition-colors hover:border-black/50 hover:text-black dark:border-white/20 dark:text-white/50 dark:hover:border-white/50 dark:hover:text-white"
            >
              view on pds →
            </a>
          </div>
        </div>
      </article>

      <footer className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/thinking" className="font-sans text-xs text-black/30 transition-colors hover:text-black/60 dark:text-white/30 dark:hover:text-white/60">
          all articles
        </Link>
        <p className="font-sans text-xs text-black/20 dark:text-white/20">
          © {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  )
}
