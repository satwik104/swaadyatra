"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// Point 2 — responsive: custom loader lets Next.js request the exact width it needs
// (480 w on mobile, 800 w on desktop) directly from Cloudinary
const cloudinaryLoader = ({ src, width }: { src: string; width: number }) =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_${width}/${src}`;

export default function ImageCarousel({
  images,
  shopName,
  isFirst,
}: {
  images: string[];
  shopName: string;
  isFirst: boolean; // true only for the very first card on the page
}) {
  const [current, setCurrent] = useState(0);
  // Lazy load: start visible only if this is the first card, otherwise wait for IntersectionObserver
  const [visible, setVisible] = useState(isFirst);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Point 1 — lazy load: observe when the carousel enters the viewport
  useEffect(() => {
    if (isFirst || !wrapperRef.current) return; // first card is already visible
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "200px" } // start loading 200px before it enters view
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [isFirst]);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden"
      style={{ borderRadius: "2rem 2rem 50% 50% / 2rem 2rem 3rem 3rem" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {visible && (
          <Image
            loader={cloudinaryLoader}
            src={images[current]}          // just the public ID — loader builds the full URL
            alt={`${shopName} - photo ${current + 1}`}
            fill
            // Point 2 — sizes tells Next.js which width to request: ~480px on mobile, ~800px on desktop
            sizes="(max-width: 768px) 100vw, 50vw"
            // Point 3 — priority only for the first card's first slide (LCP image)
            priority={isFirst}
            loading={isFirst ? undefined : "lazy"}
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </div>

      {images.length > 1 && (
        <>
          <button onClick={prev} aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow transition">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={next} aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow transition">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to image ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
