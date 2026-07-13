'use client';

import {useState, useEffect, useRef} from 'react';
import {useSearchParams} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import type {LucideIcon} from 'lucide-react';
import {Flame, Sandwich, IceCreamCone, CupSoda, Coffee, Pizza, Salad, Beef, Utensils, UtensilsCrossed, Search, X, SlidersHorizontal} from 'lucide-react';
import {tx} from '@/lib/localize';
import type {Menu} from '@/lib/queries';
import ProductItem from '@/components/menu/product-item';
import ToastBuilder from '@/components/menu/toast-builder';
import SauceCarousel from '@/components/menu/sauce-carousel';
import AllergenIcon from '@/components/allergen-icon';
import {useHideOnScroll} from '@/lib/use-hide-on-scroll';

// Las categorías no tienen icono en BD: lo inferimos por el nombre.
function catIcon(name: string): LucideIcon {
  const s = name.toLowerCase();
  if (/hamburg|burger|smash/.test(s)) return Sandwich;
  if (/postre|dulce|helado|tarta|dessert/.test(s)) return IceCreamCone;
  if (/bebida|refresco|drink|batido|zumo/.test(s)) return CupSoda;
  if (/caf|desayuno|coffee|merienda|t[ée]\b/.test(s)) return Coffee;
  if (/pizza/.test(s)) return Pizza;
  if (/ensalada|salad|veggie|verdura/.test(s)) return Salad;
  if (/carne|parrilla|grill|meat/.test(s)) return Beef;
  if (/entrante|aperitivo|starter|tapa|snack|patata|frit/.test(s)) return Utensils;
  return UtensilsCrossed;
}

