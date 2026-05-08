'use client'

import { useState } from 'react'
import { addToCart } from '@/app/cart/actions'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  productId: string
  className?: string
  variant?: 'icon' | 'full'
}

export default function AddToCartButton({ productId, className, variant = 'icon' }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setLoading(true)
    const result = await addToCart(productId)
    setLoading(false)

    if (result.success) {
      // Small feedback could be added here
    } else {
      alert(result.error)
      if (result.error?.includes('logged in')) {
        router.push('/login')
      }
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleAdd}
        disabled={loading}
        className={`h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className={`w-full h-12 rounded-xl bg-secondary text-white font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-secondary/90 transition-all ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
