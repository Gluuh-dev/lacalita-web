'use server';

import {revalidatePath, updateTag} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
import {actionGuard} from '@/lib/auth';
import {removeMediaServer} from '@/lib/storage-server';
import {translateField} from '@/lib/translate';

export type EventInput = {
  title: string;
  description: string;
  artist: string;
  kind: string;
  starts_at: string; // ISO
  images: string[];
  video: string | null;
  published: boolean;
};

export async function saveEvent(id: string | null, form: EventInput) {
  const supabase = await createClient();
  const denied = await actionGuard(supabase);
  if (denied) return denied;
  const row = {
    title: await translateField(form.title),
    description: form.description ? await translateField(form.description) : null,
    artist: form.artist || null,
    kind: form.kind,
    starts_at: form.starts_at,
    image: form.images[0] ?? null,
    images: form.images,
    video: form.video,
    published: form.published
  };
  const res = id
    ? await supabase.from('events').update(row).eq('id', id).select('id')
    : await supabase.from('events').insert(row).select('id');
  if (res.error) return {ok: false, error: res.error.message};
  if (!res.data?.length) return {ok: false, error: 'No se pudo guardar (sesion caducada). Vuelve a entrar.'};
  revalidatePath('/', 'layout');
  updateTag('events');
  revalidatePath('/admin/eventos');
  return {ok: true};
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  const denied = await actionGuard(supabase);
  if (denied) return denied;
  const {data: row} = await supabase.from('events').select('image, images, video').eq('id', id).single();
  const {error} = await supabase.from('events').delete().eq('id', id);
  if (error) return {ok: false, error: error.message};
  if (row) await removeMediaServer(supabase, [row.image, row.video, ...((row.images as string[]) ?? [])]);
  revalidatePath('/', 'layout');
  updateTag('events');
  revalidatePath('/admin/eventos');
  return {ok: true};
}
