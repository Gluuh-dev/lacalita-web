import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {tx} from '@/lib/localize';
import type {Menu, Allergen} from '@/lib/queries';
import MenuFilters from './menu-filters';
import AllergenIcon from './allergen-icon';
import AdminEditLink from './admin-edit-link';

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

  const headerMedia = menu.header_video || menu.header_image;

  return (
    <div data-theme={menu.theme} className="min-h-screen bg-bg text-ink">
      <header
        className={`relative overflow-hidden px-6 pb-10 pt-20 text-center ${
          headerMedia ? 'pb-20 text-white' : 'bg-brand/10'
        }`}
      >
        {menu.header_video ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={menu.header_video}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : menu.header_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={menu.header_image}
            alt=""
          />
        ) : null}
        {headerMedia && <div className="absolute inset-0 bg-black/40" />}

        <div className="relative z-10">
          <Link
            href="/carta"
            className={`text-sm hover:underline ${
              headerMedia ? 'text-white/90' : 'text-brand-deep'
            }`}
          >
            ← {t('all')}
          </Link>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
            {tx(menu.name, locale)}
          </h1>
          {menu.subtitle && (
            <p className={headerMedia ? 'mt-2 text-white/80' : 'mt-2 text-ink-2'}>
              {tx(menu.subtitle, locale)}
            </p>
          )}
          <AdminEditLink href={`/admin/menus/${menu.id}`} label="Editar carta" />
        </div>
      </header>

      <MenuFilters menu={menu} />

      {used.size > 0 && (
        <div className="mx-auto max-w-5xl px-4 pb-12">
          <section className="border-t border-line pt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-2">
              {t('allergens')}
            </h2>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-2">
              {[...used.values()].map((a) => (
                <li key={a.code} className="flex items-center gap-1.5">
                  <AllergenIcon src={a.icon} label={tx(a.name, locale)} size={22} />
                  {tx(a.name, locale)}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
