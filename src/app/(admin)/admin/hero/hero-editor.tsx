'use client';

import {useEffect, useState, useTransition} from 'react';
import {toast} from 'sonner';
import {Plus, Trash2, ChevronUp, ChevronDown, Monitor, Smartphone, RotateCcw, Check, MousePointerClick, Sparkles, List, Eye, EyeOff} from 'lucide-react';
import {cn} from '@/lib/utils';
import {input as inputCls, label as labelCls, btn, btnGhost} from '@/components/admin/ui';
import HeroMedia from '@/components/admin/hero-media';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from '@/components/ui/select';
import {HeroPreview} from '@/components/hero';
import {saveHero} from './actions';
import {DEFAULT_HERO_SLIDE, type HeroSlide, type HeroFont} from '@/lib/hero-types';
import type {HeroEvent} from '@/lib/hero';

const MODES = [
  {id: 'boton', label: 'Solo botón', Icon: MousePointerClick},
  {id: 'rotulo', label: 'Rótulo de evento', Icon: Sparkles},
  {id: 'agenda', label: 'Lista de eventos', Icon: List}
] as const;

// Mapea los valores antiguos del color del logo a hex (compatibilidad).
const LEGACY_LOGO: Record<string, string> = {
  white: '#ffffff',
  cream: '#faf6ef',
  brown: '#4c2f08',
  ink: '#243b53',
  orange: '#f26b21'
};

