'use client';

import { useEffect, useRef } from 'react';

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reduce quality for performance - poster frame while loading
    video.play().catch((error) => {
      console.error("Autoplay was prevented:", error);
    });

    // Pause when not visible for performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="w-full h-full object-cover opacity-60 scale-105"
      style={{
        willChange: 'auto',
        backfaceVisibility: 'hidden',
      }}
    >
      <source src="/hero-background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
