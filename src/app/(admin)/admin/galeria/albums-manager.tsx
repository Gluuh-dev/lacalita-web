'use client';

import {useState} from 'react';
import {btn, card} from '@/components/admin/ui';
import Drawer from '@/components/admin/drawer';
import DeleteButton from '@/components/admin/delete-button';
import EmptyState from '@/components/admin/empty-state';
import AlbumForm from './album-form';
import {deleteAlbum} from './actions';
import type {GalleryAlbum} from '@/lib/queries';

export default function AlbumsManager({albums}: {albums: GalleryAlbum[]}) {
  const [edit, setEdit] = useState<GalleryAlbum | null | undefined>(undefined);
  const open = edit !== undefined;

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button className={btn} onClick={() => setEdit(null)}>Nuevo álbum</button>
      </div>
      {albums.length === 0 && <EmptyState text="Aún no hay álbumes. Crea el primero y sube sus fotos." />}
      <ul className="space-y-2">
        {albums.map((a) => (
          <li key={a.id} className={`${card} flex items-center justify-between gap-3`}>
            <div className="flex min-w-0 items-center gap-3">
              {a.images[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.images[0]} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-black/10" />
              )}
              <div className="min-w-0">
                <div className="truncate font-medium">{a.title || 'Sin título'}</div>
                <div className="text-xs text-ink-3">
                  {a.date ? new Date(a.date).toLocaleDateString('es-ES') : 'Sin fecha'} · {a.images.length} foto{a.images.length === 1 ? '' : 's'}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <button onClick={() => setEdit(a)} className="text-sm text-accent hover:underline">Editar</button>
              <DeleteButton onDelete={() => deleteAlbum(a.id)} />
            </div>
          </li>
        ))}
      </ul>

      <Drawer open={open} title={edit ? 'Editar álbum' : 'Nuevo álbum'} onClose={() => setEdit(undefined)}>
        {open && <AlbumForm id={edit ? edit.id : null} album={edit ?? null} onSaved={() => setEdit(undefined)} />}
      </Drawer>
    </>
  );
}
