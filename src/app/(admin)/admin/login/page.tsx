'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {createClient} from '@/lib/supabase/client';
import {input, btn} from '@/components/admin/ui';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const {error} = await createClient().auth.signInWithPassword({
      email: String(form.get('email')),
      password: String(form.get('password'))
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <div className="text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-texto-debajo.svg" alt="La Calita" className="mx-auto w-40" />
        <h1 className="mt-4 font-serif text-2xl">Panel de administración</h1>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          defaultValue="admin@lacalita.test"
          className={input}
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Contraseña"
          className={input}
        />
        <button disabled={loading} className={`${btn} mt-1 py-2.5`}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
