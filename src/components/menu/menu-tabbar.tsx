'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {Heart, PlayCircle, UtensilsCrossed, ListChecks, X, Plus, Minus, Trash2, ChevronUp, ChevronDown} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {euro, tx} from '@/lib/localize';
import AllergenIcon from '@/components/allergen-icon';
import {useScrollLock} from '@/lib/use-scroll-lock';
import {useMenuStore, type MenuItem} from './store';

type View = 'none' | 'favs' | 'list' | 'video';
type ListEntry = {item: MenuItem; qty: number; note?: string};

export default function MenuTabBar({videos, locale, menuSlug}: {videos: MenuItem[]; locale: string; menuSlug: string}) {
  const s = useMenuStore();
  const [view, setView] = useState<View>('none');

  useScrollLock(view !== 'none' || !!s.open);

  // Solo lo de la carta actual (desayunos / restaurante / hamburguesería).
  const favs = Object.values(s.favs).filter((i) => i.menuSlug === menuSlug);
  const listItems = Object.values(s.list).filter((x) => x.item.menuSlug === menuSlug);
  const favCount = favs.length;
  const listCount = listItems.reduce((n, x) => n + x.qty, 0);
  const activeKey = view === 'none' ? 'menu' : view;

  const tabs = [
    {key: 'menu', label: 'Menú', Icon: UtensilsCrossed, onClick: () => setView('none'), badge: 0},
    ...(videos.length ? [{key: 'video', label: 'Vídeo', Icon: PlayCircle, onClick: () => setView('video'), badge: 0}] : []),
    {key: 'favs', label: 'Favoritos', Icon: Heart, onClick: () => setView('favs'), badge: favCount},
    {key: 'list', label: 'Mi lista', Icon: ListChecks, onClick: () => setView('list'), badge: listCount}
  ];

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-line bg-surface/95 px-2 py-2 backdrop-blur md:inset-x-auto md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:gap-1 md:rounded-full md:border md:px-3 md:shadow-lg">
        {tabs.map((tb) => {
          const active = tb.key === activeKey;
          return (
            <button key={tb.key} onClick={tb.onClick} className="relative flex flex-1 flex-col items-center gap-0.5 whitespace-nowrap px-2 py-1 text-[0.62rem] font-medium md:flex-none md:flex-row md:gap-1.5 md:px-3.5 md:text-sm">
              <span className={`flex size-9 items-center justify-center rounded-full transition md:size-auto md:bg-transparent ${active ? 'bg-brand text-on-primary md:text-brand-deep' : 'text-ink-2'}`}>
                <tb.Icon className="size-5 md:size-4" />
              </span>
              <span className={active ? 'text-brand-deep' : 'text-ink-2'}>{tb.label}</span>
              {tb.badge > 0 && (
                <span className="absolute right-1.5 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[0.6rem] font-bold text-on-primary md:static md:ml-1">
                  {tb.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {(view === 'favs' || view === 'list') && (
        <Sheet title={view === 'favs' ? 'Favoritos' : 'Mi lista'} onClose={() => setView('none')}>
          {view === 'favs' ? <FavsView items={favs} locale={locale} /> : <ListView items={listItems} locale={locale} />}
        </Sheet>
      )}
      {view === 'video' && <VideoReels videos={videos} locale={locale} onClose={() => setView('none')} />}

      <ProductModal locale={locale} />
    </>
  );
}

function Sheet({title, onClose, children}: {title: string; onClose: () => void; children: React.ReactNode}) {
  const [drag, setDrag] = useState(0);
  const dy = useRef<number | null>(null);
  return (
    <div className="fixed inset-0 z-[300]">
      <div onClick={onClose} className="absolute inset-0 bg-black/45 duration-200 animate-in fade-in" />
      <div
        className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto overscroll-contain rounded-t-[24px] border-t border-line bg-bg p-4 pb-8 shadow-2xl duration-300 animate-in slide-in-from-bottom"
        style={{transform: `translateY(${drag}px)`, transition: drag ? 'none' : undefined}}
        onTouchStart={(e) => (dy.current = e.touches[0].clientY)}
        onTouchMove={(e) => {
          if (dy.current != null) {
            const d = e.touches[0].clientY - dy.current;
            if (d > 0) setDrag(d);
          }
        }}
        onTouchEnd={() => {
          if (drag > 110) onClose();
          setDrag(0);
          dy.current = null;
        }}
      >
        <div onClick={onClose} className="mx-auto mb-3 h-1.5 w-11 cursor-pointer rounded-full bg-line-strong" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl">{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-full bg-surface-2 p-1.5">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Thumb({item}: {item: MenuItem}) {
  const s = useMenuStore();
  return (
    <button onClick={() => s.setOpen(item)} className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-sunken text-line-strong">
      {item.image ? <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" /> : <UtensilsCrossed className="size-6" />}
    </button>
  );
}

function FavsView({items, locale}: {items: MenuItem[]; locale: string}) {
  const s = useMenuStore();
  if (!items.length) return <p className="py-8 text-center text-sm text-ink-3">Aún no tienes favoritos. Pulsa el ♥ en los platos.</p>;
  return (
    <div className="flex flex-col gap-2">
      {items.map((it) => (
        <div key={it.id} className="flex items-center gap-3 rounded-[16px] border border-line bg-surface p-2.5">
          <Thumb item={it} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">{it.name}</div>
            {it.price != null && <div className="text-sm font-semibold text-brand-deep">{euro(it.price, locale)}</div>}
          </div>
          <button onClick={() => s.add(it)} className="rounded-full bg-brand px-3.5 py-1.5 text-sm font-semibold text-on-primary">Añadir</button>
          <button onClick={() => s.toggleFav(it)} aria-label="Quitar" className="p-1.5 text-red-500">
            <Heart className="size-5" fill="currentColor" />
          </button>
        </div>
      ))}
    </div>
  );
}

function ListView({items, locale}: {items: ListEntry[]; locale: string}) {
  const s = useMenuStore();
  if (!items.length) return <p className="py-8 text-center text-sm text-ink-3">Tu lista está vacía. Pulsa “Añadir” en los platos.</p>;
  const total = items.reduce((sum, x) => sum + (x.item.price ?? 0) * x.qty, 0);
  return (
    <div className="flex flex-col gap-2">
      {items.map(({item, qty, note}) => (
        <div key={item.id} className="flex items-center gap-3 rounded-[16px] border border-line bg-surface p-2.5">
          <Thumb item={item} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">{item.name}</div>
            {item.price != null && <div className="text-sm font-semibold text-brand-deep">{euro(item.price, locale)}</div>}
            {note && <div className="mt-0.5 line-clamp-2 text-xs text-ink-3">📝 {note}</div>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => s.dec(item.id)} aria-label="Quitar" className="flex size-8 items-center justify-center rounded-full bg-brand text-on-primary"><Minus className="size-4" /></button>
            <span className="w-4 text-center font-bold tabular-nums">{qty}</span>
            <button onClick={() => s.add(item)} aria-label="Añadir" className="flex size-8 items-center justify-center rounded-full bg-brand text-on-primary"><Plus className="size-4" /></button>
          </div>
          <button onClick={() => s.remove(item.id)} aria-label="Eliminar" className="p-1 text-ink-3 hover:text-danger"><Trash2 className="size-4" /></button>
        </div>
      ))}
      <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
        <span className="font-medium text-ink-2">Total orientativo</span>
        <span className="font-bold tabular-nums text-brand-deep">{euro(total, locale)}</span>
      </div>
      <button onClick={() => s.clear()} className="mt-1 self-end text-sm text-ink-3 hover:text-danger">Vaciar lista</button>
    </div>
  );
}

function VideoReels({videos, locale, onClose}: {videos: MenuItem[]; locale: string; onClose: () => void}) {
  const s = useMenuStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [idx, setIdx] = useState(0);
  const [controls, setControls] = useState(false);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = sectionRefs.current.indexOf(e.target as HTMLElement);
          if (i < 0) continue;
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            setIdx(i);
            videoRefs.current.forEach((v, j) => {
              if (!v) return;
              if (j === i) {
                v.currentTime = 0;
                v.play().catch(() => {});
              } else {
                v.pause();
              }
            });
          }
        }
      },
      {root, threshold: [0.6]}
    );
    sectionRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [videos.length]);

  function goTo(i: number) {
    sectionRefs.current[i]?.scrollIntoView({behavior: 'smooth'});
  }

  return (
    <div className="fixed inset-0 z-[300] bg-black">
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-texto-derecha.svg" alt="La Calita" className="h-9 w-auto brightness-0 invert" />
        <button onClick={onClose} aria-label="Cerrar" className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
          <X className="size-5" />
        </button>
      </div>

      {controls && videos.length > 1 && (
        <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3">
          <button onClick={() => goTo(idx - 1)} disabled={idx === 0} aria-label="Anterior" className="flex size-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition disabled:opacity-30">
            <ChevronUp className="size-6" />
          </button>
          <button onClick={() => goTo(idx + 1)} disabled={idx === videos.length - 1} aria-label="Siguiente" className="flex size-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition disabled:opacity-30">
            <ChevronDown className="size-6" />
          </button>
        </div>
      )}

      <div ref={scrollRef} onClick={() => setControls((c) => !c)} className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain">
        {videos.map((v, i) => {
          const fav = s.isFav(v.id);
          const n = s.qty(v.id);
          return (
            <section key={v.id} ref={(el) => { sectionRefs.current[i] = el; }} className="relative flex h-full snap-start items-center justify-center overflow-hidden">
              {v.video && <video ref={(el) => { videoRefs.current[i] = el; }} src={v.video} poster={v.image ?? undefined} muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />}
              <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(0,0,0,.72), transparent 45%)'}} />
              <div onClick={(e) => e.stopPropagation()} className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-5 pb-10 text-white">
                <div className="min-w-0">
                  <h3 className="font-serif text-2xl font-bold">{v.name}</h3>
                  {v.price != null && <p className="mt-0.5 font-bold text-brand">{euro(v.price, locale)}</p>}
                  {v.desc && <p className="mt-1 line-clamp-2 max-w-md text-sm text-white/85">{v.desc}</p>}
                  <button onClick={() => s.setOpen(v)} className="mt-1 inline-block text-sm font-medium text-brand">Ver más</button>
                  {v.allergens && v.allergens.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {v.allergens.map((a) => (
                        <span key={a.code} className="flex size-7 items-center justify-center rounded-md bg-white/90">
                          <AllergenIcon src={a.icon} label={tx(a.name, locale)} size={20} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-center gap-3">
                  <button onClick={() => s.toggleFav(v)} aria-label="Favorito" className={`flex size-12 items-center justify-center rounded-full bg-white/15 backdrop-blur ${fav ? 'text-red-500' : 'text-white'}`}>
                    <Heart className="size-6" fill={fav ? 'currentColor' : 'none'} />
                  </button>
                  {n === 0 ? (
                    <button onClick={() => s.add(v)} aria-label="Añadir" className="flex size-12 items-center justify-center rounded-full bg-brand text-on-primary">
                      <Plus className="size-6" />
                    </button>
                  ) : (
                    <div className="flex w-12 flex-col items-center gap-1 rounded-full bg-brand py-2 text-on-primary">
                      <button onClick={() => s.add(v)} aria-label="Añadir"><Plus className="size-6" /></button>
                      <span className="text-base font-bold tabular-nums">{n}</span>
                      <button onClick={() => s.dec(v.id)} aria-label="Quitar"><Minus className="size-6" /></button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function ProductModal({locale}: {locale: string}) {
  const s = useMenuStore();
  const it = s.open;
  const n = it ? s.qty(it.id) : 0;
  const [note, setNote] = useState('');
  useEffect(() => {
    setNote(it ? s.list[it.id]?.note ?? '' : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [it]);
  if (!it) return null;
  const close = () => s.setOpen(null);
  const isBurger = it.menuSlug === 'hamburgueseria';
  return (
    <div className="fixed inset-0 z-[320] flex items-end justify-center sm:items-center sm:p-4">
      <div onClick={close} className="absolute inset-0 bg-black/60 duration-200 animate-in fade-in" />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-t-[24px] bg-bg shadow-2xl duration-300 animate-in slide-in-from-bottom sm:rounded-[24px] sm:zoom-in-95">
        <div className="relative flex aspect-[4/3] items-center justify-center bg-surface-sunken text-line-strong">
          {it.video ? (
            <video src={it.video} poster={it.image ?? undefined} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
          ) : it.image ? (
            <Image src={it.image} alt={it.name} fill sizes="448px" className="object-cover" />
          ) : (
            <UtensilsCrossed className="size-14" strokeWidth={1.25} />
          )}
          <button onClick={close} aria-label="Cerrar" className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur">
            <X className="size-5" />
          </button>
        </div>
        <div className="max-h-[38vh] overflow-y-auto overscroll-contain p-5">
          <h2 className="font-serif text-2xl font-bold">{it.name}</h2>
          {it.desc && <p className="mt-1 leading-relaxed text-ink-2">{it.desc}</p>}
          {it.price != null && <p className="mt-3 text-xl font-bold text-brand-deep">{euro(it.price, locale)}</p>}
          {it.ingredients && it.ingredients.length > 0 && (
            <div className="mt-3">
              <div className="mb-1.5 font-adam text-[0.66rem] uppercase tracking-[0.1em] text-ink-3">Lleva</div>
              <div className="flex flex-wrap gap-1.5">
                {it.ingredients.map((ing, i) => (
                  <span key={i} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-ink-2">{ing}</span>
                ))}
              </div>
            </div>
          )}
          {it.allergens && it.allergens.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {it.allergens.map((a) => (
                <span key={a.code} className="flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs text-ink-2">
                  <AllergenIcon src={a.icon} label={tx(a.name, locale)} size={18} />
                  {tx(a.name, locale)}
                </span>
              ))}
            </div>
          )}
          {isBurger && (
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-ink-2">¿Quitar o añadir algo?</label>
              <textarea
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  if (s.list[it.id]) s.setNote(it.id, e.target.value);
                }}
                rows={2}
                placeholder="Ej. sin cebolla, extra bacon, pan sin gluten…"
                className="w-full rounded-[12px] border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
              />
            </div>
          )}
        </div>
        <p className="border-t border-line bg-surface-2 px-5 py-2.5 text-center text-xs text-ink-3">
          Esta lista no es un pedido: te sirve para guardar lo que quieres y enseñárselo al camarero.
        </p>
        <div className="flex items-center gap-3 border-t border-line p-4">
          <div className="flex items-center gap-2">
            <button onClick={() => s.dec(it.id)} disabled={n === 0} aria-label="Menos" className="flex size-9 items-center justify-center rounded-full bg-brand text-on-primary disabled:opacity-40"><Minus className="size-4" /></button>
            <span className="w-5 text-center font-bold tabular-nums">{n}</span>
            <button onClick={() => s.add(it)} aria-label="Más" className="flex size-9 items-center justify-center rounded-full bg-brand text-on-primary"><Plus className="size-4" /></button>
          </div>
          <button
            onClick={() => {
              if (n === 0) s.add(it);
              s.setNote(it.id, note);
              close();
            }}
            className="flex-1 rounded-full bg-brand py-3 font-semibold text-on-primary transition hover:bg-brand-deep"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}
