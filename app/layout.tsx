import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display, Silkscreen } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { PageTransitionProvider, TransitionOverlay } from '@/components/page-transition'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-serif" });
const silkscreen = Silkscreen({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-pixel" });

export const metadata: Metadata = {
  title: 'sam sauer — developer & photographer',
  description: 'developer and photographer building digital products at krekeny. based in germany.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${playfair.variable} ${silkscreen.variable} bg-background`}>
      <body className="font-sans antialiased">
        <PageTransitionProvider>
          <TransitionOverlay />
          {children}
        </PageTransitionProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
