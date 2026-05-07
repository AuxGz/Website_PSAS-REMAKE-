'use client';

import { useEffect, useRef } from 'react';

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Memaksa video untuk play jika browser mencoba memblokirnya
      videoRef.current.play().catch((error) => {
        console.error("Autoplay was prevented:", error);
      });
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="w-full h-full object-cover opacity-60 scale-105"
    >
      <source src="/videos/LPage-main.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
