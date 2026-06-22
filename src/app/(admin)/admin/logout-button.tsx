'use client';

import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await createClient().auth.signOut();
        router.push('/admin/login');
        router.refresh();
      }}
      className="rounded border px-3 py-1.5 text-sm hover:bg-neutral-100"
    >
      Salir
    </button>
  );
}
