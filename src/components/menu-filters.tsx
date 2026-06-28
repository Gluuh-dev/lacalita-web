'use client';

import {useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {useLocale} from 'next-intl';
import type {LucideIcon} from 'lucide-react';
import {Flame, Sandwich, IceCreamCone, CupSoda, Coffee, Pizza, Salad, Beef, Utensils, UtensilsCrossed} from 'lucide-react';
import {tx} from '@/lib/localize';
import type {Menu} from '@/lib/queries';
import ProductItem from '@/components/menu/product-item';
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
  const {hidden, scrolled} = useHideOnScroll();
  const params = useSearchParams();
  const cats = (menu.categories ?? []).filter((c) => c.products?.length);
  const catParam = params.get('cat');
  const [active, setActive] = useState<string>(catParam && cats.some((c) => c.id === catParam) ? catParam : 'all');
  const groups = active === 'all' ? cats : cats.filter((c) => c.id === active);

  return (
    <>
      {/* Filtros: no desplazan, filtran en el sitio. bg sólido para que no “tiemble” al fijarse */}
      <div className={`sticky z-30 transition-[background-color,transform] duration-300 ease-out ${pinned ? `top-[58px] ${scrolled ? 'bg-[#fdfbf7]/85 backdrop-blur-md' : 'bg-transparent'}` : `top-[3.5rem] border-b border-line bg-bg/95 backdrop-blur ${hidden ? '-translate-y-[9rem]' : ''}`}`}>
        <div className="mx-auto flex max-w-5xl gap-2.5 overflow-x-auto py-3 pl-4 pr-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={active === 'all'} onClick={() => setActive('all')} icon={Flame}>
            Todos
          </Chip>
          {cats.map((c) => (
            <Chip key={c.id} active={active === c.id} onClick={() => setActive(c.id)} icon={catIcon(tx(c.name, locale))}>
              {tx(c.name, locale)}
            </Chip>
          ))}
        </div>
      </div>

      <div key={active} className="ds-grid-enter mx-auto max-w-5xl px-4 py-8">
        {groups.map((c) => (
          <div key={c.id} className="mb-9">
            {active === 'all' && <h2 className="eyebrow mb-4">{tx(c.name, locale)}</h2>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.products.map((p) => (
                <ProductItem key={p.id} product={p} menuSlug={menu.slug} locale={locale} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Chip({active, onClick, icon: Icon, children}: {active: boolean; onClick: () => void; icon: LucideIcon; children: React.ReactNode}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 font-adam text-[0.8125rem] uppercase tracking-[0.06em] transition ${
        active ? 'border-brand bg-brand text-on-primary' : 'border-black/5 bg-white text-brand hover:border-brand/40'
      }`}
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={2} />
      {children}
    </button>
  );
}
