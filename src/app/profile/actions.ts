'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateAvatarUrl(url: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // 1. Dapatkan info profil lama untuk ambil URL foto lama
    const oldProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { avatarUrl: true }
    });

    // 2. Jika ada foto lama, hapus dari Supabase Storage
    if (oldProfile?.avatarUrl) {
      try {
        // Ambil nama file dari URL (biasanya setelah /avatars/)
        const urlParts = oldProfile.avatarUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        if (fileName) {
          await supabase.storage
            .from('avatars')
            .remove([`avatars/${fileName}`]);
            
          console.log('Old avatar deleted:', fileName);
        }
      } catch (deleteError) {
        console.error('Error deleting old avatar from storage:', deleteError);
        // Kita tidak throw error di sini agar proses update DB tetap jalan
      }
    }

    // 3. Update database dengan URL foto baru
    await prisma.profile.update({
      where: { userId: user.id },
      data: { avatarUrl: url },
    });
    
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('Error updating avatar URL:', error);
    return { success: false, error: 'Failed to update database' };
  }
}
