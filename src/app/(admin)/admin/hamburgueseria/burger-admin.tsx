'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {toast} from 'sonner';
import {Plus, Pencil, Trash2, Star, Image as ImageIcon, GripVertical} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from '@/components/ui/select';
import {btn, btnGhost} from '@/components/admin/ui';
import Drawer from '@/components/admin/drawer';
import HeroMedia from '@/components/admin/hero-media';
import type {BurgerSlide, BurgerOffer} from '@/lib/queries';
import {saveBurgerSlide, saveBurgerOffer, deleteBurgerSlide, deleteBurgerOffer, toggleBurgerSlide, toggleBurgerOffer} from './actions';

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
      {src ? <Image src={src} alt="" fill sizes="48px" className="object-contain" /> : <ImageIcon className="size-5" />}
    </span>
  );
}

function Footer({pending, onCancel}: {pending: boolean; onCancel: () => void}) {
  return (
    <div className="flex shrink-0 gap-3 border-t border-line bg-bg p-4">
      <button type="button" onClick={onCancel} className={`${btnGhost} flex-1`}>Cancelar</button>
      <button type="submit" disabled={pending} className={`${btn} flex-1`}>{pending ? 'Guardando…' : 'Guardar'}</button>
    </div>
  );
}

// ---------------- Diapositivas de portada ----------------
function SlideForm({slide, onDone}: {slide: BurgerSlide | null; onDone: () => void}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [f, setF] = useState({
    name: slide?.name ?? '',
    eyebrow: slide?.eyebrow ?? '',
    title: slide?.title ?? '',
    price: slide?.price != null ? String(slide.price) : '',
    position: String(slide?.position ?? 0)
  });
  const [image, setImage] = useState<string | null>(slide?.image ?? null);
  const [active, setActive] = useState(slide?.active ?? true);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await saveBurgerSlide(slide?.id ?? null, {
        name: f.name,
        eyebrow: f.eyebrow,
        title: f.title,
        price: f.price === '' ? null : Number(f.price),
        image,
        position: Number(f.position) || 0,
        active
      });
      if (r.ok) {
        toast.success('Guardado');
        router.refresh();
        onDone();
      } else toast.error(r.error);
    });
  }

  return (
    <form onSubmit={submit} className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <div>
          <Label>Imagen de la hamburguesa (PNG recortado)</Label>
          <HeroMedia media={image ?? ''} mediaType="image" onSet={({media}) => setImage(media)} onClear={() => setImage(null)} />
        </div>
        <div>
          <Label>Nombre interno</Label>
          <Input value={f.name} onChange={(e) => setF({...f, name: e.target.value})} placeholder="La Doble Calita" />
        </div>
        <div>
          <Label>Eyebrow (rótulo superior)</Label>
          <Input value={f.eyebrow} onChange={(e) => setF({...f, eyebrow: e.target.value})} placeholder="Nuevo · Crujiente · De siempre" />
        </div>
        <div>
          <Label>Título (grande)</Label>
          <Input value={f.title} onChange={(e) => setF({...f, title: e.target.value})} placeholder="la doble calita" />
        </div>
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
          Activa (visible en la web) <Switch on={active} onClick={() => setActive((v) => !v)} />
        </label>
      </div>
      <Footer pending={pending} onCancel={onDone} />
    </form>
  );
}

