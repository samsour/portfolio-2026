import { Navigation } from "@/components/navigation"
import Link from "next/link"

export const metadata = {
  title: "trips — sam sauer",
  description: "photo collections from my travels",
}

// placeholder trips - you'll replace these with your actual trips
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

export default function TripsPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      <div className="px-6 pb-24 pt-32 md:px-16 lg:px-24">
        <header className="mb-16">
          <p className="mb-4 font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-white/40">
            photo collections
          </p>
          <h1 className="font-serif text-4xl font-normal text-white md:text-5xl">
            trips
          </h1>
        </header>

        <div className="grid gap-12 md:gap-16">
          {trips.map((trip) => (
            <Link
              key={trip.slug}
              href={`/trips/${trip.slug}`}
              className="group block border-b border-white/10 pb-12 transition-colors hover:border-white/30 md:pb-16"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="mb-2 font-serif text-2xl font-normal text-white transition-opacity group-hover:opacity-80 md:text-3xl">
                    {trip.title}
                  </h2>
                  <p className="font-sans text-sm text-white/40">
                    {trip.location}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <span className="font-[family-name:var(--font-pixel)] text-[10px] text-white/30">
                    {trip.imageCount} photos
                  </span>
                  <span className="font-sans text-sm text-white/50">
                    {trip.year}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {trips.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-sans text-sm text-white/40">
              no trips yet. check back soon.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black via-black/80 to-transparent px-6 py-6 md:px-12">
        <Link href="/" className="font-sans text-xs text-white/30 transition-colors hover:text-white/60">
          back home
        </Link>
        <p className="font-sans text-xs text-white/20">
          © {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  )
}
