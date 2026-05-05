import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import prisma from '@/lib/prisma'

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // SINKRONISASI OTOMATIS: 
  // Kalau user login (dari Email, Google, dsb), pastikan datanya masuk ke tabel Prisma 'profiles'
  if (user) {
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        email: user.email,
        fullName: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatarUrl: user.user_metadata?.avatar_url || null,
      },
      create: {
        userId: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatarUrl: user.user_metadata?.avatar_url || null,
      },
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white px-4 font-sans selection:bg-zinc-500">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] h-[40%] w-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-900/10 blur-[120px]" />
      </div>

      <main className="relative z-10 flex flex-col items-center gap-8 text-center max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            SummitX<span className="text-zinc-500">Gear</span>
          </h1>
          <p className="text-xl text-zinc-400">
            Premium outdoor equipment for your next adventure.
          </p>
        </div>

        {user ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-zinc-300">Welcome back,</p>
              <p className="text-xl font-semibold text-white mt-1">{user.email}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-bold text-black transition-all hover:bg-zinc-200 active:scale-[0.98]"
              >
                Browse Catalog
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-transparent px-8 text-sm font-bold text-white transition-all hover:bg-white/5 active:scale-[0.98]"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-bold text-black transition-all hover:bg-zinc-200 active:scale-[0.98]"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-transparent px-8 text-sm font-bold text-white transition-all hover:bg-white/5 active:scale-[0.98]"
            >
              View Products
            </Link>
          </div>
        )}
      </main>

      <footer className="absolute bottom-8 text-zinc-600 text-sm">
        © 2026 SummitXGear. All rights reserved.
      </footer>
    </div>
  )
}
