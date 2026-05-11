import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { revalidatePath } from 'next/cache'

export default async function AdminProductsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user: authUser } } = await supabase.auth.getUser()

  const user = authUser ? await prisma.profile.findUnique({
    where: { userId: authUser.id }
  }) : null

  if (user?.role !== 'ADMIN') {
    redirect('/')
  }

  const products = await prisma.product.findMany({
    include: { 
      category: true,
      images: {
        where: { type: 'THUMBNAIL' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  async function deleteProduct(formData: FormData) {
    'use server'
    const productId = formData.get('productId') as string
    await prisma.product.delete({ where: { id: productId } })
    revalidatePath('/admin/products')
    revalidatePath('/products')
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Link href="/admin" className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
            <p className="mt-2 text-zinc-500 text-sm font-light">Inventory control and product listings.</p>
          </div>
          <Link href="/admin/products/new" className="h-14 px-8 rounded-2xl bg-secondary text-white text-[10px] tracking-[0.3em] uppercase font-bold flex items-center justify-center hover:bg-secondary/80 transition-all shadow-lg shadow-secondary/20">
            Add New Gear
          </Link>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-primary/20 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/5 bg-white/5 text-[10px] tracking-[0.2em] uppercase text-zinc-500">
                <tr>
                  <th className="px-8 py-5 font-bold">Product</th>
                  <th className="px-8 py-5 font-bold">Category</th>
                  <th className="px-8 py-5 font-bold">Price</th>
                  <th className="px-8 py-5 font-bold">Stock</th>
                  <th className="px-8 py-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/40 border border-white/5 overflow-hidden flex-shrink-0">
                          {product.images[0] ? (
                            <Image src={product.images[0].url} alt={product.name} width={48} height={48} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-zinc-700">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{product.name}</div>
                          <div className="text-xs text-zinc-500 font-light tracking-tight">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] uppercase font-bold text-accent">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-medium">
                      Rp {Number(product.price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? 'bg-secondary' : 'bg-red-500'}`} />
                        {product.stock} Units
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-zinc-500 hover:text-secondary transition-colors" title="Edit Product">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </Link>
                        <Link href={`/products/${product.slug}`} className="p-2 text-zinc-500 hover:text-white transition-colors" title="View Product">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </Link>
                        <form action={deleteProduct}>
                          <input type="hidden" name="productId" value={product.id} />
                          <button type="submit" className="p-2 text-zinc-500 hover:text-red-500 transition-colors" title="Delete Product">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-zinc-500 font-light italic">No products found in the collection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
