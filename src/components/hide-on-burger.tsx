'use client';

import {usePathname} from 'next/navigation';

// La hamburguesería tiene su propia cabecera/pie oscuros; ocultamos los globales ahí.
export default function HideOnBurger({children}: {children: React.ReactNode}) {
  const p = usePathname();
  // Toda la app de hamburguesería vive en /burguer: usa su propio navbar/tabbar.
  if (/^(\/[a-z]{2,3})?\/burguer(\/.*)?$/.test(p)) return null;
  return <>{children}</>;
}
