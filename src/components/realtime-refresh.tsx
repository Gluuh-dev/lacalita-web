'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/client';

const TABLES = ['products', 'menus', 'categories', 'events', 'settings', 'product_variants', 'product_allergens', 'burger_hero_slides', 'burger_offers'];

/**
 * Recarga los datos del servidor (router.refresh) en cuanto cambia algo en la
 * base de datos. Así un cliente que tenga la web/carta abierta ve los cambios
 * (precios, platos, eventos…) sin recargar a mano.
 */
export default function RealtimeRefresh() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), 300);
    };
    const ch = supabase.channel('lc-realtime');
    for (const t of TABLES) {
      ch.on('postgres_changes', {event: '*', schema: 'public', table: t}, refresh);
    }
    ch.subscribe();
    return () => {
      clearTimeout(timer);
      supabase.removeChannel(ch);
    };
  }, [router]);
  return null;
}