export default function HeroEditor({initial, events}: {initial: HeroSlide[]; events: HeroEvent[]}) {
  const [slides, setSlides] = useState<HeroSlide[]>(
    initial.length ? initial : [{...DEFAULT_HERO_SLIDE, id: 's' + Date.now()}]
  );
  const [sel, setSel] = useState(slides[0]?.id);
  const [device, setDevice] = useState<'pc' | 'mobile'>('pc');
  const [animKey, setAnimKey] = useState(0);
  const [pending, start] = useTransition();

  const slide = slides.find((s) => s.id === sel) ?? slides[0];
  const isPoster = slide?.heroMode === 'poster';

  useEffect(() => {
    if (!slides.find((s) => s.id === sel) && slides[0]) setSel(slides[0].id);
  }, [slides, sel]);
  useEffect(() => setAnimKey((k) => k + 1), [sel, device]);

  function set<K extends keyof HeroSlide>(k: K, v: HeroSlide[K]) {
    setSlides((arr) => arr.map((s) => (s.id === slide.id ? {...s, [k]: v} : s)));
  }
  function setLine(i: number, key: 'text' | 'color' | 'font', value: string) {
    const lines = [0, 1, 2].map((j) => slide.rotuloLines?.[j] ?? {text: '', color: '#ffffff', font: 'romance' as HeroFont});
    lines[i] = {...lines[i], [key]: value};
    set('rotuloLines', lines);
  }
  function persist(next: HeroSlide[], msg?: string) {
    setSlides(next);
    start(async () => {
      const r = await saveHero(next);
      if (!r.ok) toast.error(r.error);
      else if (msg) toast.success(msg);
    });
  }
  function addSlide() {
    const id = 's' + Date.now();
    const next = [...slides, {...DEFAULT_HERO_SLIDE, id, name: `Diapositiva ${slides.length + 1}`}];
    persist(next, 'Diapositiva añadida');
    setSel(id);
  }
  function removeSlide(id: string) {
    // La primera diapositiva es la portada por defecto: siempre debe existir.
    if (slides.findIndex((s) => s.id === id) === 0) return toast.error('La portada por defecto no se puede eliminar');
    if (slides.length <= 1) return toast.error('Debe quedar al menos una');
    persist(slides.filter((s) => s.id !== id), 'Diapositiva eliminada');
  }
  function toggleActive(id: string) {
    persist(slides.map((s) => (s.id === id ? {...s, active: s.active === false} : s)));
  }
  function move(id: string, dir: -1 | 1) {
    const i = slides.findIndex((s) => s.id === id);
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    const next = [...slides];
    [next[i], next[j]] = [next[j], next[i]];
    persist(next);
  }
  function save() {
    start(async () => {
      const r = await saveHero(slides);
      if (r.ok) toast.success('Portada guardada');
      else toast.error(r.error);
    });
  }

  if (!slide) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,400px)_1fr] lg:items-start">
      {/* EDITOR */}
      <div className="flex flex-col gap-4">
        {/* Diapositivas */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="eyebrow">Diapositivas</div>
            <button onClick={addSlide} className={`${btnGhost} inline-flex items-center gap-1.5`}>
              <Plus className="size-4" /> Añadir
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {slides.map((s, i) => (
              <div key={s.id} className={cn('flex items-center gap-2 rounded-lg border p-1.5', s.id === sel ? 'border-brand bg-surface-sunken' : 'border-line')}>
                <div className="flex flex-col">
                  <button onClick={() => move(s.id, -1)} disabled={i === 0} className="text-ink-3 disabled:opacity-30"><ChevronUp className="size-4" /></button>
                  <button onClick={() => move(s.id, 1)} disabled={i === slides.length - 1} className="text-ink-3 disabled:opacity-30"><ChevronDown className="size-4" /></button>
                </div>
                <button onClick={() => setSel(s.id)} className="flex flex-1 items-center gap-2 text-left">
                  <span className="flex h-7 w-11 shrink-0 items-center justify-center overflow-hidden rounded bg-gradient-to-br from-accent to-ink text-white" style={s.media && s.mediaType === 'image' ? {background: `center/cover url(${s.media})`} : undefined}>
                    {s.mediaType === 'video' && '▶'}
                  </span>
                  <span className={cn('flex-1 truncate text-sm font-medium', s.active === false && 'text-ink-3 line-through')}>{s.name}</span>
                </button>
                <button onClick={() => toggleActive(s.id)} aria-label={s.active === false ? 'Activar' : 'Desactivar'} title={s.active === false ? 'Activar' : 'Ocultar en la web'} className="p-1 text-ink-3 hover:text-ink">
                  {s.active === false ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
                <button
                  onClick={() => removeSlide(s.id)}
                  disabled={i === 0}
                  aria-label="Eliminar"
                  title={i === 0 ? 'La portada por defecto no se puede eliminar' : 'Eliminar'}
                  className="p-1 text-ink-3 hover:text-danger disabled:pointer-events-none disabled:opacity-30"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Tipo de diapositiva */}
        <Card>
          <div className="eyebrow">Tipo de diapositiva</div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => set('heroMode', 'boton')} className={cn('rounded-[14px] border p-3 text-sm font-semibold', !isPoster ? 'border-brand bg-surface-sunken text-brand-deep' : 'border-line-strong text-ink-2')}>Normal</button>
            <button type="button" onClick={() => set('heroMode', 'poster')} className={cn('rounded-[14px] border p-3 text-sm font-semibold', isPoster ? 'border-brand bg-surface-sunken text-brand-deep' : 'border-line-strong text-ink-2')}>Póster de evento</button>
          </div>
          {isPoster && <p className="text-sm text-ink-3">Cartel de evento: fondo + palmeras + foto del artista + textos. El fondo y el color del logo se ponen en la tarjeta “Fondo”.</p>}
        </Card>

        {/* Fondo */}
        <Card>
          <Field label="Nombre de la diapositiva">
            <input className={inputCls} value={slide.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label="Fondo (imagen o vídeo)">
            <HeroMedia
              media={slide.media}
              mediaType={slide.mediaType}
              poster={slide.poster}
              onSet={(m) => setSlides((arr) => arr.map((s) => (s.id === slide.id ? {...s, ...m} : s)))}
              onClear={() => setSlides((arr) => arr.map((s) => (s.id === slide.id ? {...s, media: '', poster: undefined} : s)))}
            />
          </Field>
          {slide.mediaType === 'image' && slide.media && (
            <Field label="Ajuste de la imagen" hint="“Completa” muestra el cartel entero sin recortar y rellena el hueco con la propia imagen difuminada. Ideal para carteles verticales.">
              <div className="grid grid-cols-2 gap-2">
                {([['cover', 'Rellenar'], ['contain', 'Completa (difuminado)']] as const).map(([v, l]) => {
                  const on = (slide.mediaFit ?? 'cover') === v;
                  return (
                    <button key={v} type="button" onClick={() => set('mediaFit', v)} className={cn('rounded-[12px] border px-1 py-2 text-xs font-medium', on ? 'border-brand bg-surface-sunken text-brand-deep' : 'border-line-strong text-ink-2')}>
                      {l}
                    </button>
                  );
                })}
              </div>
            </Field>
          )}
          <Field label={`Oscurecido del fondo · ${slide.darken}%`}>
            <input type="range" min={0} max={80} value={slide.darken} onChange={(e) => set('darken', +e.target.value)} className="w-full accent-brand" />
          </Field>
          <Field label="Logo">
            <div className="grid grid-cols-3 gap-2">
              {([['none', 'Ninguno'], ['solo', 'Símbolo'], ['debajo', 'Texto debajo'], ['derecha', 'Texto al lado'], ['texto', 'Solo texto']] as const).map(([v, l]) => {
                const on = (slide.logoVariant ?? 'debajo') === v;
                return (
                  <button key={v} type="button" onClick={() => set('logoVariant', v)} className={cn('rounded-[12px] border px-1 py-2 text-[0.7rem] font-medium leading-tight', on ? 'border-brand bg-surface-sunken text-brand-deep' : 'border-line-strong text-ink-2')}>
                    {l}
                  </button>
                );
              })}
            </div>
          </Field>
          {(slide.logoVariant ?? 'debajo') !== 'none' && (
            <Field label="Color del logo">
              <Swatch value={LEGACY_LOGO[slide.logoColor] ?? slide.logoColor ?? '#ffffff'} onPick={(c) => set('logoColor', c)} />
            </Field>
          )}
        </Card>

        {!isPoster && (
          <>
        {/* Textos */}
        <Card>
          <div className="eyebrow">Textos</div>
          <Field label="Eyebrow (rótulo superior)">
            <input className={inputCls} value={slide.eyebrow} onChange={(e) => set('eyebrow', e.target.value)} />
          </Field>
          <Field label="Título / lema">
            <textarea className={inputCls} rows={2} value={slide.lema} onChange={(e) => set('lema', e.target.value)} />
          </Field>
          <Field label="Frase de bienvenida">
            <textarea className={inputCls} rows={2} value={slide.bienvenida} onChange={(e) => set('bienvenida', e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Texto del botón">
              <input className={inputCls} value={slide.button} onChange={(e) => set('button', e.target.value)} placeholder="Ver la carta" />
            </Field>
            <Field label="Enlace del botón">
              <input className={inputCls} value={slide.link} onChange={(e) => set('link', e.target.value)} placeholder="/carta" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Color del botón">
              <Swatch value={slide.btnColor} onPick={(c) => set('btnColor', c)} />
            </Field>
            <Field label="Color del eyebrow">
              <Swatch value={slide.eyebrowColor} onPick={(c) => set('eyebrowColor', c)} />
            </Field>
            <Field label="Color del título">
              <Swatch value={slide.lemaColor} onPick={(c) => set('lemaColor', c)} />
            </Field>
            <Field label="Color de la bienvenida">
              <Swatch value={slide.bienvenidaColor} onPick={(c) => set('bienvenidaColor', c)} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Tipografía eyebrow">
              <FontSelect value={slide.eyebrowFont ?? 'adam'} onChange={(v) => set('eyebrowFont', v as HeroFont)} />
            </Field>
            <Field label="Tipografía título">
              <FontSelect value={slide.lemaFont ?? 'display'} onChange={(v) => set('lemaFont', v as HeroFont)} />
            </Field>
            <Field label="Tipografía bienvenida">
              <FontSelect value={slide.bienvenidaFont ?? 'sans'} onChange={(v) => set('bienvenidaFont', v as HeroFont)} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label={`Tamaño eyebrow · ${Math.round((slide.eyebrowScale ?? 1) * 100)}%`}>
              <input type="range" min={0.6} max={1.6} step={0.05} value={slide.eyebrowScale ?? 1} onChange={(e) => set('eyebrowScale', +e.target.value)} className="w-full accent-brand" />
            </Field>
            <Field label={`Tamaño título · ${Math.round((slide.lemaScale ?? 1) * 100)}%`}>
              <input type="range" min={0.6} max={1.8} step={0.05} value={slide.lemaScale ?? 1} onChange={(e) => set('lemaScale', +e.target.value)} className="w-full accent-brand" />
            </Field>
            <Field label={`Tamaño bienvenida · ${Math.round((slide.bienvenidaScale ?? 1) * 100)}%`}>
              <input type="range" min={0.6} max={1.6} step={0.05} value={slide.bienvenidaScale ?? 1} onChange={(e) => set('bienvenidaScale', +e.target.value)} className="w-full accent-brand" />
            </Field>
          </div>
          <Field label="Posición del contenido">
            <div className="grid grid-cols-3 gap-2">
              {([['left', 'Izquierda'], ['center', 'Centro'], ['right', 'Derecha']] as const).map(([v, l]) => {
                const on = (slide.contentAlign ?? 'left') === v;
                return (
                  <button key={v} type="button" onClick={() => set('contentAlign', v)} className={cn('rounded-[12px] border px-1 py-2 text-xs font-medium', on ? 'border-brand bg-surface-sunken text-brand-deep' : 'border-line-strong text-ink-2')}>
                    {l}
                  </button>
                );
              })}
            </div>
          </Field>
        </Card>

        {/* Zona de eventos */}
        <Card>
          <div className="eyebrow">Zona de eventos en el hero</div>
          <div className="grid grid-cols-3 gap-2">
            {MODES.map((m) => {
              const on = (slide.heroMode || 'boton') === m.id;
              return (
                <button key={m.id} onClick={() => set('heroMode', m.id)} className={cn('flex flex-col items-center gap-1.5 rounded-[14px] border p-3 text-center', on ? 'border-brand bg-surface-sunken text-brand-deep' : 'border-line-strong text-ink-2')}>
                  <m.Icon className="size-5" />
                  <span className="text-xs font-semibold leading-tight">{m.label}</span>
                </button>
              );
            })}
          </div>
          {slide.heroMode === 'agenda' ? (
            <p className="text-sm text-ink-3">Muestra los próximos eventos uno debajo de otro. En PC aparece un panel lateral.</p>
          ) : (
            <>
              <Toggle label="Rellenar con el próximo evento" checked={!!slide.rotuloAuto} onChange={(v) => set('rotuloAuto', v)} />
              {slide.rotuloAuto && (
                <p className="text-sm text-ink-3">Las 3 líneas se rellenan solas con el próximo evento (título · fecha · artista). Elige color y tipografía de cada línea.</p>
              )}
              <div className="flex flex-col gap-2">
                {[0, 1, 2].map((i) => {
                  const line = slide.rotuloLines?.[i] ?? {text: '', color: '#ffffff', font: 'romance' as HeroFont};
                  return (
                    <div key={i} className="rounded-[12px] border border-line p-2.5">
                      {!slide.rotuloAuto && (
                        <input className={`${inputCls} mb-2`} value={line.text} placeholder={`Línea ${i + 1}`} onChange={(e) => setLine(i, 'text', e.target.value)} />
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-3">Línea {i + 1}</span>
                        <div className="ml-auto flex items-center gap-2">
                          <FontSelect value={line.font} onChange={(v) => setLine(i, 'font', v)} />
                          <Swatch value={line.color} onPick={(c) => setLine(i, 'color', c)} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          <Field label="Animación">
            <Select value={slide.anim} onValueChange={(v) => set('anim', (v ?? 'fade') as HeroSlide['anim'])}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="fade">Fundido</SelectItem>
                  <SelectItem value="slide">Deslizar</SelectItem>
                  <SelectItem value="none">Ninguna</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          {slide.heroMode === 'rotulo' && (
            <Field label={`Posición vertical del rótulo · ${slide.rotuloY ?? 68}%`} hint="Más arriba o más abajo en la pantalla">
              <input type="range" min={10} max={88} value={slide.rotuloY ?? 68} onChange={(e) => set('rotuloY', +e.target.value)} className="w-full accent-brand" />
            </Field>
          )}
          <div className="flex flex-col gap-3 border-t border-line pt-3">
            <Toggle label="Botón 'Ir al evento' bajo el evento" checked={slide.eventBtn} onChange={(v) => set('eventBtn', v)} />
            {slide.eventBtn && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Texto del botón">
                  <input className={inputCls} value={slide.eventBtnText} onChange={(e) => set('eventBtnText', e.target.value)} />
                </Field>
                <Field label="Enlace (a qué página lleva)">
                  <input className={inputCls} value={slide.eventBtnLink ?? '/eventos'} onChange={(e) => set('eventBtnLink', e.target.value)} placeholder="/eventos" />
                </Field>
              </div>
            )}
          </div>
        </Card>

        {/* Marquesina */}
        <Card>
          <div className="eyebrow">Texto en movimiento</div>
          <Toggle label="Activar marquesina (texto animado de un lado a otro)" checked={slide.marqueeOn} onChange={(v) => set('marqueeOn', v)} />
          {slide.marqueeOn && (
            <>
              <Field label="Texto">
                <input className={inputCls} value={slide.marquee} onChange={(e) => set('marquee', e.target.value)} placeholder="Noche de directo · La Calita" />
              </Field>
              <Field label={`Velocidad · ${slide.marqueeSpeed}s por vuelta`}>
                <input type="range" min={6} max={40} value={slide.marqueeSpeed} onChange={(e) => set('marqueeSpeed', +e.target.value)} className="w-full accent-brand" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Orientación">
                  <Select value={slide.marqueeOrient} onValueChange={(v) => set('marqueeOrient', (v ?? 'horizontal') as HeroSlide['marqueeOrient'])}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="horizontal">Horizontal</SelectItem>
                        <SelectItem value="vertical">Vertical</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Dirección">
                  <Select value={slide.marqueeDir} onValueChange={(v) => set('marqueeDir', (v ?? 'left') as HeroSlide['marqueeDir'])}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {slide.marqueeOrient === 'vertical' ? (
                          <>
                            <SelectItem value="up">Hacia arriba</SelectItem>
                            <SelectItem value="down">Hacia abajo</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="left">Hacia la izquierda</SelectItem>
                            <SelectItem value="right">Hacia la derecha</SelectItem>
                          </>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label={`Posición · ${slide.marqueePos}%`} hint={slide.marqueeOrient === 'vertical' ? 'Izquierda → derecha' : 'Arriba → abajo'}>
                <input type="range" min={0} max={100} value={slide.marqueePos} onChange={(e) => set('marqueePos', +e.target.value)} className="w-full accent-brand" />
              </Field>
              <Field label="Color del texto">
                <Swatch value={slide.marqueeColor} onPick={(c) => set('marqueeColor', c)} />
              </Field>
              <Field label="Fondo de la banda" hint="Opcional">
                <Swatch value={slide.marqueeBg} onPick={(c) => set('marqueeBg', c)} none />
              </Field>
            </>
          )}
        </Card>
          </>
        )}

        {isPoster && (
          <Card>
            <div className="eyebrow">Póster del evento</div>
            <Field label="Foto del artista (PNG recortado, fondo transparente)">
              <HeroMedia
                media={slide.posterPhoto ?? ''}
                mediaType="image"
                onSet={(m) => set('posterPhoto', m.media)}
                onClear={() => set('posterPhoto', '')}
              />
            </Field>
            <Field label="Presenta (rótulo superior)">
              <input className={inputCls} value={slide.eyebrow} onChange={(e) => set('eyebrow', e.target.value)} placeholder="Presenta" />
            </Field>
            <Field label="Título grande">
              <input className={inputCls} value={slide.posterTitle ?? ''} onChange={(e) => set('posterTitle', e.target.value)} placeholder="MONÓLOGO" />
            </Field>
            <Field label="Subtítulo manuscrito">
              <input className={inputCls} value={slide.posterScript ?? ''} onChange={(e) => set('posterScript', e.target.value)} placeholder="en La Calita" />
            </Field>
            <Field label="Nombre del artista">
              <input className={inputCls} value={slide.posterName ?? ''} onChange={(e) => set('posterName', e.target.value)} placeholder="Pepe Molina" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Fecha">
                <input className={inputCls} value={slide.posterDate ?? ''} onChange={(e) => set('posterDate', e.target.value)} placeholder="Jueves 23 Julio" />
              </Field>
              <Field label="Hora">
                <input className={inputCls} value={slide.posterTime ?? ''} onChange={(e) => set('posterTime', e.target.value)} placeholder="23:30h" />
              </Field>
            </div>
            <Field label="Ubicación">
              <input className={inputCls} value={slide.posterLoc ?? ''} onChange={(e) => set('posterLoc', e.target.value)} placeholder="Paseo Marítimo · Salobreña" />
            </Field>
          </Card>
        )}

        <button onClick={save} disabled={pending} className={`${btn} inline-flex items-center justify-center gap-1.5`}>
          <Check className="size-4" /> {pending ? 'Guardando…' : 'Guardar portada'}
        </button>
      </div>

      {/* PREVIEW */}
      <div className="lg:sticky lg:top-20">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="eyebrow">Previsualización · así se verá en la web</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAnimKey((k) => k + 1)} className={`${btnGhost} inline-flex items-center gap-1.5`}>
              <RotateCcw className="size-4" /> Recargar
            </button>
            <div className="inline-flex gap-1 rounded-full bg-surface-sunken p-1">
              {([['pc', Monitor, 'PC'], ['mobile', Smartphone, 'Móvil']] as const).map(([key, Ic, lbl]) => (
                <button key={key} onClick={() => setDevice(key)} className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium', device === key ? 'bg-surface text-ink shadow-sm' : 'text-ink-3')}>
                  <Ic className="size-4" /> {lbl}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={cn('flex justify-center rounded-[20px] bg-[#1c160e] p-6', device === 'mobile' && 'px-[24%]')}>
          <div className="w-full">
            <HeroPreview slide={slide} events={events} device={device} animKey={animKey} />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-ink-3">Mismas tipografías, proporciones y animación que la web. Pulsa “Recargar” para ver la entrada.</p>
      </div>
    </div>
  );
}

const FONT_LABELS: [string, string][] = [
  ['display', 'Playfair'],
  ['romance', 'Modern Romance'],
  ['eight', 'Eight One'],
  ['adam', 'Adam'],
  ['sans', 'Geist'],
  // Tipografías de marca del cliente
  ['tosca', 'Tosca Zero'],
  ['alfa', 'Alfa Slab One'],
  ['vibes', 'Great Vibes'],
  ['kaushan', 'Kaushan Script'],
  ['cinzel', 'Cinzel'],
  ['montserrat', 'Montserrat']
];

function FontSelect({value, onChange}: {value: string; onChange: (v: string) => void}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? value)}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {FONT_LABELS.map(([v, l]) => (
            <SelectItem key={v} value={v}>{l}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function Card({children}: {children: React.ReactNode}) {
  return <div className="flex flex-col gap-3.5 rounded-[20px] border border-line bg-surface p-4 shadow-sm">{children}</div>;
}

function Field({label, hint, children}: {label: string; hint?: string; children: React.ReactNode}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-3">{hint}</p>}
    </div>
  );
}

function Toggle({label, checked, onChange}: {label: string; checked: boolean; onChange: (v: boolean) => void}) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-3 text-left text-sm">
      <span className="text-ink-2">{label}</span>
      <span className={cn('relative h-6 w-10 shrink-0 rounded-full transition', checked ? 'bg-brand' : 'bg-line-strong')}>
        <span className={cn('absolute top-0.5 size-5 rounded-full bg-white transition-all', checked ? 'left-[18px]' : 'left-0.5')} />
      </span>
    </button>
  );
}

function Swatch({value, onPick, colors, none}: {value: string; onPick: (c: string) => void; colors?: string[]; none?: boolean}) {
  const [open, setOpen] = useState(false);
  const list = colors ?? ['#e9ae74', '#ffffff', '#fedb71', '#2e6e8e', '#f26b21', '#4c2f08', '#243b53'];
  return (
    <div className="relative inline-block">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-full border border-line bg-surface px-2.5 py-1.5">
        <span className="size-5 rounded-full border border-line-strong" style={{background: value || 'transparent'}} />
        <span className="text-xs text-ink-2">{value || 'Ninguno'}</span>
      </button>
      {open && (
        <>
          <button type="button" aria-hidden className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-20 mt-1 flex w-max max-w-[220px] flex-wrap items-center gap-2 rounded-[14px] border border-line bg-surface p-3 shadow-lg">
            {none && (
              <button type="button" onClick={() => { onPick(''); setOpen(false); }} title="Ninguno" className="flex size-7 items-center justify-center rounded-full border border-line-strong bg-surface text-xs text-ink-3">∅</button>
            )}
            {list.map((c) => (
              <button key={c} type="button" onClick={() => { onPick(c); setOpen(false); }} className="size-7 rounded-full" style={{background: c, boxShadow: `0 0 0 ${value === c ? '2px var(--ink)' : '1px var(--line-strong)'}`}} />
            ))}
            <label className="relative size-7 cursor-pointer overflow-hidden rounded-full" title="Color personalizado" style={{boxShadow: '0 0 0 1px var(--line-strong)'}}>
              <span className="absolute inset-0" style={{background: 'conic-gradient(red, orange, yellow, lime, cyan, blue, magenta, red)'}} />
              <input type="color" value={value && value.startsWith('#') ? value : '#e9ae74'} onChange={(e) => onPick(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
