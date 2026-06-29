'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import MediaUpload from '@/components/admin/media-upload';
import {removeMedia} from '@/lib/storage';
import {saveAlbum} from './actions';
import type {GalleryAlbum} from '@/lib/queries';

export default function AlbumForm({id, album, onSaved}: {id: string | null; album: GalleryAlbum | null; onSaved?: () => void}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [images, setImages] = useState<string[]>(album?.images ?? []);
  const [f, setF] = useState({title: album?.title ?? '', date: album?.date ?? '', position: String(album?.position ?? 0)});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await saveAlbum(id, {title: f.title, date: f.date || null, images, position: Number(f.position) || 0});
      if (r.ok) {
        toast.success('Guardado');
        router.refresh();
        onSaved?.();
      } else toast.error(r.error);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Título del álbum</Label>
        <Input value={f.title} onChange={(e) => setF({...f, title: e.target.value})} placeholder="Noche de DJ · Sábado" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Fecha</Label>
          <Input type="date" value={f.date} onChange={(e) => setF({...f, date: e.target.value})} />
        </div>
        <div>
          <Label>Orden</Label>
          <Input type="number" value={f.position} onChange={(e) => setF({...f, position: e.target.value})} />
        </div>
      </div>
      <div>
        <Label>Fotos del álbum</Label>
        {images.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {images.map((url, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover ring-1 ring-black/10" />
                <button
                  type="button"
                  onClick={() => {
                    removeMedia(url);
                    setImages(images.filter((_, j) => j !== i));
                  }}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <MediaUpload value={null} multiple onChange={(u) => u && setImages((prev) => [...prev, u])} label="+ Añadir fotos (varias a la vez)" />
      </div>
      <Button type="submit" disabled={pending}>{pending ? 'Guardando…' : 'Guardar'}</Button>
    </form>
  );
}
