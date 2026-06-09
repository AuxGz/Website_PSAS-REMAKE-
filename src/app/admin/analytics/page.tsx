import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { Suspense } from 'react'
import UserNav from '@/components/UserNav'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'

export const metadata = {
  title: 'Transaction Analytics | SummitXGear Admin',
  description: 'Financial overview and transaction volume insights for SummitXGear.',
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function AnalyticsPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user: authUser } } = await supabase.auth.getUser()

  const user = authUser ? await prisma.profile.findUnique({
    where: { userId: authUser.id }
  }) : null

  if (user?.role !== 'ADMIN') {
    redirect('/')
  }

  // ─── Filter Logic ───
  const filter = (searchParams.filter as string) || 'Last 7 Days'
  const now = new Date()
  let daysToFetch = 7
  let rangeStart = new Date(now)

  if (filter === 'Today') {
    daysToFetch = 1
    rangeStart.setHours(0, 0, 0, 0)
  } else if (filter === 'Last 30 Days') {
    daysToFetch = 30
    rangeStart.setDate(rangeStart.getDate() - 29)
    rangeStart.setHours(0, 0, 0, 0)
  } else if (filter === 'This Month') {
    daysToFetch = now.getDate() // e.g. if today is 15th, fetch 15 days
    rangeStart = new Date(now.getFullYear(), now.getMonth(), 1)
  } else {
    // Default: Last 7 Days
    daysToFetch = 8 // to match original 8 data points request
    rangeStart.setDate(rangeStart.getDate() - 7)
    rangeStart.setHours(0, 0, 0, 0)
  }

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // ─── Optimized Cached Data Fetch ───
  // We use unstable_cache to cache the expensive DB aggregations.
  // The cache key automatically includes the stringified arguments (rangeStartStr).
  const getCachedAnalytics = unstable_cache(
    async (rangeStartStr: string) => {
      const rs = new Date(rangeStartStr)
      return Promise.all([
        // Aggregate for the selected period
        prisma.order.aggregate({
          _sum: { totalAmount: true },
          _count: true,
          where: {
            status: { in: ['PAID', 'PROCESSING'] },
            createdAt: { gte: rs },
          },
        }),
        // Orders for chart
        prisma.order.findMany({
          where: {
            status: { in: ['PAID', 'PROCESSING'] },
            createdAt: { gte: rs },
          },
          select: {
            totalAmount: true,
            createdAt: true,
            paymentMethod: true,
          },
          orderBy: { createdAt: 'asc' },
        }),
      ])
    },
    ['analytics-dashboard-data'],
    { revalidate: 60, tags: ['orders'] } // Revalidate every 60 seconds or on 'orders' tag invalidation
  )

  const [periodStats, recentOrders] = await getCachedAnalytics(rangeStart.toISOString())

  // ─── Build daily data ───
  const dailyMap = new Map<string, { volume: number; count: number }>()

  // Initialize days with zeros
  for (let i = daysToFetch - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
    dailyMap.set(key, { volume: 0, count: 0 })
  }

  // Accumulate actual order data
  for (const order of recentOrders) {
    const d = new Date(order.createdAt)
    const key = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
    const existing = dailyMap.get(key)
    if (existing) {
      existing.volume += Number(order.totalAmount)
      existing.count += 1
    }
  }

  const dailyData = Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    volume: data.volume,
    count: data.count,
  }))

  const totalVolume = Number(periodStats._sum.totalAmount || 0)
  const totalTransactions = periodStats._count || 0

  // ─── Date range label ───
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let dateRangeLabel = ''
  if (filter === 'Today') {
    dateRangeLabel = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
  } else {
    dateRangeLabel = `${rangeStart.getDate()} ${months[rangeStart.getMonth()]} - ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 md:h-20 items-center justify-between">
            <Link href="/" className="group flex items-center justify-center transition-transform hover:scale-110">
              <span className="text-xl font-serif italic tracking-tighter">SummitXGear</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-xs tracking-[0.15em] uppercase font-bold border border-white/10 px-4 py-2 rounded-full text-zinc-300 hover:text-white hover:border-white/30 transition-all duration-500"
              >
                View Shop
              </Link>
              <Suspense fallback={<div className="h-8 w-20 animate-pulse bg-white/5 rounded-full" />}>
                <UserNav />
              </Suspense>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Main ─── */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        {/* Breadcrumb + Title */}
        <div className="mb-12 space-y-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Dashboard
          </Link>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight">
            Transaction <span className="font-serif italic">Analytics.</span>
          </h1>
          <p className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold">
            Financial overview &amp; volume insights
          </p>
        </div>

        {/* Dashboard */}
        <AnalyticsDashboard
          totalVolume={totalVolume}
          totalTransactions={totalTransactions}
          dailyData={dailyData}
          dateRangeLabel={dateRangeLabel}
        />
      </main>

      {/* ─── Footer ─── */}
      <footer className="mt-32 py-12 border-t border-white/5 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-zinc-600">
          SummitX Systems — Transaction Analytics
        </p>
      </footer>
    </div>
  )
}
