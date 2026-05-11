import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Card from '@/components/ui/Card'
import AvatarUpload from '@/components/AvatarUpload'

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
    <div className="min-h-screen bg-background text-foreground font-sans py-20 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-12">
          <AvatarUpload 
            currentUrl={profile?.avatarUrl} 
            name={profile?.fullName || ''} 
            email={user.email || ''} 
          />
          
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-light tracking-tight italic">
              {profile?.fullName || 'Summit Explorer'}
            </h2>
            <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Member Status: Active</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid gap-8">
          <Card className="space-y-6">
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
          </Card>

          <div className="grid sm:grid-cols-2 gap-6">
            <Link href="/orders" className="block group">
              <Card className="flex flex-col justify-center space-y-2 group-hover:border-accent/40 transition-all">
                <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold group-hover:text-accent transition-colors">Total Orders</h3>
                <p className="text-4xl font-light italic text-accent">
                  {await prisma.order.count({ where: { profileId: profile?.id } })}
                </p>
              </Card>
            </Link>
            <Card className="flex flex-col justify-center space-y-2">
              <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold">Cart Items</h3>
              <p className="text-4xl font-light italic text-secondary">
                {await prisma.cartItem.count({ where: { profileId: profile?.id } })}
              </p>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <Link 
            href="/products" 
            className="flex-1 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-white hover:text-black transition-all duration-500"
          >
            Back to Catalog
          </Link>
          <form action="/auth/signout" method="post" className="flex-1">
            <button type="submit" className="w-full h-14 rounded-2xl border border-red-500/20 bg-red-500/5 text-[10px] tracking-[0.2em] uppercase font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500">
              Sign Out
            </button>
          </form>
        </div>

        <footer className="pt-20 text-center">
          <p className="text-[9px] tracking-[0.3em] uppercase text-zinc-700">
            SummitXGear Heritage — The Pinnacle of Outdoor Luxury
          </p>
        </footer>
      </div>
    </div>
  )
}
