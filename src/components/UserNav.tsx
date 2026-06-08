import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import MobileNavMenu from './MobileNavMenu';
import { unstable_cache } from 'next/cache';

const getCachedProfile = unstable_cache(
  async (userId: string) => {
    return prisma.profile.findUnique({
      where: { userId },
      select: { 
        id: true, 
        role: true,
        _count: { select: { cartItems: true } }
      }
    });
  },
  ['user-profile-nav'],
  { revalidate: 30, tags: ['profile'] }
);

export default async function UserNav() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  console.time('UserNav-Supabase');
  const { data: { user } } = await supabase.auth.getUser();
  console.timeEnd('UserNav-Supabase');

  let isAdmin = false;
  let cartCount = 0;
  if (user) {
    console.time('UserNav-Prisma');
    const profile = await getCachedProfile(user.id);
    console.timeEnd('UserNav-Prisma');
    
    if (profile) {
      isAdmin = profile.role === 'ADMIN';
      cartCount = profile._count.cartItems;
    }
  }

  const CartIcon = () => (
    <Link
      href="/cart"
      className="relative group p-2 text-zinc-400 hover:text-white transition-all duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-white ring-2 ring-background animate-in zoom-in duration-300">
          {cartCount}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {/* Desktop Nav - inline links */}
      <div className="hidden md:flex items-center gap-4">
        <CartIcon />
        {isAdmin && (
          <Link
            href="/admin"
            className="text-[10px] tracking-[0.2em] uppercase font-medium border border-accent/20 px-4 py-2 rounded-full text-accent hover:bg-accent hover:text-black transition-all duration-500"
          >
            Admin
          </Link>
        )}
        {user ? (
          <>
            <Link
              href="/orders"
              className="text-[10px] tracking-[0.2em] uppercase font-medium border border-white/10 px-5 py-2 rounded-full text-zinc-400 hover:text-white hover:border-white/30 transition-all duration-500"
            >
              Orders
            </Link>
            <Link
              href="/profile"
              className="text-[10px] tracking-[0.2em] uppercase font-medium border border-secondary px-6 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all duration-500"
            >
              Account
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className="text-[10px] tracking-[0.2em] uppercase font-medium border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-500"
          >
            Enter
          </Link>
        )}
      </div>

      {/* Mobile Nav - hamburger menu */}
      <div className="md:hidden">
        <MobileNavMenu
          isAdmin={isAdmin}
          isLoggedIn={!!user}
          cartCount={cartCount}
        />
      </div>
    </>
  );
}
