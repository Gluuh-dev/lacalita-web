'use client';

import {Suspense} from 'react';
import {usePathname} from 'next/navigation';
import BurgerHeader from './burger-header';
import BurgerTabBar from './burger-tabbar';
import BurgerOverlays from './burger-overlays';

// Navbar + tab-bar de hamburguesería montados en el layout: persisten al navegar
// (parece la misma app, solo cambia el contenido).
export default function BurgerChrome({locale}: {locale: string}) {
  const p = usePathname();
  const onLanding = /^(\/[a-z]{2,3})?\/hamburgueseria(\/.*)?$/.test(p);
  const onCarta = /^(\/[a-z]{2,3})?\/carta\/hamburgueseria(\/.*)?$/.test(p);
  if (!onLanding && !onCarta) return null;
  return (
    <>
      <BurgerHeader locale={locale} />
      <Suspense fallback={null}>
        <BurgerTabBar />
      </Suspense>
      <BurgerOverlays locale={locale} />
    </>
  );
}
