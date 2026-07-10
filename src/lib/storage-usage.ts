import {createClient} from '@/lib/supabase/server';

export {fmtBytes} from './format-bytes';

const MARKER = '/storage/v1/object/public/media/';
const PAGE = 1000;

// Supabase no expone la cuota del plan por API. El plan gratuito da 1 GB.
// Si pasáis a Pro, cambiad SUPABASE_STORAGE_LIMIT_BYTES en el entorno.
export const STORAGE_LIMIT = Number(process.env.SUPABASE_STORAGE_LIMIT_BYTES) || 1_073_741_824;

// URL pública del bucket → ruta interna ('image/1699-abc.webp'). null si no es del bucket.
export function pathOf(url: string): string | null {
  const i = url.indexOf(MARKER);
  return i === -1 ? null : decodeURIComponent(url.slice(i + MARKER.length));
}

export type MediaUsage = {sizes: Map<string, number>; total: number};

// Recorre el bucket `media` y devuelve el tamaño de cada objeto.
export async function getMediaUsage(): Promise<MediaUsage> {
  const supabase = await createClient();
  const bucket = supabase.storage.from('media');
  const sizes = new Map<string, number>();

  // Un nivel de carpetas (image/, video/, poster/). `id: null` = carpeta.
  const {data: roots} = await bucket.list('', {limit: PAGE});
  const folders = (roots ?? []).filter((e) => e.id === null).map((e) => e.name);

  const scan = async (prefix: string) => {
    for (let offset = 0; ; offset += PAGE) {
      const {data, error} = await bucket.list(prefix, {limit: PAGE, offset});
      if (error || !data?.length) return;
      for (const f of data) {
        if (f.id === null) continue; // subcarpeta: no las usamos
        sizes.set(prefix ? `${prefix}/${f.name}` : f.name, f.metadata?.size ?? 0);
      }
      if (data.length < PAGE) return;
    }
  };

  await Promise.all([scan(''), ...folders.map(scan)]);

  let total = 0;
  for (const s of sizes.values()) total += s;
  return {sizes, total};
}

// Suma los bytes de una lista de URLs públicas.
export function bytesOf(urls: string[], sizes: Map<string, number>): number {
  let n = 0;
  for (const url of urls) {
    const p = pathOf(url);
    if (p) n += sizes.get(p) ?? 0;
  }
  return n;
}
