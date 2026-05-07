import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'

// Caching aktif (60 detik)
export const revalidate = 60; 

/**
 * KOMPONEN UNTUK AMBIL DATA PRODUK (DIPISAH AGAR BISA STREAMING)
 * Komponen ini yang melakukan query berat ke database.
 */
async function ProductGrid({ selectedCategory }: { selectedCategory?: string }) {
  // Ambil data produk
  const products = await prisma.product.findMany({
    where: { 
      isActive: true,
      ...(selectedCategory ? { category: { slug: selectedCategory } } : {})
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[3rem] border border-white/5 bg-primary/10 py-32 text-center backdrop-blur-sm">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary/10 text-secondary">
          <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-foreground">No products found</h3>
        <p className="mt-2 max-w-xs text-zinc-500">We're currently preparing our new collection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <Link href={`/products/${product.slug}`} key={product.id} className="group relative block">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl bg-primary/20 border border-white/5 transition-all group-hover:border-secondary/20 group-hover:bg-primary/40">
            <div className="flex h-full w-full items-center justify-center text-zinc-800">
              <svg className="h-12 w-12 transition-transform group-hover:scale-110 group-hover:text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-lg font-medium text-foreground transition-colors group-hover:text-secondary">{product.name}</h3>
            <p className="text-sm text-zinc-500">{product.category.name}</p>
            <p className="text-lg font-bold text-accent">Rp {Number(product.price).toLocaleString('id-ID')}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/**
 * HALAMAN UTAMA (SHELL) - Dibuat instan tanpa await yang memblokir
 */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: selectedCategory } = await searchParams;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation - Muncul Instan */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="group flex items-center justify-center transition-transform hover:scale-110">
              <Image src="/icons/icons-120x40.jpg" alt="Logo" width={120} height={40} className="object-contain" />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium hover:text-secondary">Enter</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        {/* Header - Muncul Instan */}
        <div className="mb-8 space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Our Collection</h1>
          <p className="max-w-2xl text-zinc-400 font-light leading-relaxed">
            Explore our curated selection of premium outdoor equipment.
          </p>
        </div>

        {/* Categories & Products - Streaming menyusul belakangan */}
        <Suspense fallback={<div className="h-10 w-full animate-pulse bg-white/5 rounded-full mb-10" />}>
           <CategoryBar selectedCategory={selectedCategory} />
        </Suspense>

        <Suspense fallback={
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[4/5] rounded-3xl bg-white/5" />
                <div className="h-4 w-2/3 rounded bg-white/5" />
                <div className="h-4 w-1/3 rounded bg-white/5" />
              </div>
            ))}
          </div>
        }>
          <ProductGrid selectedCategory={selectedCategory} />
        </Suspense>
      </main>
    </div>
  );
}

// Komponen terpisah untuk Category Bar agar tidak memblokir TTFB
async function CategoryBar({ selectedCategory }: { selectedCategory?: string }) {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  
  return (
    <div className="mb-10 flex gap-3 overflow-x-auto pb-4 no-scrollbar">
      <Link 
        href="/products" 
        className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${!selectedCategory ? 'bg-secondary text-white' : 'border border-white/10 bg-primary/30'}`}
      >
        All Gear
      </Link>
      {categories.map((cat) => (
        <Link 
          key={cat.id} 
          href={`/products?category=${cat.slug}`} 
          className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${selectedCategory === cat.slug ? 'bg-secondary text-white' : 'border border-white/10 bg-primary/30'}`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
