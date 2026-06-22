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
      <header className="relative overflow-hidden px-6 pb-12 pt-24 text-center text-white">
        {!headerMedia && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-deep" />
        )}
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
            className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 font-adam text-[0.72rem] uppercase tracking-[0.1em] backdrop-blur transition hover:bg-white/30"
          >
            ← {t('all')}
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl">{tx(menu.name, locale)}</h1>
          {menu.subtitle && <p className="mt-2 text-white/90">{tx(menu.subtitle, locale)}</p>}
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
