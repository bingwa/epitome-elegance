'use client'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import localFont from 'next/font/local' 
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Toaster } from 'react-hot-toast'
import { usePathname } from 'next/navigation'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${signatieFont.variable}`}>
      <body className="font-sans antialiased">
        {!isAdmin && <Header />}
        <main className={isAdmin ? '' : '[&_*]:!scroll-mt-24 pt-16 md:pt-20 lg:pt-24'}>
          {children}
        </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <CartDrawer />}
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
