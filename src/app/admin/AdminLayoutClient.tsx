'use client'
import { ReactNode, useEffect } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'

export default function AdminLayoutClient({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add('admin-page')
    return () => {
      document.body.classList.remove('admin-page')
    }
  }, [])

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
