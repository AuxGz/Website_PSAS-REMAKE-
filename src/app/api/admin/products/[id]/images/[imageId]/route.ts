import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// --- DELETE: Hapus Gambar dari DB ---
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string, imageId: string }> }
) {
  try {
    const { imageId } = await params

    await prisma.productImage.delete({
      where: { id: imageId }
    })

    return NextResponse.json({ message: "Gambar dihapus" })
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus gambar" }, { status: 500 })
  }
}
