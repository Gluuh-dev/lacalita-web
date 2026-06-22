'use client';

import {useState} from 'react';
import {motion, AnimatePresence, useReducedMotion} from 'framer-motion';
import {useTranslations, useLocale} from 'next-intl';
import {tx} from '@/lib/localize';
import type {Menu} from '@/lib/queries';
import ProductCard from './product-card';

export default function MenuFilters({menu}: {menu: Menu}) {
  const t = useTranslations('menu');
  const locale = useLocale();
  const reduce = useReducedMotion();
  const cats = (menu.categories ?? []).filter((c) => c.products?.length);
  const [active, setActive] = useState<string>('all');

  const visibleCats = active === 'all' ? cats : cats.filter((c) => c.id === active);
  const items = visibleCats.flatMap((c) => c.products);

  return (
    <>
      {/* Filtros: NO desplazan, filtran en el sitio */}
      <div className="sticky top-14 z-10 overflow-x-auto border-b border-black/5 bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl gap-2 px-4 py-3">
          <Chip active={active === 'all'} onClick={() => setActive('all')}>
            {t('all')}
          </Chip>
          {cats.map((c) => (
            <Chip
              key={c.id}
              active={active === c.id}
              onClick={() => setActive(c.id)}
            >
              {tx(c.name, locale)}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {items.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={reduce ? false : {opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                exit={reduce ? {opacity: 0} : {opacity: 0, scale: 0.95}}
                transition={{duration: 0.25}}
              >
                <ProductCard product={p} menuSlug={menu.slug} locale={locale} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

function Chip({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`ds-chip whitespace-nowrap rounded-full border px-4 py-1.5 font-adam text-[0.8125rem] uppercase tracking-[0.08em] ${
        active
          ? 'border-transparent bg-brand text-on-primary shadow-sm'
          : 'border-line-strong bg-surface text-ink-2 hover:border-brand'
      }`}
    >
      {children}
    </button>
  );
}
