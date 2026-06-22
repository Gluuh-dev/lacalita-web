// Next 16: el antiguo `middleware` ahora se llama `proxy`.
// - En /admin refresca la sesión de Supabase (escribe cookies) para que las
//   Server Actions estén autenticadas y RLS no bloquee escrituras en silencio.
// - En el resto, aplica el middleware de i18n de next-intl.
import {NextResponse, type NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {createServerClient} from '@supabase/ssr';
import {routing} from './i18n/routing';

const intl = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const response = NextResponse.next({request});
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({name, value, options}) =>
              response.cookies.set(name, value, options)
            );
          }
        }
      }
    );
    await supabase.auth.getUser();
    return response;
  }

  return intl(request);
}

export const config = {
  // Todo menos api, estáticos y archivos con extensión (incluye /admin y /[locale]).
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};
