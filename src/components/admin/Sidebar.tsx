'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Package, Warehouse, ShoppingCart, 
  DollarSign, LogOut, Store 
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Inventory', href: '/admin/inventory', icon: Warehouse },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Payouts', href: '/admin/payouts', icon: DollarSign },
]

export default function Sidebar() {
  const pathname = usePathname()
  
  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    window.location.href = '/admin-login'
  }
  
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center space-x-2">
          <Store className="w-8 h-8" />
          <div>
            <h1 className="font-display text-xl font-bold">Epitome Elegance</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 sidebar-scroll overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg
                transition-all duration-200 font-display
                ${isActive 
                  ? 'bg-gray-800 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      
      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full
                     text-gray-300 hover:bg-red-900 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-display">Logout</span>
        </button>
      </div>
    </div>
  )
}
