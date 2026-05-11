import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import UserNav from '@/components/UserNav'
import { Suspense } from 'react'

export default async function OrdersPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      orders: {
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  images: { where: { type: 'THUMBNAIL' }, take: 1 }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!profile) return redirect('/login')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-secondary bg-secondary/10'
      case 'PENDING': return 'text-amber-500 bg-amber-500/10'
      case 'PROCESSING': return 'text-blue-500 bg-blue-500/10'
      case 'CANCELLED': return 'text-red-500 bg-red-500/10'
      default: return 'text-zinc-500 bg-zinc-500/10'
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
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

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        <div className="mb-12 space-y-4">
          <Link href="/profile" className="group flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-zinc-500 hover:text-white transition-colors mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1"><path d="m15 18-6-6 6-6" /></svg>
            Back to Profile
          </Link>
          <h1 className="text-4xl md:text-6xl font-light italic tracking-tight">Order <span className="font-serif">History.</span></h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 font-bold">Track your premium gear acquisitions</p>
        </div>

        <div className="space-y-8">
          {profile.orders.length === 0 ? (
            <Card className="py-20 text-center space-y-6" hover={false}>
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center text-zinc-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m20 10-6.07-1.19L12 3 9.07 8.81 3 10l4.5 4.5L6.21 21 12 17.27 17.79 21l-1.29-6.5L22 10z"/></svg>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium italic">No orders found</h3>
                <p className="text-sm text-zinc-500 font-light max-w-xs mx-auto leading-relaxed">Your journey has just begun. Explore our collection to find your first gear.</p>
              </div>
              <Link href="/products" className="inline-block h-12 px-8 rounded-xl bg-secondary text-white text-[10px] tracking-[0.3em] uppercase font-bold hover:scale-105 active:scale-95 transition-all">
                Shop Now
              </Link>
            </Card>
          ) : (
            profile.orders.map((order) => (
              <Card key={order.id} className="overflow-hidden border-white/5 hover:border-secondary/20 transition-all duration-500" hover={false}>
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
                  <div className="space-y-1">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-zinc-500 font-bold">Order ID</p>
                    <p className="text-sm font-mono text-zinc-300">{order.midtransOrderId || order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="space-y-1 md:text-center">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-zinc-500 font-bold">Date</p>
                    <p className="text-sm text-zinc-300">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="space-y-1 md:text-right">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-zinc-500 font-bold">Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-2">
                      <div className="h-16 w-16 rounded-xl bg-primary/30 border border-white/5 overflow-hidden flex-shrink-0">
                        {item.product.images[0] ? (
                          <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-zinc-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                        <p className="text-xs text-zinc-500 font-light">Qty: {item.quantity} × Rp {Number(item.price).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-bold">Total Payment</span>
                    <span className="text-xl font-bold text-white">Rp {Number(order.totalAmount).toLocaleString('id-ID')}</span>
                  </div>
                  
                  {order.status === 'PENDING' && order.midtransToken && (
                    <Link 
                      href={`/checkout/pending?order_id=${order.midtransOrderId}`}
                      className="h-10 px-6 rounded-xl border border-secondary text-secondary text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-secondary hover:text-white transition-all flex items-center justify-center"
                    >
                      Complete Payment
                    </Link>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      <footer className="mt-32 py-12 border-t border-white/5 text-center">
        <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-700">SummitXGear — Defined by Excellence</p>
      </footer>
    </div>
  )
}
