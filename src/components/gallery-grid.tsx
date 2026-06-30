'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {X, ChevronLeft, ChevronRight} from 'lucide-react';

export default function GalleryGrid({images}: {images: string[]}) {
  const [idx, setIdx] = useState<number | null>(null);
  const open = idx !== null;
  const touchX = useRef<number | null>(null);
  const go = (dir: number) => setIdx((i) => (i === null ? i : (i + dir + images.length) % images.length));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIdx(null);
      else if (e.key === 'ArrowRight') setIdx((i) => (i === null ? i : (i + 1) % images.length));
      else if (e.key === 'ArrowLeft') setIdx((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, images.length]);

  // Botón atrás (Android) cierra el lightbox en vez de salir.
  useEffect(() => {
    if (!open) return;
    window.history.pushState({lightbox: true}, '');
    const onPop = () => setIdx(null);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      if (window.history.state?.lightbox) window.history.back();
    };
  }, [open]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((url, i) => (
          <button key={i} onClick={() => setIdx(i)} className="lc-img-loading ds-media-zoom relative aspect-square cursor-zoom-in overflow-hidden rounded-[16px] border border-line">
            <Image src={url} alt="" fill sizes="(min-width:1024px) 18rem, (min-width:640px) 30vw, 45vw" className="object-cover" />
          </button>
        ))}
      </div>

      {open && idx !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 p-4 duration-200 animate-in fade-in" onClick={() => setIdx(null)}>
          <button aria-label="Cerrar" className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
            <X className="size-5" />
          </button>
          {images.length > 1 && (
            <>
              <button
                aria-label="Anterior"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx((i) => (i === null ? i : (i - 1 + images.length) % images.length));
                }}
                className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                aria-label="Siguiente"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx((i) => (i === null ? i : (i + 1) % images.length));
                }}
                className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[idx]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 40 && images.length > 1) go(dx < 0 ? 1 : -1);
            }}
            className="max-h-[88vh] max-w-full touch-pan-y select-none rounded-2xl object-contain"
          />
        </div>
      )}
    </>
  );
}
