'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'react-hot-toast'

interface WishlistItem {
  productId: string
  name: string
  price: number
  image: string
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items
        const existingItem = items.find(item => item.productId === newItem.productId)

        if (!existingItem) {
          set(state => ({
            items: [...state.items, newItem]
          }))
          toast.success('Added to wishlist')
        }
      },

      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(item => item.productId !== productId)
        }))
        toast.success('Removed from wishlist')
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId)
      },

      clearWishlist: () => {
        set({ items: [] })
      }
    }),
    {
      name: 'guest-wishlist-storage'
    }
  )
)
