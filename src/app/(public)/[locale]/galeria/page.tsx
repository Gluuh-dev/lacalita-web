import {setRequestLocale} from 'next-intl/server';
import Image from 'next/image';
import {getSettings} from '@/lib/queries';
import {altLanguages} from '@/lib/site';

export const revalidate = 300;

export function generateMetadata() {
  return {title: 'Galería · La Calita Beach Club', alternates: altLanguages('/galeria')};
}

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const settings = await getSettings();
  const gallery = settings?.content?.gallery ?? [];

  return (
    <main className="min-h-screen bg-bg pb-28 pt-20 text-ink">
      <div className="mx-auto max-w-6xl px-4">
        <div className="eyebrow mb-2 text-center">Galería</div>
        <h1 className="mb-10 text-center font-serif text-4xl sm:text-5xl">Momentos en La Calita</h1>
        {gallery.length === 0 ? (
          <p className="py-16 text-center text-ink-3">Aún no hay fotos en la galería.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.map((url, i) => (
              <div key={i} className="ds-media-zoom relative aspect-square overflow-hidden rounded-[16px] border border-line">
                <Image src={url} alt="" fill sizes="(min-width:1024px) 18rem, (min-width:640px) 30vw, 45vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
