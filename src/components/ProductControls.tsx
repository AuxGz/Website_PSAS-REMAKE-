'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import { Search, ChevronDown, Check } from 'lucide-react'

export default function ProductControls() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get('q') || ''
  const currentSort = searchParams.get('sort') || 'newest'

  // Local state for debouncing search input
  const [searchValue, setSearchValue] = useState(currentSearch)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const sortOptions = [
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
  ]

  const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Newest Arrivals'

  // Create a new URL search params string
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  // Debounced Search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue !== currentSearch) {
        router.push(pathname + '?' + createQueryString('q', searchValue))
      }
    }, 500) // 500ms delay

    return () => clearTimeout(delayDebounceFn)
  }, [searchValue, currentSearch, pathname, router, createQueryString])

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      {/* Search Bar */}
      <div className="relative w-full sm:max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-500" />
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="block w-full pl-11 pr-4 py-2.5 border border-white/10 rounded-full bg-primary/20 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-colors text-sm"
        />
      </div>

      {/* Custom Sort Dropdown (Shadcn UI style) */}
      <div className="relative w-full sm:w-auto flex items-center gap-3">
        <span className="text-sm text-zinc-500 hidden sm:inline-block">Sort by:</span>
        <div className="relative w-full sm:w-56">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full pl-4 pr-4 py-2.5 border border-white/10 rounded-full bg-primary/20 text-zinc-300 text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all hover:bg-white/5"
          >
            {currentSortLabel}
            <ChevronDown className="h-4 w-4 text-zinc-500 ml-2" />
          </button>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Invisible overlay to close dropdown when clicking outside */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 sm:left-0 top-full mt-2 w-full min-w-[200px] rounded-xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        router.push(pathname + '?' + createQueryString('sort', option.value))
                        setIsDropdownOpen(false)
                      }}
                      className={`flex items-center justify-between w-full text-left px-3 py-2 text-sm rounded-lg transition-colors hover:bg-white/10 hover:text-white ${
                        currentSort === option.value ? 'text-secondary font-medium' : 'text-zinc-300'
                      }`}
                    >
                      {option.label}
                      {currentSort === option.value && (
                        <Check className="h-4 w-4 text-secondary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
