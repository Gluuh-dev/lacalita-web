'use server';

import {revalidatePath, updateTag} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
import {actionGuard} from '@/lib/auth';
import type {HeroSlide} from '@/lib/queries';

export async function saveHero(slides: HeroSlide[]) {
  const supabase = await createClient();
  const denied = await actionGuard(supabase);
  if (denied) return denied;
  const {data, error} = await supabase
    .from('settings')
    .upsert({id: 1, hero: slides, updated_at: new Date().toISOString()})
    .select('id');
  if (error) return {ok: false, error: error.message};
  if (!data?.length) return {ok: false, error: 'No se pudo guardar (sesion caducada). Vuelve a entrar.'};
  // updateTag (no revalidateTag) => la siguiente petición espera datos frescos.
  // Sin esto, getSettings() servía los ajustes cacheados y el hero no cambiaba.
  updateTag('settings');
  revalidatePath('/', 'layout');
  return {ok: true};
}
