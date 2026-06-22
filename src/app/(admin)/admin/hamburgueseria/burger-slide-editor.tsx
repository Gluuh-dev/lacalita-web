'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {toast} from 'sonner';
import {UtensilsCrossed} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {btn, btnGhost} from '@/components/admin/ui';
import HeroMedia from '@/components/admin/hero-media';
import {I18nField} from '@/components/admin/i18n-field';
import type {BurgerSlide} from '@/lib/queries';
import {saveBurgerSlide} from './actions';

export default function BurgerSlideEditor({slide}: {slide: BurgerSlide | null}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const back = '/admin/hamburgueseria';
  const [f, setF] = useState({
    name: slide?.name ?? '',
    price: slide?.price != null ? String(slide.price) : '',
    position: String(slide?.position ?? 0)
  });
  const [eyebrow, setEyebrow] = useState<Record<string, string>>(slide?.eyebrow ?? {es: ''});
  const [title, setTitle] = useState<Record<string, string>>(slide?.title ?? {es: ''});
  const [image, setImage] = useState<string | null>(slide?.image ?? null);
  const [active, setActive] = useState(slide?.active ?? true);

  function save() {
    start(async () => {
      const r = await saveBurgerSlide(slide?.id ?? null, {
        name: f.name,
        eyebrow,
        title,
        price: f.price === '' ? null : Number(f.price),
        image,
        position: Number(f.position) || 0,
        active
      });
      if (r.ok) {
        toast.success('Guardado');
        router.push(back);
        router.refresh();
      } else toast.error(r.error);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="space-y-4"
      >
        <div>
          <Label>Imagen de la hamburguesa (PNG recortado)</Label>
          <HeroMedia media={image ?? ''} mediaType="image" onSet={({media}) => setImage(media)} onClear={() => setImage(null)} />
        </div>
        <div>
          <Label>Nombre interno</Label>
          <Input value={f.name} onChange={(e) => setF({...f, name: e.target.value})} placeholder="La Doble Calita" />
        </div>
        <I18nField label="Eyebrow (rótulo superior)" value={eyebrow} onChange={setEyebrow} placeholder="Nuevo · Crujiente · De siempre" />
        <I18nField label="Título (grande)" value={title} onChange={setTitle} placeholder="la doble calita" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Precio (€)</Label>
            <Input type="number" step="0.01" value={f.price} onChange={(e) => setF({...f, price: e.target.value})} />
          </div>
          <div>
            <Label>Orden</Label>
            <Input type="number" value={f.position} onChange={(e) => setF({...f, position: e.target.value})} />
          </div>
        </div>
        <label className="flex items-center justify-between rounded-[12px] border border-line p-3 text-sm">
          Activa (visible en la web)
          <button type="button" onClick={() => setActive((v) => !v)} aria-label="Activa" className={`relative h-6 w-10 rounded-full transition ${active ? 'bg-brand' : 'bg-line-strong'}`}>
            <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${active ? 'left-[18px]' : 'left-0.5'}`} />
          </button>
        </label>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.push(back)} className={`${btnGhost} flex-1`}>Cancelar</button>
          <button type="submit" disabled={pending} className={`${btn} flex-1`}>{pending ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>

      {/* Previsualización */}
      <div className="lg:sticky lg:top-20 lg:h-fit">
        <div className="mb-2 font-adam text-[0.66rem] uppercase tracking-[0.12em] text-ink-3">Previsualización · así se verá en el hero</div>
        <div className="flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-[22px] p-8 text-center" style={{background: 'radial-gradient(120% 90% at 70% 0%, #241910, #150f08)'}}>
          {eyebrow.es && <div className="font-adam text-[0.7rem] uppercase tracking-[0.32em]" style={{color: '#dcb069'}}>{eyebrow.es}</div>}
          {title.es && <div className="mt-1 font-eight text-5xl leading-none text-white">{title.es}</div>}
          {image ? (
            <div className="relative mt-6 aspect-square w-full max-w-[16rem]">
              <Image src={image} alt="" fill sizes="256px" className="object-contain drop-shadow-2xl" />
            </div>
          ) : (
            <div className="mt-6 flex aspect-square w-full max-w-[16rem] items-center justify-center rounded-3xl border border-dashed border-white/15 text-white/30">
              <UtensilsCrossed className="size-12" />
            </div>
          )}
          {f.price && <div className="mt-4 font-eight text-3xl text-[#f4ede2]">{f.price} €</div>}
        </div>
      </div>
    </div>
  );
}
