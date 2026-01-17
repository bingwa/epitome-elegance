import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  // This layout overrides the root layout for /admin-login
  // No Header, No Footer, No CartDrawer
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  )
}
