'use client';

import {useRef, useState} from 'react';
import {toast} from 'sonner';
import {UploadCloud, RefreshCw, Trash2, Play} from 'lucide-react';
import {cn} from '@/lib/utils';
import {createClient} from '@/lib/supabase/client';
import {compressImage, captureVideoPoster} from '@/lib/compress';
import {removeMedia} from '@/lib/storage';
import {Progress} from '@/components/ui/progress';

export default function HeroMedia({
  media,
  mediaType,
  poster,
  onSet,
  onClear
}: {
  media: string;
  mediaType: 'image' | 'video';
  poster?: string;
  onSet: (m: {media: string; mediaType: 'image' | 'video'; poster?: string}) => void;
  onClear: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handle(file: File) {
    const isImg = file.type.startsWith('image/');
    const isVid = file.type.startsWith('video/');
    if (!isImg && !isVid) {
      toast.error('Sube una imagen o un vídeo');
      return;
    }
    setBusy(true);
    setProgress(10);
    const timer = setInterval(() => setProgress((p) => Math.min(p + Math.random() * 14, 92)), 220);
    try {
      const supabase = createClient();
      let body: Blob = file;
      let ext = (file.name.split('.').pop() || 'bin').toLowerCase();
      if (isImg) {
        body = await compressImage(file);
        if (body.type === 'image/webp') ext = 'webp';
      }
      const path = `${isImg ? 'image' : 'video'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const {error} = await supabase.storage.from('media').upload(path, body, {contentType: body.type || file.type});
      if (error) {
        toast.error(error.message);
        return;
      }
      const url = supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
      let newPoster: string | undefined;
      if (isVid) {
        try {
          const posterBlob = await captureVideoPoster(file);
          if (posterBlob) {
            const pPath = `image/${Date.now()}-poster.webp`;
            await supabase.storage.from('media').upload(pPath, posterBlob, {contentType: 'image/webp'});
            newPoster = supabase.storage.from('media').getPublicUrl(pPath).data.publicUrl;
          }
        } catch {
          /* sin poster */
        }
      }
      if (media) removeMedia(media);
      if (poster) removeMedia(poster);
      onSet({media: url, mediaType: isImg ? 'image' : 'video', poster: newPoster});
      setProgress(100);
    } finally {
      clearInterval(timer);
      setTimeout(() => {
        setBusy(false);
        setProgress(0);
      }, 400);
    }
  }

  function clear() {
    if (media) removeMedia(media);
    if (poster) removeMedia(poster);
    onClear();
  }

  if (media) {
    return (
      <div className="group relative aspect-video overflow-hidden rounded-[14px] border border-line bg-surface-sunken">
        {mediaType === 'video' ? (
          <video src={media} poster={poster} muted loop className="h-full w-full object-cover" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media} alt="" className="h-full w-full object-cover" />
        )}
        {mediaType === 'video' && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-xs text-white">
            <Play className="size-3" /> vídeo
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition group-hover:opacity-100">
          <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-ink shadow">
            <RefreshCw className="size-4" /> Cambiar
          </button>
          <button type="button" onClick={clear} className="inline-flex items-center gap-1.5 rounded-full bg-danger px-3 py-1.5 text-sm font-medium text-white shadow">
            <Trash2 className="size-4" /> Eliminar
          </button>
        </div>
        <input ref={inputRef} type="file" accept="image/*,video/*" hidden onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])} />
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (e.dataTransfer.files?.[0]) handle(e.dataTransfer.files[0]);
      }}
      className={cn(
        'flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed bg-surface-2 text-center text-sm text-ink-3 transition',
        drag ? 'border-brand bg-accent-soft' : 'border-line-strong hover:border-brand'
      )}
    >
      {busy ? (
        <div className="w-2/3">
          <Progress value={progress} />
          <p className="mt-2 text-xs">Subiendo… {Math.round(progress)}%</p>
        </div>
      ) : (
        <>
          <UploadCloud className="size-7 text-ink-3" />
          <p>
            Arrastra una <b>imagen</b> o un <b>vídeo</b>, o pulsa para elegir
          </p>
        </>
      )}
      <input ref={inputRef} type="file" accept="image/*,video/*" hidden onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])} />
    </div>
  );
}
