import type {Metadata} from 'next';
import {Geist} from 'next/font/google';
import {Playfair_Display} from 'next/font/google';
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
import {HeaderModeProvider} from '@/components/header-mode';
import ServiceWorker from '@/components/service-worker';
import '../../globals.css';

const sans = Geist({variable: '--font-geist', subsets: ['latin']});
const serif = Playfair_Display({variable: '--font-playfair', subsets: ['latin']});

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
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg font-sans text-ink">
        <NextIntlClientProvider>
          <HeaderModeProvider>
            <HideOnBurger>
              <SiteHeader />
            </HideOnBurger>
            {children}
            <HideOnBurger>
              <SiteFooter />
            </HideOnBurger>
            <Toaster richColors position="top-center" />
            <ServiceWorker />
            <RealtimeRefresh />
          </HeaderModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
