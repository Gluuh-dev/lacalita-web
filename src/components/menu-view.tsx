import {Suspense} from 'react';
import {getTranslations} from 'next-intl/server';
import {tx} from '@/lib/localize';
import type {Menu, Allergen} from '@/lib/queries';
import MenuFilters from './menu-filters';
import AllergenIcon from './allergen-icon';
import {type MenuItem} from '@/components/menu/store';
import BurgerData from '@/components/burger/burger-data';
import CartaEmpty from './carta-empty';

export default async function MenuView({
  menu,
  locale
}: {
  menu: Menu;
  locale: string;
}) {
  const t = await getTranslations('menu');
  const cats = (menu.categories ?? []).filter((c) => c.products?.length);

  const used = new Map<string, Allergen>();
  for (const c of cats) {
    for (const p of c.products) {
      for (const pa of p.product_allergens ?? []) {
        if (pa.allergens) used.set(pa.allergens.code, pa.allergens);
      }
    }
  }

  const videos: MenuItem[] = cats
    .flatMap((c) => c.products)
    .filter((p) => p.video)
    .map((p) => ({
      id: p.id,
      name: tx(p.name, locale),
      price: p.price != null ? Number(p.price) : null,
      image: p.image ?? null,
      slug: p.slug,
      menuSlug: menu.slug,
      video: p.video,
      desc: p.description ? tx(p.description, locale) : undefined,
      ingredients: p.ingredients ?? [],
      allergens: (p.product_allergens ?? [])
        .map((pa) => pa.allergens)
        .filter((a): a is NonNullable<typeof a> => !!a)
        .map((a) => ({code: a.code, icon: a.icon, name: a.name}))
    }));

  return (
    <div data-theme={menu.theme} className="relative isolate min-h-screen overflow-x-clip bg-bg pb-24 text-ink md:pb-10">
      {menu.slug === 'hamburgueseria' && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[26rem] w-[185%] -translate-x-1/2 rotate-[-7deg] opacity-[0.13]"
          style={{
            backgroundImage: 'url(/brand/motivo-carta.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            WebkitMaskImage: 'linear-gradient(180deg,#000 58%,transparent 100%)',
            maskImage: 'linear-gradient(180deg,#000 58%,transparent 100%)'
          }}
        />
      )}
      {menu.slug !== 'hamburgueseria' && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[26rem] w-[185%] -translate-x-1/2 rotate-[-6deg] opacity-[0.1]"
          style={{
            backgroundColor: '#E9AE74',
            WebkitMaskImage: 'url(/brand/manifesto.svg)',
            maskImage: 'url(/brand/manifesto.svg)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskPosition: 'center',
            maskPosition: 'center'
          }}
        />
      )}
      {menu.slug === 'hamburgueseria' ? (
        <header className="relative z-10 px-5 pb-6 pt-24 text-center duration-500 animate-in fade-in slide-in-from-top-2 fill-mode-both">
          <div className="font-adam text-[0.7rem] uppercase tracking-[0.22em] text-brand">La Calita Burger</div>
          <h1 className="font-eight text-4xl text-ink sm:text-5xl">{tx(menu.name, locale)}</h1>
          {menu.subtitle && <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-2">{tx(menu.subtitle, locale)}</p>}
        </header>
      ) : (
        <header className="relative z-10 px-5 pb-6 pt-24 text-center duration-500 animate-in fade-in slide-in-from-top-2 fill-mode-both">
          <div className="font-adam text-[0.7rem] uppercase tracking-[0.22em] text-brand">La Calita · Carta</div>
          <h1 className="font-serif text-5xl leading-[1.05] text-ink sm:text-6xl">{tx(menu.name, locale)}</h1>
          {menu.subtitle && <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-2">{tx(menu.subtitle, locale)}</p>}
        </header>
      )}

      {cats.length === 0 ? (
        <CartaEmpty name={tx(menu.name, locale)} />
      ) : (
        <>
          <Suspense fallback={null}>
            <MenuFilters menu={menu} pinned />
          </Suspense>

          {used.size > 0 && (
            <div className="mx-auto max-w-5xl px-4 pb-12">
              <section className="border-t border-line pt-8 text-center">
                <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-ink-2">
                  {t('allergens')}
                </h2>
                <ul className="flex flex-wrap justify-center gap-2.5 text-sm text-ink-2">
                  {[...used.values()].map((a) => (
                    <li key={a.code} className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5">
                      <AllergenIcon src={a.icon} label={tx(a.name, locale)} size={20} />
                      {tx(a.name, locale)}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {menu.slug === 'hamburgueseria' && <BurgerData videos={videos} />}
        </>
      )}
    </div>
  );
}
