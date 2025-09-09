'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'react-hot-toast'

interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  price: number
  image: string
  size?: string
  color?: string
  stock: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { price: number | string; quantity?: number | string }) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const toNumber = (val: any, def: number = 0) => {
  const num = Number(val)
  return Number.isFinite(num) ? num : def
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (incoming) => {
        const items = get().items
        const price = toNumber(incoming.price, 0)
        const quantityToAdd = Math.max(1, toNumber(incoming.quantity, 1))
        const stock = Math.max(0, toNumber(incoming.stock, 99))

        const existingIndex = items.findIndex(
          (i) => i.productId === incoming.productId && i.variantId === incoming.variantId
        )

        if (existingIndex > -1) {
          const updated = [...items]
          const existing = updated[existingIndex]
          const nextQty = Math.min(existing.quantity + quantityToAdd, stock || existing.stock)
          updated[existingIndex] = { ...existing, quantity: nextQty }
          set({ items: updated })
          toast.success(`Updated ${incoming.name} in cart`)
        } else {
          const item: CartItem = {
            id: `${incoming.productId}-${incoming.variantId || 'default'}-${Date.now()}`,
            productId: incoming.productId,
            variantId: incoming.variantId,
            name: incoming.name,
            image: incoming.image,
            size: incoming.size,
            color: incoming.color,
            stock,
            price,
            quantity: Math.min(quantityToAdd, stock),
          }
          set({ items: [...items, item] })
          toast.success(`Added ${incoming.name} to cart`)
        }
      },

      removeItem: (itemId) => {
        set((s) => ({ items: s.items.filter((i) => i.id !== itemId) }))
        toast.success('Item removed from cart')
      },

      updateQuantity: (itemId, quantity) => {
        const qty = Math.max(0, toNumber(quantity, 0))
        set((s) => ({
          items: s.items
            .map((i) => (i.id === itemId ? { ...i, quantity: Math.min(qty, i.stock || 999) } : i))
            .filter((i) => i.quantity > 0),
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: 'epitome-cart-storage',
    }
  )
)

// This hook provides reactive, calculated values.
export function useCartTotals() {
  const items = useCart((s) => s.items)

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shippingCost = subtotal > 0 && subtotal < 5000 ? 500 : 0
  const tax = Math.round(subtotal * 0.16)
  const total = subtotal + shippingCost + tax

  return {
    totalItems,
    subtotal,
    shippingCost,
    tax,
    total,
    items, // Also return items for convenience
  }
}
