'use client'

import React, { useEffect, useRef, useState } from 'react'

interface StrictScrollContainerProps {
  children: React.ReactNode
}

export default function StrictScrollContainer({ children }: StrictScrollContainerProps) {
  const [index, setIndex] = useState(0)
  const isLocked = useRef(false)
  const childrenArray = React.Children.toArray(children)
  const totalSlides = childrenArray.length

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') changeSlide(1)
      if (e.key === 'ArrowUp') changeSlide(-1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [index])

  const changeSlide = (direction: number) => {
    if (isLocked.current) return
    
    const nextIndex = index + direction
    if (nextIndex >= 0 && nextIndex < totalSlides) {
      isLocked.current = true
      setIndex(nextIndex)
      
      // Lock input selama durasi transisi cinematic (1.2 detik)
      setTimeout(() => {
        isLocked.current = false
      }, 1200)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 40) return
    changeSlide(e.deltaY > 0 ? 1 : -1)
  }

  const touchStart = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientY
    const diff = touchStart.current - touchEnd
    if (Math.abs(diff) > 50) {
      changeSlide(diff > 0 ? 1 : -1)
    }
  }

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden bg-transparent selection:bg-secondary/30"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cinematic Content Layer */}
      <div 
        className="w-full h-full transition-transform ease-[cubic-bezier(0.645,0.045,0.355,1.000)]"
        style={{ 
          transform: `translateY(-${index * 100}%)`,
          transitionDuration: '1200ms',
          willChange: 'transform'
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
