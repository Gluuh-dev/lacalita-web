'use client';

import {usePathname} from 'next/navigation';

// La hamburguesería tiene su propia cabecera/pie oscuros; ocultamos los globales ahí.
export default function HideOnBurger({children}: {children: React.ReactNode}) {
  const p = usePathname();
  // La landing y sus subpáginas (oferta…), NO la carta (/[locale]/carta/hamburgueseria).
  if (/^(\/[a-z]{2,3})?\/hamburgueseria(\/.*)?$/.test(p)) return null;
  return <>{children}</>;
}
