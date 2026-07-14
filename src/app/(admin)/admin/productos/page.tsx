import Link from 'next/link';
import {Coffee, UtensilsCrossed, Sandwich, ArrowRight} from 'lucide-react';
import {requireUser} from '@/lib/auth';
import {getMenusWithCategories} from '@/lib/queries';
import {tx} from '@/lib/localize';
import AdminShell from '@/components/admin/admin-shell';

const ICONS: Record<string, typeof Coffee> = {
  desayunos: Coffee,
  restaurante: UtensilsCrossed,
  hamburgueseria: Sandwich
};

export default async function ProductosHome() {
  await requireUser();
  const menus = await getMenusWithCategories();
  return (
    <AdminShell title="Productos">
      <p className="mb-5 text-sm text-ink-2">Elige una carta para gestionar sus productos.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {menus.map((m) => {
          const Icon = ICONS[m.slug] ?? UtensilsCrossed;
          return (
            <Link key={m.id} href={`/admin/productos/${m.slug}`} className="flex items-center gap-3 rounded-[18px] border border-line bg-surface p-5 shadow-sm transition hover:border-brand">
              <span className="flex size-11 items-center justify-center rounded-[14px] bg-brand/15 text-brand-deep">
                <Icon className="size-5" />
              </span>
              <div className="flex-1">
                <div className="font-serif text-lg">{tx(m.name, 'es')}</div>
                <div className="text-xs text-ink-3">{m.categories?.length ?? 0} categorías</div>
              </div>
              <ArrowRight className="size-4 text-ink-3" />
            </Link>
          );
        })}
      </div>
    </AdminShell>
  );
}
