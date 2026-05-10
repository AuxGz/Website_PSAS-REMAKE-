'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function saveAddress(formData: FormData) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (!profile) throw new Error('Profile not found')

    const label = formData.get('label') as string
    const fullName = formData.get('fullName') as string
    const country = (formData.get('country') as string) || 'Indonesia'
    const phone = formData.get('phone') as string
    const street = formData.get('street') as string
    const city = formData.get('city') as string
    const cityId = formData.get('cityId') as string
    const subdistrict = formData.get('subdistrict') as string
    const subdistrictId = formData.get('subdistrictId') as string
    const province = formData.get('province') as string
    const provinceId = formData.get('provinceId') as string
    const postalCode = formData.get('postalCode') as string
    const isDefault = formData.get('isDefault') === 'on'
    const latitude = formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null
    const longitude = formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { profileId: profile.id, isDefault: true },
        data: { isDefault: false }
      })
    }

    // Check if user has no addresses, make first one default
    const addressCount = await prisma.address.count({
      where: { profileId: profile.id }
    })

    await prisma.address.create({
      data: {
        profileId: profile.id,
        label,
        fullName,
        country,
        phone,
        street,
        city,
        cityId,
        subdistrict,
        subdistrictId,
        province,
        provinceId,
        postalCode,
        isDefault: addressCount === 0 ? true : isDefault,
        latitude,
        longitude
      }
    })

    revalidatePath('/profile')
    revalidatePath('/checkout')
    return { success: true }
  } catch (error: any) {
    console.error('Save address error:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    await prisma.address.delete({
      where: { id: addressId }
    })

    revalidatePath('/profile')
    revalidatePath('/checkout')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
