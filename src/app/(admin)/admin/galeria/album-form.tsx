'use client';

import {useRef, useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import MediaUpload from '@/components/admin/media-upload';
import FormFooter from '@/components/admin/form-footer';
import {removeMedia} from '@/lib/storage';
import {saveAlbum} from './actions';
import type {GalleryAlbum} from '@/lib/queries';

const TIPOS: {value: string; label: string}[] = [
  {value: 'evento', label: 'Evento'},
  {value: 'comida', label: 'Comida'},
  {value: 'local', label: 'El local'},
  {value: 'gente', label: 'Gente'}
];

export default function AlbumForm({
  id,
  album,
  events = [],
  onSaved
}: {
  id: string | null;
  album: GalleryAlbum | null;
  events?: {id: string; title: string}[];
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [albumId, setAlbumId] = useState<string | null>(id);
  const [images, setImages] = useState<string[]>(album?.images ?? []);
  const [f, setF] = useState({
    title: album?.title ?? '',
    date: album?.date ?? '',
    position: String(album?.position ?? 0),
    kind: (album?.kind ?? 'evento') as string,
    event_id: album?.event_id ?? ''
  });
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
        position: Number(fRef.current.position) || 0,
        kind: fRef.current.kind,
        // La portada es la primera foto: el propio orden la decide.
        cover: imagesRef.current[0] ?? null,
        event_id: fRef.current.kind === 'evento' ? fRef.current.event_id || null : null
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
        // Sin onSaved estamos en la página propia del álbum, no en el cajón.
        if (onSaved) onSaved();
        else router.push('/admin/galeria');
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
      <div>
        <Label>Tipo de álbum</Label>
        <div className="mt-1 flex flex-wrap gap-2">
          {TIPOS.map((t) => {
            const on = f.kind === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  setF({...f, kind: t.value});
                  autoSave();
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${on ? 'border-brand bg-brand text-on-primary' : 'border-line bg-surface text-ink-2 hover:border-brand'}`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-xs text-ink-3">Con esto la galería puede filtrarse: eventos, comida, el local o gente.</p>
      </div>

      {f.kind === 'evento' && events.length > 0 && (
        <div>
          <Label>¿De qué evento son? (opcional)</Label>
          <select
            className="w-full rounded-[14px] border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
            value={f.event_id}
            onChange={(e) => {
              setF({...f, event_id: e.target.value});
              autoSave();
            }}
          >
            <option value="">Ninguno</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-ink-3">Si lo enlazas, las fotos saldrán también en la ficha de ese evento.</p>
        </div>
      )}

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
        <Label>
          Fotos del álbum
          {images.length > 0 && <span className="ml-2 text-xs font-normal text-ink-3">{images.length} foto{images.length === 1 ? '' : 's'}</span>}
        </Label>
        {images.length > 0 && (
          <p className="mb-2 text-xs text-ink-3">La primera foto (★) es la portada del álbum. Pasa el ratón por una foto para cambiarla.</p>
        )}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
          {/* Primer hueco: soltar/pulsar para añadir fotos nuevas. */}
          <MediaUpload
            tile
            value={null}
            multiple
            maxDim={1600}
            onChange={(u) => {
              if (u) {
                setImages((prev) => [...prev, u]);
                autoSave();
              }
            }}
            label="+ Añadir fotos"
          />
          {images.map((url, i) => (
            <div key={url} className={`group relative ${i === 0 ? 'ring-2 ring-brand ring-offset-1' : ''} rounded-lg`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-square w-full rounded-lg object-cover ring-1 ring-black/10" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-brand px-1.5 py-0.5 text-[0.6rem] font-bold text-on-primary shadow">★ Portada</span>
              )}
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => {
                    // A la primera posición sin borrar nada más.
                    setImages((prev) => [url, ...prev.filter((u) => u !== url)]);
                    autoSave();
                  }}
                  className="absolute inset-x-1 bottom-1 rounded-full bg-black/70 py-0.5 text-[0.6rem] font-semibold text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
                >
                  Hacer portada
                </button>
              )}
              <button
                type="button"
                aria-label="Quitar foto"
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
        {savedNote && <p className="mt-2 text-xs font-medium text-green-600">Guardado automáticamente ✓</p>}
      </div>
      <FormFooter pending={pending} cancelHref="/admin/galeria" label="Guardar y cerrar" />
    </form>
  );
}
