'use client';

import Link from 'next/link';
import {Pencil} from 'lucide-react';
import {btn, btnEdit, card} from '@/components/admin/ui';
import DeleteButton from '@/components/admin/delete-button';
import EmptyState from '@/components/admin/empty-state';
import {fmtBytes} from '@/lib/format-bytes';
import {deleteAlbum} from './actions';
import type {GalleryAlbum} from '@/lib/queries';

export default function AlbumsManager({albums, albumBytes}: {albums: GalleryAlbum[]; albumBytes: Record<string, number>}) {
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Link href="/admin/galeria/nuevo" className={btn}>Nuevo álbum</Link>
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
                  {a.date ? new Date(a.date).toLocaleDateString('es-ES') : 'Sin fecha'} · {a.images.length} foto{a.images.length === 1 ? '' : 's'} · {fmtBytes(albumBytes[a.id] ?? 0)}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link href={`/admin/galeria/${a.id}`} className={btnEdit}>
                <Pencil className="size-3.5" /> Editar
              </Link>
              <DeleteButton onDelete={() => deleteAlbum(a.id)} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
