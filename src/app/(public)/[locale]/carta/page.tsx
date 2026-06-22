import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getMenus} from '@/lib/queries';
import {tx} from '@/lib/localize';

export const revalidate = 300;

export default async function CartaSelector({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('menu');
  const menus = await getMenus();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <h1 className="mb-10 text-center font-serif text-4xl sm:text-5xl">
        {t('title')}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {menus.map((m) => (
          <Link
            key={m.id}
            href={`/carta/${m.slug}`}
            data-theme={m.theme}
            className="group ds-card--link flex min-h-56 flex-col items-center justify-center rounded-[28px] bg-brand p-10 text-center text-on-primary shadow-md"
          >
            <span className="font-serif text-3xl sm:text-4xl">
              {tx(m.name, locale)}
            </span>
            {m.subtitle && (
              <span className="mt-2 max-w-xs opacity-90">
                {tx(m.subtitle, locale)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