function SlidesManager({slides}: {slides: BurgerSlide[]}) {
  const router = useRouter();
  const [, start] = useTransition();
  const [edit, setEdit] = useState<BurgerSlide | null | undefined>(undefined);
  const open = edit !== undefined;

  function tog(s: BurgerSlide) {
    start(async () => {
      const r = await toggleBurgerSlide(s.id, !s.active);
      if (r.ok) router.refresh();
      else toast.error(r.error);
    });
  }
  function del(s: BurgerSlide) {
    if (!confirm('¿Eliminar esta diapositiva?')) return;
    start(async () => {
      const r = await deleteBurgerSlide(s.id);
      if (r.ok) router.refresh();
      else toast.error(r.error);
    });
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold">Portada · diapositivas del hero</h2>
          <p className="text-sm text-ink-3">Las hamburguesas que pasan en el slider del inicio.</p>
        </div>
        <button onClick={() => setEdit(null)} className={`${btn} inline-flex items-center gap-1.5`}>
          <Plus className="size-4" /> Añadir
        </button>
      </div>
      <div className="overflow-hidden rounded-[18px] border border-line bg-surface">
        {slides.length === 0 ? (
          <p className="p-5 text-sm text-ink-3">Sin diapositivas.</p>
        ) : (
          slides.map((s) => (
            <div key={s.id} className="flex items-center gap-3 border-b border-line p-3 last:border-0">
              <GripVertical className="size-4 text-ink-3" />
              <Thumb src={s.image} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-ink">{s.name || s.title || 'Sin nombre'}</div>
                <div className="truncate text-xs text-ink-3">{s.eyebrow}{s.price != null ? ` · ${s.price} €` : ''}</div>
              </div>
              <Switch on={s.active} onClick={() => tog(s)} />
              <button onClick={() => setEdit(s)} aria-label="Editar" className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink"><Pencil className="size-4" /></button>
              <button onClick={() => del(s)} aria-label="Eliminar" className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-danger"><Trash2 className="size-4" /></button>
            </div>
          ))
        )}
      </div>
      <Drawer open={open} title={edit ? 'Editar diapositiva' : 'Nueva diapositiva'} onClose={() => setEdit(undefined)} flush>
        {open && <SlideForm slide={edit ?? null} onDone={() => setEdit(undefined)} />}
      </Drawer>
    </section>
  );
}

// ---------------- Ofertas ----------------
function OfferForm({offer, onDone}: {offer: BurgerOffer | null; onDone: () => void}) {
  const router = useRouter();
  const [pending, start] = useTransition();
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

  function submit(e: React.FormEvent) {
    e.preventDefault();
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
        router.refresh();
        onDone();
      } else toast.error(r.error);
    });
  }

  return (
    <form onSubmit={submit} className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
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
          Activa (visible en la web) <Switch on={active} onClick={() => setActive((v) => !v)} />
        </label>
      </div>
      <Footer pending={pending} onCancel={onDone} />
    </form>
  );
}

function OffersManager({offers}: {offers: BurgerOffer[]}) {
  const router = useRouter();
  const [, start] = useTransition();
  const [edit, setEdit] = useState<BurgerOffer | null | undefined>(undefined);
  const open = edit !== undefined;

  function tog(o: BurgerOffer) {
    start(async () => {
      const r = await toggleBurgerOffer(o.id, !o.active);
      if (r.ok) router.refresh();
      else toast.error(r.error);
    });
  }
  function del(o: BurgerOffer) {
    if (!confirm('¿Eliminar esta oferta?')) return;
    start(async () => {
      const r = await deleteBurgerOffer(o.id);
      if (r.ok) router.refresh();
      else toast.error(r.error);
    });
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold">Ofertas</h2>
          <p className="text-sm text-ink-3">Las tarjetas de ofertas de la landing.</p>
        </div>
        <button onClick={() => setEdit(null)} className={`${btn} inline-flex items-center gap-1.5`}>
          <Plus className="size-4" /> Añadir
        </button>
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
                  {o.title || 'Sin título'}
                  {o.rating != null && <span className="inline-flex items-center gap-0.5 text-xs text-ink-3"><Star className="size-3 fill-brand text-brand" /> {o.rating}</span>}
                </div>
                <div className="truncate text-xs text-ink-3">{o.eyebrow}{o.discount_label ? ` · ${o.discount_label}` : ''}{o.price != null ? ` · ${o.price} €` : ''}</div>
              </div>
              <Switch on={o.active} onClick={() => tog(o)} />
              <button onClick={() => setEdit(o)} aria-label="Editar" className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink"><Pencil className="size-4" /></button>
              <button onClick={() => del(o)} aria-label="Eliminar" className="rounded-md p-1.5 text-ink-3 hover:bg-surface-2 hover:text-danger"><Trash2 className="size-4" /></button>
            </div>
          ))
        )}
      </div>
      <Drawer open={open} title={edit ? 'Editar oferta' : 'Nueva oferta'} onClose={() => setEdit(undefined)} flush>
        {open && <OfferForm offer={edit ?? null} onDone={() => setEdit(undefined)} />}
      </Drawer>
    </section>
  );
}

export default function BurgerAdmin({slides, offers}: {slides: BurgerSlide[]; offers: BurgerOffer[]}) {
  return (
    <div className="flex max-w-4xl flex-col gap-10">
      <SlidesManager slides={slides} />
      <OffersManager offers={offers} />
    </div>
  );
}
