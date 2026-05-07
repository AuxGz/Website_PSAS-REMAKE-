import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewProductPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user: authUser } } = await supabase.auth.getUser()

  // Keamanan: Hanya Admin yang boleh masuk
  const user = authUser ? await prisma.profile.findUnique({
    where: { userId: authUser.id }
  }) : null

  if (user?.role !== 'ADMIN') {
    redirect('/')
  }

  const categories = await prisma.category.findMany()

  async function createProduct(formData: FormData) {
    'use server'
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const weight = parseInt(formData.get('weight') as string)
    const categoryId = formData.get('categoryId') as string
    const has360View = formData.get('has360View') === 'on'

    const slug = name.toLowerCase().replace(/ /g, '-')

    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        weight,
        categoryId,
        has360View,
      }
    })

    redirect('/products')
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/products" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-secondary transition-colors">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Catalog
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="mt-2 text-zinc-500">Fill in the details to add a new item to the SummitXGear collection.</p>
        </div>

        <form action={createProduct} className="space-y-8 rounded-3xl border border-white/5 bg-primary/30 p-8 backdrop-blur-xl shadow-2xl">
          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold border-b border-white/5 pb-2 text-accent">Basic Information</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Product Name</label>
                <input name="name" required type="text" placeholder="e.g. Summit Elite X1" className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm focus:border-secondary/30 focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Category</label>
                <select name="categoryId" required className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm focus:border-secondary/30 focus:outline-none appearance-none">
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-primary">{cat.name}</option>
                  ))}
                  {categories.length === 0 && <option disabled className="bg-primary">No categories available</option>}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Description</label>
              <textarea name="description" required rows={4} placeholder="Describe the features and benefits..." className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm focus:border-secondary/30 focus:outline-none resize-none"></textarea>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold border-b border-white/5 pb-2 text-accent">Pricing & Inventory</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Price (IDR)</label>
                <input name="price" required type="number" placeholder="4500000" className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm focus:border-secondary/30 focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Stock</label>
                <input name="stock" required type="number" placeholder="10" className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm focus:border-secondary/30 focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Weight (grams)</label>
                <input name="weight" required type="number" placeholder="2400" className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm focus:border-secondary/30 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Special Features */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold border-b border-white/5 pb-2 text-accent">Special Features</h2>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input name="has360View" type="checkbox" className="h-5 w-5 rounded border-white/10 bg-background/50 text-secondary focus:ring-0 focus:ring-offset-0" />
              <span className="text-sm text-zinc-400 group-hover:text-foreground transition-colors">Enable 360° Product View</span>
            </label>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full rounded-xl bg-secondary py-4 text-sm font-bold text-white hover:bg-secondary/80 shadow-lg shadow-secondary/20 transition-colors">
              Publish Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
