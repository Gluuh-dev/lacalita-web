'use client';

import {useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {useLocale} from 'next-intl';
import {tx} from '@/lib/localize';
import type {Menu} from '@/lib/queries';
import ProductItem from '@/components/menu/product-item';

export default function MenuFilters({menu}: {menu: Menu}) {
  const locale = useLocale();
  const params = useSearchParams();
  const cats = (menu.categories ?? []).filter((c) => c.products?.length);
  const catParam = params.get('cat');
  const [active, setActive] = useState<string>(catParam && cats.some((c) => c.id === catParam) ? catParam : 'all');
  const groups = active === 'all' ? cats : cats.filter((c) => c.id === active);

  return (
    <>
      {/* Filtros: no desplazan, filtran en el sitio. bg sólido para que no “tiemble” al fijarse */}
      <div className="sticky top-14 z-30 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto py-3 pl-4 pr-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={active === 'all'} onClick={() => setActive('all')}>
            Todo
          </Chip>
          {cats.map((c) => (
            <Chip key={c.id} active={active === c.id} onClick={() => setActive(c.id)}>
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

function Chip({active, onClick, children}: {active: boolean; onClick: () => void; children: React.ReactNode}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-4 py-1.5 font-adam text-[0.8125rem] uppercase tracking-[0.08em] transition ${
        active ? 'border-transparent bg-brand text-on-primary shadow-sm' : 'border-line-strong bg-surface text-ink-2 hover:border-brand'
      }`}
    >
      {children}
    </button>
  );
}
