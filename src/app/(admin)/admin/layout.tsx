import type {Metadata} from 'next';
import {Geist, Playfair_Display, Alfa_Slab_One, Great_Vibes, Kaushan_Script, Cinzel, Montserrat} from 'next/font/google';
import {Toaster} from 'sonner';
import RealtimeRefresh from '@/components/realtime-refresh';
import '../../globals.css';

// Mismas fuentes que la web: la previsualización del hero debe verse igual.
const sans = Geist({variable: '--font-geist', subsets: ['latin']});
const serif = Playfair_Display({variable: '--font-playfair', subsets: ['latin']});
const alfa = Alfa_Slab_One({variable: '--font-alfa', subsets: ['latin'], weight: '400'});
const vibes = Great_Vibes({variable: '--font-vibes', subsets: ['latin'], weight: '400'});
const kaushan = Kaushan_Script({variable: '--font-kaushan', subsets: ['latin'], weight: '400'});
const cinzel = Cinzel({variable: '--font-cinzel', subsets: ['latin']});
const montserrat = Montserrat({variable: '--font-montserrat', subsets: ['latin']});
const FONT_VARS = `${sans.variable} ${serif.variable} ${alfa.variable} ${vibes.variable} ${kaushan.variable} ${cinzel.variable} ${montserrat.variable}`;

export const metadata: Metadata = {
  title: 'Admin · La Calita',
  robots: {index: false, follow: false},
  icons: {icon: '/icon.svg'}
};

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${FONT_VARS} h-full antialiased`}>
      <body className="min-h-full bg-bg font-sans text-ink">
        {children}
        <Toaster richColors position="top-center" />
        <RealtimeRefresh />
      </body>
    </html>
  );
}
