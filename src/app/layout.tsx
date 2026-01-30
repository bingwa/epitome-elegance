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
  src: '../assets/fonts/Signatie.otf',
  display: 'swap',
  variable: '--font-logo',
})

export const metadata: Metadata = {
  title: 'Epitome Elegance - Luxury Fashion in Kenya',
  description: 'Discover luxury fashion at Epitome Elegance.',
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
        <main className="[&_*]:!scroll-mt-24 pt-16 md:pt-20 lg:pt-24">
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
