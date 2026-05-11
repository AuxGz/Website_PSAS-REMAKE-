"use client"

import { useState, useRef } from "react"
import { createBrowserClient } from "@supabase/ssr"
import imageCompression from "browser-image-compression"
import Image from "next/image"
import { Trash2, Image as ImageIcon, Star, Loader2, Upload } from "lucide-react"

interface ProductImage {
  id: string
  url: string
  type: "GALLERY" | "THUMBNAIL" | "VIEW_360"
}

interface Props {
  productId: string
  initialImages: ProductImage[]
}

export default function ProductImageManager({ productId, initialImages }: Props) {
  const [images, setImages] = useState<ProductImage[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      
      const is3D = file.name.endsWith(".glb") || file.name.endsWith(".obj")
      let fileToUpload: Blob | File = file
      let finalFileName = file.name

      // Jika bukan file 3D, otomatis kompres ke WebP menggunakan library
      if (!is3D && file.type.startsWith("image/")) {
        console.log("Mengompres gambar ke WebP...")
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: "image/webp" as any
        }
        fileToUpload = await imageCompression(file, options)
        finalFileName = file.name.split(".")[0] + ".webp"
      }

      // 1. Upload ke Storage
      const filePath = `products/${productId}/${Date.now()}-${finalFileName}`
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, fileToUpload)

      if (uploadError) throw uploadError

      // 2. Dapatkan URL
      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath)

      // 3. Simpan ke DB (Gunakan Server Action atau API Route kamu)
      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: publicUrl, type: "GALLERY" }),
      })

      const newImage = await res.json()
      setImages((prev) => [...prev, newImage])

    } catch (error) {
      console.error(error)
      alert("Gagal mengunggah gambar")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const setAsThumbnail = async (imageId: string) => {
    try {
      await fetch(`/api/admin/products/${productId}/images/${imageId}/set-thumbnail`, { method: "POST" })
      setImages((prev) => prev.map(img => ({
        ...img,
        type: img.id === imageId ? "THUMBNAIL" : "GALLERY"
      })))
    } catch (error) {
      alert("Gagal mengatur thumbnail")
    }
  }

  const deleteImage = async (imageId: string, url: string) => {
    if (!confirm("Hapus gambar ini?")) return
    try {
      // Hapus dari DB
      await fetch(`/api/admin/products/${productId}/images/${imageId}`, { method: "DELETE" })
      
      // Hapus dari Storage (Opsional tapi disarankan)
      const path = url.split("/public/product-images/")[1]
      await supabase.storage.from("product-images").remove([path])

      setImages((prev) => prev.filter(img => img.id !== imageId))
    } catch (error) {
      alert("Gagal menghapus gambar")
    }
  }

  return (
    <div className="space-y-6 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-secondary" />
            Media Gallery
          </h3>
          <p className="text-xs text-zinc-500 mt-1">PNG, JPG, WebP akan dikompres otomatis. GLB/OBJ tidak dikompres.</p>
        </div>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Add Media"}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          className="hidden" 
          accept="image/*,.glb,.obj"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img) => {
          const is3D = img.url.endsWith(".glb") || img.url.endsWith(".obj")
          
          return (
            <div key={img.id} className="group relative aspect-square bg-black rounded-xl overflow-hidden border border-white/5">
              {is3D ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800 text-zinc-400">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">3D Model</span>
                </div>
              ) : (
                <Image 
                  src={img.url} 
                  alt="Product" 
                  fill 
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className={`object-cover transition-all ${img.type === 'THUMBNAIL' ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} 
                />
              )}
              
              {img.type === 'THUMBNAIL' && (
                <div className="absolute top-2 left-2 bg-secondary text-white p-1 rounded-lg shadow-lg z-20">
                  <Star className="w-3 h-3 fill-current" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {!is3D && img.type !== 'THUMBNAIL' && (
                  <button 
                    onClick={() => setAsThumbnail(img.id)}
                    className="p-2 bg-white/10 hover:bg-secondary rounded-lg text-white transition-colors"
                    title="Set as Thumbnail"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => deleteImage(img.id, img.url)}
                  className="p-2 bg-white/10 hover:bg-red-500 rounded-lg text-white transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
