'use client';

import {useState} from 'react';
import {tx, euro} from '@/lib/localize';
import {btn, card} from '@/components/admin/ui';
import Drawer from '@/components/admin/drawer';
import DeleteButton from '@/components/admin/delete-button';
import EmptyState from '@/components/admin/empty-state';
import ProductForm from './product-form';
import {deleteProduct} from './actions';
import type {Product, Menu, Allergen} from '@/lib/queries';

type I18n = Record<string, string>;
type MenuWithCats = Pick<Menu, 'id' | 'name'> & {
  categories: {id: string; name: I18n}[];
};
type Row = Product & {
  categories?: {name: I18n; menus?: {name: I18n; slug: string} | null} | null;
};

export default function ProductsTable({
  products,
  menus,
  allergens
}: {
  products: Row[];
  menus: MenuWithCats[];
  allergens: Allergen[];
}) {
  const [active, setActive] = useState('all');
  const [edit, setEdit] = useState<Row | null | undefined>(undefined);
  const open = edit !== undefined;

  const menuMap = new Map<string, I18n>();
  for (const p of products) {
    const m = p.categories?.menus;
    if (m && !menuMap.has(m.slug)) menuMap.set(m.slug, m.name);
  }
  const menuTabs = [...menuMap.entries()];

  const filtered = active === 'all' ? products : products.filter((p) => p.categories?.menus?.slug === active);
  const groups: {label: string; items: Row[]}[] = [];
  const idx = new Map<string, number>();
  for (const p of filtered) {
    const label = p.categories ? tx(p.categories.name, 'es') : 'Sin categoría';
    if (!idx.has(label)) {
      idx.set(label, groups.length);
      groups.push({label, items: []});
    }
    groups[idx.get(label)!].items.push(p);
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Chip active={active === 'all'} onClick={() => setActive('all')}>
            Todas
          </Chip>
          {menuTabs.map(([slug, name]) => (
            <Chip key={slug} active={active === slug} onClick={() => setActive(slug)}>
              {tx(name, 'es')}
            </Chip>
          ))}
        </div>
        <button className={btn} onClick={() => setEdit(null)}>
          Nuevo producto
        </button>
      </div>

      {products.length === 0 && <EmptyState text="Aún no hay productos. Crea el primero." />}
      {groups.map((g) => (
        <div key={g.label} className="mb-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-3">{g.label}</h2>
          <ul className="space-y-2">
            {g.items.map((p) => (
              <li key={p.id} className={`${card} flex items-center justify-between gap-3`}>
                <div className="min-w-0">
                  <div className="truncate font-medium">
                    {tx(p.name, 'es')}
                    {!p.available && <span className="ml-2 text-xs text-amber-600">(no disp.)</span>}
                    {p.featured && <span className="ml-1 text-xs">★</span>}
                  </div>
                  <div className="text-xs text-ink-3">
                    {p.price != null ? euro(Number(p.price), 'es') : '—'}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <button onClick={() => setEdit(p)} className="text-sm text-accent hover:underline">
                    Editar
                  </button>
                  <DeleteButton onDelete={() => deleteProduct(p.id)} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <Drawer open={open} title={edit ? 'Editar producto' : 'Nuevo producto'} onClose={() => setEdit(undefined)}>
        {open && (
          <ProductForm
            id={edit ? edit.id : null}
            product={edit ?? null}
            menus={menus}
            allergens={allergens}
            onSaved={() => setEdit(undefined)}
          />
        )}
      </Drawer>
    </>
  );
}

function Chip({active, onClick, children}: {active: boolean; onClick: () => void; children: React.ReactNode}) {
  return (
    <button
      onClick={onClick}
      className={`ds-chip rounded-full border px-3.5 py-1.5 text-sm font-medium ${
        active ? 'border-brand bg-brand text-on-primary' : 'border-line bg-surface text-ink-2 hover:border-brand'
      }`}
    >
      {children}
    </button>
  );
}
