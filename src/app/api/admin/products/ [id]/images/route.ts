import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// --- POST: Tambah Gambar Baru ---
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { url, type } = await req.json()
    const productId = params.id

    const newImage = await prisma.productImage.create({
      data: {
        productId,
        url,
        type: type || "GALLERY",
      }
    })

    return NextResponse.json(newImage)
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan gambar" }, { status: 500 })
  }
}
