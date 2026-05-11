"use client"

import { useState } from "react"
import Image from "next/image"

interface Props {
  images: { id: string, url: string, type: string }[]
  productName: string
  has360View?: boolean
}

export default function ProductGallery({ images, productName, has360View }: Props) {
  // Cari thumbnail default, kalau tidak ada pakai gambar pertama
  const defaultImage = images.find(img => img.type === 'THUMBNAIL') || images[0]
  const [activeImage, setActiveImage] = useState(defaultImage)

  const isActive3D = activeImage?.url.endsWith(".glb") || activeImage?.url.endsWith(".obj")

  return (
    <div className="space-y-6">
      {/* Main Display Container */}
      <div className="aspect-square w-full overflow-hidden rounded-[2.5rem] bg-black border border-white/5 relative group shadow-2xl">
        {isActive3D ? (
          <div className="w-full h-full relative">
            {/* @ts-ignore */}
            <model-viewer
              src={activeImage.url}
              alt={productName}
              auto-rotate
              camera-controls
              shadow-intensity="1"
              environment-image="neutral"
              exposure="1"
              style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
            >
              <div slot="progress-bar" className="bg-secondary h-1 w-full absolute top-0" />
            {/* @ts-ignore */}
            </model-viewer>
          </div>
        ) : activeImage ? (
          <Image 
            src={activeImage.url} 
            alt={productName} 
            fill 
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-all duration-700 ease-in-out"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700">
            <svg className="mb-4 h-24 w-24 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {has360View && !isActive3D && (
          <div className="absolute bottom-6 left-6 rounded-full bg-black/50 backdrop-blur-md px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white border border-white/10 z-10">
            Interactive View
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img) => {
            const is3D = img.url.endsWith(".glb") || img.url.endsWith(".obj")
            
            return (
              <button 
                key={img.id} 
                onClick={() => setActiveImage(img)}
                className={`aspect-square rounded-2xl border transition-all overflow-hidden relative group ${activeImage?.id === img.id ? 'border-secondary ring-2 ring-secondary/20' : 'border-white/5 hover:border-white/20'}`}
              >
                {is3D ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800 text-zinc-400">
                    <svg className="w-6 h-6 mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    <span className="text-[8px] uppercase font-bold opacity-30">3D</span>
                  </div>
                ) : (
                  <Image 
                    src={img.url} 
                    alt="Thumbnail" 
                    fill 
                    sizes="150px"
                    className={`object-cover transition-opacity duration-300 ${activeImage?.id === img.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} 
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
