import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import HeroVideo from '@/components/HeroVideo'
import UserNav from '@/components/UserNav'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'

export default async function Home() {
  return (
    <div className="relative h-screen overflow-y-auto scroll-smooth snap-y snap-mandatory no-scrollbar selection:bg-secondary/30">
      {/* BACKGROUND CINEMATIC VIDEO */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-10" />
        <HeroVideo />
      </div>

      {/* MINIMALIST TOP NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-8 md:px-12 backdrop-blur-sm bg-background/5">
        <Link href="/">
          <Image
            src="/icons/icons-120x40.jpg"
            alt="SummitXGear"
            width={120}
            height={40}
            className="brightness-0 invert opacity-80"
          />
        </Link>
        <div className="hidden md:flex gap-12 text-[10px] tracking-[0.3em] uppercase font-light text-zinc-400">
          <Link href="#ready" className="hover:text-white transition-colors">Experience</Link>
          <Link href="/products" className="hover:text-white transition-colors">Collection</Link>
        </div>
        
        <Suspense fallback={<div className="w-24 h-8 animate-pulse bg-white/10 rounded-full" />}>
          <UserNav />
        </Suspense>
      </nav>

      {/* 1. HERO SECTION */}
      <Section className="flex flex-col items-center justify-end px-6 pb-24 md:pb-32 text-center">
        <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <h2 className="text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase text-secondary font-bold">
            Inspiring Exploration
          </h2>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-light tracking-tighter leading-[0.9] italic">
            Peak of <span className="font-serif">Excellence.</span>
          </h1>
          <p className="max-w-md mx-auto text-sm md:text-lg text-zinc-400 font-light leading-relaxed tracking-wide px-4">
            Defined by endurance. Crafted for the extraordinary. SummitXGear is the pinnacle of outdoor luxury.
          </p>
          <div className="pt-4">
            <Button href="/products" variant="primary" size="lg">
              Discover Collection
            </Button>
          </div>
        </div>
        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-white to-transparent animate-pulse" />
        </div>
      </Section>

      {/* 2. CRAFTSMANSHIP SECTION */}
      <Section id="craft" className="flex items-center bg-background px-6 md:px-24">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center max-w-7xl mx-auto">
          <div className="space-y-8 md:space-y-10 order-2 lg:order-1">
            <h3 className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-secondary font-bold">
              The Art of Detail
            </h3>
            <h2 className="text-3xl md:text-6xl font-light leading-tight">
              Mastery in Every <span className="font-serif italic">Stitch.</span>
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed text-base md:text-lg">
              Every piece of SummitXGear equipment undergoes rigorous testing in the world's most unforgiving climates. We don't just build gear; we engineer legacies.
            </p>
            <Button variant="outline" href="/products">
              Explore Craft
            </Button>
          </div>
          <div className="relative aspect-square md:aspect-[4/5] bg-primary/20 rounded-[2rem] md:rounded-[3rem] overflow-hidden order-1 lg:order-2 border border-white/5">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-1000 scale-105" />
          </div>
        </div>
      </Section>

      {/* 3. READY TO BUY / CTA SECTION */}
      <Section id="ready" className="flex flex-col items-center justify-center text-center px-6 bg-black">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1533240332313-0db36245e452?auto=format&fit=crop&q=80')] bg-cover bg-fixed bg-center" />
        <div className="relative z-10 max-w-4xl space-y-10 md:space-y-12">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-light tracking-tighter italic leading-tight">
            Your Next <span className="font-serif">Chapter</span> Awaits.
          </h2>
          <p className="text-zinc-500 font-light tracking-[0.2em] uppercase text-[10px] md:text-xs">
            Are you prepared for the extraordinary?
          </p>

          <div className="pt-6 md:pt-10">
            <Button href="/login" size="lg" className="hover:scale-110 active:scale-95 shadow-2xl shadow-secondary/20">
              Ready to Buy?
            </Button>
          </div>
        </div>
      </Section>

      {/* FOOTER STRIP */}
      <Section fullHeight={false} snap={true} className="h-[30vh] flex flex-col md:flex-row justify-between items-center gap-6 px-12 py-12 text-[9px] tracking-[0.2em] uppercase text-zinc-600 border-t border-white/5 bg-black">
        <div>© 2026 SummitXGear — The Pinnacle of Luxury</div>
        <div className="flex gap-12">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </Section>
    </div>
  )
}
