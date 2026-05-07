import Image from 'next/image'

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      <div className="relative">
        {/* Efek Lingkaran Bersinar di Belakang Logo */}
        <div className="absolute inset-0 animate-ping rounded-full bg-secondary/20 blur-xl" />
        
        {/* Logo yang berdenyut (Pulse) */}
        <div className="relative animate-pulse">
          <Image
            src="/icons/icons-120x40.jpg"
            alt="SummitXGear Loading"
            width={180}
            height={60}
            className="brightness-0 invert opacity-80"
          />
        </div>
      </div>
      
      {/* Teks Loading Minimalis */}
      <div className="mt-8 flex items-center gap-2">
        <div className="h-1 w-1 animate-bounce rounded-full bg-secondary" style={{ animationDelay: '0ms' }} />
        <div className="h-1 w-1 animate-bounce rounded-full bg-secondary" style={{ animationDelay: '150ms' }} />
        <div className="h-1 w-1 animate-bounce rounded-full bg-secondary" style={{ animationDelay: '300ms' }} />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 ml-2">
          Preparing Excellence
        </span>
      </div>
    </div>
  )
}
