'use server';

import {revalidatePath, updateTag} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
import {actionGuard} from '@/lib/auth';
import {translateField} from '@/lib/translate';
import type {Hours} from '@/lib/hours';

export type SettingsInput = {
  address: string;
  phone: string;
  email: string;
  maps_url: string;
  instagram: string;
  facebook: string;
  landing: string;
  hours: Hours;
};

export async function saveSettings(form: SettingsInput) {
  const supabase = await createClient();
  const denied = await actionGuard(supabase);
  if (denied) return denied;
  const {data, error} = await supabase.from('settings').upsert({
    id: 1,
    address: form.address || null,
    phone: form.phone || null,
    email: form.email || null,
    maps_url: form.maps_url || null,
    hours: form.hours,
    social: {instagram: form.instagram, facebook: form.facebook},
    landing: await translateField(form.landing),
    updated_at: new Date().toISOString()
  }).select('id');
  if (error) return {ok: false, error: error.message};
  if (!data?.length) return {ok: false, error: 'No se pudo guardar (sesion caducada). Vuelve a entrar.'};
  revalidatePath('/', 'layout');
  updateTag('settings');
  return {ok: true};
}
