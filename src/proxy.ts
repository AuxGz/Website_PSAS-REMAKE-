import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  // Update session dan dapatkan response awal
  const { supabase, supabaseResponse } = updateSession(request);

  const { pathname } = request.nextUrl;

  // Proteksi: Hanya rute ini yang butuh pengecekan login
  const isProtectedRoute = 
    pathname.startsWith('/products') || 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/profile');

  // Hanya panggil getUser JIKA rutenya memang butuh login
  if (isProtectedRoute) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|videos|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)',
  ],
};
