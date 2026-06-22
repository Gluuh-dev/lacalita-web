'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {Heart, PlayCircle, UtensilsCrossed, ListChecks, X, Plus, Minus, Trash2} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {euro, tx} from '@/lib/localize';
import AllergenIcon from '@/components/allergen-icon';
import {useMenuStore, type MenuItem} from './store';

type View = 'none' | 'favs' | 'list' | 'video';

export default function MenuTabBar({videos, locale}: {videos: MenuItem[]; locale: string}) {
  const s = useMenuStore();
  const [view, setView] = useState<View>('none');

  useEffect(() => {
    document.body.style.overflow = view !== 'none' ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [view]);

  const tabs = [
    {key: 'menu', label: 'Menú', Icon: UtensilsCrossed, onClick: () => setView('none'), badge: 0},
    ...(videos.length ? [{key: 'video', label: 'Vídeo', Icon: PlayCircle, onClick: () => setView('video'), badge: 0}] : []),
    {key: 'favs', label: 'Favoritos', Icon: Heart, onClick: () => setView('favs'), badge: s.favCount},
    {key: 'list', label: 'Mi lista', Icon: ListChecks, onClick: () => setView('list'), badge: s.listCount}
  ];

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-line bg-surface/95 px-2 py-2 backdrop-blur md:inset-x-auto md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:gap-1 md:rounded-full md:border md:px-3 md:shadow-lg">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={tb.onClick}
            className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-[0.62rem] font-medium transition md:flex-row md:gap-1.5 md:text-xs ${view === tb.key ? 'text-brand-deep' : 'text-ink-2'}`}
          >
            <tb.Icon className="size-5 md:size-4" />
            <span>{tb.label}</span>
            {tb.badge > 0 && (
              <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[0.6rem] font-bold text-on-primary md:static md:ml-1">
                {tb.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {(view === 'favs' || view === 'list') && (
        <Sheet title={view === 'favs' ? 'Favoritos' : 'Mi lista'} onClose={() => setView('none')}>
          {view === 'favs' ? <FavsView locale={locale} /> : <ListView locale={locale} />}
        </Sheet>
      )}
      {view === 'video' && <VideoReels videos={videos} locale={locale} onClose={() => setView('none')} />}
    </>
  );
}

function Sheet({title, onClose, children}: {title: string; onClose: () => void; children: React.ReactNode}) {
  const [drag, setDrag] = useState(0);
  const dy = useRef<number | null>(null);
  return (
    <div className="fixed inset-0 z-[300]">
      <div onClick={onClose} onTouchMove={(e) => e.preventDefault()} className="absolute inset-0 bg-black/45 duration-200 animate-in fade-in" />
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
  return (
    <Link href={`/carta/${item.menuSlug}/${item.slug}`} className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
      {item.image && <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />}
    </Link>
  );
}

function FavsView({locale}: {locale: string}) {
  const s = useMenuStore();
  const items = Object.values(s.favs);
  if (!items.length)
    return <p className="py-8 text-center text-sm text-ink-3">Aún no tienes favoritos. Pulsa el ♥ en los platos.</p>;
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
          <button onClick={() => s.toggleFav(it)} aria-label="Quitar" className="p-1.5 text-brand-deep">
            <Heart className="size-5" fill="currentColor" />
          </button>
        </div>
      ))}
    </div>
  );
}

function ListView({locale}: {locale: string}) {
  const s = useMenuStore();
  const items = Object.values(s.list);
  if (!items.length)
    return <p className="py-8 text-center text-sm text-ink-3">Tu lista está vacía. Pulsa "Añadir" en los platos.</p>;
  const total = items.reduce((sum, x) => sum + (x.item.price ?? 0) * x.qty, 0);
  return (
    <div className="flex flex-col gap-2">
      {items.map(({item, qty}) => (
        <div key={item.id} className="flex items-center gap-3 rounded-[16px] border border-line bg-surface p-2.5">
          <Thumb item={item} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">{item.name}</div>
            {item.price != null && <div className="text-sm font-semibold text-brand-deep">{euro(item.price, locale)}</div>}
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
  return (
    <div className="fixed inset-0 z-[300] bg-black">
      <button onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur">
        <X className="size-5" />
      </button>
      <div className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain">
        {videos.map((v) => {
          const n = s.qty(v.id);
          const fav = s.isFav(v.id);
          return (
            <section key={v.id} className="relative flex h-full snap-start items-center justify-center overflow-hidden">
              {v.video && <video src={v.video} poster={v.image ?? undefined} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />}
              <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(0,0,0,.7), transparent 45%)'}} />
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-5 pb-10 text-white">
                <div className="min-w-0">
                  <h3 className="font-serif text-2xl font-bold">{v.name}</h3>
                  {v.price != null && <p className="mt-0.5 font-bold text-brand">{euro(v.price, locale)}</p>}
                  {v.desc && <p className="mt-1 line-clamp-2 max-w-md text-sm text-white/85">{v.desc}</p>}
                  <Link href={`/carta/${v.menuSlug}/${v.slug}`} className="mt-1 inline-block text-sm font-medium text-brand">Ver más</Link>
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
                  <button onClick={() => s.toggleFav(v)} aria-label="Favorito" className="flex size-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
                    <Heart className="size-6" fill={fav ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => s.add(v)} aria-label="Añadir" className="flex size-12 items-center justify-center rounded-full bg-brand text-on-primary">
                    {n > 0 ? <span className="font-bold">{n}</span> : <Plus className="size-6" />}
                  </button>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
