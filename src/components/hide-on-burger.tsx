'use client';

import {usePathname} from 'next/navigation';

// La hamburguesería tiene su propia cabecera/pie oscuros; ocultamos los globales ahí.
export default function HideOnBurger({children}: {children: React.ReactNode}) {
  const p = usePathname();
  // Landing de hamburguesería y la carta de hamburguesería: ocultamos cabecera/pie globales
  // (usan el navbar propio de hamburguesería).
  if (/^(\/[a-z]{2,3})?\/hamburgueseria(\/.*)?$/.test(p)) return null;
  if (/^(\/[a-z]{2,3})?\/carta\/hamburgueseria(\/.*)?$/.test(p)) return null;
  return <>{children}</>;
}
