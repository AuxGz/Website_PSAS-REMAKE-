"use client"

import { useState } from "react"
import { PlusCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Props {
  categories: any[]
  createAction: (formData: FormData) => Promise<{ success: boolean, productId?: string, error?: string }>
}

export default function ProductCreateForm({ categories, createAction }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    
    const formData = new FormData(e.currentTarget)
    try {
      const result = await createAction(formData)
      if (result.success) {
        setShowSuccess(true)
        // Notifikasi akan muncul sebelum diarahkan (redirect ditangani oleh server action)
      } else {
        alert(result.error || "Gagal membuat produk.")
      }
    } catch (error) {
      console.error("Gagal membuat produk:", error)
      alert("Gagal membuat produk baru.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative">
      {/* Sleek Floating Notification */}
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${showSuccess ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-white text-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-xl">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm font-bold tracking-tight">Product created! Redirecting to media upload...</span>
        </div>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Add New <span className="text-secondary italic">Gear.</span></h1>
        <p className="mt-2 text-zinc-500 text-[10px] tracking-[0.4em] uppercase font-bold">Inscribe a new legend into the collection</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 bg-zinc-900/30 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden backdrop-blur-sm">
        {isSaving && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center transition-all">
            <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white">Forging New Gear...</span>
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-6">
          <h2 className="text-[10px] tracking-[0.3em] uppercase font-bold border-b border-white/5 pb-4 text-secondary/60">Basic Information</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500 px-1">Product Name</label>
              <input 
                name="name" 
                required 
                type="text" 
                placeholder="e.g. Summit Elite X1" 
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-all placeholder:text-zinc-700" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500 px-1">Category</label>
              <select 
                name="categoryId" 
                required 
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-secondary focus:outline-none appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-zinc-900">{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500 px-1">Description</label>
            <textarea 
              name="description" 
              required 
              rows={4} 
              placeholder="Describe the craftsmanship..." 
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-secondary focus:outline-none resize-none transition-all placeholder:text-zinc-700"
            ></textarea>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-6">
          <h2 className="text-[10px] tracking-[0.3em] uppercase font-bold border-b border-white/5 pb-4 text-accent/60">Pricing & Inventory</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500 px-1">Price (IDR)</label>
              <input 
                name="price" 
                required 
                type="number" 
                placeholder="4500000" 
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-all placeholder:text-zinc-700" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500 px-1">Stock</label>
              <input 
                name="stock" 
                required 
                type="number" 
                placeholder="10" 
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-all placeholder:text-zinc-700" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500 px-1">Weight (g)</label>
              <input 
                name="weight" 
                required 
                type="number" 
                placeholder="2400" 
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-all placeholder:text-zinc-700" 
              />
            </div>
          </div>
        </div>

        {/* Special Features */}
        <div className="space-y-6">
          <h2 className="text-[10px] tracking-[0.3em] uppercase font-bold border-b border-white/5 pb-4 text-zinc-400">Special Features</h2>
          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <input 
              name="has360View" 
              type="checkbox" 
              className="h-5 w-5 rounded-lg border-white/10 bg-white/5 text-secondary focus:ring-0 focus:ring-offset-0 transition-all checked:bg-secondary cursor-pointer" 
            />
            <span className="text-[10px] tracking-[0.1em] uppercase font-bold text-zinc-500 group-hover:text-foreground transition-colors">Enable 360° Product View</span>
          </label>
        </div>

        <div className="pt-4 flex gap-4">
           <Link 
            href="/admin/products"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-4 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-center tracking-widest uppercase"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSaving}
            className="flex-[2] rounded-xl bg-white text-black py-4 text-xs font-bold hover:bg-zinc-200 shadow-xl transition-all tracking-widest uppercase flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            {isSaving ? 'Forging...' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
