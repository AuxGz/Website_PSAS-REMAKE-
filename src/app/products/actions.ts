'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitReview(productId: string, rating: number, comment: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Anda harus login untuk memberikan review' };
  }

  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return { success: false, error: 'Rating harus antara 1-5' };
  }

  const trimmedComment = comment.trim();
  if (trimmedComment.length > 1000) {
    return { success: false, error: 'Komentar maksimal 1000 karakter' };
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true }
    });

    if (!profile) {
      return { success: false, error: 'Profil tidak ditemukan' };
    }

    // Check if user has an existing review
    const existingReview = await prisma.review.findUnique({
      where: {
        profileId_productId: {
          profileId: profile.id,
          productId,
        }
      }
    });

    // If no existing review, verify purchase status (PAID or PROCESSING)
    if (!existingReview) {
      const hasPurchased = await prisma.order.findFirst({
        where: {
          profileId: profile.id,
          status: { in: ['PAID', 'PROCESSING'] },
          orderItems: {
            some: {
              productId: productId
            }
          }
        }
      });

      if (!hasPurchased) {
        return { success: false, error: 'Anda hanya dapat memberikan ulasan untuk produk yang telah Anda beli dan bayar.' };
      }
    }

    await prisma.review.upsert({
      where: {
        profileId_productId: {
          profileId: profile.id,
          productId,
        }
      },
      update: {
        rating,
        comment: trimmedComment || null,
      },
      create: {
        profileId: profile.id,
        productId,
        rating,
        comment: trimmedComment || null,
      },
    });

    revalidatePath(`/products`);
    return { success: true };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, error: 'Gagal menyimpan review' };
  }
}

export async function deleteReview(reviewId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true }
    });

    if (!profile) {
      return { success: false, error: 'Profil tidak ditemukan' };
    }

    // Only allow deleting own reviews
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { profileId: true }
    });

    if (!review || review.profileId !== profile.id) {
      return { success: false, error: 'Review tidak ditemukan' };
    }

    await prisma.review.delete({
      where: { id: reviewId }
    });

    revalidatePath(`/products`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { success: false, error: 'Gagal menghapus review' };
  }
}
