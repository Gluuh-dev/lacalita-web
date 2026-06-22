'use server';

import {revalidatePath} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
import {removeMediaServer} from '@/lib/storage-server';
import {translateField} from '@/lib/translate';
import {slugify} from '@/lib/slug';

export type ProductInput = {
  category_id: string;
  slug: string;
  name: string;
  description: string;
  price: number | null;
  image: string | null;
  video: string | null;
  featured: boolean;
  is_new: boolean;
  tag: string | null;
  ingredients: string[];
  available: boolean;
  position: number;
  old_price: number | null;
  votes: number;
  rating: number | null;
  variants: {name: string; price: number}[];
  allergenIds: string[];
};

export async function saveProduct(id: string | null, form: ProductInput) {
  const supabase = await createClient();
  // Refresca/valida la sesión antes de escribir (evita 0 filas por token caducado).
  const {
    data: {user}
  } = await supabase.auth.getUser();
  if (!user) return {ok: false, error: 'Sesión caducada. Vuelve a iniciar sesión.'};
  const slug = form.slug || slugify(form.name);
  const row = {
    category_id: form.category_id,
    slug,
    name: await translateField(form.name),
    description: form.description ? await translateField(form.description) : null,
    price: form.variants.length ? null : form.price,
    image: form.image,
    video: form.video,
    featured: form.featured,
    is_new: form.is_new,
    tag: form.tag,
    ingredients: form.ingredients,
    available: form.available,
    position: form.position,
    old_price: form.old_price,
    votes: form.votes,
    rating: form.rating,
    updated_at: new Date().toISOString()
  };

  let productId = id;
  if (id) {
    const {data, error} = await supabase
      .from('products')
      .update(row)
      .eq('id', id)
      .select('id');
    if (error) return {ok: false, error: error.message};
    if (!data?.length)
      return {ok: false, error: 'No se pudo guardar (sesión caducada). Vuelve a entrar.'};
  } else {
    const {data, error} = await supabase
      .from('products')
      .insert(row)
      .select('id')
      .single();
    if (error) return {ok: false, error: error.message};
    productId = data.id;
  }

  // Variantes: reemplazar todas
  await supabase.from('product_variants').delete().eq('product_id', productId);
  if (form.variants.length) {
    const vrows = await Promise.all(
      form.variants.map(async (v, i) => ({
        product_id: productId,
        name: await translateField(v.name),
        price: v.price,
        position: i
      }))
    );
    const {error} = await supabase.from('product_variants').insert(vrows);
    if (error) return {ok: false, error: error.message};
  }

  // Alérgenos: reemplazar todos
  await supabase.from('product_allergens').delete().eq('product_id', productId);
  if (form.allergenIds.length) {
    const arows = form.allergenIds.map((aid) => ({
      product_id: productId,
      allergen_id: aid
    }));
    const {error} = await supabase.from('product_allergens').insert(arows);
    if (error) return {ok: false, error: error.message};
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin/productos');
  return {ok: true};
}

export async function toggleAvailable(id: string, available: boolean) {
  const supabase = await createClient();
  const {
    data: {user}
  } = await supabase.auth.getUser();
  if (!user) return {ok: false, error: 'Sesión caducada. Vuelve a iniciar sesión.'};
  const {error} = await supabase.from('products').update({available, updated_at: new Date().toISOString()}).eq('id', id).select('id');
  if (error) return {ok: false, error: error.message};
  revalidatePath('/', 'layout');
  revalidatePath('/admin/productos');
  return {ok: true};
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const {data: row} = await supabase.from('products').select('image, video').eq('id', id).single();
  const {error} = await supabase.from('products').delete().eq('id', id);
  if (error) return {ok: false, error: error.message};
  if (row) await removeMediaServer(supabase, [row.image, row.video]);
  revalidatePath('/', 'layout');
  revalidatePath('/admin/productos');
  return {ok: true};
}
