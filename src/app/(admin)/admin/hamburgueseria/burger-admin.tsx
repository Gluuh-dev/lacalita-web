'use client';

import {useTransition} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {toast} from 'sonner';
import {Plus, Pencil, Trash2, Star, Image as ImageIcon} from 'lucide-react';
import {btn} from '@/components/admin/ui';
import {tx} from '@/lib/localize';
import {isVideoUrl} from '@/lib/utils';
import type {BurgerSlide, BurgerOffer} from '@/lib/queries';
import {deleteBurgerSlide, deleteBurgerOffer, toggleBurgerSlide, toggleBurgerOffer} from './actions';

function Switch({on, onClick}: {on: boolean; onClick: () => void}) {
  return (
    <button type="button" onClick={onClick} aria-label="Activa" className={`relative h-6 w-10 shrink-0 rounded-full transition ${on ? 'bg-brand' : 'bg-line-strong'}`}>
      <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  );
}
function Thumb({src}: {src: string | null}) {
  return (
    <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-sunken text-line-strong">
      {src ? (
        isVideoUrl(src) ? (
          <video src={src} muted playsInline className="h-full w-full object-contain" />
        ) : (
          <Image src={src} alt="" fill sizes="48px" className="object-contain" />
        )
      ) : (
        <ImageIcon className="size-5" />
      )}
    </span>
  );
}

export default function BurgerAdmin({slides, offers}: {slides: BurgerSlide[]; offers: BurgerOffer[]}) {
  const router = useRouter();
  const [, start] = useTransition();

  function togSlide(s: BurgerSlide) {
    start(async () => {
      const r = await toggleBurgerSlide(s.id, !s.active);
      if (r.ok) router.refresh();
      else toast.error(r.error);
    });
  }
  function delSlide(s: BurgerSlide) {
    if (!confirm('¿Eliminar esta diapositiva?')) return;
    start(async () => {
      const r = await deleteBurgerSlide(s.id);
      if (r.ok) router.refresh();
      else toast.error(r.error);
    });
  }
  function togOffer(o: BurgerOffer) {
    start(async () => {
      const r = await toggleBurgerOffer(o.id, !o.active);
      if (r.ok) router.refresh();
      else toast.error(r.error);
    });
  }
  function delOffer(o: BurgerOffer) {
    if (!confirm('¿Eliminar esta oferta?')) return;
    start(async () => {
      const r = await deleteBurgerOffer(o.id);
      if (r.ok) router.refresh();
      else toast.error(r.error);
    });
  }

  return (
    <div className="flex max-w-4xl flex-col gap-10">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold">Portada · diapositivas del hero</h2>
            <p className="text-sm text-ink-3">Las hamburguesas que pasan en el slider del inicio.</p>
          </div>
          <Link href="/admin/hamburgueseria/hero/nuevo" className={`${btn} inline-flex items-center gap-1.5`}>
            <Plus className="size-4" /> Añadir
          </Link>
        </div>
        <div className="overflow-hidden rounded-[18px] border border-line bg-surface">
          {slides.length === 0 ? (
            <p className="p-5 text-sm text-ink-3">Sin diapositivas.</p>
          ) : (
            slides.map((s) => (
              <div key={s.id} className="flex items-center gap-3 border-b border-line p-3 last:border-0">
                <Thumb src={s.image} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-ink">{s.name || tx(s.title, 'es') || 'Sin nombre'}</div>
                  <div className="truncate text-xs text-ink-3">{tx(s.eyebrow, 'es')}{s.price != null ? ` · ${s.price} €` : ''}</div>
                </div>
                <Switch on={s.active} onClick={() => togSlide(s)} />
                <Link href={`/admin/hamburgueseria/hero/${s.id}`} aria-label="Editar" className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink"><Pencil className="size-4" /></Link>
                <button onClick={() => delSlide(s)} aria-label="Eliminar" className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-danger"><Trash2 className="size-4" /></button>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold">Ofertas</h2>
            <p className="text-sm text-ink-3">Las tarjetas de ofertas de la landing.</p>
          </div>
          <Link href="/admin/hamburgueseria/oferta/nuevo" className={`${btn} inline-flex items-center gap-1.5`}>
            <Plus className="size-4" /> Añadir
          </Link>
        </div>
        <div className="overflow-hidden rounded-[18px] border border-line bg-surface">
          {offers.length === 0 ? (
            <p className="p-5 text-sm text-ink-3">Sin ofertas.</p>
          ) : (
            offers.map((o) => (
              <div key={o.id} className="flex items-center gap-3 border-b border-line p-3 last:border-0">
                <Thumb src={o.image} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 truncate font-medium text-ink">
                    {tx(o.title, 'es') || 'Sin título'}
                    {o.rating != null && <span className="inline-flex items-center gap-0.5 text-xs text-ink-3"><Star className="size-3 fill-brand text-brand" /> {o.rating}</span>}
                  </div>
                  <div className="truncate text-xs text-ink-3">{tx(o.eyebrow, 'es')}{o.discount_label ? ` · ${o.discount_label}` : ''}{o.price != null ? ` · ${o.price} €` : ''}</div>
                </div>
                <Switch on={o.active} onClick={() => togOffer(o)} />
                <Link href={`/admin/hamburgueseria/oferta/${o.id}`} aria-label="Editar" className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink"><Pencil className="size-4" /></Link>
                <button onClick={() => delOffer(o)} aria-label="Eliminar" className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-danger"><Trash2 className="size-4" /></button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
