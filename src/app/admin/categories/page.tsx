import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function AdminCategoriesPage() {
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

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  async function createCategory(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const slug = name.toLowerCase().replace(/ /g, '-')

    await prisma.category.create({
      data: { name, slug, description }
    })

    revalidatePath('/admin/categories')
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Categories</h1>
            <p className="mt-2 text-zinc-500">Organize your products by creating and managing categories.</p>
          </div>
          <Link href="/admin/products/new" className="rounded-xl border border-white/10 bg-primary/40 px-6 py-3 text-sm font-medium hover:bg-primary/60 transition-all">
            Go to Add Product
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Tambah Kategori */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-white/5 bg-primary/30 p-6 backdrop-blur-xl">
              <h2 className="mb-6 text-xl font-semibold">New Category</h2>
              <form action={createCategory} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Category Name</label>
                  <input name="name" required type="text" placeholder="e.g. Tents" className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm focus:border-secondary/30 focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Description</label>
                  <textarea name="description" rows={3} placeholder="Brief description..." className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm focus:border-secondary/30 focus:outline-none resize-none"></textarea>
                </div>
                <button type="submit" className="w-full rounded-xl bg-secondary py-3 text-sm font-bold text-white hover:bg-secondary/80 transition-colors shadow-lg shadow-secondary/10">
                  Add Category
                </button>
              </form>
            </div>
          </div>

          {/* List Kategori */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-white/5 bg-primary/20 backdrop-blur-xl">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/5 bg-white/5 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{cat.name}</div>
                        <div className="text-xs text-zinc-500">{cat.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-zinc-500 hover:text-red-400 transition-colors">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
