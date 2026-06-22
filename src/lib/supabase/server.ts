import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';

// Cliente para Server Components / Server Actions. Gestiona cookies de sesión.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // En Server Components no se pueden escribir cookies; el proxy refresca la sesión.
          try {
            cookiesToSet.forEach(({name, value, options}) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // ponytail: ignorado a propósito en RSC; el refresh ocurre en proxy/route handlers.
          }
        }
      }
    }
  );
}
