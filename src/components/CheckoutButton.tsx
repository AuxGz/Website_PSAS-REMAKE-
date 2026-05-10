'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CheckoutButtonProps {
  addressId: string
  shippingCost?: number
  disabled?: boolean
}

declare global {
  interface Window {
    snap: any
  }
}

export default function CheckoutButton({ addressId, shippingCost = 0, disabled }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCheckout = async () => {
    if (!addressId) {
      setError('Pilih alamat pengiriman terlebih dahulu')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId, shippingCost })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Checkout gagal')
        setLoading(false)
        return
      }

      // Open Midtrans Snap popup
      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: () => {
            router.push('/checkout/success')
          },
          onPending: () => {
            router.push('/checkout/pending')
          },
          onError: () => {
            setError('Pembayaran gagal. Silakan coba lagi.')
            setLoading(false)
          },
          onClose: () => {
            setLoading(false)
          }
        })
      } else {
        // Fallback: redirect to Midtrans payment page
        window.location.href = data.redirectUrl
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleCheckout}
        disabled={loading || disabled}
        className="w-full h-16 rounded-2xl bg-secondary text-white text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 shadow-2xl shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          'Pay with Midtrans'
        )}
      </button>

      {error && (
        <p className="text-red-400 text-xs text-center font-medium animate-in fade-in duration-300">{error}</p>
      )}
    </div>
  )
}
