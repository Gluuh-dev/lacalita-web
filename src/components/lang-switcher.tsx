'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';

const FLAGS: Record<string, string> = {es: '🇪🇸', en: '🇬🇧', fr: '🇫🇷'};

export default function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-0.5">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, {locale: l})}
          aria-label={l}
          className={`rounded-md px-1.5 py-1 text-base leading-none transition ${
            l === locale ? 'opacity-100' : 'opacity-40 hover:opacity-80'
          }`}
        >
          {FLAGS[l] ?? l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
