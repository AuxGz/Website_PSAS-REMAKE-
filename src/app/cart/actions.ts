'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to add items to the cart' }
    }

    // Get profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true }
    })

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        profileId_productId: {
          profileId: profile.id,
          productId: productId
        }
      }
    })

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    } else {
      await prisma.cartItem.create({
        data: {
          profileId: profile.id,
          productId: productId,
          quantity: quantity
        }
      })
    }

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/cart')
    return { success: true }
  } catch (error: any) {
    console.error('Error adding to cart:', error)
    return { success: false, error: error.message }
  }
}

export async function removeFromCart(itemId: string) {
  try {
    await prisma.cartItem.delete({
      where: { id: itemId }
    })
    revalidatePath('/cart')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateCartQuantity(itemId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      return await removeFromCart(itemId)
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    })
    revalidatePath('/cart')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
