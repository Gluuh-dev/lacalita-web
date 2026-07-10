'use server';

import {revalidatePath, updateTag} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
import {actionGuard} from '@/lib/auth';
import {translateField} from '@/lib/translate';
import type {LandingContent} from '@/lib/content-types';

// Recibe el contenido con textos en ES; traduce títulos/textos y guarda.
export async function saveContent(input: {
  aboutTitle: string;
  aboutText: string;
  features: string[];
  storyTitle: string;
  storyText: string;
  reviews: {quote: string; author: string; rating?: number}[];
  gallery: string[];
}) {
  const supabase = await createClient();
  const denied = await actionGuard(supabase);
  if (denied) return denied;
  const content: LandingContent = {
    about: {
      title: await translateField(input.aboutTitle),
      text: await translateField(input.aboutText),
      features: input.features.map((f) => f.trim()).filter(Boolean)
    },
    story: {
      title: await translateField(input.storyTitle),
      text: await translateField(input.storyText)
    },
    reviews: input.reviews.filter((r) => r.quote.trim()),
    gallery: input.gallery
  };
  const {data, error} = await supabase
    .from('settings')
    .upsert({id: 1, content, updated_at: new Date().toISOString()})
    .select('id');
  if (error) return {ok: false, error: error.message};
  if (!data?.length) return {ok: false, error: 'No se pudo guardar (sesion caducada). Vuelve a entrar.'};
  revalidatePath('/', 'layout');
  updateTag('settings');
  return {ok: true};
}
