import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import UserNav from '@/components/UserNav'
import CheckoutButton from '@/components/CheckoutButton'
import AddressSelector from '@/components/AddressSelector'
import { Suspense } from 'react'
import Script from 'next/script'
import CheckoutClient from '@/components/CheckoutClient'

export default async function CheckoutPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      cartItems: {
        include: {
          product: {
            include: {
              images: { where: { type: 'THUMBNAIL' }, take: 1 }
            }
          }
        }
      },
      addresses: {
        orderBy: { isDefault: 'desc' }
      }
    }
  })

  if (!profile || profile.cartItems.length === 0) {
    return redirect('/cart')
  }

  const subtotal = profile.cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity, 0
  )
  const totalWeight = profile.cartItems.reduce(
    (acc, item) => acc + (item.product.weight || 0) * item.quantity, 0
  )

  // Midtrans Snap JS URL (sandbox)
  const snapUrl = process.env.MIDTRANS_IS_PRODUCTION === 'true'
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js'
  const clientKey = process.env.MIDTRANS_CLIENT_KEY!

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
      {/* Midtrans Snap Script — client key is safe to expose (it's public) */}
      <Script
        src={snapUrl}
        data-client-key={clientKey}
        strategy="afterInteractive"
      />

      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="group flex items-center justify-center transition-transform hover:scale-110">
              <span className="text-xl font-serif italic tracking-tighter">SummitXGear</span>
            </Link>
            <div className="flex items-center gap-4">
              <Suspense fallback={<div className="h-8 w-20 animate-pulse bg-white/5 rounded-full" />}>
                <UserNav />
              </Suspense>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="mb-12 space-y-4">
          <Link href="/cart" className="group flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-zinc-500 hover:text-white transition-colors mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1"><path d="m15 18-6-6 6-6" /></svg>
            Back to Cart
          </Link>
          <h1 className="text-4xl md:text-6xl font-light italic tracking-tight">Check<span className="font-serif">out.</span></h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 font-bold">Confirm your order and complete payment</p>
        </div>

        <CheckoutClient
          initialAddresses={profile.addresses as any}
          cartItems={profile.cartItems.map(item => ({
            ...item,
            product: {
              ...item.product,
              price: Number(item.product.price)
            }
          })) as any}
          subtotal={subtotal}
          totalWeight={totalWeight}
        />
      </main>

      <footer className="mt-32 py-12 border-t border-white/5 text-center">
        <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-700">SummitXGear — Defined by Excellence</p>
      </footer>
    </div>
  )
}
