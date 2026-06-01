'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileNavMenuProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
  cartCount: number;
}

export default function MobileNavMenu({ isAdmin, isLoggedIn, cartCount }: MobileNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:text-white transition-colors duration-300"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col items-center justify-center gap-[5px] w-5">
          <span
            className={`block h-[1.5px] w-full bg-current transition-all duration-300 origin-center ${
              isOpen ? 'rotate-45 translate-y-[6.5px]' : ''
            }`}
          />
          <span
            className={`block h-[1.5px] w-full bg-current transition-all duration-300 ${
              isOpen ? 'opacity-0 scale-x-0' : ''
            }`}
          />
          <span
            className={`block h-[1.5px] w-full bg-current transition-all duration-300 origin-center ${
              isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
            }`}
          />
        </div>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[51] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Dropdown Menu */}
      <div
        className={`fixed left-0 right-0 top-[56px] z-[55] bg-background/95 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/50 transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-5 py-4 space-y-2.5">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/60 border border-white/5 text-[11px] tracking-[0.25em] uppercase font-bold text-white hover:bg-primary hover:border-white/10 transition-all duration-300 active:scale-[0.98]"
          >
            Cart
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn && (
            <>
              <Link
                href="/orders"
                className="flex items-center justify-center w-full py-3 rounded-xl bg-primary/60 border border-white/5 text-[11px] tracking-[0.25em] uppercase font-bold text-white hover:bg-primary hover:border-white/10 transition-all duration-300 active:scale-[0.98]"
              >
                Orders
              </Link>

              <Link
                href="/profile"
                className="flex items-center justify-center w-full py-3 rounded-xl bg-primary/60 border border-white/5 text-[11px] tracking-[0.25em] uppercase font-bold text-white hover:bg-primary hover:border-white/10 transition-all duration-300 active:scale-[0.98]"
              >
                Account
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center justify-center w-full py-3 rounded-xl bg-primary/60 border border-white/5 text-[11px] tracking-[0.25em] uppercase font-bold text-white hover:bg-primary hover:border-white/10 transition-all duration-300 active:scale-[0.98]"
            >
              Admin
            </Link>
          )}

          {!isLoggedIn && (
            <Link
              href="/login"
              className="flex items-center justify-center w-full py-3 rounded-xl bg-secondary/20 border border-secondary/30 text-[11px] tracking-[0.25em] uppercase font-bold text-secondary hover:bg-secondary hover:text-white transition-all duration-300 active:scale-[0.98]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
