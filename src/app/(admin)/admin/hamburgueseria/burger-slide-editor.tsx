'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Checkbox} from '@/components/ui/checkbox';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from '@/components/ui/select';
import FormFooter from '@/components/admin/form-footer';
import {btn, btnGhost} from '@/components/admin/ui';
import HeroMedia from '@/components/admin/hero-media';
import {I18nField} from '@/components/admin/i18n-field';
import {isVideoUrl} from '@/lib/utils';
import {autoPoints, type EdgePoint} from '@/components/burger/burger-fx';
import ImageColorPicker from './image-color-picker';
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
const COLORS = ['#c36148', '#d67a63', '#9a2f24', '#f26b21', '#e9ae74', '#3a7d44', '#2e6e8e', '#2a1713', '#fdfbf7'];
const BG_PRESETS: [string, string][] = [
  ['/burger/bg/swirl-centro.webp', 'Remolino'],
  ['/burger/bg/swirl-esquinas.webp', 'Esquinas'],
  ['/burger/bg/swirl-esquinas2.webp', 'Esquinas 2'],
  ['/burger/bg/rayos.webp', 'Rayos'],
  ['/burger/bg/humo-1.webp', 'Humo'],
  ['/burger/bg/humo-2.webp', 'Humo 2'],
  ['/burger/bg/brasas.webp', 'Brasas'],
  ['/burger/bg/extra-1.webp', 'Fondo 8'],
  ['/burger/bg/extra-2.webp', 'Fondo 9'],
  ['/burger/bg/extra-3.webp', 'Fondo 10']
];
const EFFECTS: [string, string][] = [
  ['none', 'Ninguno (crema)'],
  ['image', 'Imagen de fondo']
];
const TITLE_FILLS: [string, string][] = [
  ['plano', 'Color plano'],
  ['auto', 'Degradado (del color elegido)'],
  ['red', 'Degradado rojo'],
  ['terra', 'Degradado terracota'],
  ['fire', 'Degradado fuego'],
  ['orange', 'Degradado naranja'],
  ['gold', 'Degradado dorado'],
  ['cream', 'Degradado crema']
];

// Detecta el color de la esquina (fondo) de la imagen O del primer fotograma del vídeo.
function detectBg(url: string): Promise<string> {
  return new Promise((resolve) => {
    if (!url) return resolve('');
    const sample = (src: CanvasImageSource) => {
      try {
        const c = document.createElement('canvas');
        c.width = 10;
        c.height = 10;
        const ctx = c.getContext('2d');
        if (!ctx) return resolve('');
        ctx.drawImage(src, 0, 0, 10, 10);
        const d = ctx.getImageData(0, 0, 1, 1).data;
        resolve('#' + [d[0], d[1], d[2]].map((x) => x.toString(16).padStart(2, '0')).join(''));
      } catch {
        resolve('');
      }
    };
    if (isVideoUrl(url)) {
      const v = document.createElement('video');
      v.crossOrigin = 'anonymous';
      v.muted = true;
      v.playsInline = true;
      v.onseeked = () => sample(v);
      v.onloadeddata = () => {
        try {
          v.currentTime = 0.1;
        } catch {
          sample(v);
        }
      };
      v.onerror = () => resolve('');
      v.src = url;
    } else {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => sample(img);
      img.onerror = () => resolve('');
      img.src = url;
    }
  });
}

// Detecta el color más vivo (saturado, valor medio) de la imagen/vídeo → para el título/precio.
function detectVibrant(url: string): Promise<string> {
  return new Promise((resolve) => {
    if (!url) return resolve('');
    const run = (src: CanvasImageSource) => {
      try {
        const S = 48;
        const c = document.createElement('canvas');
        c.width = S;
        c.height = S;
        const ctx = c.getContext('2d');
        if (!ctx) return resolve('');
        ctx.drawImage(src, 0, 0, S, S);
        const d = ctx.getImageData(0, 0, S, S).data;
        let best = '';
        let bestScore = -1;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          if (d[i + 3] < 200) continue;
          const max = Math.max(r, g, b), min = Math.min(r, g, b);
          const v = max / 255;
          const s = max === 0 ? 0 : (max - min) / max;
          if (v < 0.22 || v > 0.96) continue; // descarta muy oscuro / muy claro (fondo crema)
          const score = s * s * (v * (1 - v) * 4); // muy saturado y de valor medio
          if (score > bestScore) {
            bestScore = score;
            best = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
          }
        }
        resolve(best);
      } catch {
        resolve('');
      }
    };
    if (isVideoUrl(url)) {
      const vid = document.createElement('video');
      vid.crossOrigin = 'anonymous';
      vid.muted = true;
      vid.playsInline = true;
      vid.onseeked = () => run(vid);
      vid.onloadeddata = () => {
        try {
          vid.currentTime = 0.1;
        } catch {
          run(vid);
        }
      };
      vid.onerror = () => resolve('');
      vid.src = url;
    } else {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => run(img);
      img.onerror = () => resolve('');
      img.src = url;
    }
  });
}

