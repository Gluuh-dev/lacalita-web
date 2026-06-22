'use client';

import {useState, useTransition} from 'react';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {card} from '@/components/admin/ui';
import MediaUpload from '@/components/admin/media-upload';
import HeroMedia from '@/components/admin/hero-media';
import HeroStage from '@/components/hero-stage';
import {removeMedia} from '@/lib/storage';
import {saveHero} from './actions';
import type {HeroSlide, HeroCaption} from '@/lib/queries';

const fld = 'w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm';

const DEFAULT_CAPTION: HeroCaption = {
  kind: 'text', font: 'eight', text: 'SÁBADO · 21:00', src: null, size: 30,
  orientation: 'horizontal', position: 'bottom', color: '#ffffff', bg: null,
  opacity: 70, anim: 'enter', speed: 4, offsetY: 0
};

const POSITIONS: [HeroCaption['position'], string][] = [
  ['top-left', 'Arriba izq.'], ['top', 'Arriba'], ['top-right', 'Arriba der.'],
  ['left', 'Izquierda'], ['center', 'Centro'], ['right', 'Derecha'],
  ['bottom-left', 'Abajo izq.'], ['bottom', 'Abajo'], ['bottom-right', 'Abajo der.']
];
const ANIMS: [HeroCaption['anim'], string][] = [
  ['none', 'Fija'], ['fade', 'Aparecer'], ['enter', 'Entra y se queda'],
  ['marquee', 'Cinta horizontal'], ['marquee-y', 'Cinta vertical'], ['diagonal', 'Diagonal']
];
const MOVING = ['marquee', 'marquee-y', 'diagonal'];

