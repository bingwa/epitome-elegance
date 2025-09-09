import { Metadata } from 'next'
import { CheckoutPage } from '@/components/checkout/CheckoutPage'

// This file is a Server Component, so exporting metadata is allowed.
export const metadata: Metadata = {
  title: 'Secure Checkout | Epitome Elegance',
  description: 'Complete your purchase securely with M-Pesa.',
}

export default function Page() {
  // This Server Component renders the Client Component below.
  return <CheckoutPage />
}