// ¿El color es claro? (para elegir texto oscuro/claro encima).
function isLight(hex: string): boolean {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return true;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

// Muestrea 8 colores de borde (4 esquinas + 4 puntos medios) para fundir la imagen.
function detectEdges(url: string): Promise<Record<string, string>> {
  return new Promise((resolve) => {
    if (!url) return resolve({});
    const run = (src: CanvasImageSource) => {
      try {
        const S = 100;
        const c = document.createElement('canvas');
        c.width = S;
        c.height = S;
        const ctx = c.getContext('2d');
        if (!ctx) return resolve({});
        ctx.drawImage(src, 0, 0, S, S);
        const hex = (x: number, y: number) => {
          const d = ctx.getImageData(Math.round(x * (S - 1)), Math.round(y * (S - 1)), 1, 1).data;
          return '#' + [d[0], d[1], d[2]].map((n) => n.toString(16).padStart(2, '0')).join('');
        };
        const i = 0.06;
        resolve({
          tl: hex(i, i), tr: hex(1 - i, i), bl: hex(i, 1 - i), br: hex(1 - i, 1 - i),
          tc: hex(0.5, i), bc: hex(0.5, 1 - i), lm: hex(i, 0.5), rm: hex(1 - i, 0.5)
        });
      } catch {
        resolve({});
      }
    };
    if (isVideoUrl(url)) {
      const v = document.createElement('video');
      v.crossOrigin = 'anonymous';
      v.muted = true;
      v.playsInline = true;
      v.onseeked = () => run(v);
      v.onloadeddata = () => {
        try {
          v.currentTime = 0.1;
        } catch {
          run(v);
        }
      };
      v.onerror = () => resolve({});
      v.src = url;
    } else {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => run(img);
      img.onerror = () => resolve({});
      img.src = url;
    }
  });
}

export default function BurgerSlideEditor({slide}: {slide: BurgerSlide | null}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const back = '/admin/hamburgueseria';
  const [f, setF] = useState({
    name: slide?.name ?? '',
    price: slide?.price != null ? String(slide.price) : '',
    position: String(slide?.position ?? 0)
  });
  const [eyebrow] = useState<Record<string, string>>(slide?.eyebrow ?? {es: ''});
  const [title, setTitle] = useState<Record<string, string>>(slide?.title ?? {es: ''});
  const [image, setImage] = useState<string | null>(slide?.image ?? null);
  const [mediaY] = useState(slide?.media_y ?? 0);
  const [active, setActive] = useState(slide?.active ?? true);
  const [titleFont, setTitleFont] = useState(slide?.title_font ?? 'eight');
  const [titleColor, setTitleColor] = useState(slide?.title_color ?? '#c36148');
  const [titleBehind, setTitleBehind] = useState(slide?.title_behind ?? false);
  const [bgEffect, setBgEffect] = useState(slide?.bg_effect ?? 'none');
  const [bgImage, setBgImage] = useState<string | null>(slide?.bg_image ?? null);
  const [bgColor, setBgColor] = useState(slide?.bg_color ?? '');
  const [textShadow, setTextShadow] = useState(slide?.text_shadow ?? false);
  const [titleOutline, setTitleOutline] = useState(slide?.title_outline ?? false);
  const [priceOutline, setPriceOutline] = useState(slide?.price_outline ?? false);
  const [hideTitle, setHideTitle] = useState(slide?.hide_title ?? false);
  const [hidePrice, setHidePrice] = useState(slide?.hide_price ?? false);
  const [accentColor, setAccentColor] = useState(slide?.accent_color ?? '');
  const [buttonColor, setButtonColor] = useState(slide?.button_color ?? '');
  const [textColor, setTextColor] = useState(slide?.text_color ?? '');
  const [edgeColors, setEdgeColors] = useState<Record<string, string>>(slide?.edge_colors ?? {});
  const [edgePoints, setEdgePoints] = useState<EdgePoint[]>(slide?.edge_points ?? []);
  const [navColor, setNavColor] = useState(slide?.nav_color ?? '');
  const [showPicker, setShowPicker] = useState(false);
  const [titleScale, setTitleScale] = useState(slide?.title_scale ?? 1);
  const [eyebrowScale] = useState(slide?.eyebrow_scale ?? 1);
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
        bg_color: bgColor,
        text_shadow: textShadow,
        title_outline: titleOutline,
        price_outline: priceOutline,
        hide_title: hideTitle,
        hide_price: hidePrice,
        accent_color: accentColor,
        button_color: buttonColor,
        text_color: textColor,
        nav_color: navColor,
        edge_colors: edgeColors,
        edge_points: edgePoints,
        media_y: mediaY,
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

  const previewCfg = {
    image,
    name: title.es ?? '',
    eyebrow: eyebrow.es ?? '',
    price: f.price,
    font: titleFont,
    color: titleColor,
    behind: titleBehind,
    bgEffect,
    bgImage,
    bgColor,
    textShadow,
    titleOutline,
    priceOutline,
    hideTitle,
    hidePrice,
    accentColor,
    buttonColor,
    textColor,
    navColor,
    edgeColors,
    edgePoints,
    mediaY,
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
  };

  const colorTargets = [
    {key: 'title', label: 'Título', set: (c: string) => { setTitleColor(c); setTitleGradient(''); }},
    {key: 'price', label: 'Precio', set: (c: string) => { setPriceColor(c); setPriceGradient(''); }},
    {key: 'accent', label: 'Logo y lema', set: setAccentColor},
    {key: 'button', label: 'Botones', set: setButtonColor},
    {key: 'text', label: 'Texto', set: setTextColor},
    {key: 'nav', label: 'Navbar', set: setNavColor},
    {key: 'bg', label: 'Fondo', set: setBgColor}
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="space-y-4"
      >
        <div>
          <Label>Imagen o vídeo de la hamburguesa</Label>
          <div className="max-w-[260px]">
            <HeroMedia
            media={image ?? ''}
            mediaType={isVideoUrl(image) ? 'video' : 'image'}
            onSet={({media}) => {
              setImage(media);
              detectBg(media).then((c) => {
                if (c) {
                  setBgColor(c);
                  setTextColor(isLight(c) ? '#2a1713' : '#fdfbf7');
                }
              });
              detectEdges(media).then((ec) => {
                setEdgeColors(ec);
                setEdgePoints(autoPoints(ec));
              });
              detectVibrant(media).then((v) => {
                if (!v) return;
                setTitleColor(v);
                setPriceColor(v);
                setTitleGradient('auto');
                setPriceGradient('auto');
                setAccentColor(v);
                setButtonColor(v);
              });
            }}
            onClear={() => setImage(null)}
          />
          </div>
          <button
            type="button"
            onClick={async () => {
              if (!image) return;
              const v = await detectVibrant(image);
              if (!v) {
                toast.error('No se pudo detectar el color de la imagen');
                return;
              }
              setTitleColor(v);
              setPriceColor(v);
              setTitleGradient('auto');
              setPriceGradient('auto');
              toast.success('Título y precio combinados con la imagen');
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-ink-2 transition hover:border-brand"
          >
            🎨 Combinar título y precio con la imagen
          </button>
          {image && !isVideoUrl(image) && (
            <button type="button" onClick={() => setShowPicker(true)} className="mt-2 ml-2 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-ink-2 transition hover:border-brand">
              🎯 Colores y puntos de la imagen
            </button>
          )}
        </div>
        <div>
          <Label>Nombre interno</Label>
          <Input value={f.name} onChange={(e) => setF({...f, name: e.target.value})} placeholder="La Doble Calita" />
        </div>
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
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <label className="flex items-center gap-2"><Checkbox checked={titleOutline} onCheckedChange={(v) => setTitleOutline(v === true)} /> Título con contorno (sin relleno)</label>
            <label className="flex items-center gap-2"><Checkbox checked={textShadow} onCheckedChange={(v) => setTextShadow(v === true)} /> Sombra en los textos</label>
            <label className="flex items-center gap-2"><Checkbox checked={hideTitle} onCheckedChange={(v) => setHideTitle(v === true)} /> Ocultar título (ya está en la imagen)</label>
          </div>
          <div className="mt-3">
            <Label>Tamaño del título · {Math.round(titleScale * 100)}%</Label>
            <input type="range" min={0.5} max={2.6} step={0.05} value={titleScale} onChange={(e) => setTitleScale(+e.target.value)} className="w-full accent-brand" />
          </div>
          <div className="mt-3">
            <Label>Posición título (↑ baja el nº) · {titleY}%</Label>
            <input type="range" min={2} max={45} value={titleY} onChange={(e) => setTitleY(+e.target.value)} className="w-full accent-brand" />
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
          <label className="mt-3 flex items-center gap-2 text-sm"><Checkbox checked={priceOutline} onCheckedChange={(v) => setPriceOutline(v === true)} /> Precio con contorno (sin relleno)</label>
          <label className="mt-2 flex items-center gap-2 text-sm"><Checkbox checked={hidePrice} onCheckedChange={(v) => setHidePrice(v === true)} /> Ocultar precio (ya está en la imagen)</label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <Label>Tamaño del precio · {Math.round(priceScale * 100)}%</Label>
              <input type="range" min={0.25} max={3.2} step={0.05} value={priceScale} onChange={(e) => setPriceScale(+e.target.value)} className="w-full accent-brand" />
            </div>
            <div>
              <Label>Posición precio (↑ sube el nº) · {priceY}%</Label>
              <input type="range" min={2} max={45} value={priceY} onChange={(e) => setPriceY(+e.target.value)} className="w-full accent-brand" />
            </div>
          </div>
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
          <div className="mt-3">
            <Label>Color de fondo del hero</Label>
            <div className="flex items-center gap-2">
              <span className="size-7 rounded-full border border-line-strong" style={{background: bgColor || '#fdfbf7'}} />
              <input type="color" value={/^#/.test(bgColor) ? bgColor : '#fdfbf7'} onChange={(e) => setBgColor(e.target.value)} className="size-7 cursor-pointer rounded-full border-0 bg-transparent p-0" />
              <button type="button" onClick={() => image && detectBg(image).then((c) => c && setBgColor(c))} className="rounded-full border border-line px-3 py-1 text-xs text-ink-2 transition hover:border-brand">Detectar de la imagen</button>
              {bgColor && <button type="button" onClick={() => setBgColor('')} className="text-xs text-ink-3 underline">Quitar</button>}
            </div>
            <p className="mt-1 text-xs text-ink-3">Se coge del fondo de la imagen para que no se note el cambio. Vacío = crema por defecto.</p>
          </div>
          <div className="mt-3">
            <Label>Colores del lado izquierdo (si el fondo es de otro color)</Label>
            <div className="mt-1 grid gap-2">
              {([
                ['Logo y lema', accentColor, setAccentColor, '#d67a63'],
                ['Botones', buttonColor, setButtonColor, '#c36148'],
                ['Texto', textColor, setTextColor, '#2a1713']
              ] as [string, string, (v: string) => void, string][]).map(([label, val, set, def]) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <span className="w-20 text-ink-2">{label}</span>
                  <span className="size-7 rounded-full border border-line-strong" style={{background: val || def}} />
                  <input type="color" value={/^#/.test(val) ? val : def} onChange={(e) => set(e.target.value)} className="size-7 cursor-pointer rounded-full border-0 bg-transparent p-0" />
                  {val && <button type="button" onClick={() => set('')} className="text-xs text-ink-3 underline">Por defecto</button>}
                </div>
              ))}
            </div>
            <p className="mt-1 text-xs text-ink-3">Vacío = colores de marca. Útil si el fondo del hero es de otro color.</p>
          </div>
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
        <FormFooter pending={pending} cancelHref={back} />
      </form>

      <BurgerHeroPreview cfg={previewCfg} />
      {showPicker && image && (
        <ImageColorPicker
          image={image}
          cfg={previewCfg}
          targets={colorTargets}
          points={edgePoints}
          onPointsChange={setEdgePoints}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
