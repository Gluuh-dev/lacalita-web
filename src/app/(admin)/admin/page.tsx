import Link from 'next/link';
import {UtensilsCrossed, LayoutGrid, BookOpen, Calendar, Plus, Image as ImageIcon, CalendarPlus, Settings, Disc3, Music, Sparkles, ArrowRight} from 'lucide-react';
import {requireUser} from '@/lib/auth';
import {createClient} from '@/lib/supabase/server';
import {getAllEvents} from '@/lib/queries';
import {tx} from '@/lib/localize';
import AdminShell from '@/components/admin/admin-shell';

export default async function AdminHome() {
  await requireUser();
  const supabase = await createClient();
  const [{data: products}, {count: catCount}, {count: menuCount}, events] = await Promise.all([
    supabase.from('products').select('available'),
    supabase.from('categories').select('*', {count: 'exact', head: true}),
    supabase.from('menus').select('*', {count: 'exact', head: true}),
    getAllEvents()
  ]);

  const prodCount = products?.length ?? 0;
  const availCount = products?.filter((p) => p.available).length ?? 0;
  const drafts = events.filter((e) => !e.published).length;
  const upcoming = events.slice(0, 3);

  const quick = [
    {href: '/admin/productos', label: 'Nuevo producto', Icon: Plus},
    {href: '/admin/hero', label: 'Editar portada', Icon: ImageIcon},
    {href: '/admin/eventos', label: 'Nuevo evento', Icon: CalendarPlus},
    {href: '/admin/ajustes', label: 'Ajustes', Icon: Settings}
  ];

  return (
    <AdminShell title="Panel">
      <div className="flex max-w-5xl flex-col gap-7">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat Icon={UtensilsCrossed} value={prodCount} label="Productos" hint={`${availCount} disponibles`} tone="bg-brand/15 text-brand-deep" />
          <Stat Icon={LayoutGrid} value={catCount ?? 0} label="Categorías" tone="bg-accent-soft text-accent" />
          <Stat Icon={BookOpen} value={menuCount ?? 0} label="Cartas" tone="bg-success/15 text-success" />
          <Stat Icon={Calendar} value={events.length} label="Eventos" hint={drafts ? `${drafts} borradores` : undefined} tone="bg-amber-100 text-amber-700" />
        </div>

        <div>
          <div className="eyebrow mb-3">Accesos directos</div>
          <div className="flex flex-wrap gap-3">
            {quick.map((q) => (
              <Link key={q.label} href={q.href} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium transition hover:border-brand hover:bg-surface-2">
                <q.Icon className="size-4" /> {q.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-line bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold">Próximos eventos</h2>
            <Link href="/admin/eventos" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-deep hover:underline">
              Ver todos <ArrowRight className="size-4" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-ink-3">Aún no hay eventos.</p>
          ) : (
            <ul className="flex flex-col">
              {upcoming.map((e, i) => {
                const kind = (e.kind as 'dj' | 'concierto' | 'otro') || 'dj';
                const Ic = kind === 'concierto' ? Music : kind === 'otro' ? Sparkles : Disc3;
                const time = new Intl.DateTimeFormat('es', {day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'}).format(new Date(e.starts_at));
                return (
                  <li key={e.id} className={`flex items-center justify-between gap-3 py-3 ${i ? 'border-t border-line' : ''}`}>
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-brand-deep">
                        <Ic className="size-[18px]" />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-ink">{tx(e.title, 'es')}</div>
                        <div className="text-xs text-ink-3">
                          {e.artist ? `${e.artist} · ` : ''}
                          {time}
                        </div>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${e.published ? 'bg-success/15 text-success' : 'bg-amber-100 text-amber-700'}`}>
                      {e.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function Stat({Icon, value, label, hint, tone}: {Icon: typeof UtensilsCrossed; value: number; label: string; hint?: string; tone: string}) {
  return (
    <div className="rounded-[18px] border border-line bg-surface p-5 shadow-sm">
      <span className={`mb-3 flex size-11 items-center justify-center rounded-[14px] ${tone}`}>
        <Icon className="size-5" />
      </span>
      <div className="text-3xl font-bold text-ink">{value}</div>
      <div className="text-sm text-ink-2">{label}</div>
      {hint && <div className="mt-1 text-xs text-ink-3">{hint}</div>}
    </div>
  );
}
