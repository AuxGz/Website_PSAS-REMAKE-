'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { createClient } from '@/utils/supabase/client';
import { updateAvatarUrl } from '@/app/profile/actions';

interface AvatarUploadProps {
  currentUrl?: string | null;
  name: string;
  email: string;
}

export default function AvatarUpload({ currentUrl, name, email }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logika Inisial
  const initial = (name?.[0] || email?.[0] || 'S').toUpperCase();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validasi ukuran awal (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File too large. Maximum size is 10MB.');
        return;
      }

      setUploading(true);

      // 1. KOMPRESI (Target 1-2MB)
      const options = {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);

      // 2. UPLOAD KE SUPABASE
      const supabase = createClient();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // 3. DAPATKAN URL PUBLIK
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 4. UPDATE DATABASE VIA SERVER ACTION
      const result = await updateAvatarUrl(publicUrl);

      if (result.success) {
        setPreviewUrl(publicUrl);
      } else {
        throw new Error(result.error);
      }

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group">
      {/* Container Avatar */}
      <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 shadow-2xl shadow-secondary/20">
        <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden relative">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar"
              width={128}
              height={128}
              className={`h-full w-full object-cover transition-opacity duration-500 ${uploading ? 'opacity-40' : 'opacity-100'}`}
            />
          ) : (
            <span className="text-4xl font-light text-zinc-700 italic">{initial}</span>
          )}

          {/* Loading Overlay */}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Tombol Upload (Ikon Kamera) */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center border-4 border-background hover:scale-110 transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-xl"
        title="Change photo"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
