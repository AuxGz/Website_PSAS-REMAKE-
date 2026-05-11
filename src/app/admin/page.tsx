import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import UserNav from '@/components/UserNav'
import { Suspense } from 'react'

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user: authUser } } = await supabase.auth.getUser()

  const user = authUser ? await prisma.profile.findUnique({
    where: { userId: authUser.id }
  }) : null

  if (user?.role !== 'ADMIN') {
    redirect('/')
  }

  const [productCount, categoryCount, orderCount, totalRevenue] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'PAID' }
    })
  ])

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">
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
          <h1 className="text-4xl md:text-6xl font-light italic tracking-tight">Admin <span className="font-serif">Dashboard.</span></h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 font-bold">Manage your outdoor luxury empire</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="flex flex-col justify-center space-y-2" hover={false}>
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold">Total Revenue</h3>
            <p className="text-3xl font-light italic text-secondary">
              Rp {Number(totalRevenue._sum.totalAmount || 0).toLocaleString('id-ID')}
            </p>
          </Card>
          <Card className="flex flex-col justify-center space-y-2" hover={false}>
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold">Total Orders</h3>
            <p className="text-3xl font-light italic">{orderCount}</p>
          </Card>
          <Card className="flex flex-col justify-center space-y-2" hover={false}>
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold">Products</h3>
            <p className="text-3xl font-light italic">{productCount}</p>
          </Card>
          <Card className="flex flex-col justify-center space-y-2" hover={false}>
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold">Categories</h3>
            <p className="text-3xl font-light italic">{categoryCount}</p>
          </Card>
        </div>

        {/* Management Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/admin/products/new" className="group">
            <Card className="h-full flex flex-col justify-between p-8 border-white/5 bg-primary/20 hover:bg-secondary/5 hover:border-secondary/20 transition-all duration-500">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 15h2m-1-1v2m-6 3h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/></svg>
                </div>
                <h3 className="text-2xl font-light italic">Product Management</h3>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">Create new gear, update pricing, manage stock levels, and upload 360° views.</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-secondary group-hover:translate-x-2 transition-transform">
                Go to Products <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </div>
            </Card>
          </Link>

          <Link href="/admin/categories" className="group">
            <Card className="h-full flex flex-col justify-between p-8 border-white/5 bg-primary/20 hover:bg-accent/5 hover:border-accent/20 transition-all duration-500">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </div>
                <h3 className="text-2xl font-light italic">Category Organization</h3>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">Organize your catalog by creating and managing equipment categories.</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-accent group-hover:translate-x-2 transition-transform">
                Manage Categories <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </div>
            </Card>
          </Link>

          <Link href="/admin/orders" className="group">
            <Card className="h-full flex flex-col justify-between p-8 border-white/5 bg-primary/20 hover:bg-yellow-500/5 hover:border-yellow-500/20 transition-all duration-500">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </div>
                <h3 className="text-2xl font-light italic">Order Fulfillment</h3>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">Track customer orders, manage statuses, and oversee business transactions.</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-yellow-500 group-hover:translate-x-2 transition-transform">
                View Orders <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </div>
            </Card>
          </Link>
        </div>
      </main>

      <footer className="mt-32 py-12 border-t border-white/5 text-center">
        <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-700">SummitX Systems — Administrative Authority</p>
      </footer>
    </div>
  )
}
