'use server';

import {revalidatePath, revalidateTag} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
import {removeMediaServer} from '@/lib/storage-server';

export type AlbumInput = {title: string; date: string | null; images: string[]; position: number};

export async function saveAlbum(id: string | null, input: AlbumInput) {
  const supabase = await createClient();
  const row = {title: input.title, date: input.date || null, images: input.images, position: input.position};
  let savedId = id;
  if (id) {
    const {error} = await supabase.from('gallery_albums').update(row).eq('id', id);
    if (error) return {ok: false, error: error.message};
  } else {
    const {data, error} = await supabase.from('gallery_albums').insert(row).select('id').single();
    if (error) return {ok: false, error: error.message};
    savedId = data?.id ?? null;
  }
  revalidatePath('/', 'layout');
  revalidateTag('gallery', 'max');
  revalidatePath('/admin/galeria');
  return {ok: true, id: savedId};
}

export async function deleteAlbum(id: string) {
  const supabase = await createClient();
  const {data: row} = await supabase.from('gallery_albums').select('images').eq('id', id).single();
  const {error} = await supabase.from('gallery_albums').delete().eq('id', id);
  if (error) return {ok: false, error: error.message};
  if (row?.images) await removeMediaServer(supabase, row.images as string[]);
  revalidatePath('/', 'layout');
  revalidateTag('gallery', 'max');
  revalidatePath('/admin/galeria');
  return {ok: true};
}
