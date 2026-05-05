import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user: authUser } } = await supabase.auth.getUser()

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar Simple */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          <Link href="/products" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Catalog
          </Link>
          <div className="text-sm font-bold tracking-widest opacity-50 uppercase">{product.category.name}</div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">

          {/* Left: Product Visuals */}
          <div className="space-y-6">
            <div className="aspect-square w-full overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/5 relative group">
              {/* PLACEHOLDER UNTUK 360 VIEW / IMAGE */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700">
                <svg className="mb-4 h-24 w-24 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {product.has360View && (
                  <div className="rounded-full bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 border border-white/10">
                    360° View Available
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Mockups */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-2xl bg-zinc-900 border border-white/5" />
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-white">Rp {Number(product.price).toLocaleString('id-ID')}</span>
                {product.stock > 0 ? (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500 border border-emerald-500/20 uppercase tracking-tighter">In Stock ({product.stock})</span>
                ) : (
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500 border border-red-500/20 uppercase tracking-tighter">Out of Stock</span>
                )}
              </div>
            </div>

            <p className="text-lg text-zinc-400 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Action Buttons */}
            <div className="grid gap-4 sm:grid-cols-2 mb-12">
              <button className="flex h-16 items-center justify-center rounded-2xl bg-white text-lg font-bold text-black hover:bg-zinc-200 transition-all active:scale-[0.98]">
                Add to Cart
              </button>
              <button className="flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-bold hover:bg-white/10 transition-all active:scale-[0.98]">
                Add to Wishlist
              </button>
            </div>

            {/* Specs Table */}
            <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">Technical Specifications</h3>
              <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-8">
                <div className="border-b border-white/5 pb-4">
                  <dt className="text-sm text-zinc-500 mb-1">Weight</dt>
                  <dd className="font-medium text-white">{product.weight} grams</dd>
                </div>
                <div className="border-b border-white/5 pb-4">
                  <dt className="text-sm text-zinc-500 mb-1">Category</dt>
                  <dd className="font-medium text-white">{product.category.name}</dd>
                </div>
                <div className="border-b border-white/5 pb-4 sm:border-0">
                  <dt className="text-sm text-zinc-500 mb-1">SKU</dt>
                  <dd className="font-medium text-white uppercase tracking-tighter">{product.slug.slice(0, 8)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-zinc-500 mb-1">Availability</dt>
                  <dd className="font-medium text-white">Ready to Ship</dd>
                </div>
              </dl>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
