'use client';

import {useEffect, useState} from 'react';

/**
 * Cabecera que se oculta al bajar y reaparece al subir.
 * `hidden` = ocúltala (translate -100%). `scrolled` = ya no estás arriba (fondo sólido).
 */
export function useHideOnScroll(threshold = 60) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > threshold && y > last + 4) setHidden(true);
      else if (y < last - 4) setHidden(false);
      last = y;
    };
    on();
    window.addEventListener('scroll', on, {passive: true});
    return () => window.removeEventListener('scroll', on);
  }, [threshold]);

  return {hidden, scrolled};
}