export default function MenuFilters({menu, pinned = false}: {menu: Menu; pinned?: boolean}) {
  const locale = useLocale();
  const t = useTranslations('carta');
  const tMenu = useTranslations('menu');
  const {hidden, scrolled} = useHideOnScroll();
  const params = useSearchParams();
  const cats = (menu.categories ?? []).filter((c) => c.products?.length);
  // Configurador "Arma tu tostada": si hay una categoría base (panes) y otra
  // topping (rellenos). Convive con las listas normales.
  const baseCat = cats.find((c) => c.role === 'base');
  const toppingCat = cats.find((c) => c.role === 'topping');
  const catParam = params.get('cat');
  const [active, setActive] = useState<string>(catParam && cats.some((c) => c.id === catParam) ? catParam : 'all');
  const groups = active === 'all' ? cats : cats.filter((c) => c.id === active);
  const rowRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [showAllergens, setShowAllergens] = useState(false);

  // Alérgenos presentes en esta carta (para el filtro).
  const allergenMap = new Map<string, {code: string; name: Record<string, string>; icon: string}>();
  for (const c of cats) for (const p of c.products) for (const pa of p.product_allergens ?? []) if (pa.allergens) allergenMap.set(pa.allergens.code, pa.allergens);
  const allergens = [...allergenMap.values()];

  const q = query.trim().toLowerCase();
  const filtering = q.length > 0 || excluded.size > 0;
  const results = filtering
    ? cats.flatMap((c) => c.products).filter((p) => {
        if (excluded.size && (p.product_allergens ?? []).some((pa) => pa.allergens && excluded.has(pa.allergens.code))) return false;
        if (q) {
          const n = tx(p.name, locale).toLowerCase();
          const d = p.description ? tx(p.description, locale).toLowerCase() : '';
          if (!n.includes(q) && !d.includes(q)) return false;
        }
        return true;
      })
    : [];
  const toggleEx = (code: string) =>
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });

  // Al entrar desde Inicio con ?cat=, centra el chip activo en el slider de filtros.
  useEffect(() => {
    if (active === 'all') return;
    const row = rowRef.current;
    const chip = row?.querySelector('[data-active]') as HTMLElement | null;
    if (row && chip) row.scrollTo({left: chip.offsetLeft - row.clientWidth / 2 + chip.clientWidth / 2, behavior: 'smooth'});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Filtros: no desplazan, filtran en el sitio. bg sólido para que no “tiemble” al fijarse */}
      <div className={`sticky z-30 transition-[background-color,transform] duration-300 ease-out ${pinned ? `top-[56px] ${scrolled ? 'border-b border-line bg-bg' : 'bg-transparent'}` : `top-[3.5rem] border-b border-line bg-bg ${hidden ? '-translate-y-[9rem]' : ''}`}`}>
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 pt-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search')}
              aria-label="Buscar"
              className="w-full rounded-full border border-line bg-white py-2 pl-9 pr-9 text-sm text-ink outline-none transition focus:border-brand"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Limpiar" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-3 hover:text-ink">
                <X className="size-4" />
              </button>
            )}
          </div>
          {allergens.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAllergens((s) => !s)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition ${excluded.size || showAllergens ? 'border-brand bg-brand text-on-primary' : 'border-line bg-white text-ink-2'}`}
            >
              <SlidersHorizontal className="size-4" />
              {excluded.size ? `${tMenu('allergens')} · ${excluded.size}` : tMenu('allergens')}
            </button>
          )}
        </div>
        {showAllergens && allergens.length > 0 && (
          <div className="mx-auto max-w-5xl px-4 pt-3">
            <p className="mb-2 text-xs text-ink-3">{t('hideMarked')}</p>
            <div className="flex flex-wrap gap-2">
              {allergens.map((a) => {
                const on = excluded.has(a.code);
                return (
                  <button key={a.code} type="button" onClick={() => toggleEx(a.code)} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs transition ${on ? 'border-danger bg-danger/10 text-danger' : 'border-line bg-white text-ink-2'}`}>
                    <AllergenIcon src={a.icon} label={tx(a.name, locale)} size={16} /> {tx(a.name, locale)}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {/* Móvil: scroll horizontal. PC: todos a la vista, envuelven a 2ª fila si no caben. */}
        <div ref={rowRef} className="mx-auto flex max-w-5xl gap-2.5 overflow-x-auto py-3 pl-4 pr-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:justify-center md:overflow-visible md:pr-4">
          <Chip active={active === 'all'} onClick={() => setActive('all')} icon={Flame}>
            {t('all')}
          </Chip>
          {cats.map((c) => (
            <Chip key={c.id} active={active === c.id} onClick={() => setActive(c.id)} icon={catIcon(tx(c.name, locale))}>
              {tx(c.name, locale)}
            </Chip>
          ))}
        </div>
      </div>

      {filtering ? (
        <div className="mx-auto max-w-5xl px-4 py-8">
          {results.length === 0 ? (
            <p className="py-16 text-center text-ink-3">{t('noResults')}</p>
          ) : (
            <>
              <p className="mb-4 text-sm text-ink-3">{t('results', {count: results.length})}</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((p) => (
                  <ProductItem key={p.id} product={p} menuSlug={menu.slug} locale={locale} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div key={active} className="ds-grid-enter py-8">
          {active === 'all' && baseCat && toppingCat && (
            <ToastBuilder base={baseCat} topping={toppingCat} menuSlug={menu.slug} theme={menu.theme} />
          )}
          <div className="mx-auto max-w-5xl px-4">
          {groups.map((c) =>
            c.role === 'carousel' ? (
              <SauceCarousel key={c.id} cat={c} menuSlug={menu.slug} />
            ) : (
              <div key={c.id} className="mb-9">
                {active === 'all' && <h2 className="eyebrow mb-4">{tx(c.name, locale)}</h2>}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {c.products.map((p) => (
                    <ProductItem key={p.id} product={p} menuSlug={menu.slug} locale={locale} />
                  ))}
                </div>
              </div>
            )
          )}
          </div>
        </div>
      )}
    </>
  );
}

function Chip({active, onClick, icon: Icon, children}: {active: boolean; onClick: () => void; icon: LucideIcon; children: React.ReactNode}) {
  return (
    <button
      onClick={onClick}
      data-active={active || undefined}
      className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 font-adam text-[0.8125rem] uppercase tracking-[0.06em] transition ${
        active ? 'border-brand bg-brand text-on-primary' : 'border-black/5 bg-white text-brand hover:border-brand/40'
      }`}
    >
      <Icon className="size-4 shrink-0" strokeWidth={2} />
      {children}
    </button>
  );
}
