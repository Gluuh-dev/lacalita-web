import {createClient} from '@supabase/supabase-js';

// Cliente anónimo SIN cookies: para lecturas públicas. Al no usar cookies, las
// páginas que sólo usan esto pueden cachearse (ISR) en vez de renderizar siempre.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {auth: {persistSession: false}}
);
