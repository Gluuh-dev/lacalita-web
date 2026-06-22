'use client';

import {useState, useTransition} from 'react';
import {toast} from 'sonner';
import {Plus, Trash2} from 'lucide-react';
import {input as inputCls, label as labelCls, btn, btnGhost} from '@/components/admin/ui';
import MediaUpload from '@/components/admin/media-upload';
import {removeMedia} from '@/lib/storage';
import {saveContent} from './actions';
import {DEFAULT_CONTENT, type LandingContent} from '@/lib/content-types';

export default function ContentForm({initial}: {initial: LandingContent}) {
  const D = DEFAULT_CONTENT;
  const [aboutTitle, setAboutTitle] = useState(initial.about?.title?.es ?? D.about.title!.es ?? '');
  const [aboutText, setAboutText] = useState(initial.about?.text?.es ?? D.about.text!.es ?? '');
  const [features, setFeatures] = useState<string[]>(initial.about?.features ?? D.about.features ?? ['', '', '']);
  const [storyTitle, setStoryTitle] = useState(initial.story?.title?.es ?? D.story.title!.es ?? '');
  const [storyText, setStoryText] = useState(initial.story?.text?.es ?? D.story.text!.es ?? '');
  const [reviews, setReviews] = useState(initial.reviews ?? []);
  const [gallery, setGallery] = useState<string[]>(initial.gallery ?? []);
  const [pending, start] = useTransition();

  function save() {
    start(async () => {
      const r = await saveContent({aboutTitle, aboutText, features, storyTitle, storyText, reviews, gallery});
      if (r.ok) toast.success('Contenido guardado');
      else toast.error(r.error);
    });
  }

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      {/* Sobre el sitio */}
      <Card title="Sobre el sitio">
        <Field label="Título">
          <input className={inputCls} value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} />
        </Field>
        <Field label="Texto">
          <textarea className={inputCls} rows={3} value={aboutText} onChange={(e) => setAboutText(e.target.value)} />
        </Field>
        <Field label="Distintivos (3)">
          <div className="grid gap-2 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                className={inputCls}
                value={features[i] ?? ''}
                placeholder={['A pie de playa', 'Cocina mediterránea', 'Música en directo'][i]}
                onChange={(e) => setFeatures((arr) => arr.map((f, j) => (j === i ? e.target.value : f)))}
              />
            ))}
          </div>
        </Field>
      </Card>

      {/* Historia */}
      <Card title="Nuestra historia">
        <Field label="Título">
          <input className={inputCls} value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} />
        </Field>
        <Field label="Texto">
          <textarea className={inputCls} rows={4} value={storyText} onChange={(e) => setStoryText(e.target.value)} />
        </Field>
      </Card>

      {/* Reseñas */}
      <Card title="Reseñas">
        <div className="flex flex-col gap-3">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-[14px] border border-line p-3">
              <textarea
                className={`${inputCls} mb-2`}
                rows={2}
                placeholder="Reseña…"
                value={r.quote}
                onChange={(e) => setReviews((arr) => arr.map((x, j) => (j === i ? {...x, quote: e.target.value} : x)))}
              />
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  placeholder="Autor/a"
                  value={r.author}
                  onChange={(e) => setReviews((arr) => arr.map((x, j) => (j === i ? {...x, author: e.target.value} : x)))}
                />
                <button onClick={() => setReviews((arr) => arr.filter((_, j) => j !== i))} className="shrink-0 p-2 text-ink-3 hover:text-danger" aria-label="Eliminar">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => setReviews((arr) => [...arr, {quote: '', author: ''}])} className={`${btnGhost} inline-flex w-fit items-center gap-1.5`}>
            <Plus className="size-4" /> Añadir reseña
          </button>
        </div>
      </Card>

      {/* Galería */}
      <Card title="Galería de fotos">
        {gallery.length > 0 && (
          <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {gallery.map((url, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-[12px] border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => {
                    removeMedia(url);
                    setGallery((arr) => arr.filter((u) => u !== url));
                  }}
                  className="absolute right-1 top-1 rounded-full bg-danger p-1 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Eliminar"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <MediaUpload value={null} kind="image" label="Añadir foto" onChange={(url) => url && setGallery((arr) => [...arr, url])} />
      </Card>

      <button onClick={save} disabled={pending} className={`${btn} w-fit`}>
        {pending ? 'Guardando…' : 'Guardar contenido'}
      </button>
    </div>
  );
}

function Card({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <div className="flex flex-col gap-3.5 rounded-[20px] border border-line bg-surface p-5 shadow-sm">
      <div className="eyebrow">{title}</div>
      {children}
    </div>
  );
}

function Field({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}
