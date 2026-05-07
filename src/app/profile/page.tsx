import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Ambil data detail dari Prisma
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  })

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <nav className="relative z-10 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          <Link href="/products" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-secondary transition-colors">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Catalog
          </Link>
          <h1 className="text-sm font-bold tracking-[0.3em] uppercase opacity-50">Member Profile</h1>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          
          {/* Header Profile */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-secondary via-accent to-primary p-1 shadow-2xl shadow-secondary/20">
                <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-4xl font-light text-zinc-700 italic">S</span>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-secondary flex items-center justify-center border-4 border-background">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-tight italic">
                {profile?.fullName || 'Summit Explorer'}
              </h2>
              <p className="text-sm tracking-[0.2em] uppercase text-secondary font-bold">Elite Member</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid gap-6">
            <div className="group rounded-3xl border border-white/5 bg-primary/20 p-8 backdrop-blur-xl transition-all hover:border-secondary/20">
              <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-6 font-bold">Account Information</h3>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-white/5 pb-4">
                  <span className="text-sm text-zinc-500 font-light">Email Address</span>
                  <span className="text-sm font-medium text-foreground">{user.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-white/5 pb-4">
                  <span className="text-sm text-zinc-500 font-light">Full Name</span>
                  <span className="text-sm font-medium text-foreground">{profile?.fullName || 'Not provided'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-sm text-zinc-500 font-light">Member Since</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
               <div className="rounded-3xl border border-white/5 bg-primary/20 p-8 backdrop-blur-xl">
                  <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-4 font-bold">Total Orders</h3>
                  <p className="text-4xl font-light italic">0</p>
               </div>
               <div className="rounded-3xl border border-white/5 bg-primary/20 p-8 backdrop-blur-xl">
                  <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-4 font-bold">Wishlist Items</h3>
                  <p className="text-4xl font-light italic text-accent">0</p>
               </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <form action="/auth/signout" method="post" className="w-full">
              <button type="submit" className="w-full h-14 rounded-2xl border border-red-500/20 bg-red-500/5 text-xs tracking-[0.2em] uppercase font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500">
                Sign Out
              </button>
            </form>
          </div>

        </div>
      </main>

      <footer className="mt-20 py-12 text-center border-t border-white/5">
        <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-600">SummitXGear Heritage — Established 2026</p>
      </footer>
    </div>
  )
}
