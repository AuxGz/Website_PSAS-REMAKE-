'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="relative w-full bg-black pt-24 pb-12 px-8 md:px-24 overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 mb-24">
          {/* Brand Identity */}
          <div className="space-y-8 lg:col-span-1">
            <Link href="/" className="inline-block">
               <span className="text-2xl font-serif italic tracking-tighter text-white">SummitXGear</span>
            </Link>
            <p className="text-zinc-500 text-sm font-light leading-relaxed max-w-xs">
              Defined by excellence. Crafted for the extraordinary. We engineer equipment for those who refuse to settle for anything less than the pinnacle.
            </p>
          </div>

          {/* Experience Links */}
          <div className="space-y-8">
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-zinc-300 font-bold">Experience</h4>
            <ul className="space-y-4 text-xs text-zinc-500 font-light">
              <li><Link href="/products" className="hover:text-white transition-colors">Our Collection</Link></li>
              <li><Link href="#craft" className="hover:text-white transition-colors">Craftsmanship</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">The SummitX Story</Link></li>
              <li><Link href="/innovation" className="hover:text-white transition-colors">Innovation Lab</Link></li>
            </ul>
          </div>

          {/* Bespoke Services */}
          <div className="space-y-8">
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-zinc-300 font-bold">Bespoke</h4>
            <ul className="space-y-4 text-xs text-zinc-500 font-light">
              <li><Link href="/custom" className="hover:text-white transition-colors">Custom Equipment</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Client Support</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Private Inquiry</Link></li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-8">
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-zinc-300 font-bold">Follow the Journey</h4>
            <div className="flex gap-6">
               <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                 <span className="text-[10px] tracking-[0.2em] uppercase font-bold">Instagram</span>
               </a>
               <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                 <span className="text-[10px] tracking-[0.2em] uppercase font-bold">YouTube</span>
               </a>
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[9px] tracking-[0.2em] uppercase text-zinc-600">Newsletter</p>
              <div className="mt-4 flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="flex-1 bg-transparent border-b border-white/10 text-xs py-2 focus:outline-none focus:border-white transition-colors font-light"
                />
                <button className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 hover:text-white transition-colors">→</button>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Strip */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-700">© 2026 SummitXGear — Defined by Excellence</p>
          <div className="flex gap-12 text-[9px] tracking-[0.3em] uppercase text-zinc-700">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
