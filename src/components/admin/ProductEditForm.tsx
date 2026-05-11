"use client"

import { useState } from "react"
import { Save, CheckCircle2 } from "lucide-react"

interface Props {
  product: any
  categories: any[]
  updateAction: (formData: FormData) => Promise<void>
}

export default function ProductEditForm({ product, categories, updateAction }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    
    const formData = new FormData(e.currentTarget)
    try {
      await updateAction(formData)
      setShowSuccess(true)
      // Sembunyikan notifikasi setelah 3 detik
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error("Gagal menyimpan:", error)
      alert("Gagal menyimpan perubahan.")
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
          <span className="text-sm font-bold tracking-tight">Changes saved successfully</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/30 p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
        {isSaving && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-10 flex items-center justify-center transition-all">
            <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 px-6 py-3 rounded-2xl shadow-xl">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-xs font-bold tracking-widest uppercase">Saving...</span>
            </div>
          </div>
        )}

        <input type="hidden" name="productId" value={product.id} />
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold px-1">Product Name</label>
            <input 
              name="name"
              defaultValue={product.name}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold px-1">Price (IDR)</label>
            <input 
              name="price"
              type="number"
              defaultValue={Number(product.price)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold px-1">Current Stock</label>
            <input 
              name="stock"
              type="number"
              defaultValue={product.stock}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold px-1">Category</label>
            <select 
              name="categoryId"
              defaultValue={product.categoryId}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-zinc-900 text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold px-1">Description</label>
          <textarea 
            name="description"
            rows={4}
            defaultValue={product.description || ''}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors resize-none"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-8 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
