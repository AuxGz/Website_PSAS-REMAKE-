import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProductCreateForm from '@/components/admin/ProductCreateForm'

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

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  async function createProduct(formData: FormData) {
    'use server'
    
    try {
      const name = formData.get('name') as string
      const description = formData.get('description') as string
      const price = parseFloat(formData.get('price') as string)
      const stock = parseInt(formData.get('stock') as string)
      const weight = parseInt(formData.get('weight') as string)
      const categoryId = formData.get('categoryId') as string
      const has360View = formData.get('has360View') === 'on'

      const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

      const product = await prisma.product.create({
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

      // Redirect ke halaman edit agar bisa langsung upload gambar
      redirect(`/admin/products/${product.id}/edit`)
      
      return { success: true, productId: product.id }
    } catch (error: any) {
      console.error("Gagal membuat produk:", error)
      return { success: false, error: error.message }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/admin/products" className="mb-8 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors group">
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
          Back to Gear List
        </Link>

        <ProductCreateForm categories={categories} createAction={createProduct} />
      </div>
    </div>
  )
}
