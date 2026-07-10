'use server';

import {revalidatePath, updateTag} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
import {actionGuard} from '@/lib/auth';
import {translateField} from '@/lib/translate';

export type MenuInput = {
  slug: string;
  name: string;
  subtitle: string;
  theme: string;
  header_image: string | null;
  header_video: string | null;
  position: number;
};

export async function saveMenu(id: string | null, form: MenuInput) {
  const supabase = await createClient();
  const denied = await actionGuard(supabase);
  if (denied) return denied;
  const row = {
    slug: form.slug,
    name: await translateField(form.name),
    subtitle: form.subtitle ? await translateField(form.subtitle) : null,
    theme: form.theme,
    header_image: form.header_image,
    header_video: form.header_video,
    position: form.position,
    updated_at: new Date().toISOString()
  };
  const res = id
    ? await supabase.from('menus').update(row).eq('id', id).select('id')
    : await supabase.from('menus').insert(row).select('id');
  if (res.error) return {ok: false, error: res.error.message};
  if (!res.data?.length) return {ok: false, error: 'No se pudo guardar (sesion caducada). Vuelve a entrar.'};
  revalidatePath('/', 'layout');
  updateTag('menu');
  revalidatePath('/admin/menus');
  return {ok: true};
}

export async function deleteMenu(id: string) {
  const supabase = await createClient();
  const denied = await actionGuard(supabase);
  if (denied) return denied;
  const {error} = await supabase.from('menus').delete().eq('id', id);
  if (error) return {ok: false, error: error.message};
  revalidatePath('/', 'layout');
  updateTag('menu');
  revalidatePath('/admin/menus');
  return {ok: true};
}
