import {redirect} from 'next/navigation';
import type {SupabaseClient} from '@supabase/supabase-js';
import {createClient} from '@/lib/supabase/server';

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: {user}
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  return user;
}

// Guard para Server Actions: valida la sesión SIN redirigir (la action devuelve
// {ok:false} y el formulario enseña el error). Imprescindible: con el token
// caducado, RLS bloquea el UPDATE en silencio (0 filas, sin error) y sin este
// check la UI diría "Guardado" habiendo perdido los cambios.
export async function actionGuard(supabase: SupabaseClient): Promise<{ok: false; error: string} | null> {
  const {
    data: {user}
  } = await supabase.auth.getUser();
  return user ? null : {ok: false, error: 'Sesión caducada. Vuelve a iniciar sesión.'};
}

// Sin redirección: para el público (mostrar atajos de admin si está logueado).
export async function getOptionalUser() {
  const supabase = await createClient();
  const {
    data: {user}
  } = await supabase.auth.getUser();
  return user;
}
