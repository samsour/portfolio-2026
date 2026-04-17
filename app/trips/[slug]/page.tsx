import { Navigation } from "@/components/navigation"
import Link from "next/link"

// This will be replaced with your actual trip data
const trips: Record<string, { title: string; year: string; location: string; description: string }> = {
  "japan-2024": {
    title: "japan",
    year: "2024",
    location: "tokyo, kyoto, osaka",
    description: "two weeks exploring japan. from the neon chaos of shibuya to the quiet temples of kyoto.",
  },
  "portugal-2023": {
    title: "portugal",
    year: "2023",
    location: "lisbon, porto",
    description: "chasing light through the streets of lisbon. azulejos, pastéis de nata, and golden hour.",
  },
  "iceland-2022": {
    title: "iceland",
    year: "2022",
    location: "reykjavik, golden circle",
    description: "waterfalls, glaciers, and endless summer light. iceland in june.",
  },
}

export async function generateStaticParams() {
  return Object.keys(trips).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const trip = trips[slug]
  return {
    title: trip ? `${trip.title} — sam sauer` : "trip — sam sauer",
    description: trip?.description || "photo collection",
  }
}

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const trip = trips[slug]

  if (!trip) {
    return (
      <main className="min-h-screen bg-black">
        <Navigation />
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-2xl text-white">trip not found</h1>
            <Link href="/trips" className="font-sans text-sm text-white/50 transition-colors hover:text-white">
              back to trips
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      <div className="px-6 pb-24 pt-32 md:px-16 lg:px-24">
        <header className="mb-16">
          <Link href="/trips" className="mb-8 inline-block font-sans text-xs text-white/30 transition-colors hover:text-white/60">
            ← back to trips
          </Link>
          <p className="mb-4 font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-white/40">
            {trip.year} · {trip.location}
          </p>
          <h1 className="mb-6 font-serif text-4xl font-normal text-white md:text-5xl">
            {trip.title}
          </h1>
          <p className="max-w-xl font-sans text-base leading-relaxed text-white/50">
            {trip.description}
          </p>
        </header>

        {/* Photo grid placeholder */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] bg-white/5"
              style={{
                aspectRatio: i % 3 === 0 ? "4/5" : i % 3 === 1 ? "3/2" : "1/1",
              }}
            />
          ))}
        </div>

        <p className="mt-16 text-center font-sans text-sm text-white/30">
          photos coming soon
        </p>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/trips" className="font-sans text-xs text-white/30 transition-colors hover:text-white/60">
          all trips
        </Link>
        <p className="font-sans text-xs text-white/20">
          © {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  )
}
