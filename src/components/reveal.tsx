'use client';

import {useEffect, useRef, useState} from 'react';

// Fade-up al entrar en pantalla. Antes usaba framer-motion (~40 KB gzip en el
// first-load de la portada) para esto mismo: un IntersectionObserver y una
// transicion CSS. prefers-reduced-motion se respeta en globals.css.
export default function Reveal({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      {rootMargin: '0px 0px -80px 0px'}
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`lc-reveal ${on ? 'lc-reveal-in' : ''} ${className}`}>
      {children}
    </div>
  );
}
