import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Coffee, UtensilsCrossed, Sandwich, ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {getMenus} from '@/lib/queries';
import {tx} from '@/lib/localize';
import {altLanguages} from '@/lib/site';

export const revalidate = 300;

export function generateMetadata() {
  return {alternates: altLanguages('/carta')};
}

const ICONS: Record<string, typeof Coffee> = {
  desayunos: Coffee,
  restaurante: UtensilsCrossed,
  hamburgueseria: Sandwich
};

export default async function CartaSelector({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('menu');
  const tCarta = await getTranslations('carta');
  const tCommon = await getTranslations('common');
  const menus = await getMenus();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-20 pt-28 sm:pt-32">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <div className="eyebrow mb-3">{t('title')}</div>
        <h1 className="font-serif text-4xl sm:text-5xl">{tCarta('question')}</h1>
        <p className="mt-3 text-lg text-ink-2">
          {tCarta('intro')}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menus.map((m) => {
          const Icon = ICONS[m.slug] ?? UtensilsCrossed;
          return (
            <Link
              key={m.id}
              href={`/carta/${m.slug}`}
              data-theme={m.theme}
              className="ds-card--link group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[28px] bg-gradient-to-br from-brand to-brand-deep p-6 text-white shadow-md"
            >
              <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <Icon className="size-6" />
              </span>
              <h2 className="font-serif text-3xl leading-tight">{tx(m.name, locale)}</h2>
              {m.subtitle && <p className="mt-1 text-white/90">{tx(m.subtitle, locale)}</p>}
              <span className="mt-3 inline-flex items-center gap-1.5 font-adam text-[0.75rem] uppercase tracking-[0.12em]">
                {tCommon('seeMenu')} <ArrowRight className="size-4" />
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
