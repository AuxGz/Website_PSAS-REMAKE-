import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddToCartButton from '@/components/AddToCartButton'
import UserNav from '@/components/UserNav'
import { Suspense } from 'react'
import ProductGallery from '@/components/ProductGallery'
import { unstable_cache } from 'next/cache'
import ReviewSection from '@/components/ReviewSection'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

const getCachedProduct = unstable_cache(
  async (slug: string) => {
    return prisma.product.findUnique({
      where: { slug },
      include: { 
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        reviews: {
          include: {
            profile: {
              select: { id: true, fullName: true, avatarUrl: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  },
  ['product-detail'],
  { revalidate: 60, tags: ['products'] }
);

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await getCachedProduct(slug);

  if (!product) {
    notFound()
  }

  // Get current user profile for review ownership and check purchase status
  let currentProfileId: string | null = null;
  let hasPurchased = false;
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const profile = await prisma.profile.findUnique({
        where: { userId: user.id },
        select: { 
          id: true,
          orders: {
            where: {
              status: { in: ['PAID', 'PROCESSING'] },
              orderItems: {
                some: {
                  productId: product.id
                }
              }
            },
            take: 1,
            select: { id: true }
          }
        }
      });
      if (profile) {
        currentProfileId = profile.id;
        hasPurchased = profile.orders.length > 0;
      }
    }
  } catch {}

  // Calculate average rating
  const reviews = (product.reviews || []).map(r => ({
    ...r,
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : r.createdAt.toISOString(),
  }));
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar Simple */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 md:h-20 items-center justify-between">
          <Link href="/products" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-secondary transition-colors">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden md:inline">Back to Catalog</span>
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
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-3xl font-black text-accent">Rp {Number(product.price).toLocaleString('id-ID')}</span>
                {product.stock > 0 ? (
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary border border-secondary/20 uppercase tracking-tighter">In Stock ({product.stock})</span>
                ) : (
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500 border border-red-500/20 uppercase tracking-tighter">Out of Stock</span>
                )}
              </div>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} className="w-4 h-4" viewBox="0 0 24 24" fill={star <= Math.round(averageRating) ? '#f59e0b' : 'none'} stroke={star <= Math.round(averageRating) ? '#f59e0b' : '#52525b'} strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-amber-500">{averageRating.toFixed(1)}</span>
                  <span className="text-sm text-zinc-500">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </div>
              )}
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

        {/* Reviews Section */}
        <div className="mt-16">
          <ReviewSection
            productId={product.id}
            reviews={reviews}
            currentProfileId={currentProfileId}
            averageRating={averageRating}
            hasPurchased={hasPurchased}
          />
        </div>
      </main>
    </div>
  )
}
