import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/products'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // SINKRONISASI SEKALI SAJA DI SINI
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const prisma = (await import('@/lib/prisma')).default
        await prisma.profile.upsert({
          where: { userId: user.id },
          update: {
            email: user.email!,
            fullName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
            avatarUrl: user.user_metadata?.avatar_url,
          },
          create: {
            userId: user.id,
            email: user.email!,
            fullName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
            avatarUrl: user.user_metadata?.avatar_url,
            role: 'CUSTOMER',
          },
        })
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
