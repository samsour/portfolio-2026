import { Navigation } from "@/components/navigation"
import Link from "next/link"

// This will be replaced with your actual article content (probably from MDX or a CMS)
const articles: Record<string, { title: string; date: string; content: string }> = {
  "self-hosting-everything": {
    title: "why i self-host everything now",
    date: "2024-12-15",
    content: `there's something deeply satisfying about running your own servers. 

it started with a simple question: where does my data actually live? the answer was... everywhere. scattered across dozens of services, each with their own privacy policies and terms of service that nobody reads.

so i started bringing things home. email first, then file storage, then the photo backups. it's not always easy. things break. updates need to happen at 2am sometimes. but there's a sense of ownership that comes with it.

the old web had this feeling. when you visited someone's personal site, you were visiting *their* space. not a profile on someone else's platform. that's what i'm trying to recapture.

is it for everyone? probably not. but if you've ever wondered what happens to your data when a service shuts down, maybe it's worth exploring.`,
  },
  "old-tech-new-appreciation": {
    title: "old tech, new appreciation",
    date: "2024-11-28",
    content: `i found my old nintendo ds in a drawer last month. charged it up, half expecting it to be dead. the startup chime hit different.

there's no notifications on a ds. no infinite scroll. no algorithm deciding what i should see next. just me and whatever game i choose to play.

same with the ipod. 30gb of music i actually own. no subscription fees. no "this song is no longer available in your region." it just works.

we traded simplicity for convenience. but sometimes convenience comes at a cost we don't notice until it's gone.

linkin park's hybrid theory sounds exactly the same as it did in 2001 on that ipod. that's kind of beautiful.`,
  },
  "photography-patience": {
    title: "photography taught me patience",
    date: "2024-10-14",
    content: `street photography is mostly waiting.

waiting for the light to hit just right. waiting for someone to walk into frame. waiting for the moment that makes a photo feel alive.

it's the opposite of how we experience most things now. instant everything. swipe, tap, done. but a good photo can't be rushed.

i've stood on the same corner for an hour, watching. most of the time, nothing happens. but when it does—when all the elements align for a fraction of a second—that's when the magic happens.

photography taught me to slow down. to observe. to be present in a moment instead of always chasing the next one.

the camera is just a tool. patience is the real skill.`,
  },
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).toLowerCase()
}

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles[slug]
  return {
    title: article ? `${article.title} — sam sauer` : "thinking — sam sauer",
    description: article?.content.slice(0, 160) || "thoughts and musings",
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles[slug]

  if (!article) {
    return (
      <main className="min-h-screen bg-black">
        <Navigation />
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-2xl text-white">article not found</h1>
            <Link href="/thinking" className="font-sans text-sm text-white/50 transition-colors hover:text-white">
              back to thinking
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      <article className="mx-auto max-w-2xl px-6 pb-24 pt-32">
        <header className="mb-12">
          <Link href="/thinking" className="mb-8 inline-block font-sans text-xs text-white/30 transition-colors hover:text-white/60">
            ← back to thinking
          </Link>
          <p className="mb-4 font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-white/40">
            {formatDate(article.date)}
          </p>
          <h1 className="font-serif text-3xl font-normal leading-tight text-white md:text-4xl">
            {article.title}
          </h1>
        </header>

        <div className="prose prose-invert max-w-none">
          {article.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="mb-6 font-sans text-base leading-relaxed text-white/70">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {/* Footer */}
      <footer className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/thinking" className="font-sans text-xs text-white/30 transition-colors hover:text-white/60">
          all articles
        </Link>
        <p className="font-sans text-xs text-white/20">
          © {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  )
}
