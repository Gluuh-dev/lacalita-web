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
  label
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  onPoster?: (url: string | null) => void;
  kind?: 'image' | 'video';
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (kind === 'image' && !file.type.startsWith('image/')) {
      toast.error('Eso no es una imagen');
      return;
    }
    if (kind === 'video' && !file.type.startsWith('video/')) {
      toast.error('Eso no es un vídeo');
      return;
    }
    setBusy(true);
    setProgress(10);
    const timer = setInterval(
      () => setProgress((p) => Math.min(p + Math.random() * 14, 92)),
      220
    );
    try {
      const supabase = createClient();
      let body: Blob = file;
      let ext = (file.name.split('.').pop() || 'bin').toLowerCase();
      if (kind === 'image') {
        body = await compressImage(file);
        if (body.type === 'image/webp') ext = 'webp';
        setProgress((p) => Math.max(p, 45));
      }
      const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const {error} = await supabase.storage
        .from('media')
        .upload(path, body, {contentType: body.type || file.type});
      if (error) {
        toast.error(error.message);
        return;
      }
      const {data} = supabase.storage.from('media').getPublicUrl(path);
      setProgress(100);
      if (value) removeMedia(value); // borra el anterior al reemplazar
      onChange(data.publicUrl);
      toast.success(kind === 'video' ? 'Vídeo subido' : 'Imagen subida');

      // Poster automático (primer fotograma) para vídeos
      if (kind === 'video' && onPoster) {
        const poster = await captureVideoPoster(file);
        if (poster) {
          const ppath = `poster/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
          const {error: perr} = await supabase.storage
            .from('media')
            .upload(ppath, poster, {contentType: 'image/webp'});
          if (!perr) onPoster(supabase.storage.from('media').getPublicUrl(ppath).data.publicUrl);
        }
      }
    } finally {
      clearInterval(timer);
      if (inputRef.current) inputRef.current.value = '';
      setTimeout(() => {
        setBusy(false);
        setProgress(0);
      }, 500);
    }
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
        role="button"
        tabIndex={0}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
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
          {kind === 'video' ? 'Vídeo (MP4)' : 'Imagen — se comprime sola'}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={kind === 'video' ? 'video/*' : 'image/*'}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {busy && (
        <div className="space-y-1">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">
            Subiendo… {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}
