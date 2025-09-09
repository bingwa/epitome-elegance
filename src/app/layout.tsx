import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import localFont from 'next/font/local' 
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-display'
})

const signatieFont = localFont({
  src: '../assets/fonts/Signatie.otf', // Make sure this path is correct
  display: 'swap',
  variable: '--font-logo', // Assign it to a new CSS variable --font-logo
})

export const metadata: Metadata = {
  title: 'Epitome Elegance - Luxury Fashion in Kenya',
  description: 'Discover luxury fashion at Epitome Elegance. Premium clothing, bags, shoes, and jewelry for men and women. Free shipping across Kenya on orders over KSh 5,000.',
  keywords: 'fashion, luxury, Kenya, clothing, bags, shoes, jewelry, M-Pesa, online shopping',
  authors: [{ name: 'Epitome Elegance' }],
  creator: 'Epitome Elegance',
  publisher: 'Epitome Elegance',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://epitomeelegance.co.ke',
    title: 'Epitome Elegance - Luxury Fashion in Kenya',
    description: 'Discover luxury fashion at Epitome Elegance. Premium clothing, bags, shoes, and jewelry.',
    siteName: 'Epitome Elegance',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Epitome Elegance - Luxury Fashion in Kenya',
    description: 'Discover luxury fashion at Epitome Elegance. Premium clothing, bags, shoes, and jewelry.',
    creator: '@epitomeelegance',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${signatieFont.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#f59e0b',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
