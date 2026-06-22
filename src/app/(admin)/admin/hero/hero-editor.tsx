'use client';

import {useEffect, useState, useTransition} from 'react';
import {toast} from 'sonner';
import {Plus, Trash2, ChevronUp, ChevronDown, Monitor, Smartphone, RotateCcw, Check, MousePointerClick, Sparkles, List, Eye, EyeOff} from 'lucide-react';
import {cn} from '@/lib/utils';
import {input as inputCls, label as labelCls, btn, btnGhost} from '@/components/admin/ui';
import HeroMedia from '@/components/admin/hero-media';
import {HeroPreview} from '@/components/hero';
import {saveHero} from './actions';
import {DEFAULT_HERO_SLIDE, type HeroSlide} from '@/lib/hero-types';
import type {HeroEvent} from '@/lib/hero';

const MODES = [
  {id: 'boton', label: 'Solo botón', Icon: MousePointerClick},
  {id: 'rotulo', label: 'Rótulo de evento', Icon: Sparkles},
  {id: 'agenda', label: 'Lista de eventos', Icon: List}
] as const;

const LOGO_COLORS: [HeroSlide['logoColor'], string][] = [
  ['white', '#ffffff'],
  ['cream', '#faf6ef'],
  ['brown', '#4c2f08'],
  ['ink', '#243b53'],
  ['orange', '#f26b21']
];

export default function HeroEditor({initial, events}: {initial: HeroSlide[]; events: HeroEvent[]}) {
  const [slides, setSlides] = useState<HeroSlide[]>(
    initial.length ? initial : [{...DEFAULT_HERO_SLIDE, id: 's' + Date.now()}]
  );
  const [sel, setSel] = useState(slides[0]?.id);
  const [device, setDevice] = useState<'pc' | 'mobile'>('pc');
  const [animKey, setAnimKey] = useState(0);
  const [pending, start] = useTransition();

  const slide = slides.find((s) => s.id === sel) ?? slides[0];

  useEffect(() => {
    if (!slides.find((s) => s.id === sel) && slides[0]) setSel(slides[0].id);
  }, [slides, sel]);
  useEffect(() => setAnimKey((k) => k + 1), [sel, device]);

  function set<K extends keyof HeroSlide>(k: K, v: HeroSlide[K]) {
    setSlides((arr) => arr.map((s) => (s.id === slide.id ? {...s, [k]: v} : s)));
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
                <button onClick={() => removeSlide(s.id)} aria-label="Eliminar" className="p-1 text-ink-3 hover:text-danger"><Trash2 className="size-4" /></button>
              </div>
            ))}
          </div>
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
          <Field label={`Oscurecido del fondo · ${slide.darken}%`}>
            <input type="range" min={0} max={80} value={slide.darken} onChange={(e) => set('darken', +e.target.value)} className="w-full accent-brand" />
          </Field>
          <Toggle label="Mostrar logo" checked={slide.showLogo} onChange={(v) => set('showLogo', v)} />
          {slide.showLogo && (
            <Field label="Color del logo">
              <div className="flex gap-2">
                {LOGO_COLORS.map(([name, hex]) => (
                  <button key={name} onClick={() => set('logoColor', name)} className="size-7 rounded-full" style={{background: hex, boxShadow: `0 0 0 ${(slide.logoColor || 'white') === name ? '2px var(--ink)' : '1px var(--line-strong)'}`}} />
                ))}
              </div>
            </Field>
          )}
        </Card>

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
              <Field label="Texto del rótulo">
                <input className={inputCls} value={slide.rotulo} onChange={(e) => set('rotulo', e.target.value)} placeholder="Sunset Sessions" />
              </Field>
              <Field label="Subtexto">
                <input className={inputCls} value={slide.sub} onChange={(e) => set('sub', e.target.value)} placeholder="SÁBADO · 20:00" />
              </Field>
            </>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipografía rótulo">
              <select className={inputCls} value={slide.font} onChange={(e) => set('font', e.target.value as HeroSlide['font'])}>
                <option value="romance">Modern Romance</option>
                <option value="eight">Eight One</option>
                <option value="display">Playfair</option>
              </select>
            </Field>
            <Field label="Animación">
              <select className={inputCls} value={slide.anim} onChange={(e) => set('anim', e.target.value as HeroSlide['anim'])}>
                <option value="fade">Fundido</option>
                <option value="slide">Deslizar</option>
                <option value="none">Ninguna</option>
              </select>
            </Field>
          </div>
          <Field label="Color del rótulo">
            <Swatch value={slide.color} onPick={(c) => set('color', c)} colors={['#e9ae74', '#ffffff', '#fedb71', '#2e6e8e', '#f26b21']} />
          </Field>
          {slide.heroMode === 'rotulo' && (
            <Field label={`Posición vertical del rótulo · ${slide.rotuloY ?? 68}%`} hint="Más arriba o más abajo en la pantalla">
              <input type="range" min={10} max={88} value={slide.rotuloY ?? 68} onChange={(e) => set('rotuloY', +e.target.value)} className="w-full accent-brand" />
            </Field>
          )}
          <div className="flex flex-col gap-3 border-t border-line pt-3">
            <Toggle label="Botón 'Ir al evento' bajo el evento" checked={slide.eventBtn} onChange={(v) => set('eventBtn', v)} />
            {slide.eventBtn && (
              <Field label="Texto del botón de evento">
                <input className={inputCls} value={slide.eventBtnText} onChange={(e) => set('eventBtnText', e.target.value)} />
              </Field>
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
                  <select className={inputCls} value={slide.marqueeOrient} onChange={(e) => set('marqueeOrient', e.target.value as HeroSlide['marqueeOrient'])}>
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                  </select>
                </Field>
                <Field label="Dirección">
                  <select className={inputCls} value={slide.marqueeDir} onChange={(e) => set('marqueeDir', e.target.value as HeroSlide['marqueeDir'])}>
                    {slide.marqueeOrient === 'vertical' ? (
                      <>
                        <option value="up">Hacia arriba</option>
                        <option value="down">Hacia abajo</option>
                      </>
                    ) : (
                      <>
                        <option value="left">Hacia la izquierda</option>
                        <option value="right">Hacia la derecha</option>
                      </>
                    )}
                  </select>
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
  const list = colors ?? ['#e9ae74', '#ffffff', '#fedb71', '#2e6e8e', '#f26b21', '#4c2f08', '#243b53'];
  const isCustom = !!value && !list.includes(value);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {none && (
        <button type="button" onClick={() => onPick('')} title="Ninguno" className="flex size-7 items-center justify-center rounded-full border border-line-strong bg-surface text-xs text-ink-3" style={{boxShadow: !value ? '0 0 0 2px var(--ink)' : 'none'}}>
          ∅
        </button>
      )}
      {list.map((c) => (
        <button key={c} type="button" onClick={() => onPick(c)} className="size-7 rounded-full" style={{background: c, boxShadow: `0 0 0 ${value === c ? '2px var(--ink)' : '1px var(--line-strong)'}`}} />
      ))}
      {/* Color personalizado: cualquier color */}
      <label className="relative size-7 cursor-pointer overflow-hidden rounded-full" title="Color personalizado" style={{boxShadow: `0 0 0 ${isCustom ? '2px var(--ink)' : '1px var(--line-strong)'}`}}>
        <span className="absolute inset-0" style={{background: isCustom ? value : 'conic-gradient(red, orange, yellow, lime, cyan, blue, magenta, red)'}} />
        <input type="color" value={value && value.startsWith('#') ? value : '#e9ae74'} onChange={(e) => onPick(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
      </label>
    </div>
  );
}
