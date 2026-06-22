'use server';

import {revalidatePath} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
import type {HeroSlide} from '@/lib/queries';

export async function saveHero(slides: HeroSlide[]) {
  const supabase = await createClient();
  const {error} = await supabase
    .from('settings')
    .upsert({id: 1, hero: slides, updated_at: new Date().toISOString()});
  if (error) return {ok: false, error: error.message};
  revalidatePath('/', 'layout');
  return {ok: true};
}
