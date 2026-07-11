'use client';

import {Suspense, useEffect} from 'react';
import {usePathname} from 'next/navigation';
import BurgerHeader from './burger-header';
import BurgerTabBar from './burger-tabbar';

// Barra de estado igual que el navbar de la hamburguesería (crema), no terracota.
const BURGER_THEME = '#fdfbf7';

// Navbar + tab-bar de hamburguesería montados en el layout: persisten al navegar
// (parece la misma app, solo cambia el contenido).
export default function BurgerChrome({locale, hasVideos = true}: {locale: string; hasVideos?: boolean}) {
  const p = usePathname();
  const onBurguer = /^(\/[a-z]{2,3})?\/burguer(\/.*)?$/.test(p);

  // Barra de estado (Android/PWA): color de marca de la hamburguesería; se restaura al salir.
  useEffect(() => {
    if (!onBurguer) return;
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    const prev = meta?.getAttribute('content') ?? null;
    let created = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
      created = true;
    }
    meta.setAttribute('content', BURGER_THEME);
    return () => {
      if (created) meta?.remove();
      else if (prev !== null) meta?.setAttribute('content', prev);
    };
  }, [onBurguer]);

  if (!onBurguer) return null;
  return (
    <>
      <BurgerHeader locale={locale} />
      <Suspense fallback={null}>
        <BurgerTabBar hasVideos={hasVideos} />
      </Suspense>
    </>
  );
}
