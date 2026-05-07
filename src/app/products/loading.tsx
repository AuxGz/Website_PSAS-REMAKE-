export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar Skeleton */}
      <nav className="h-20 border-b border-white/5 bg-background/50 backdrop-blur-xl" />

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Header Skeleton */}
        <div className="mb-12 space-y-4">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-white/5" />
          <div className="h-6 w-full max-w-2xl animate-pulse rounded-lg bg-white/5" />
        </div>

        {/* Categories Skeleton */}
        <div className="mb-10 flex gap-3 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 w-24 flex-shrink-0 animate-pulse rounded-full bg-white/5" />
          ))}
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/5] w-full animate-pulse rounded-[2rem] bg-white/5" />
              <div className="space-y-2">
                <div className="h-6 w-3/4 animate-pulse rounded-lg bg-white/5" />
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-white/5" />
                <div className="h-6 w-1/3 animate-pulse rounded-lg bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
