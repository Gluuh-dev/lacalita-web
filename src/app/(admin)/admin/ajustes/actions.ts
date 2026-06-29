'use server';

import {revalidatePath, revalidateTag} from 'next/cache';
import {createClient} from '@/lib/supabase/server';
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
  const {error} = await supabase.from('settings').upsert({
    id: 1,
    address: form.address || null,
    phone: form.phone || null,
    email: form.email || null,
    maps_url: form.maps_url || null,
    hours: form.hours,
    social: {instagram: form.instagram, facebook: form.facebook},
    landing: await translateField(form.landing),
    updated_at: new Date().toISOString()
  });
  if (error) return {ok: false, error: error.message};
  revalidatePath('/', 'layout');
  revalidateTag('settings', 'max');
  return {ok: true};
}
