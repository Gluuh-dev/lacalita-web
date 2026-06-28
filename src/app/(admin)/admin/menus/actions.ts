'use server';

import {revalidatePath, revalidateTag} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
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
    ? await supabase.from('menus').update(row).eq('id', id)
    : await supabase.from('menus').insert(row);
  if (res.error) return {ok: false, error: res.error.message};
  revalidatePath('/', 'layout');
  revalidateTag('menu', 'max');
  revalidatePath('/admin/menus');
  return {ok: true};
}

export async function deleteMenu(id: string) {
  const supabase = await createClient();
  const {error} = await supabase.from('menus').delete().eq('id', id);
  if (error) return {ok: false, error: error.message};
  revalidatePath('/', 'layout');
  revalidateTag('menu', 'max');
  revalidatePath('/admin/menus');
  return {ok: true};
}
