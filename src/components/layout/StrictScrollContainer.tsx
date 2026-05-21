'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

interface StrictScrollContainerProps {
  children: React.ReactNode
}

export default function StrictScrollContainer({ children }: StrictScrollContainerProps) {
  const [index, setIndex] = useState(0)
  const isLocked = useRef(false)
  const wheelAccumulator = useRef(0)
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const childrenArray = React.Children.toArray(children)
  const totalSlides = childrenArray.length

  const changeSlide = useCallback((direction: number) => {
    if (isLocked.current) return

    const nextIndex = direction > 0
      ? Math.min(index + 1, totalSlides - 1)
      : Math.max(index - 1, 0)

    if (nextIndex === index) return

    isLocked.current = true
    setIndex(nextIndex)

    // Lock input selama durasi transisi cinematic (1s)
    setTimeout(() => {
      isLocked.current = false
      wheelAccumulator.current = 0
    }, 1000)
  }, [index, totalSlides])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        changeSlide(1)
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        changeSlide(-1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [changeSlide])

  // Debounced wheel handler - accumulates delta to avoid jitter from trackpad
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (isLocked.current) return

      wheelAccumulator.current += e.deltaY

      if (wheelTimeout.current) {
        clearTimeout(wheelTimeout.current)
      }

      wheelTimeout.current = setTimeout(() => {
        const accumulated = wheelAccumulator.current
        if (Math.abs(accumulated) > 30) {
          changeSlide(accumulated > 0 ? 1 : -1)
        }
        wheelAccumulator.current = 0
      }, 50)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current)
    }
  }, [changeSlide])

  const touchStart = useRef(0)
  const touchStartTime = useRef(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY
    touchStartTime.current = Date.now()
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientY
    const diff = touchStart.current - touchEnd
    const timeDiff = Date.now() - touchStartTime.current

    // Swipe must be fast enough (< 500ms) and long enough (> 40px)
    if (Math.abs(diff) > 40 && timeDiff < 500) {
      changeSlide(diff > 0 ? 1 : -1)
    }
  }, [changeSlide])

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden bg-transparent selection:bg-secondary/30"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cinematic Content Layer */}
      <div
        className="w-full h-full"
        style={{
          transform: `translate3d(0, -${index * 100}%, 0)`,
          transition: 'transform 1s cubic-bezier(0.76, 0, 0.24, 1)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          perspective: 1000,
        }}
      >
        {childrenArray.map((child, i) => (
          <div key={i} className="w-full h-screen flex-shrink-0 overflow-hidden relative">
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
