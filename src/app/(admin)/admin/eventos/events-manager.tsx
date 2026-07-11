'use client';

import Link from 'next/link';
import {Pencil} from 'lucide-react';
import {btn, btnEdit, card} from '@/components/admin/ui';
import DeleteButton from '@/components/admin/delete-button';
import {deleteEvent} from './actions';
import EmptyState from '@/components/admin/empty-state';
import {tx} from '@/lib/localize';
import type {EventRow} from '@/lib/queries';

// Página propia en vez de cajón lateral: el formulario lleva una galería de
// imágenes que no cabía bien en 520px (mismo cambio que se hizo en galería).
export default function EventsManager({events}: {events: EventRow[]}) {
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Link href="/admin/eventos/nuevo" className={btn}>
          Nuevo evento
        </Link>
      </div>
      {events.length === 0 && <EmptyState text="Aún no hay eventos. Crea el primero." />}
      <ul className="space-y-2">
        {events.map((e) => (
          <li key={e.id} className={`${card} flex items-center justify-between gap-3`}>
            <div className="min-w-0">
              <div className="truncate font-medium">
                {tx(e.title, 'es')}
                {!e.published && <span className="ml-2 text-xs text-amber-600">(borrador)</span>}
              </div>
              <div className="text-xs text-ink-3">
                {new Date(e.starts_at).toLocaleString('es-ES')}
                {e.artist ? ` · ${e.artist}` : ''}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link href={`/admin/eventos/${e.id}`} className={btnEdit}>
                <Pencil className="size-3.5" /> Editar
              </Link>
              <DeleteButton onDelete={() => deleteEvent(e.id)} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
