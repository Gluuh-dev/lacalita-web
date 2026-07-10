'use client';

import {useState} from 'react';
import {Pencil} from 'lucide-react';
import {btn, btnEdit, card} from '@/components/admin/ui';
import Drawer from '@/components/admin/drawer';
import DeleteButton from '@/components/admin/delete-button';
import EventForm from './event-form';
import {deleteEvent} from './actions';
import EmptyState from '@/components/admin/empty-state';
import {tx} from '@/lib/localize';
import type {EventRow} from '@/lib/queries';

export default function EventsManager({events}: {events: EventRow[]}) {
  const [edit, setEdit] = useState<EventRow | null | undefined>(undefined);
  const open = edit !== undefined;

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button className={btn} onClick={() => setEdit(null)}>
          Nuevo evento
        </button>
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
              <button type="button" onClick={() => setEdit(e)} className={btnEdit}>
                <Pencil className="size-3.5" /> Editar
              </button>
              <DeleteButton onDelete={() => deleteEvent(e.id)} />
            </div>
          </li>
        ))}
      </ul>

      <Drawer open={open} title={edit ? 'Editar evento' : 'Nuevo evento'} onClose={() => setEdit(undefined)}>
        {open && (
          <EventForm id={edit ? edit.id : null} event={edit ?? null} onSaved={() => setEdit(undefined)} />
        )}
      </Drawer>
    </>
  );
}
