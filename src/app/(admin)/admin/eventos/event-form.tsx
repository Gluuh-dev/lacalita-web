'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import MediaUpload from '@/components/admin/media-upload';
import {removeMedia} from '@/lib/storage';
import {saveEvent} from './actions';
import type {EventRow} from '@/lib/queries';

function toLocalInput(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function EventForm({
  id,
  event,
  onSaved
}: {
  id: string | null;
  event: EventRow | null;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [images, setImages] = useState<string[]>(
    event?.images?.length ? event.images : event?.image ? [event.image] : []
  );
  const [video, setVideo] = useState<string | null>(event?.video ?? null);
  const [kind, setKind] = useState(event?.kind ?? 'dj');
  const [published, setPublished] = useState(event?.published ?? true);
  const [f, setF] = useState({
    title: event?.title?.es ?? '',
    description: event?.description?.es ?? '',
    artist: event?.artist ?? '',
    starts_at: toLocalInput(event?.starts_at)
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.starts_at) {
      toast.error('Pon fecha y hora');
      return;
    }
    start(async () => {
      const r = await saveEvent(id, {
        title: f.title,
        description: f.description,
        artist: f.artist,
        kind,
        starts_at: new Date(f.starts_at).toISOString(),
        images,
        video,
        published
      });
      if (r.ok) {
        toast.success('Guardado');
        router.refresh();
        if (onSaved) onSaved();
        else router.push('/admin/eventos');
      } else toast.error(r.error);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Título (es)</Label>
        <Input
          value={f.title}
          onChange={(e) => setF({...f, title: e.target.value})}
          required
        />
      </div>
      <div>
        <Label>Descripción (es)</Label>
        <Textarea
          rows={2}
          value={f.description}
          onChange={(e) => setF({...f, description: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Artista / DJ</Label>
          <Input value={f.artist} onChange={(e) => setF({...f, artist: e.target.value})} />
        </div>
        <div>
          <Label>Tipo</Label>
          <Select value={kind} onValueChange={(v) => setKind(v ?? 'dj')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dj">DJ</SelectItem>
              <SelectItem value="concierto">Concierto</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Fecha y hora</Label>
        <Input
          type="datetime-local"
          value={f.starts_at}
          onChange={(e) => setF({...f, starts_at: e.target.value})}
        />
      </div>

      <div>
        <Label>Galería de imágenes</Label>
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
        <MediaUpload
          value={null}
          onChange={(u) => u && setImages([...images, u])}
          label="+ Añadir imagen"
        />
      </div>

      <div>
        <Label>Vídeo</Label>
        <MediaUpload kind="video" value={video} onChange={setVideo} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={published} onCheckedChange={(v) => setPublished(v === true)} />
        Publicado
      </label>
      <Button type="submit" disabled={pending}>{pending ? 'Guardando…' : 'Guardar'}</Button>
    </form>
  );
}
