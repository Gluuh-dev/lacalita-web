'use client';

import {useRef, useState} from 'react';
import {toast} from 'sonner';
import {UploadCloud, RefreshCw, Trash2} from 'lucide-react';
import {cn} from '@/lib/utils';
import {createClient} from '@/lib/supabase/client';
import {compressImage, captureVideoPoster} from '@/lib/compress';
import {removeMedia} from '@/lib/storage';
import {Progress} from '@/components/ui/progress';
import HeroPreview from './hero-preview';
import type {HeroSlide} from '@/lib/queries';

export default function HeroMedia({
  slide,
  device,
  onSet,
  onClear
}: {
  slide: HeroSlide;
  device: 'pc' | 'mobile';
  onSet: (m: {type: 'image' | 'video'; url: string; poster?: string}) => void;
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
        setProgress((p) => Math.max(p, 45));
      }
      const path = `${isImg ? 'image' : 'video'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const {error} = await supabase.storage.from('media').upload(path, body, {contentType: body.type || file.type});
      if (error) {
        toast.error(error.message);
        return;
      }
      const newUrl = supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
      if (slide.url) removeMedia(slide.url);
      if (slide.poster) removeMedia(slide.poster);

      let poster: string | undefined;
      if (isVid) {
        const pst = await captureVideoPoster(file);
        if (pst) {
          const pp = `poster/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
          const {error: pe} = await supabase.storage.from('media').upload(pp, pst, {contentType: 'image/webp'});
          if (!pe) poster = supabase.storage.from('media').getPublicUrl(pp).data.publicUrl;
        }
      }
      setProgress(100);
      onSet({type: isImg ? 'image' : 'video', url: newUrl, poster});
      toast.success(isImg ? 'Imagen subida' : 'Vídeo subido');
    } finally {
      clearInterval(timer);
      if (inputRef.current) inputRef.current.value = '';
      setTimeout(() => {
        setBusy(false);
        setProgress(0);
      }, 500);
    }
  }

  const pick = () => inputRef.current?.click();

  return (
    <div className="space-y-2">
      <div
        className="group relative"
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handle(f);
        }}
      >
        {slide.url ? (
          <>
            <HeroPreview slide={slide} device={device} />
            {/* Controles al pasar por encima */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
              <button
                type="button"
                onClick={pick}
                className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-medium hover:bg-white"
              >
                <RefreshCw className="size-4" /> Cambiar
              </button>
              <button
                type="button"
                onClick={() => {
                  removeMedia(slide.url);
                  removeMedia(slide.poster);
                  onClear();
                }}
                className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                <Trash2 className="size-4" /> Eliminar
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={pick}
            className={cn(
              'flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-center transition',
              drag ? 'border-brand bg-brand/5' : 'border-input hover:border-brand/60 hover:bg-accent/40',
              busy && 'pointer-events-none opacity-70'
            )}
          >
            <UploadCloud className="size-7 text-muted-foreground" />
            <span className="text-sm font-medium">Arrastra una imagen o vídeo, o haz clic</span>
            <span className="text-xs text-muted-foreground">La imagen se comprime · Vídeo MP4</span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handle(f);
          }}
        />
      </div>

      {busy && (
        <div className="space-y-1">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">Subiendo… {Math.round(progress)}%</p>
        </div>
      )}
    </div>
  );
}
