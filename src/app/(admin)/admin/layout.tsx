import type {Metadata} from 'next';
import {Geist} from 'next/font/google';
import {Toaster} from 'sonner';
import '../../globals.css';

const sans = Geist({variable: '--font-geist', subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Admin · La Calita',
  robots: {index: false, follow: false},
  icons: {icon: '/icon.svg'}
};

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${sans.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg font-sans text-ink">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
