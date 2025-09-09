import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string, currency = 'KSH') {
  const numPrice = Number(price)
  
  if (currency === 'KSH') {
    return `KSh ${numPrice.toLocaleString('en-KE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`
  }
  
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
  }).format(numPrice)
}

export function formatKSH(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE')}`
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Africa/Nairobi'
  }).format(new Date(date))
}

export function formatPhoneNumber(phone: string): string {
  // Format Kenyan phone numbers to international format
  let cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1)
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    cleaned = '254' + cleaned
  } else if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned
  }
  
  return cleaned
}

export function validateKenyanPhone(phone: string): boolean {
  const formatted = formatPhoneNumber(phone)
  return /^254[71]\d{8}$/.test(formatted)
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8)
  return `EE-${timestamp.slice(-6)}${random.toUpperCase()}`
}

export function calculateVAT(subtotal: number, vatRate = 0.16): number {
  return subtotal * vatRate
}

export function calculateShipping(subtotal: number, location: 'nairobi' | 'other' = 'other'): number {
  if (subtotal >= 5000) return 0 // Free shipping over KSh 5,000
  return location === 'nairobi' ? 200 : 400
}

export function getImageUrl(path: string, transform?: string): string {
  if (!path.startsWith('http')) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}${path}`
  }
  return path
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
