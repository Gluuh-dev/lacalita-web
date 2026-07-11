'use client';

import {useMemo, useState, useTransition} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {toast} from 'sonner';
import DeleteButton from '@/components/admin/delete-button';
import {Pencil, Plus, Search, Star, UtensilsCrossed} from 'lucide-react';
import {tx, euro} from '@/lib/localize';
import {btn} from '@/components/admin/ui';
import EmptyState from '@/components/admin/empty-state';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from '@/components/ui/select';
import {deleteProduct, toggleAvailable} from './actions';
import type {Product} from '@/lib/queries';

type I18n = Record<string, string>;
type Row = Product & {categories?: {name: I18n; menus?: {name: I18n; slug: string} | null} | null};

const ABBR: Record<string, string> = {
  gluten: 'GL', crustaceos: 'CR', huevos: 'HU', pescado: 'PE', cacahuetes: 'CA', soja: 'SO',
  lacteos: 'LA', frutos_cascara: 'FC', frutos_secos: 'FC', apio: 'AP', mostaza: 'MO',
  sesamo: 'SE', sulfitos: 'SU', altramuces: 'AT', moluscos: 'ML'
};
const abbr = (code: string) => ABBR[code] ?? code.slice(0, 2).toUpperCase();
function hue(code: string) {
  let h = 0;
  for (const c of code) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}
function priceLabel(p: Row) {
  const variants = p.product_variants ?? [];
  if (variants.length) return `desde ${euro(Math.min(...variants.map((v) => Number(v.price))), 'es')}`;
  return p.price != null ? euro(Number(p.price), 'es') : '—';
}

export default function ProductsTable({products, cartaSlug}: {products: Row[]; cartaSlug: string}) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [avail, setAvail] = useState<Record<string, boolean>>(() => Object.fromEntries(products.map((p) => [p.id, p.available])));
  const [, start] = useTransition();

  const catOpts = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of products) {
      if (p.category_id && p.categories && !m.has(p.category_id)) m.set(p.category_id, tx(p.categories.name, 'es'));
    }
    return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [products]);

  const filtered = products
    .filter((p) => {
      if (cat !== 'all' && p.category_id !== cat) return false;
      if (q && !tx(p.name, 'es').toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const ca = a.categories ? tx(a.categories.name, 'es') : '';
      const cb = b.categories ? tx(b.categories.name, 'es') : '';
      return ca.localeCompare(cb) || tx(a.name, 'es').localeCompare(tx(b.name, 'es'));
    });

  function toggle(p: Row) {
    const next = !(avail[p.id] ?? p.available);
    setAvail((a) => ({...a, [p.id]: next}));
    start(async () => {
      const r = await toggleAvailable(p.id, next);
      if (!r.ok) {
        toast.error(r.error);
        setAvail((a) => ({...a, [p.id]: !next}));
      }
    });
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto…" className="w-full rounded-full border border-line bg-surface py-2.5 pl-9 pr-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25" />
        </div>
        {catOpts.length > 1 && (
          <Select value={cat} onValueChange={(v) => setCat(v ?? 'all')}>
            <SelectTrigger className="min-w-[190px] rounded-full px-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {catOpts.map(([id, name]) => (
                  <SelectItem key={id} value={id}>{name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        <Link href={`/admin/productos/${cartaSlug}/nuevo`} className={`${btn} ml-auto inline-flex items-center gap-1.5`}>
          <Plus className="size-4" /> Nuevo producto
        </Link>
      </div>

      {filtered.length === 0 ? (
        <EmptyState text="Sin productos." />
      ) : (
        <div className="overflow-x-auto rounded-[20px] border border-line bg-surface shadow-sm">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-left font-adam text-[0.66rem] uppercase tracking-[0.1em] text-ink-3">
                <th className="px-4 py-3">Producto</th>
                <th className="hidden px-4 py-3 sm:table-cell">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="hidden px-4 py-3 md:table-cell">Alérgenos</th>
                <th className="px-4 py-3">Disp.</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const al = (p.product_allergens ?? []).map((pa) => pa.allergens).filter((a): a is NonNullable<typeof a> => !!a);
                const on = avail[p.id] ?? p.available;
                return (
                  <tr key={p.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-sunken text-line-strong">
                          {p.image ? (
                            <Image src={p.image} alt="" fill sizes="48px" className="object-cover" />
                          ) : p.video ? (
                            <video src={p.video} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                          ) : (
                            <UtensilsCrossed className="size-5" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 font-medium text-ink">
                            <span className="truncate">{tx(p.name, 'es')}</span>
                            {p.featured && <Star className="size-3.5 shrink-0 fill-brand text-brand" />}
                            {p.tag && <span className="rounded-full bg-red-100 px-1.5 text-[0.6rem] font-bold text-red-600">{p.tag}</span>}
                          </div>
                          {p.description && <div className="truncate text-xs text-ink-3">{tx(p.description, 'es')}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-ink-2 sm:table-cell">{p.categories ? tx(p.categories.name, 'es') : '—'}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-brand-deep">{priceLabel(p)}</td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {al.map((a) => {
                          const h = hue(a.code);
                          return (
                            <span key={a.code} title={tx(a.name, 'es')} className="flex size-6 items-center justify-center rounded-full text-[0.6rem] font-bold" style={{background: `hsl(${h} 55% 90%)`, color: `hsl(${h} 45% 32%)`}}>
                              {abbr(a.code)}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggle(p)} aria-label="Disponible" className={`relative h-6 w-10 rounded-full transition ${on ? 'bg-brand' : 'bg-line-strong'}`}>
                        <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/productos/${cartaSlug}/${p.id}`} aria-label="Editar" className="rounded-md p-1.5 text-ink-3 transition hover:bg-surface-2 hover:text-ink">
                          <Pencil className="size-4" />
                        </Link>
                        <DeleteButton icon onDelete={() => deleteProduct(p.id)} confirmText="¿Eliminar este producto? Se borra también su imagen/vídeo." />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
