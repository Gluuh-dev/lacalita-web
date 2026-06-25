'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Checkbox} from '@/components/ui/checkbox';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from '@/components/ui/select';
import {btn, btnGhost} from '@/components/admin/ui';
import HeroMedia from '@/components/admin/hero-media';
import {I18nField} from '@/components/admin/i18n-field';
import BurgerHeroPreview from '@/components/burger/burger-hero-preview';
import type {BurgerSlide} from '@/lib/queries';
import {saveBurgerSlide} from './actions';

const FONTS: [string, string][] = [
  ['eight', 'Eight One'],
  ['display', 'Playfair'],
  ['modern', 'Modern Romance'],
  ['adam', 'Adam'],
  ['sans', 'Geist']
];
const COLORS = ['#c94a3c', '#d67a63', '#2a1713', '#fdfbf7', '#e9ae74'];
const BG_PRESETS: [string, string][] = [
  ['/burger/bg/rings.jpg', 'Anillos'],
  ['/burger/bg/beach.jpg', 'Playa'],
  ['/burger/bg/fire.jpg', 'Fuego'],
  ['/burger/bg/smoke.jpg', 'Humo']
];
const EFFECTS: [string, string][] = [
  ['none', 'Ninguno (crema)'],
  ['image', 'Imagen de fondo']
];
const TITLE_FILLS: [string, string][] = [
  ['plano', 'Color plano'],
  ['red', 'Degradado rojo'],
  ['terra', 'Degradado terracota'],
  ['gold', 'Degradado dorado'],
  ['cream', 'Degradado crema']
];

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
  const [titleFont, setTitleFont] = useState(slide?.title_font ?? 'eight');
  const [titleColor, setTitleColor] = useState(slide?.title_color ?? '#c94a3c');
  const [titleBehind, setTitleBehind] = useState(slide?.title_behind ?? false);
  const [bgEffect, setBgEffect] = useState(slide?.bg_effect ?? 'none');
  const [bgImage, setBgImage] = useState<string | null>(slide?.bg_image ?? null);
  const [titleScale, setTitleScale] = useState(slide?.title_scale ?? 1);
  const [eyebrowScale, setEyebrowScale] = useState(slide?.eyebrow_scale ?? 1);
  const [priceScale, setPriceScale] = useState(slide?.price_scale ?? 1);
  const [overlayFx] = useState(slide?.overlay_fx ?? 'none');
  const [showRings, setShowRings] = useState(slide?.show_rings ?? true);
  const [titleGradient, setTitleGradient] = useState(slide?.title_gradient ?? '');
  const [fxSparks, setFxSparks] = useState(slide?.fx_sparks ?? false);
  const [fxSmoke, setFxSmoke] = useState(slide?.fx_smoke ?? false);
  const [priceFont, setPriceFont] = useState(slide?.price_font ?? 'eight');
  const [priceColor, setPriceColor] = useState(slide?.price_color ?? '#d67a63');
  const [priceGradient, setPriceGradient] = useState(slide?.price_gradient ?? '');
  const [titleY, setTitleY] = useState(slide?.title_y ?? 10);
  const [priceY, setPriceY] = useState(slide?.price_y ?? 14);

  function save() {
    start(async () => {
      const r = await saveBurgerSlide(slide?.id ?? null, {
        name: f.name,
        eyebrow,
        title,
        price: f.price === '' ? null : Number(f.price),
        image,
        position: Number(f.position) || 0,
        active,
        title_font: titleFont,
        title_color: titleColor,
        title_behind: titleBehind,
        bg_effect: bgEffect,
        bg_image: bgImage,
        title_scale: titleScale,
        eyebrow_scale: eyebrowScale,
        price_scale: priceScale,
        overlay_fx: overlayFx,
        show_rings: showRings,
        title_gradient: titleGradient,
        fx_sparks: fxSparks,
        fx_smoke: fxSmoke,
        price_font: priceFont,
        price_color: priceColor,
        price_gradient: priceGradient,
        title_y: titleY,
        price_y: priceY,
        fx_video: '',
        fx_video_behind: false,
        fx_video_x: 62,
        fx_video_y: 50,
        fx_video_scale: 1.1
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

        {/* Estilo del título */}
        <div className="rounded-[14px] border border-line bg-surface p-3">
          <div className="mb-2 font-adam text-[0.66rem] uppercase tracking-[0.1em] text-ink-3">Estilo del título</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tipografía</Label>
              <Select value={titleFont} onValueChange={(v) => setTitleFont(v ?? 'eight')}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {FONTS.map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Relleno del título</Label>
              <Select value={titleGradient || 'plano'} onValueChange={(v) => setTitleGradient(v === 'plano' ? '' : (v ?? ''))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {TITLE_FILLS.map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          {titleGradient === '' && (
            <div className="mt-3">
              <Label>Color del título</Label>
              <div className="flex items-center gap-2">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setTitleColor(c)} className="size-7 rounded-full border" style={{background: c, boxShadow: titleColor === c ? '0 0 0 2px var(--brand)' : '0 0 0 1px var(--line-strong)'}} aria-label={c} />
                ))}
                <input type="color" value={/^#/.test(titleColor) ? titleColor : '#ffffff'} onChange={(e) => setTitleColor(e.target.value)} className="size-7 cursor-pointer rounded-full border-0 bg-transparent p-0" />
              </div>
            </div>
          )}
          <label className="mt-3 flex items-center justify-between text-sm">
            Título detrás de la hamburguesa
            <button type="button" onClick={() => setTitleBehind((v) => !v)} aria-label="Detrás" className={`relative h-6 w-10 rounded-full transition ${titleBehind ? 'bg-brand' : 'bg-line-strong'}`}>
              <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${titleBehind ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
          </label>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <Label>Título · {Math.round(titleScale * 100)}%</Label>
              <input type="range" min={0.5} max={1.6} step={0.05} value={titleScale} onChange={(e) => setTitleScale(+e.target.value)} className="w-full accent-brand" />
            </div>
            <div>
              <Label>Eyebrow · {Math.round(eyebrowScale * 100)}%</Label>
              <input type="range" min={0.6} max={1.6} step={0.05} value={eyebrowScale} onChange={(e) => setEyebrowScale(+e.target.value)} className="w-full accent-brand" />
            </div>
            <div>
              <Label>Precio · {Math.round(priceScale * 100)}%</Label>
              <input type="range" min={0.5} max={1.6} step={0.05} value={priceScale} onChange={(e) => setPriceScale(+e.target.value)} className="w-full accent-brand" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <Label>Posición título (↑ baja el nº) · {titleY}%</Label>
              <input type="range" min={2} max={45} value={titleY} onChange={(e) => setTitleY(+e.target.value)} className="w-full accent-brand" />
            </div>
            <div>
              <Label>Posición precio (↑ sube el nº) · {priceY}%</Label>
              <input type="range" min={2} max={45} value={priceY} onChange={(e) => setPriceY(+e.target.value)} className="w-full accent-brand" />
            </div>
          </div>
        </div>

        {/* Estilo del precio */}
        <div className="rounded-[14px] border border-line bg-surface p-3">
          <div className="mb-2 font-adam text-[0.66rem] uppercase tracking-[0.1em] text-ink-3">Estilo del precio</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tipografía</Label>
              <Select value={priceFont} onValueChange={(v) => setPriceFont(v ?? 'eight')}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {FONTS.map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Relleno</Label>
              <Select value={priceGradient || 'plano'} onValueChange={(v) => setPriceGradient(v === 'plano' ? '' : (v ?? ''))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {TITLE_FILLS.map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          {priceGradient === '' && (
            <div className="mt-3 flex items-center gap-2">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setPriceColor(c)} className="size-7 rounded-full border" style={{background: c, boxShadow: priceColor === c ? '0 0 0 2px var(--brand)' : '0 0 0 1px var(--line-strong)'}} aria-label={c} />
              ))}
              <input type="color" value={/^#/.test(priceColor) ? priceColor : '#e9ae74'} onChange={(e) => setPriceColor(e.target.value)} className="size-7 cursor-pointer rounded-full border-0 bg-transparent p-0" />
            </div>
          )}
        </div>

        {/* Fondo */}
        <div className="rounded-[14px] border border-line bg-surface p-3">
          <div className="mb-2 font-adam text-[0.66rem] uppercase tracking-[0.1em] text-ink-3">Fondo de la diapositiva</div>
          <Select value={bgEffect} onValueChange={(v) => setBgEffect(v ?? 'none')}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {EFFECTS.map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {bgEffect === 'image' && (
            <div className="mt-3 space-y-2">
              <Label>Imagen de fondo (se verá difuminada)</Label>
              <div className="flex flex-wrap gap-2">
                {BG_PRESETS.map(([src, label]) => (
                  <button key={src} type="button" onClick={() => setBgImage(src)} title={label} className={`relative h-12 w-20 overflow-hidden rounded-md border ${bgImage === src ? 'border-brand ring-2 ring-brand/40' : 'border-line'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={label} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-3">Elige un preset o sube tu propia imagen:</p>
              <HeroMedia media={bgImage ?? ''} mediaType="image" onSet={({media}) => setBgImage(media)} onClear={() => setBgImage(null)} />
            </div>
          )}
          <div className="mt-3">
            <Label>Animación encima de la hamburguesa (marca las que quieras)</Label>
            <div className="mt-1 flex gap-5">
              <label className="flex items-center gap-2 text-sm"><Checkbox checked={fxSparks} onCheckedChange={(v) => setFxSparks(v === true)} /> Chispas / brasas</label>
              <label className="flex items-center gap-2 text-sm"><Checkbox checked={fxSmoke} onCheckedChange={(v) => setFxSmoke(v === true)} /> Humo</label>
            </div>
          </div>
          <label className="mt-3 flex items-center justify-between text-sm">
            Mostrar anillos
            <button type="button" onClick={() => setShowRings((v) => !v)} aria-label="Anillos" className={`relative h-6 w-10 rounded-full transition ${showRings ? 'bg-brand' : 'bg-line-strong'}`}>
              <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${showRings ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
          </label>
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

      <BurgerHeroPreview
        cfg={{
          image,
          name: title.es ?? '',
          eyebrow: eyebrow.es ?? '',
          price: f.price,
          font: titleFont,
          color: titleColor,
          behind: titleBehind,
          bgEffect,
          bgImage,
          titleScale,
          eyebrowScale,
          priceScale,
          showRings,
          overlayFx,
          gradient: titleGradient,
          fxSparks,
          fxSmoke,
          priceFont,
          priceColor,
          priceGradient,
          titleY,
          priceY,
          fxVideo: '',
          fxVideoBehind: false,
          fxVideoX: 62,
          fxVideoY: 50,
          fxVideoScale: 1.1
        }}
      />
    </div>
  );
}
