'use server';

import {revalidatePath, updateTag} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
import {actionGuard} from '@/lib/auth';
import {removeMediaServer} from '@/lib/storage-server';

export type AlbumInput = {
  title: string;
  date: string | null;
  images: string[];
  position: number;
  kind: string;            // evento | comida | local | gente
  cover: string | null;    // foto de portada; si no, la primera
  event_id: string | null; // si el álbum salió de un evento
};

export async function saveAlbum(id: string | null, input: AlbumInput) {
  const supabase = await createClient();
  const denied = await actionGuard(supabase);
  if (denied) return denied;
  const row = {
    title: input.title,
    date: input.date || null,
    images: input.images,
    position: input.position,
    kind: input.kind || 'evento',
    // Si la portada elegida ya no está entre las fotos, cae a la primera.
    cover: input.cover && input.images.includes(input.cover) ? input.cover : (input.images[0] ?? null),
    event_id: input.event_id || null
  };
  let savedId = id;
  if (id) {
    const {data, error} = await supabase.from('gallery_albums').update(row).eq('id', id).select('id');
    if (error) return {ok: false, error: error.message};
    if (!data?.length) return {ok: false, error: 'No se pudo guardar (sesion caducada). Vuelve a entrar.'};
  } else {
    const {data, error} = await supabase.from('gallery_albums').insert(row).select('id').single();
    if (error) return {ok: false, error: error.message};
    savedId = data?.id ?? null;
  }
  revalidatePath('/', 'layout');
  updateTag('media-usage'); // el medidor de espacio refleja las fotos nuevas
  revalidatePath('/admin/galeria');
  return {ok: true, id: savedId};
}

export async function deleteAlbum(id: string) {
  const supabase = await createClient();
  const denied = await actionGuard(supabase);
  if (denied) return denied;
  const {data: row} = await supabase.from('gallery_albums').select('images').eq('id', id).single();
  const {error} = await supabase.from('gallery_albums').delete().eq('id', id);
  if (error) return {ok: false, error: error.message};
  if (row?.images) await removeMediaServer(supabase, row.images as string[]);
  revalidatePath('/', 'layout');
  updateTag('media-usage');
  revalidatePath('/admin/galeria');
  return {ok: true};
}
