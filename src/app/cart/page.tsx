import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import CartItemRow from '@/components/CartItemRow'
import UserNav from '@/components/UserNav'
import { Suspense } from 'react'

export default async function CartPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      cartItems: {
        include: {
          product: {
            include: {
              images: {
                where: { type: 'THUMBNAIL' },
                take: 1
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  const cartItems = profile?.cartItems || []
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0)

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
      {/* Navbar */}
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
          <Link 
            href="/products" 
            className="group flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-zinc-500 hover:text-white transition-colors mb-6"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="transition-transform group-hover:-translate-x-1"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Continue Shopping
          </Link>
          <h1 className="text-4xl md:text-6xl font-light italic tracking-tight">Your <span className="font-serif">Cart.</span></h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 font-bold">Review your selection before adventure</p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-32 text-center" hover={false}>
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-secondary/5 text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
            <h3 className="text-2xl font-light italic">Your cart is empty</h3>
            <p className="mt-4 max-w-xs text-zinc-500 font-light leading-relaxed">
              It seems you haven't added any gear to your collection yet.
            </p>
            <Link href="/products" className="mt-10 text-[10px] tracking-[0.3em] uppercase font-bold border border-white/10 px-8 py-4 rounded-2xl hover:bg-white hover:text-black transition-all duration-500">
              Start Exploring
            </Link>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* List Items */}
            <div className="lg:col-span-2 space-y-2">
              <div className="hidden md:grid grid-cols-[1fr,auto,auto] gap-6 px-6 py-4 text-[10px] tracking-[0.3em] uppercase text-zinc-600 border-b border-white/5">
                <span>Product</span>
                <span className="w-32 text-center">Quantity</span>
                <span className="w-[120px] text-right">Total</span>
              </div>
              {cartItems.map((item: any) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-32 space-y-8" hover={false}>
                <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold border-b border-white/5 pb-6">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500 font-light">Subtotal</span>
                    <span className="text-sm font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500 font-light">Shipping</span>
                    <span className="text-sm font-medium text-secondary">Free</span>
                  </div>
                  <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-400">Estimated Total</span>
                    <span className="text-3xl font-light italic">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button className="w-full h-16 rounded-2xl bg-secondary text-white text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 shadow-2xl shadow-secondary/20">
                  Proceed to Checkout
                </button>

                <Link 
                  href="/products" 
                  className="w-full h-14 rounded-2xl border border-white/5 text-zinc-500 flex items-center justify-center text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-white/5 hover:text-white transition-all duration-500"
                >
                  Back to Catalog
                </Link>
                
                <p className="text-[9px] text-center text-zinc-600 tracking-wider">
                  Secure checkout powered by SummitX Systems
                </p>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-32 py-12 border-t border-white/5 text-center">
        <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-700">SummitXGear — Defined by Excellence</p>
      </footer>
    </div>
  )
}
