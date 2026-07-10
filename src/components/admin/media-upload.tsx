'use client';

import {useRef, useState} from 'react';
import {toast} from 'sonner';
import {UploadCloud} from 'lucide-react';
import {cn} from '@/lib/utils';
import {createClient} from '@/lib/supabase/client';
import {compressImage, captureVideoPoster} from '@/lib/compress';
import {removeMedia} from '@/lib/storage';
import {Progress} from '@/components/ui/progress';

export default function MediaUpload({
  value,
  onChange,
  onPoster,
  kind = 'image',
  label,
  multiple = false,
  maxDim = 2000,
  tile = false
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  onPoster?: (url: string | null) => void;
  kind?: 'image' | 'video';
  label?: string;
  multiple?: boolean;
  maxDim?: number;
  tile?: boolean; // casilla cuadrada para encajar como primer hueco de una rejilla
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [note, setNote] = useState('');
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sube un archivo (comprime imágenes a WebP) y devuelve su URL pública.
  async function uploadOne(file: File): Promise<string | null> {
    const supabase = createClient();
    let body: Blob = file;
    let ext = (file.name.split('.').pop() || 'bin').toLowerCase();
    if (kind === 'image') {
      body = await compressImage(file, maxDim);
      if (body.type === 'image/webp') ext = 'webp';
    }
    const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const {error} = await supabase.storage.from('media').upload(path, body, {contentType: body.type || file.type});
    if (error) {
      toast.error(error.message);
      return null;
    }
    const url = supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
    if (kind === 'video' && onPoster) {
      const poster = await captureVideoPoster(file);
      if (poster) {
        const ppath = `poster/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
        const {error: perr} = await supabase.storage.from('media').upload(ppath, poster, {contentType: 'image/webp'});
        if (!perr) onPoster(supabase.storage.from('media').getPublicUrl(ppath).data.publicUrl);
      }
    }
    return url;
  }

  // Subidas en paralelo. El cuello de botella es la red, no la compresión, así
  // que encadenarlas de una en una multiplicaba el tiempo por el nº de fotos.
  const CONCURRENCY = 4;

  async function handleFiles(list: File[]) {
    const valid = list.filter((f) => (kind === 'image' ? f.type.startsWith('image/') : f.type.startsWith('video/')));
    if (valid.length === 0) {
      toast.error(kind === 'video' ? 'Eso no es un vídeo' : 'Eso no es una imagen');
      return;
    }
    setBusy(true);
    if (value && !multiple) removeMedia(value); // al reemplazar (modo único)

    const urls: (string | null)[] = new Array(valid.length).fill(null);
    let done = 0;
    let next = 0;
    setProgress(4);
    setNote(valid.length > 1 ? `Comprimiendo y subiendo 0/${valid.length}` : '');

    const worker = async () => {
      while (next < valid.length) {
        const i = next++;
        urls[i] = await uploadOne(valid[i]);
        done++;
        setProgress(Math.round((done / valid.length) * 100));
        setNote(valid.length > 1 ? `Comprimiendo y subiendo ${done}/${valid.length}` : '');
      }
    };
    await Promise.all(Array.from({length: Math.min(CONCURRENCY, valid.length)}, worker));

    // Se emiten al final y en orden: al terminar en desorden, las fotos se
    // guardarían barajadas respecto a como las eligió el usuario.
    let ok = 0;
    for (const url of urls) {
      if (url) {
        onChange(url);
        ok++;
      }
    }

    if (ok > 0) toast.success(ok > 1 ? `${ok} imágenes subidas` : kind === 'video' ? 'Vídeo subido' : 'Imagen subida');
    if (inputRef.current) inputRef.current.value = '';
    setTimeout(() => {
      setBusy(false);
      setProgress(0);
      setNote('');
    }, 400);
  }

  // Handlers de la zona de soltar, compartidos por el modo normal y el modo tile.
  const dz = {
    role: 'button' as const,
    tabIndex: 0,
    onClick: () => !busy && inputRef.current?.click(),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        inputRef.current?.click();
      }
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(true);
    },
    onDragLeave: () => setDrag(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      handleFiles(Array.from(e.dataTransfer.files ?? []));
    }
  };

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      aria-label="Añadir archivo"
      accept={kind === 'video' ? 'video/*' : 'image/*'}
      multiple={multiple && kind === 'image'}
      className="hidden"
      onChange={(e) => handleFiles(Array.from(e.target.files ?? []))}
    />
  );

  // Casilla cuadrada: encaja como primer hueco de la rejilla de miniaturas, con
  // el progreso superpuesto para no alterar la altura de la celda.
  if (tile) {
    return (
      <div
        {...dz}
        className={cn(
          'relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-1 text-center transition',
          drag ? 'border-brand bg-brand/5' : 'border-input hover:border-brand/60 hover:bg-accent/40',
          busy && 'pointer-events-none'
        )}
      >
        <UploadCloud className="size-5 text-muted-foreground" />
        <span className="px-1 text-[0.66rem] font-medium leading-tight">{label ?? '+ Añadir'}</span>
        {busy && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-lg bg-bg/85 backdrop-blur">
            <span className="text-sm font-semibold text-brand">{Math.round(progress)}%</span>
            <span className="px-1 text-[0.58rem] leading-tight text-muted-foreground">{note || 'Subiendo…'}</span>
          </div>
        )}
        {fileInput}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="flex items-center gap-3">
          {kind === 'video' ? (
            <video src={value} muted className="h-20 w-28 rounded-lg object-cover ring-1 ring-black/10" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-20 w-20 rounded-lg object-cover ring-1 ring-black/10" />
          )}
          <button
            type="button"
            onClick={() => {
              removeMedia(value);
              onChange(null);
            }}
            className="text-sm text-destructive hover:underline"
          >
            Quitar
          </button>
        </div>
      )}

      <div
        {...dz}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center transition',
          drag ? 'border-brand bg-brand/5' : 'border-input hover:border-brand/60 hover:bg-accent/40',
          busy && 'pointer-events-none opacity-70'
        )}
      >
        <UploadCloud className="size-5 text-muted-foreground" />
        <span className="text-sm font-medium">
          {label ?? (value ? 'Cambiar' : 'Arrastra aquí o haz clic')}
        </span>
        <span className="text-xs text-muted-foreground">
          {kind === 'video' ? 'Vídeo (MP4)' : multiple ? 'Imágenes — se comprimen solas (puedes elegir varias)' : 'Imagen — se comprime sola'}
        </span>
        {fileInput}
      </div>

      {busy && (
        <div className="space-y-1">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">{note || `Subiendo… ${Math.round(progress)}%`}</p>
        </div>
      )}
    </div>
  );
}
