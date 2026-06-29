'use client';

import {useRef, useState, useTransition} from 'react';
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
  const [albumId, setAlbumId] = useState<string | null>(id);
  const [images, setImages] = useState<string[]>(album?.images ?? []);
  const [f, setF] = useState({title: album?.title ?? '', date: album?.date ?? '', position: String(album?.position ?? 0)});
  const [savedNote, setSavedNote] = useState(false);

  // Refs para guardar siempre el estado más reciente desde el temporizador.
  const imagesRef = useRef(images);
  imagesRef.current = images;
  const fRef = useRef(f);
  fRef.current = f;
  const idRef = useRef(albumId);
  idRef.current = albumId;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saving = useRef(false);

  const doSave = async (close: boolean) => {
    if (saving.current) {
      autoSave();
      return;
    }
    saving.current = true;
    try {
      const r = await saveAlbum(idRef.current, {
        title: fRef.current.title,
        date: fRef.current.date || null,
        images: imagesRef.current,
        position: Number(fRef.current.position) || 0
      });
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      if (r.id && !idRef.current) {
        idRef.current = r.id;
        setAlbumId(r.id);
      }
      router.refresh();
      if (close) {
        toast.success('Guardado');
        onSaved?.();
      } else {
        setSavedNote(true);
        setTimeout(() => setSavedNote(false), 1600);
      }
    } finally {
      saving.current = false;
    }
  };

  // Autoguardado: tras 700ms sin cambios (al subir/borrar fotos o editar campos).
  const autoSave = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => doSave(false), 700);
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (timer.current) clearTimeout(timer.current);
    start(() => doSave(true));
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Título del álbum</Label>
        <Input
          value={f.title}
          onChange={(e) => {
            setF({...f, title: e.target.value});
            autoSave();
          }}
          placeholder="Noche de DJ · Sábado"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Fecha</Label>
          <Input
            type="date"
            value={f.date}
            onChange={(e) => {
              setF({...f, date: e.target.value});
              autoSave();
            }}
          />
        </div>
        <div>
          <Label>Orden</Label>
          <Input
            type="number"
            value={f.position}
            onChange={(e) => {
              setF({...f, position: e.target.value});
              autoSave();
            }}
          />
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
                    setImages((prev) => prev.filter((_, j) => j !== i));
                    autoSave();
                  }}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <MediaUpload
          value={null}
          multiple
          maxDim={1600}
          onChange={(u) => {
            if (u) {
              setImages((prev) => [...prev, u]);
              autoSave();
            }
          }}
          label="+ Añadir fotos (varias a la vez)"
        />
        {savedNote && <p className="mt-1.5 text-xs font-medium text-green-600">Guardado automáticamente ✓</p>}
      </div>
      <Button type="submit" disabled={pending}>{pending ? 'Guardando…' : 'Guardar y cerrar'}</Button>
    </form>
  );
}
