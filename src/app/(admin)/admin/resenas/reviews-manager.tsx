'use client';

import {useState, useTransition} from 'react';
import {Star, Pencil, Plus, Eye, EyeOff} from 'lucide-react';
import {toast} from 'sonner';
import {btn, btnGhost, btnEdit, card, input, label} from '@/components/admin/ui';
import DeleteButton from '@/components/admin/delete-button';
import FormFooter from '@/components/admin/form-footer';
import EmptyState from '@/components/admin/empty-state';
import type {Review} from '@/lib/queries';
import {saveReview, deleteReview, type ReviewInput} from './actions';

const vacia = (position: number): ReviewInput => ({
  author: '',
  text: '',
  rating: 5,
  source: 'Google',
  date: null,
  visible: true,
  position
});

export default function ReviewsManager({reviews}: {reviews: Review[]}) {
  // null = no hay formulario abierto; '' = una reseña nueva.
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ReviewInput>(vacia(0));
  const [pending, start] = useTransition();

  const abrir = (r?: Review) => {
    if (r) {
      setForm({author: r.author, text: r.text, rating: r.rating, source: r.source, date: r.date, visible: r.visible, position: r.position});
      setEditing(r.id);
    } else {
      setForm(vacia(reviews.length));
      setEditing('');
    }
  };

  const guardar = () => {
    if (!form.author.trim() || !form.text.trim()) {
      toast.error('Falta el nombre o el texto de la reseña.');
      return;
    }
    start(async () => {
      const res = await saveReview(editing || null, form);
      if (res.ok) {
        toast.success('Reseña guardada');
        setEditing(null);
      } else toast.error(res.error ?? 'No se pudo guardar');
    });
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-ink-3">
          Las que se ven en la portada. Cópialas de Google tal cual: no te inventes ninguna.
        </p>
        <button type="button" onClick={() => abrir()} className={`${btn} shrink-0 inline-flex items-center gap-1.5`}>
          <Plus className="size-4" /> Nueva reseña
        </button>
      </div>

      {editing !== null && (
        <div className={`${card} mb-5`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className={label}>Quién la escribe</span>
              <input className={input} value={form.author} onChange={(e) => setForm({...form, author: e.target.value})} placeholder="María G." />
            </div>
            <div>
              <span className={label}>De dónde sale</span>
              <input className={input} value={form.source ?? ''} onChange={(e) => setForm({...form, source: e.target.value})} placeholder="Google" />
            </div>
            <div className="sm:col-span-2">
              <span className={label}>Reseña</span>
              <textarea
                className={`${input} min-h-24 resize-y`}
                value={form.text}
                onChange={(e) => setForm({...form, text: e.target.value})}
                placeholder="Cenamos con la puesta de sol y…"
              />
            </div>
            <div>
              <span className={label}>Estrellas</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setForm({...form, rating: n})} aria-label={`${n} estrellas`} className="p-1">
                    <Star className={`size-6 ${n <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-line-strong'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className={label}>Fecha (opcional)</span>
              <input type="date" className={input} value={form.date ?? ''} onChange={(e) => setForm({...form, date: e.target.value || null})} />
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-ink-2">
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({...form, visible: e.target.checked})} />
            Se ve en la web
          </label>

          <FormFooter pending={pending} onCancel={() => setEditing(null)} onSave={guardar} />
        </div>
      )}

      {reviews.length === 0 && <EmptyState text="Aún no hay reseñas. Añade las de Google y aparecerán en la portada." />}

      <ul className="space-y-2">
        {reviews.map((r) => (
          <li key={r.id} className={`${card} flex items-start justify-between gap-3`}>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">{r.author}</span>
                <span className="flex">
                  {Array.from({length: r.rating}).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </span>
                {!r.visible && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-sunken px-2 py-0.5 text-[0.68rem] text-ink-3">
                    <EyeOff className="size-3" /> Oculta
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-ink-2">{r.text}</p>
              <div className="mt-1 text-xs text-ink-3">
                {r.source || 'Sin origen'}
                {r.date ? ` · ${new Date(r.date).toLocaleDateString('es-ES')}` : ''}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button type="button" onClick={() => abrir(r)} className={btnEdit}>
                <Pencil className="size-3.5" /> Editar
              </button>
              <DeleteButton onDelete={() => deleteReview(r.id)} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
