import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AddToCartButton from '@/components/AddToCartButton'
import UserNav from '@/components/UserNav'
import { Suspense } from 'react'
import ProductGallery from '@/components/ProductGallery'

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user: authUser } } = await supabase.auth.getUser()

  const product = await prisma.product.findUnique({
    where: { slug: slug },
    include: { 
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar Simple */}
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          <Link href="/products" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-secondary transition-colors">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Catalog
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-sm font-bold tracking-widest opacity-50 uppercase text-accent">{product.category.name}</div>
            <Suspense fallback={<div className="h-8 w-20 animate-pulse bg-white/5 rounded-full" />}>
              <UserNav />
            </Suspense>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">

          {/* Left: Product Visuals (Interactive Gallery) */}
          <ProductGallery 
            images={product.images} 
            productName={product.name} 
            has360View={product.has360View} 
          />

          {/* Right: Product Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-accent">Rp {Number(product.price).toLocaleString('id-ID')}</span>
                {product.stock > 0 ? (
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary border border-secondary/20 uppercase tracking-tighter">In Stock ({product.stock})</span>
                ) : (
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500 border border-red-500/20 uppercase tracking-tighter">Out of Stock</span>
                )}
              </div>
            </div>

            <p className="text-lg text-zinc-400 leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="flex flex-col gap-4 mb-12 max-w-sm">
              <AddToCartButton productId={product.id} variant="full" />
            </div>


            {/* Specs Table */}
            <div className="rounded-3xl border border-white/5 bg-primary/20 p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">Technical Specifications</h3>
              <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-8">
                <div className="border-b border-white/5 pb-4">
                  <dt className="text-sm text-zinc-500 mb-1">Weight</dt>
                  <dd className="font-medium text-foreground">{product.weight} grams</dd>
                </div>
                <div className="border-b border-white/5 pb-4">
                  <dt className="text-sm text-zinc-500 mb-1">Category</dt>
                  <dd className="font-medium text-foreground">{product.category.name}</dd>
                </div>
                <div className="border-b border-white/5 pb-4 sm:border-0">
                  <dt className="text-sm text-zinc-500 mb-1">SKU</dt>
                  <dd className="font-medium text-foreground uppercase tracking-tighter">{product.slug.slice(0, 8)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-zinc-500 mb-1">Availability</dt>
                  <dd className="font-medium text-foreground">Ready to Ship</dd>
                </div>
              </dl>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
