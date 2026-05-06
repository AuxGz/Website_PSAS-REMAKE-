import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default async function ProductsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user: authUser } } = await supabase.auth.getUser()

  // Ambil profil lengkap dari Prisma untuk cek role
  const user = authUser ? await prisma.profile.findUnique({
    where: { userId: authUser.id }
  }) : null

  // Ambil data produk (untuk saat ini mungkin masih kosong)
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation / Header */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex items-center justify-center transition-transform group-hover:scale-110">
                <Image
                  src="/icons/icons-120x40.jpg"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight">SUMMIT<span className="text-zinc-500">X</span>GEAR</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search gear..."
                  className="w-64 rounded-full border border-white/10 bg-white/5 py-2 pl-4 pr-10 text-sm transition-all focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
                <svg className="absolute right-3 top-2.5 h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 border border-white/10" />
                </div>
              ) : (
                <Link href="/login" className="text-sm font-medium hover:text-zinc-300">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Hero/Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our Collection</h1>
          <p className="max-w-2xl text-lg text-zinc-400">
            Explore our curated selection of premium outdoor equipment, designed for the most demanding environments on Earth.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="mb-10 flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {['All Gear', 'Tents', 'Backpacks', 'Apparel', 'Footwear', 'Accessories'].map((cat, i) => (
            <button
              key={cat}
              className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium transition-all ${i === 0 ? 'bg-white text-black' : 'border border-white/10 bg-white/5 hover:bg-white/10'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                {/* Product Card Visual Placeholder */}
                <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 transition-all group-hover:border-white/20">
                  {/* Image goes here */}
                  <div className="flex h-full w-full items-center justify-center text-zinc-800">
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="text-lg font-medium text-white">{product.name}</h3>
                  <p className="text-sm text-zinc-500">{product.category.name}</p>
                  <p className="text-lg font-bold">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State (Mewah) */
          <div className="flex flex-col items-center justify-center rounded-[3rem] border border-white/5 bg-white/[0.02] py-32 text-center backdrop-blur-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-zinc-600">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white">No products found</h3>
            <p className="mt-2 max-w-xs text-zinc-500">
              We're currently preparing our new collection. Check back soon for premium outdoor gear.
            </p>
            {user?.role === 'ADMIN' && (
              <Link href="/admin/products/new" className="mt-8 rounded-full bg-white px-8 py-3 text-sm font-bold text-black hover:bg-zinc-200">
                Add First Product
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
