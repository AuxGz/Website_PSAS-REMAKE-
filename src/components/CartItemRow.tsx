'use client'

import { useState } from 'react'
import Image from 'next/image'
import { updateCartQuantity, removeFromCart } from '@/app/cart/actions'

interface CartItemRowProps {
  item: {
    id: string
    quantity: number
    product: {
      id: string
      name: string
      price: any
      images: { url: string }[]
    }
  }
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const [loading, setLoading] = useState(false)

  const handleUpdateQuantity = async (newQty: number) => {
    setLoading(true)
    await updateCartQuantity(item.id, newQty)
    setLoading(false)
  }

  const handleRemove = async () => {
    setLoading(true)
    await removeFromCart(item.id)
    setLoading(false)
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-[1fr,auto,auto] items-center gap-6 py-8 border-b border-white/5 transition-opacity ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Product Info (Col 1) */}
      <div className="flex items-center gap-6">
        <div className="h-24 w-24 rounded-2xl bg-primary/20 border border-white/5 overflow-hidden flex-shrink-0">
          {item.product.images?.[0] ? (
            <Image src={item.product.images[0].url} alt={item.product.name} width={96} height={96} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-zinc-700">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-medium text-white">{item.product.name}</h3>
          <p className="text-xs text-zinc-500 font-light">Unit Price: Rp {Number(item.product.price).toLocaleString('id-ID')}</p>
          <button onClick={handleRemove} className="text-[10px] tracking-widest uppercase text-red-500/60 hover:text-red-500 transition-colors mt-2 block">
            Remove
          </button>
        </div>
      </div>

      {/* Quantity Control (Col 2) */}
      <div className="w-32 flex justify-center">
        <div className="flex items-center gap-4 bg-primary/20 rounded-full px-4 py-2 border border-white/5">
          <button onClick={() => handleUpdateQuantity(item.quantity - 1)} className="text-zinc-400 hover:text-white transition-colors">−</button>
          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
          <button onClick={() => handleUpdateQuantity(item.quantity + 1)} className="text-zinc-400 hover:text-white transition-colors">+</button>
        </div>
      </div>

      {/* Total (Col 3) */}
      <div className="md:w-[180px] text-right">
        <p className="text-xl md:text-2xl font-bold text-secondary whitespace-nowrap tracking-tight">
          Rp {(Number(item.product.price) * item.quantity).toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  )
}
