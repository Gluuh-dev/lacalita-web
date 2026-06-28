'use client';

import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {ProductModal, VideoReels} from '@/components/menu/menu-tabbar';
import {useMenuStore} from '@/components/menu/store';

// Modales globales de hamburguesería (detalle de producto + vídeo) controlados por Zustand.
// Se renderizan con portal a <body> para que aparezcan por encima de TODO.
export default function BurgerOverlays({locale}: {locale: string}) {
  const s = useMenuStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <>
      <ProductModal locale={locale} />
      {s.videoOpen && <VideoReels videos={s.videos} locale={locale} onClose={s.closeVideo} />}
    </>,
    document.body
  );
}
