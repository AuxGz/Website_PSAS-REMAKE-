'use client';

import { useEffect, useRef, useState } from 'react';

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // 1. Fallback: Check if user has Data Saver enabled
    // @ts-expect-error - navigator.connection is not fully typed
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection && connection.saveData === true) {
      setUseFallback(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // 2. Intersection Observer: video baru load saat masuk viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          // Play video if already loaded
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        } else {
          // Pause when out of view for performance
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Force load and play when the source is injected
  useEffect(() => {
    if (shouldLoadVideo && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [shouldLoadVideo]);

  // Render static image if saveData is true
  if (useFallback) {
    return (
      <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
        <span className="text-zinc-700 text-[10px] tracking-widest uppercase">Animation Paused</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="w-full h-full object-cover opacity-60 scale-105"
        style={{
          willChange: 'auto',
          backfaceVisibility: 'hidden',
        }}
      >
        {shouldLoadVideo && (
          <>
            <source src="/hero-background.webm" type="video/webm" />
            <source src="/hero-background.mp4" type="video/mp4" />
          </>
        )}
      </video>
    </div>
  );
}
