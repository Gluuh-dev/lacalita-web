'use client';

import {createClient} from '@/lib/supabase/client';

const MARKER = '/storage/v1/object/public/media/';

// Borra de Supabase Storage el archivo de una URL pública del bucket 'media'.
export async function removeMedia(url: string | null | undefined) {
  if (!url) return;
  const idx = url.indexOf(MARKER);
  if (idx === -1) return;
  const path = decodeURIComponent(url.slice(idx + MARKER.length));
  try {
    await createClient().storage.from('media').remove([path]);
  } catch {
    /* si falla el borrado, no bloqueamos la UI */
  }
}
