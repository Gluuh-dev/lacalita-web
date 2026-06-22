'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {UtensilsCrossed} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from '@/components/ui/select';
import {btn, btnGhost} from '@/components/admin/ui';
import HeroMedia from '@/components/admin/hero-media';
import {I18nField} from '@/components/admin/i18n-field';
import type {BurgerSlide} from '@/lib/queries';
import {saveBurgerSlide} from './actions';

const FONTS: [string, string][] = [
  ['eight', 'Eight One'],
  ['display', 'Playfair'],
  ['modern', 'Modern Romance'],
  ['adam', 'Adam'],
  ['sans', 'Geist']
];
const FONT_CSS: Record<string, string> = {
  eight: "'Eight One', sans-serif",
  display: 'var(--font-playfair), serif',
  modern: "'Modern Romance', serif",
  adam: "'Adam', sans-serif",
  sans: 'var(--font-geist), sans-serif'
};
const COLORS = ['#ffffff', '#e9ae74', '#f26b21', '#f4ede2', '#fedb71'];
const EFFECTS: [string, string][] = [
  ['none', 'Ninguno (degradado)'],
  ['image', 'Imagen de fondo'],
  ['smoke', 'Humo'],
  ['embers', 'Brasas / fuego']
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
  const [titleColor, setTitleColor] = useState(slide?.title_color ?? '#ffffff');
  const [titleBehind, setTitleBehind] = useState(slide?.title_behind ?? false);
  const [bgEffect, setBgEffect] = useState(slide?.bg_effect ?? 'none');
  const [bgImage, setBgImage] = useState<string | null>(slide?.bg_image ?? null);

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
        bg_image: bgImage
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
              <Label>Color del título</Label>
              <div className="flex items-center gap-2">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setTitleColor(c)} className="size-7 rounded-full border" style={{background: c, boxShadow: titleColor === c ? '0 0 0 2px var(--brand)' : '0 0 0 1px var(--line-strong)'}} aria-label={c} />
                ))}
                <input type="color" value={/^#/.test(titleColor) ? titleColor : '#ffffff'} onChange={(e) => setTitleColor(e.target.value)} className="size-7 cursor-pointer rounded-full border-0 bg-transparent p-0" />
              </div>
            </div>
          </div>
          <label className="mt-3 flex items-center justify-between text-sm">
            Título detrás de la hamburguesa
            <button type="button" onClick={() => setTitleBehind((v) => !v)} aria-label="Detrás" className={`relative h-6 w-10 rounded-full transition ${titleBehind ? 'bg-brand' : 'bg-line-strong'}`}>
              <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${titleBehind ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
          </label>
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
            <div className="mt-3">
              <Label>Imagen de fondo (se verá difuminada)</Label>
              <HeroMedia media={bgImage ?? ''} mediaType="image" onSet={({media}) => setBgImage(media)} onClear={() => setBgImage(null)} />
            </div>
          )}
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

      {/* Previsualización (como en la web) */}
      <div className="lg:sticky lg:top-20 lg:h-fit">
        <div className="mb-2 font-adam text-[0.66rem] uppercase tracking-[0.12em] text-ink-3">Previsualización · así se verá en el hero</div>
        <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden rounded-[22px]" style={{background: 'radial-gradient(90% 80% at 60% 35%, #2a1f18 0%, #16100d 70%)'}}>
          {/* fondo */}
          {bgEffect === 'image' && bgImage && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bgImage} alt="" className="absolute inset-0 h-full w-full object-cover" style={{filter: 'brightness(.42)'}} />
              <div className="absolute inset-0 bg-[#14100a]/55" />
            </>
          )}
          {bgEffect === 'smoke' && <div className="lc-smoke pointer-events-none absolute inset-0" style={{background: 'radial-gradient(45% 55% at 55% 45%, rgba(225,225,225,.12), transparent 70%)', filter: 'blur(6px)'}} />}
          {bgEffect === 'embers' && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3" style={{background: 'radial-gradient(60% 80% at 55% 100%, rgba(242,107,33,.3), transparent 68%)'}} />}

          {/* eyebrow */}
          {eyebrow.es && (
            <div className="absolute left-0 right-0 top-[7%] z-[3] text-center">
              <span className="inline-flex items-center gap-2 font-adam uppercase tracking-[0.28em]" style={{fontSize: '0.72rem', color: '#e9ae74'}}>
                <span style={{width: 22, height: 1, background: '#e9ae74', opacity: 0.6}} />
                {eyebrow.es}
                <span style={{width: 22, height: 1, background: '#e9ae74', opacity: 0.6}} />
              </span>
            </div>
          )}
          {/* título */}
          <h3 className="absolute left-0 right-0 top-[11%] m-0 px-3 text-center font-extrabold uppercase" style={{fontFamily: FONT_CSS[titleFont], color: titleColor, zIndex: titleBehind ? 1 : 3, fontSize: 'clamp(1.8rem,5vw,2.8rem)', lineHeight: 0.85, textShadow: '0 8px 30px rgba(0,0,0,.7)'}}>
            {title.es || 'Título'}
          </h3>
          {/* hamburguesa */}
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" style={{height: '78%', maxWidth: '92%', objectFit: 'contain', zIndex: 2, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,.55))'}} />
          ) : (
            <div className="flex size-40 items-center justify-center rounded-3xl border border-dashed border-white/15 text-white/25" style={{zIndex: 2}}>
              <UtensilsCrossed className="size-12" />
            </div>
          )}
          {/* precio */}
          {f.price && <div className="absolute bottom-[6%] left-0 right-0 z-[4] text-center font-eight font-extrabold" style={{fontSize: 'clamp(1.8rem,5vw,3rem)', color: '#e9ae74', textShadow: '0 8px 30px rgba(0,0,0,.7)'}}>{f.price} €</div>}
        </div>
      </div>
    </div>
  );
}
