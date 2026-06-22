import type {Metadata} from 'next';
import {Geist} from 'next/font/google';
import {Playfair_Display} from 'next/font/google';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Toaster} from 'sonner';
import {routing} from '@/i18n/routing';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import {HeaderModeProvider} from '@/components/header-mode';
import ServiceWorker from '@/components/service-worker';
import '../../globals.css';

const sans = Geist({variable: '--font-geist', subsets: ['latin']});
const serif = Playfair_Display({variable: '--font-playfair', subsets: ['latin']});

export const metadata: Metadata = {
  title: 'La Calita Beach Club',
  description: 'Beach Club, restaurante y cafetería en Salobreña, Granada.',
  icons: {icon: '/icon.svg'}
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
            <SiteHeader />
            {children}
            <SiteFooter />
            <Toaster richColors position="top-center" />
            <ServiceWorker />
          </HeaderModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
