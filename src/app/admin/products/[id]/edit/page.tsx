import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import ProductImageManager from "@/components/admin/ProductImageManager"
import ProductEditForm from "@/components/admin/ProductEditForm"
import Link from "next/link"
import { ChevronLeft, Save } from "lucide-react"
import { revalidatePath } from "next/cache"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  if (!product) {
    notFound()
  }

  // --- SERVER ACTION: UPDATE PRODUCT ---
  async function updateProductDetails(formData: FormData) {
    'use server'
    const productId = formData.get('productId') as string
    const name = formData.get('name') as string
    const price = Number(formData.get('price'))
    const stock = Number(formData.get('stock'))
    const categoryId = formData.get('categoryId') as string
    const description = formData.get('description') as string

    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        stock,
        categoryId,
        description
      }
    })

    revalidatePath(`/admin/products/${productId}/edit`)
    revalidatePath('/admin/products')
    revalidatePath('/products')
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12 pb-24">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link 
            href="/admin/products" 
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <div className="flex justify-between items-end">
            <h1 className="text-4xl font-light italic tracking-tight">
              Edit <span className="font-serif">{product.name}</span>
            </h1>
          </div>
        </div>

        {/* 1. PRODUCT DETAILS FORM (CLIENT) */}
        <ProductEditForm 
          product={product} 
          categories={categories} 
          updateAction={updateProductDetails} 
        />

        {/* 2. MEDIA MANAGEMENT SECTION */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col border-l-2 border-secondary pl-6">
            <h2 className="text-xl font-medium">Product Gallery</h2>
            <p className="text-sm text-zinc-500">Enhance your product presentation with high-quality media.</p>
          </div>
          
          <ProductImageManager 
            productId={product.id} 
            initialImages={product.images.map(img => ({
              id: img.id,
              url: img.url,
              type: img.type as "GALLERY" | "THUMBNAIL" | "VIEW_360"
            }))} 
          />
        </div>
      </div>
    </div>
  )
}
