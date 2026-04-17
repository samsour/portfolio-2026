import { redirect } from "next/navigation"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

export const metadata = {
  title: "photos — sam sauer",
  description: "photo collections from my travels",
}

const trips = [
  {
    slug: "japan-2024",
    title: "japan",
    year: "2024",
    location: "tokyo, kyoto, osaka",
    imageCount: 48,
  },
  {
    slug: "portugal-2023",
    title: "portugal",
    year: "2023",
    location: "lisbon, porto",
    imageCount: 32,
  },
  {
    slug: "iceland-2022",
    title: "iceland",
    year: "2022",
    location: "reykjavik, golden circle",
    imageCount: 56,
  },
]

export default function PhotosPage() {
  redirect("/")
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navigation />

      <div className="px-6 pb-24 pt-32 md:px-16 lg:px-24">
        <header className="mb-16">
          <p className="mb-4 font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-black/40 dark:text-white/40">
            photo collections
          </p>
          <h1 className="font-serif text-4xl font-normal text-black dark:text-white md:text-5xl">
            photos
          </h1>
        </header>

        <div className="grid gap-12 md:gap-16">
          {trips.map((trip) => (
            <Link
              key={trip.slug}
              href={`/photos/${trip.slug}`}
              className="group block border-b border-black/10 pb-12 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/30 md:pb-16"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="mb-2 font-serif text-2xl font-normal text-black transition-opacity group-hover:opacity-80 dark:text-white md:text-3xl">
                    {trip.title}
                  </h2>
                  <p className="font-sans text-sm text-black/40 dark:text-white/40">
                    {trip.location}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <span className="font-[family-name:var(--font-pixel)] text-[10px] text-black/30 dark:text-white/30">
                    {trip.imageCount} photos
                  </span>
                  <span className="font-sans text-sm text-black/50 dark:text-white/50">
                    {trip.year}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {trips.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-sans text-sm text-black/40 dark:text-white/40">
              no photos yet. check back soon.
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
