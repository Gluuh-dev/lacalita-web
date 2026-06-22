'use client';

import {useState} from 'react';
import {btn, card} from '@/components/admin/ui';
import Drawer from '@/components/admin/drawer';
import DeleteButton from '@/components/admin/delete-button';
import MenuForm from './menu-form';
import {deleteMenu} from './actions';
import {tx} from '@/lib/localize';
import type {Menu} from '@/lib/queries';

export default function MenusManager({menus}: {menus: Menu[]}) {
  const [edit, setEdit] = useState<Menu | null | undefined>(undefined);
  const open = edit !== undefined;

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button className={btn} onClick={() => setEdit(null)}>
          Nueva carta
        </button>
      </div>
      <ul className="space-y-2">
        {menus.map((m) => (
          <li key={m.id} className={`${card} flex items-center justify-between gap-3`}>
            <div className="min-w-0">
              <div className="truncate font-medium">{tx(m.name, 'es')}</div>
              <div className="text-xs text-ink-3">
                /{m.slug} · {m.theme}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <button onClick={() => setEdit(m)} className="text-sm text-accent hover:underline">
                Editar
              </button>
              <DeleteButton
                onDelete={() => deleteMenu(m.id)}
                confirmText="Esto borra la carta con TODAS sus categorías y productos. ¿Seguir?"
              />
            </div>
          </li>
        ))}
      </ul>

      <Drawer open={open} title={edit ? 'Editar carta' : 'Nueva carta'} onClose={() => setEdit(undefined)}>
        {open && <MenuForm id={edit ? edit.id : null} menu={edit ?? null} onSaved={() => setEdit(undefined)} />}
      </Drawer>
    </>
  );
}