export default function HeroEditor({initial}: {initial: HeroSlide[]}) {
  const [slides, setSlides] = useState<HeroSlide[]>(initial);
  const [pending, start] = useTransition();
  const [device, setDevice] = useState<'pc' | 'mobile'>('pc');
  const [full, setFull] = useState<number | null>(null);

  const addHero = () =>
    setSlides((s) => [...s, {type: 'image', url: '', overlay: 25, logoLight: true, loop: false, captions: []}]);
  const update = (i: number, patch: Partial<HeroSlide>) =>
    setSlides((s) => s.map((sl, j) => (j === i ? {...sl, ...patch} : sl)));
  const remove = (i: number) => {
    const sl = slides[i];
    if (sl) {
      removeMedia(sl.url);
      removeMedia(sl.poster);
      (sl.captions ?? []).forEach((c) => c.kind === 'image' && removeMedia(c.src ?? undefined));
    }
    setSlides((s) => s.filter((_, j) => j !== i));
  };
  const move = (i: number, dir: -1 | 1) =>
    setSlides((s) => {
      const j = i + dir;
      if (j < 0 || j >= s.length) return s;
      const n = [...s];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });

  const addCap = (i: number) => update(i, {captions: [...(slides[i].captions ?? []), DEFAULT_CAPTION]});
  const patchCap = (i: number, ci: number, patch: Partial<HeroCaption>) =>
    update(i, {captions: (slides[i].captions ?? []).map((c, k) => (k === ci ? {...c, ...patch} : c))});
  const removeCap = (i: number, ci: number) => {
    const c = (slides[i].captions ?? [])[ci];
    if (c?.kind === 'image') removeMedia(c.src ?? undefined);
    update(i, {captions: (slides[i].captions ?? []).filter((_, k) => k !== ci)});
  };

  function save() {
    start(async () => {
      const r = await saveHero(slides);
      if (r.ok) toast.success('Portada guardada');
      else toast.error(r.error);
    });
  }

  return (
    <div className="space-y-5">
      <div className={`${card} flex flex-wrap items-center justify-between gap-4`}>
        <Button type="button" onClick={addHero}>+ Añadir hero</Button>
        <div className="flex items-center gap-1 text-sm">
          <span className="mr-1 text-muted-foreground">Preview:</span>
          {(['pc', 'mobile'] as const).map((d) => (
            <button key={d} type="button" onClick={() => setDevice(d)}
              className={`rounded-full px-3 py-1 ${device === d ? 'bg-neutral-900 text-white' : 'bg-neutral-100'}`}>
              {d === 'pc' ? 'PC' : 'Móvil'}
            </button>
          ))}
        </div>
      </div>

      {slides.length === 0 && (
        <p className="text-sm text-muted-foreground">Sin heros. Pulsa “+ Añadir hero” y luego sube una imagen o vídeo.</p>
      )}

      <div className="space-y-3">
        {slides.map((sl, i) => (
          <div key={i} className={`${card} lg:grid lg:grid-cols-2 lg:items-start lg:gap-6`}>
            {/* Columna izquierda: media (preview + arrastrar/cambiar/eliminar) */}
            <div className="space-y-3">
              <HeroMedia
                slide={sl}
                device={device}
                onSet={(m) => update(i, {type: m.type, url: m.url, poster: m.poster})}
                onClear={() => update(i, {url: '', poster: undefined})}
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">Hero {i + 1}</span>
                <div className="flex items-center gap-3 text-sm">
                  <button type="button" onClick={() => setFull(i)} className="text-blue-600 hover:underline">Pantalla completa</button>
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30">↑</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === slides.length - 1} className="disabled:opacity-30">↓</button>
                  <button type="button" onClick={() => remove(i)} className="text-destructive hover:underline">Quitar hero</button>
                </div>
              </div>
            </div>

            {/* Columna derecha: controles */}
            <div className="mt-4 space-y-3 lg:mt-0">
              <div className="flex items-center justify-end">
                <Button type="button" size="sm" disabled={pending} onClick={save}>Guardar</Button>
              </div>
              <label className="block text-sm">
                Oscurecer fondo: <span className="font-medium">{sl.overlay}%</span>
                <input type="range" min={0} max={90} value={sl.overlay} onChange={(e) => update(i, {overlay: Number(e.target.value)})} className="mt-1 w-full accent-brand" />
              </label>
              {sl.type === 'video' && (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={sl.loop} onCheckedChange={(v) => update(i, {loop: v === true})} />
                  Repetir vídeo
                </label>
              )}
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs text-muted-foreground">
                  Texto del botón
                  <input className={fld} value={sl.ctaLabel ?? ''} onChange={(e) => update(i, {ctaLabel: e.target.value})} placeholder="Ver la carta" />
                </label>
                <label className="text-xs text-muted-foreground">
                  Enlace del botón
                  <input className={fld} value={sl.ctaHref ?? ''} onChange={(e) => update(i, {ctaHref: e.target.value})} placeholder="/carta o https://…" />
                </label>
              </div>

              <div className="border-t border-black/10 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Textos / imágenes</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => addCap(i)}>+ Añadir</Button>
                </div>

                {(sl.captions ?? []).map((cap, ci) => {
                  const kind = cap.kind ?? 'text';
                  return (
                    <div key={ci} className="mt-3 space-y-3 rounded-lg border border-black/10 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{ci + 1}.</span>
                        <button type="button" onClick={() => removeCap(i, ci)} className="text-destructive hover:underline">Quitar</button>
                      </div>
                      <label className="block text-xs text-muted-foreground">
                        Tipo
                        <select className={fld} value={kind} onChange={(e) => patchCap(i, ci, {kind: e.target.value as 'text' | 'image'})}>
                          <option value="text">Texto</option>
                          <option value="image">Imagen (logo / sello)</option>
                        </select>
                      </label>

                      {kind === 'image' ? (
                        <>
                          <MediaUpload kind="image" value={cap.src ?? null} onChange={(u) => patchCap(i, ci, {src: u})} label="Subir logo / sello" />
                          <label className="block text-xs text-muted-foreground">
                            Tamaño: {cap.size ?? 30}%
                            <input type="range" min={10} max={80} value={cap.size ?? 30} onChange={(e) => patchCap(i, ci, {size: Number(e.target.value)})} className="mt-1 w-full accent-brand" />
                          </label>
                        </>
                      ) : (
                        <>
                          <textarea value={cap.text} onChange={(e) => patchCap(i, ci, {text: e.target.value})} rows={2} placeholder="Ej: SÁBADO · 21:00" className="w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm" />
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <label className="text-xs text-muted-foreground">
                              Fuente
                              <select className={fld} value={cap.font ?? 'sans'} onChange={(e) => patchCap(i, ci, {font: e.target.value as 'sans' | 'modern' | 'eight'})}>
                                <option value="sans">Normal</option>
                                <option value="modern">Modern Romance</option>
                                <option value="eight">Eight One</option>
                              </select>
                            </label>
                            <label className="text-xs text-muted-foreground">
                              Tamaño letra: {cap.fontSize ?? 'auto'}
                              <input type="range" min={16} max={140} value={cap.fontSize ?? 56} onChange={(e) => patchCap(i, ci, {fontSize: Number(e.target.value)})} className="mt-1 w-full accent-brand" />
                            </label>
                            <label className="text-xs text-muted-foreground">
                              Color
                              <input type="color" value={cap.color} onChange={(e) => patchCap(i, ci, {color: e.target.value})} className="mt-1 block h-9 w-full rounded-lg border border-input" />
                            </label>
                            <label className="text-xs text-muted-foreground">
                              Fondo
                              <div className="mt-1 flex items-center gap-2">
                                <Checkbox checked={!!cap.bg} onCheckedChange={(v) => patchCap(i, ci, {bg: v === true ? '#243b53' : null})} />
                                {cap.bg && <input type="color" value={cap.bg} onChange={(e) => patchCap(i, ci, {bg: e.target.value})} className="h-8 w-12 rounded border border-input" />}
                              </div>
                            </label>
                            <label className="text-xs text-muted-foreground">
                              Orientación
                              <select className={fld} value={cap.orientation} onChange={(e) => patchCap(i, ci, {orientation: e.target.value as HeroCaption['orientation']})}>
                                <option value="horizontal">Horizontal</option>
                                <option value="vertical">Vertical</option>
                              </select>
                            </label>
                          </div>
                        </>
                      )}

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <label className="text-xs text-muted-foreground">
                          Posición
                          <select className={fld} value={cap.position} onChange={(e) => patchCap(i, ci, {position: e.target.value as HeroCaption['position']})}>
                            {POSITIONS.map(([v, l]) => (<option key={v} value={v}>{l}</option>))}
                          </select>
                        </label>
                        <label className="text-xs text-muted-foreground">
                          Animación
                          <select className={fld} value={cap.anim} onChange={(e) => patchCap(i, ci, {anim: e.target.value as HeroCaption['anim']})}>
                            {ANIMS.map(([v, l]) => (<option key={v} value={v}>{l}</option>))}
                          </select>
                        </label>
                        <label className="text-xs text-muted-foreground">
                          Mover ↑/↓: {cap.offsetY ?? 0}px
                          <input type="range" min={-300} max={300} value={cap.offsetY ?? 0} onChange={(e) => patchCap(i, ci, {offsetY: Number(e.target.value)})} className="mt-1 w-full accent-brand" />
                        </label>
                        <label className="text-xs text-muted-foreground">
                          Transparencia: {cap.opacity}%
                          <input type="range" min={10} max={100} value={cap.opacity} onChange={(e) => patchCap(i, ci, {opacity: Number(e.target.value)})} className="mt-1 w-full accent-brand" />
                        </label>
                        {MOVING.includes(cap.anim) && (
                          <label className="text-xs text-muted-foreground">
                            Velocidad: {cap.speed}
                            <input type="range" min={1} max={10} value={cap.speed} onChange={(e) => patchCap(i, ci, {speed: Number(e.target.value)})} className="mt-1 w-full accent-brand" />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={save} disabled={pending}>{pending ? 'Guardando…' : 'Guardar todo'}</Button>

      {full !== null && slides[full] && (
        <div className="fixed inset-0 z-[60] bg-black">
          <div className="relative h-full w-full">
            <HeroStage
              slide={slides[full]}
              preview
              tagline="Beach Club · Restaurante · Cafetería"
              intro="Cocina mediterránea con los pies en la arena, en Salobreña."
              ctaLabel={slides[full].ctaLabel || 'Ver la carta'}
              ctaHref={slides[full].ctaHref || '/carta'}
            />
          </div>
          <button type="button" onClick={() => setFull(null)} className="absolute right-4 top-4 z-[70] rounded-full bg-white/90 px-4 py-1.5 text-sm font-medium">
            Cerrar ✕
          </button>
        </div>
      )}
    </div>
  );
}
