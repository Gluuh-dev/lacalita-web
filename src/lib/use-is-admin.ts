'use client';

import {useEffect, useState} from 'react';
import {createClient} from '@/lib/supabase/client';

// Detecta sesión en el navegador (sin tocar el servidor) para que las páginas
// públicas sigan siendo estáticas/cacheadas. Muestra atajos de admin si hay sesión.
export function useIsAdmin() {
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({data}) => setAdmin(!!data.user));
    const {data: sub} = supabase.auth.onAuthStateChange((_e, session) =>
      setAdmin(!!session?.user)
    );
    return () => sub.subscription.unsubscribe();
  }, []);
  return admin;
}
