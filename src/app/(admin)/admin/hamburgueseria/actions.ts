'use server';

import {revalidatePath} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
import {removeMediaServer} from '@/lib/storage-server';

type I18nMap = Record<string, string>;

export type SlideInput = {
  name: string;
  eyebrow: I18nMap;
  title: I18nMap;
  price: number | null;
  image: string | null;
  position: number;
  active: boolean;
  title_font: string;
  title_color: string;
  title_behind: boolean;
  bg_effect: string;
  bg_image: string | null;
  bg_color: string;
  title_scale: number;
  eyebrow_scale: number;
  price_scale: number;
  overlay_fx: string;
  show_rings: boolean;
  title_gradient: string;
  fx_sparks: boolean;
  fx_smoke: boolean;
  price_font: string;
  price_color: string;
  price_gradient: string;
  title_y: number;
  price_y: number;
  fx_video: string;
  fx_video_behind: boolean;
  fx_video_x: number;
  fx_video_y: number;
  fx_video_scale: number;
};
export type OfferInput = {
  title: I18nMap;
  eyebrow: I18nMap;
  rating: number | null;
  description: I18nMap;
  discount_label: string;
  price: number | null;
  old_price: number | null;
  color_style: string;
  image: string | null;
  position: number;
  active: boolean;
};

async function authed() {
  const supabase = await createClient();
  const {
    data: {user}
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

function done() {
  revalidatePath('/', 'layout');
  revalidatePath('/admin/hamburgueseria');
}

export async function saveBurgerSlide(id: string | null, row: SlideInput) {
  const supabase = await authed();
  if (!supabase) return {ok: false, error: 'Sesión caducada. Vuelve a iniciar sesión.'};
  if (id) {
    const {data, error} = await supabase.from('burger_hero_slides').update(row).eq('id', id).select('id');
    if (error) return {ok: false, error: error.message};
    if (!data?.length) return {ok: false, error: 'No se pudo guardar.'};
  } else {
    const {error} = await supabase.from('burger_hero_slides').insert(row);
    if (error) return {ok: false, error: error.message};
  }
  done();
  return {ok: true};
}

export async function saveBurgerOffer(id: string | null, row: OfferInput) {
  const supabase = await authed();
  if (!supabase) return {ok: false, error: 'Sesión caducada. Vuelve a iniciar sesión.'};
  if (id) {
    const {data, error} = await supabase.from('burger_offers').update(row).eq('id', id).select('id');
    if (error) return {ok: false, error: error.message};
    if (!data?.length) return {ok: false, error: 'No se pudo guardar.'};
  } else {
    const {error} = await supabase.from('burger_offers').insert(row);
    if (error) return {ok: false, error: error.message};
  }
  done();
  return {ok: true};
}

async function toggle(table: string, id: string, active: boolean) {
  const supabase = await authed();
  if (!supabase) return {ok: false, error: 'Sesión caducada.'};
  const {error} = await supabase.from(table).update({active}).eq('id', id).select('id');
  if (error) return {ok: false, error: error.message};
  done();
  return {ok: true};
}
export async function toggleBurgerSlide(id: string, active: boolean) {
  return toggle('burger_hero_slides', id, active);
}
export async function toggleBurgerOffer(id: string, active: boolean) {
  return toggle('burger_offers', id, active);
}

async function remove(table: string, id: string) {
  const supabase = await authed();
  if (!supabase) return {ok: false, error: 'Sesión caducada.'};
  const {data: r} = await supabase.from(table).select('image').eq('id', id).single();
  const {error} = await supabase.from(table).delete().eq('id', id);
  if (error) return {ok: false, error: error.message};
  if (r?.image) await removeMediaServer(supabase, [r.image]);
  done();
  return {ok: true};
}
export async function deleteBurgerSlide(id: string) {
  return remove('burger_hero_slides', id);
}
export async function deleteBurgerOffer(id: string) {
  return remove('burger_offers', id);
}
