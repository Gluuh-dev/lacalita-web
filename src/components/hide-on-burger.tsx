'use client';

import {usePathname} from 'next/navigation';

// La hamburguesería tiene su propia cabecera/pie oscuros; ocultamos los globales ahí.
export default function HideOnBurger({children}: {children: React.ReactNode}) {
  const p = usePathname();
  if (/\/hamburgueseria(\/|$)/.test(p)) return null;
  return <>{children}</>;
}
