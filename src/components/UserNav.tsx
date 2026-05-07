import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function UserNav() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return (
      <Link 
        href="/profile" 
        className="text-[10px] tracking-[0.2em] uppercase font-medium border border-secondary px-6 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all duration-500"
      >
        Account
      </Link>
    );
  }

  return (
    <Link 
      href="/login" 
      className="text-[10px] tracking-[0.2em] uppercase font-medium border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-500"
    >
      Enter
    </Link>
  );
}
