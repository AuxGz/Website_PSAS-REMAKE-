import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// --- POST: Set Gambar sebagai Thumbnail ---
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string, imageId: string }> }
) {
  try {
    const { id: productId, imageId } = await params

    // 1. Ubah semua gambar produk ini menjadi GALLERY dulu (reset)
    await prisma.productImage.updateMany({
      where: { productId },
      data: { type: "GALLERY" }
    })

    // 2. Set gambar yang dipilih menjadi THUMBNAIL
    const updatedImage = await prisma.productImage.update({
      where: { id: imageId },
      data: { type: "THUMBNAIL" }
    })

    return NextResponse.json(updatedImage)
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengatur thumbnail" }, { status: 500 })
  }
}
