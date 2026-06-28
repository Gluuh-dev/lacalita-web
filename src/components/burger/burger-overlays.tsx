'use client';

import {ProductModal, VideoReels} from '@/components/menu/menu-tabbar';
import {useMenuStore} from '@/components/menu/store';

// Modales globales de hamburguesería (detalle de producto + vídeo) controlados por Zustand,
// para que funcionen en cualquier página (landing, carta, favoritos, mi lista).
export default function BurgerOverlays({locale}: {locale: string}) {
  const s = useMenuStore();
  return (
    <>
      <ProductModal locale={locale} />
      {s.videoOpen && <VideoReels videos={s.videos} locale={locale} onClose={s.closeVideo} />}
    </>
  );
}
