'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {toast} from 'sonner';
import {Star, ArrowRight, UtensilsCrossed} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from '@/components/ui/select';
import {btn, btnGhost} from '@/components/admin/ui';
import HeroMedia from '@/components/admin/hero-media';
import type {BurgerOffer} from '@/lib/queries';
import {saveBurgerOffer} from './actions';

const STYLES: Record<string, {card: string; text: string; sub: string; btn: string; btnText: string; ribbon: string; ribbonText: string}> = {
  orange: {card: 'linear-gradient(150deg,#f26b21,#c9531a)', text: '#fff', sub: 'rgba(255,255,255,.85)', btn: '#1a1209', btnText: '#fff', ribbon: '#f4d58c', ribbonText: '#7a3a10'},
  dark: {card: 'linear-gradient(150deg,#2a1d11,#15100a)', text: '#f4ede2', sub: 'rgba(244,237,226,.7)', btn: '#e7b46a', btnText: '#1a1209', ribbon: '#e7b46a', ribbonText: '#1a1209'},
  gold: {card: 'linear-gradient(150deg,#dcb069,#b98e44)', text: '#231708', sub: 'rgba(35,23,8,.75)', btn: '#1a1209', btnText: '#fff', ribbon: '#1a1209', ribbonText: '#e7b46a'}
};

export default function BurgerOfferEditor({offer}: {offer: BurgerOffer | null}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const back = '/admin/hamburgueseria';
  const [f, setF] = useState({
    title: offer?.title ?? '',
    eyebrow: offer?.eyebrow ?? '',
    rating: offer?.rating != null ? String(offer.rating) : '',
    description: offer?.description ?? '',
    discount_label: offer?.discount_label ?? '',
    price: offer?.price != null ? String(offer.price) : '',
    old_price: offer?.old_price != null ? String(offer.old_price) : '',
    position: String(offer?.position ?? 0)
  });
  const [colorStyle, setColorStyle] = useState(offer?.color_style ?? 'orange');
  const [image, setImage] = useState<string | null>(offer?.image ?? null);
  const [active, setActive] = useState(offer?.active ?? true);
  const st = STYLES[colorStyle] ?? STYLES.orange;

  function save() {
    start(async () => {
      const r = await saveBurgerOffer(offer?.id ?? null, {
        title: f.title,
        eyebrow: f.eyebrow,
        rating: f.rating === '' ? null : Number(f.rating),
        description: f.description,
        discount_label: f.discount_label,
        price: f.price === '' ? null : Number(f.price),
        old_price: f.old_price === '' ? null : Number(f.old_price),
        color_style: colorStyle,
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
          <Label>Imagen de la hamburguesa</Label>
          <HeroMedia media={image ?? ''} mediaType="image" onSet={({media}) => setImage(media)} onClear={() => setImage(null)} />
        </div>
        <div>
          <Label>Título</Label>
          <Input value={f.title} onChange={(e) => setF({...f, title: e.target.value})} placeholder="Special Beef Burger" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Etiqueta (eyebrow)</Label>
            <Input value={f.eyebrow} onChange={(e) => setF({...f, eyebrow: e.target.value})} placeholder="Oferta estrella" />
          </div>
          <div>
            <Label>Valoración (★)</Label>
            <Input type="number" step="0.1" min="0" max="5" value={f.rating} onChange={(e) => setF({...f, rating: e.target.value})} placeholder="4.9" />
          </div>
        </div>
        <div>
          <Label>Descripción</Label>
          <Input value={f.description} onChange={(e) => setF({...f, description: e.target.value})} placeholder="Doble carne, cheddar y bacon ahumado." />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Descuento</Label>
            <Input value={f.discount_label} onChange={(e) => setF({...f, discount_label: e.target.value})} placeholder="-45% / 2x1" />
          </div>
          <div>
            <Label>Precio (€)</Label>
            <Input type="number" step="0.01" value={f.price} onChange={(e) => setF({...f, price: e.target.value})} />
          </div>
          <div>
            <Label>Precio anterior</Label>
            <Input type="number" step="0.01" value={f.old_price} onChange={(e) => setF({...f, old_price: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Estilo de color</Label>
            <Select value={colorStyle} onValueChange={(v) => setColorStyle(v ?? 'orange')}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="orange">Naranja</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="gold">Dorado</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
        <div className="mb-2 font-adam text-[0.66rem] uppercase tracking-[0.12em] text-ink-3">Previsualización · tarjeta de oferta</div>
        <div className="rounded-[24px] p-6" style={{background: '#1a1209'}}>
          <article className="relative flex min-h-[340px] max-w-sm flex-col overflow-hidden rounded-[22px] p-6" style={{background: st.card, color: st.text}}>
            {f.discount_label && <span className="absolute -right-9 top-5 z-10 rotate-45 px-10 py-1 text-center text-xs font-bold" style={{background: st.ribbon, color: st.ribbonText}}>{f.discount_label}</span>}
            {image && (
              <div className="pointer-events-none absolute -bottom-3 right-0 h-60 w-36 opacity-95">
                <Image src={image} alt="" fill sizes="150px" className="object-contain drop-shadow-2xl" />
              </div>
            )}
            <div className="relative z-[1] flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.14em]" style={{color: st.sub}}>
              {f.eyebrow || 'Oferta'}
              {f.rating && <span className="inline-flex items-center gap-0.5" style={{color: st.text}}><Star className="size-3 fill-current" /> {f.rating}</span>}
            </div>
            <h3 className="relative z-[1] mt-2 max-w-[6.5em] font-eight text-3xl leading-[0.95]">{f.title || 'Título de la oferta'}</h3>
            {f.description && <p className="relative z-[1] mt-2 line-clamp-3 max-w-[10em] text-sm" style={{color: st.sub}}>{f.description}</p>}
            <span className="relative z-[1] mt-auto inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold" style={{background: st.btn, color: st.btnText}}>
              Ver la oferta <ArrowRight className="size-4" />
            </span>
            <div className="relative z-[1] mt-3 flex items-end gap-2 font-eight text-2xl">
              {f.price && <span>{f.price} €</span>}
              {f.old_price && <span className="text-base line-through opacity-60">{f.old_price} €</span>}
            </div>
            {!image && (
              <div className="absolute bottom-4 right-4 text-white/15"><UtensilsCrossed className="size-10" /></div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
