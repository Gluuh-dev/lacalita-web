import type {Metadata, Viewport} from 'next';
import {Geist} from 'next/font/google';
import {Playfair_Display, Alfa_Slab_One, Great_Vibes, Kaushan_Script, Cinzel, Montserrat} from 'next/font/google';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Toaster} from 'sonner';
import {routing} from '@/i18n/routing';
import {SITE_URL} from '@/lib/site';
import RealtimeRefresh from '@/components/realtime-refresh';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import HideOnBurger from '@/components/hide-on-burger';
import BurgerChrome from '@/components/burger/burger-chrome';
import SiteTabBar from '@/components/site-tabbar';
import {HeaderModeProvider} from '@/components/header-mode';
import {MenuStoreProvider} from '@/components/menu/store';
import ServiceWorker from '@/components/service-worker';
import CookieConsent from '@/components/cookie-consent';
import '../../globals.css';

const sans = Geist({variable: '--font-geist', subsets: ['latin']});
const serif = Playfair_Display({variable: '--font-playfair', subsets: ['latin']});
// Tipografías de la marca del cliente (Alfa Slab One, Great Vibes y Kaushan
// Script solo tienen peso 400; Cinzel y Montserrat son variables).
const alfa = Alfa_Slab_One({variable: '--font-alfa', subsets: ['latin'], weight: '400'});
const vibes = Great_Vibes({variable: '--font-vibes', subsets: ['latin'], weight: '400'});
const kaushan = Kaushan_Script({variable: '--font-kaushan', subsets: ['latin'], weight: '400'});
const cinzel = Cinzel({variable: '--font-cinzel', subsets: ['latin']});
const montserrat = Montserrat({variable: '--font-montserrat', subsets: ['latin']});
const FONT_VARS = `${sans.variable} ${serif.variable} ${alfa.variable} ${vibes.variable} ${kaushan.variable} ${cinzel.variable} ${montserrat.variable}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'La Calita Beach Club',
  description: 'Beach Club, restaurante y cafetería en Salobreña, Granada.',
  icons: {icon: '/icon.svg'},
  openGraph: {
    type: 'website',
    siteName: 'La Calita Beach Club',
    title: 'La Calita Beach Club',
    description: 'Beach Club, restaurante y cafetería en Salobreña, Granada.'
  }
};

export const viewport: Viewport = {themeColor: '#faf6ef'};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${FONT_VARS} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg font-sans text-ink">
        <NextIntlClientProvider>
          <HeaderModeProvider>
          <MenuStoreProvider>
            <HideOnBurger>
              <SiteHeader />
            </HideOnBurger>
            <BurgerChrome locale={locale} />
            <SiteTabBar />
            {children}
            <HideOnBurger>
              <SiteFooter />
            </HideOnBurger>
            <Toaster richColors position="top-center" />
            <CookieConsent />
            <ServiceWorker />
            <RealtimeRefresh />
          </MenuStoreProvider>
          </HeaderModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
