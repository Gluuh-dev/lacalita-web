import Link from 'next/link';
import {requireUser} from '@/lib/auth';
import {createClient} from '@/lib/supabase/server';
import AdminShell from '@/components/admin/admin-shell';
import {card} from '@/components/admin/ui';

const CARDS: [string, string, string][] = [
  ['productos', 'products', 'Productos'],
  ['categorias', 'categories', 'Categorías'],
  ['menus', 'menus', 'Menús'],
  ['eventos', 'events', 'Eventos']
];

export default async function AdminHome() {
  const user = await requireUser();
  const supabase = await createClient();
  const counts = await Promise.all(
    CARDS.map(async ([slug, table, label]) => {
      const {count} = await supabase
        .from(table)
        .select('*', {count: 'exact', head: true});
      return {slug, label, count: count ?? 0};
    })
  );

  return (
    <AdminShell title="Panel">
      <p className="mb-6 text-sm text-neutral-500">
        Conectado como {user.email}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map((c) => (
          <Link
            key={c.slug}
            href={`/admin/${c.slug}`}
            className={`${card} text-center transition hover:border-brand`}
          >
            <div className="text-3xl font-bold">{c.count}</div>
            <div className="text-sm text-neutral-500">{c.label}</div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
