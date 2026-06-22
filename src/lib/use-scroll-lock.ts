'use client';

import {useEffect} from 'react';

/**
 * Bloquea el scroll del fondo de forma fiable (también en iOS) fijando el body
 * y restaurando la posición al cerrar. Úsalo con cualquier modal/sheet abierto.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const y = window.scrollY;
    const b = document.body;
    const prev = {position: b.style.position, top: b.style.top, width: b.style.width, overflow: b.style.overflow};
    b.style.position = 'fixed';
    b.style.top = `-${y}px`;
    b.style.left = '0';
    b.style.right = '0';
    b.style.width = '100%';
    b.style.overflow = 'hidden';
    return () => {
      b.style.position = prev.position;
      b.style.top = prev.top;
      b.style.width = prev.width;
      b.style.overflow = prev.overflow;
      window.scrollTo(0, y);
    };
  }, [active]);
}
