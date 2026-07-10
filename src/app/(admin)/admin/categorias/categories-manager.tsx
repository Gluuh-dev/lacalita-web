'use client';

import {useState} from 'react';
import {Pencil} from 'lucide-react';
import {btn, btnEdit, card} from '@/components/admin/ui';
import Drawer from '@/components/admin/drawer';
import DeleteButton from '@/components/admin/delete-button';
import CategoryForm from './category-form';
import {deleteCategory} from './actions';
import EmptyState from '@/components/admin/empty-state';
import {tx} from '@/lib/localize';
import type {Category, Menu} from '@/lib/queries';

type Row = Category & {menus?: {name: Record<string, string>; slug: string} | null};

export default function CategoriesManager({
  categories,
  menus
}: {
  categories: Row[];
  menus: Pick<Menu, 'id' | 'name'>[];
}) {
  const [edit, setEdit] = useState<Row | null | undefined>(undefined);
  const open = edit !== undefined;

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button className={btn} onClick={() => setEdit(null)}>
          Nueva categoría
        </button>
      </div>
      {categories.length === 0 && <EmptyState text="Aún no hay categorías." />}
      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c.id} className={`${card} flex items-center justify-between gap-3`}>
            <div className="min-w-0">
              <div className="truncate font-medium">
                {tx(c.name, 'es')}
                {!c.visible && <span className="ml-2 text-xs text-amber-600">(oculta)</span>}
              </div>
              <div className="text-xs text-ink-3">{c.menus ? tx(c.menus.name, 'es') : '—'}</div>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <button type="button" onClick={() => setEdit(c)} className={btnEdit}>
                <Pencil className="size-3.5" /> Editar
              </button>
              <DeleteButton
                onDelete={() => deleteCategory(c.id)}
                confirmText="Esto borra la categoría y sus productos. ¿Seguir?"
              />
            </div>
          </li>
        ))}
      </ul>

      <Drawer open={open} title={edit ? 'Editar categoría' : 'Nueva categoría'} onClose={() => setEdit(undefined)}>
        {open && (
          <CategoryForm id={edit ? edit.id : null} category={edit ?? null} menus={menus} onSaved={() => setEdit(undefined)} />
        )}
      </Drawer>
    </>
  );
}
