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
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Link href="/admin" className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-light italic tracking-tight">Category <span className="font-serif">Organization.</span></h1>
            <p className="mt-2 text-zinc-500 text-[10px] tracking-[0.4em] uppercase font-bold">Structure your luxury catalog</p>
          </div>
          <Link href="/admin/products" className="h-14 px-8 rounded-2xl border border-white/5 text-zinc-500 flex items-center justify-center text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-white/5 hover:text-white transition-all duration-500">
            View All Products
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Form Tambah Kategori */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-[2rem] border border-white/5 bg-primary/30 p-8 backdrop-blur-xl shadow-2xl">
              <h2 className="mb-8 text-[10px] tracking-[0.3em] uppercase font-bold text-secondary border-b border-white/5 pb-4">New Category</h2>
              <form action={createCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500">Category Name</label>
                  <input name="name" required type="text" placeholder="e.g. Tents" className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm focus:border-secondary/30 focus:outline-none placeholder:text-zinc-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500">Description</label>
                  <textarea name="description" rows={3} placeholder="Brief description..." className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm focus:border-secondary/30 focus:outline-none resize-none placeholder:text-zinc-700"></textarea>
                </div>
                <button type="submit" className="w-full rounded-xl bg-secondary py-4 text-[10px] tracking-[0.3em] uppercase font-bold text-white hover:bg-secondary/80 transition-all shadow-lg shadow-secondary/10 active:scale-95">
                  Add Category
                </button>
              </form>
            </div>
          </div>

          {/* List Kategori */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-primary/20 backdrop-blur-xl">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/5 bg-white/5 text-[10px] tracking-[0.2em] uppercase text-zinc-500">
                  <tr>
                    <th className="px-8 py-5 font-bold">Name</th>
                    <th className="px-8 py-5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-medium text-foreground">{cat.name}</div>
                        <div className="text-xs text-zinc-500 font-light tracking-tight">{cat.slug}</div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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

