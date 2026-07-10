'use server';

import {revalidatePath, updateTag} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
import {translateField} from '@/lib/translate';

export type CategoryInput = {
  menu_id: string;
  name: string;
  description: string;
  position: number;
  visible: boolean;
};

export async function saveCategory(id: string | null, form: CategoryInput) {
  const supabase = await createClient();
  const row = {
    menu_id: form.menu_id,
    name: await translateField(form.name),
    description: form.description ? await translateField(form.description) : null,
    position: form.position,
    visible: form.visible
  };
  const res = id
    ? await supabase.from('categories').update(row).eq('id', id)
    : await supabase.from('categories').insert(row);
  if (res.error) return {ok: false, error: res.error.message};
  updateTag('menu');
  revalidatePath('/', 'layout');
  revalidatePath('/admin/categorias');
  return {ok: true};
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const {error} = await supabase.from('categories').delete().eq('id', id);
  if (error) return {ok: false, error: error.message};
  updateTag('menu');
  revalidatePath('/', 'layout');
  revalidatePath('/admin/categorias');
  return {ok: true};
}
