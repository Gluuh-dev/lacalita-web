import type {SupabaseClient} from '@supabase/supabase-js';

const MARKER = '/storage/v1/object/public/media/';

export function mediaPath(url: string | null | undefined): string | null {
  if (!url) return null;
  const idx = url.indexOf(MARKER);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + MARKER.length));
}

// Borra del bucket 'media' los archivos de las URLs dadas (lado servidor).
export async function removeMediaServer(
  supabase: SupabaseClient,
  urls: (string | null | undefined)[]
) {
  const paths = urls.map(mediaPath).filter((p): p is string => !!p);
  if (!paths.length) return;
  try {
    await supabase.storage.from('media').remove(paths);
  } catch {
    /* si falla el borrado de Storage no bloqueamos la operación */
  }
}
