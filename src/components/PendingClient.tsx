'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Script from 'next/script'

interface PendingClientProps {
  orderId: string | null
  snapUrl: string
  clientKey: string
}

export default function PendingClient({ orderId, snapUrl, clientKey }: PendingClientProps) {
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (orderId) {
      fetchOrderToken(orderId)
    }
  }, [orderId])

  const fetchOrderToken = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`)
      const data = await res.json()
      if (data.token) {
        setToken(data.token)
      }
    } catch (err) {
      console.error('Failed to fetch order token', err)
    }
  }

  const handlePay = () => {
    if (window.snap && token) {
      window.snap.pay(token, {
        onSuccess: () => router.push('/checkout/success'),
        onPending: () => router.refresh(),
        onError: () => alert('Payment failed. Please try again from Order History.'),
      })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Script
        src={snapUrl}
        data-client-key={clientKey}
        strategy="afterInteractive"
      />
      
      <Card className="max-w-md w-full p-8 text-center space-y-6" hover={false}>
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        
        <div>
          <h1 className="text-3xl font-light italic mb-2">Payment Pending</h1>
          <p className="text-zinc-500 text-sm font-light leading-relaxed">
            We are waiting for your payment to be completed. If you closed the payment window, you can reopen it below to see instructions.
          </p>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-3">
          {token ? (
            <button 
              onClick={handlePay}
              className="block w-full rounded-xl bg-secondary text-white py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-secondary/20"
            >
              Pay Now / Show Instructions
            </button>
          ) : (
             <div className="py-4 text-[10px] tracking-[0.2em] uppercase text-zinc-600 font-bold animate-pulse">
                Loading Payment Data...
             </div>
          )}
          
          <Link href="/orders" className="block w-full rounded-xl bg-white/5 border border-white/10 py-4 text-[10px] tracking-[0.3em] uppercase font-bold text-zinc-300 hover:bg-white/10 transition-all">
            Check Order Status
          </Link>
          <Link href="/products" className="block w-full rounded-xl border border-white/10 py-4 text-[10px] tracking-[0.3em] uppercase font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
            Continue Shopping
          </Link>
        </div>
      </Card>
    </div>
  )
}
