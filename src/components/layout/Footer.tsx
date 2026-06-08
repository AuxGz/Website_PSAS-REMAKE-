'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="relative w-full bg-black pt-24 pb-12 px-8 md:px-24 overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-16 md:gap-12 mb-24">
          {/* Brand Identity */}
          <div className="space-y-8 lg:col-span-1">
            <Link href="/" className="inline-block">
               <span className="text-2xl font-serif italic tracking-tighter text-white">SummitXGear</span>
            </Link>
            <p className="text-zinc-400 text-base font-normal leading-relaxed max-w-xs">
              Defined by excellence. Crafted for the extraordinary. We engineer equipment for those who refuse to settle for anything less than the pinnacle.
            </p>
          </div>

          {/* Experience Links */}
          <div className="space-y-8">
            <h4 className="text-xs tracking-[0.4em] uppercase text-zinc-300 font-bold">Experience</h4>
            <ul className="space-y-4 text-sm text-zinc-400 font-normal">
              <li><Link href="/products" className="hover:text-white transition-colors">Our Collection</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-8">
            <h4 className="text-xs tracking-[0.4em] uppercase text-zinc-300 font-bold">Reach Us</h4>
            
            <div className="text-sm text-zinc-400 font-normal leading-relaxed space-y-1">
              <p>Jl. Raya Banyumas No. 1</p>
              <p>Purwokerto, Jawa Tengah</p>
              <p>Indonesia</p>
              <div className="pt-4">
                <a href="mailto:summitxgear@gmail.com" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  summitxgear@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-[11px] tracking-[0.2em] uppercase text-zinc-500">Newsletter</p>
              <div className="mt-4 flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="flex-1 bg-transparent border-b border-white/10 text-sm py-2 focus:outline-none focus:border-white transition-colors font-normal"
                />
                <button className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 hover:text-white transition-colors">→</button>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Strip */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          <p className="text-[11px] tracking-[0.4em] uppercase text-zinc-500 font-medium">© 2026 SummitXGear — Defined by Excellence</p>
          <div className="flex gap-12 text-[11px] tracking-[0.3em] uppercase text-zinc-500 font-medium">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
