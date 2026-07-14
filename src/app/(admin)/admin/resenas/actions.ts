'use server';

import {revalidatePath, updateTag} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
import {actionGuard} from '@/lib/auth';

export type ReviewInput = {
  author: string;
  text: string;
  rating: number;
  source: string | null;
  date: string | null;
  visible: boolean;
  position: number;
};

export async function saveReview(id: string | null, input: ReviewInput) {
  const supabase = await createClient();
  const denied = await actionGuard(supabase);
  if (denied) return denied;

  const row = {
    author: input.author.trim(),
    text: input.text.trim(),
    rating: Math.min(5, Math.max(1, input.rating)),
    source: input.source?.trim() || null,
    date: input.date || null,
    visible: input.visible,
    position: input.position
  };
  const res = id
    ? await supabase.from('reviews').update(row).eq('id', id).select('id')
    : await supabase.from('reviews').insert(row).select('id');
  if (res.error) return {ok: false, error: res.error.message};
  if (!res.data?.length) return {ok: false, error: 'No se pudo guardar (sesion caducada). Vuelve a entrar.'};

  updateTag('reviews');
  revalidatePath('/', 'layout');
  revalidatePath('/admin/resenas');
  return {ok: true};
}

export async function deleteReview(id: string) {
  const supabase = await createClient();
  const denied = await actionGuard(supabase);
  if (denied) return denied;
  const {error} = await supabase.from('reviews').delete().eq('id', id);
  if (error) return {ok: false, error: error.message};
  updateTag('reviews');
  revalidatePath('/', 'layout');
  revalidatePath('/admin/resenas');
  return {ok: true};
}
