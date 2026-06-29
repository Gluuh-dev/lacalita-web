import {setRequestLocale} from 'next-intl/server';
import {getUpcomingEvents, getPastEvents, getSettings} from '@/lib/queries';
import {altLanguages} from '@/lib/site';
import GalleryGrid from '@/components/gallery-grid';
import GalleryAdminCta from '@/components/gallery-admin-cta';

export const revalidate = 300;

export function generateMetadata() {
  return {title: 'Galería · La Calita Beach Club', alternates: altLanguages('/galeria')};
}

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const [up, past, settings] = await Promise.all([getUpcomingEvents(50), getPastEvents(50), getSettings()]);

  // Las fotos de la galería se suben dentro de cada evento.
  const events = [...up, ...past];
  let images = events.flatMap((e) => (e.images?.length ? e.images : e.image ? [e.image] : []));
  if (images.length === 0) images = settings?.content?.gallery ?? []; // compatibilidad con galería antigua
  images = [...new Set(images)].filter(Boolean);

  return (
    <main className="min-h-screen bg-bg pb-28 pt-20 text-ink">
      <div className="mx-auto max-w-6xl px-4">
        <div className="eyebrow mb-2 text-center">Galería</div>
        <h1 className="mb-4 text-center font-serif text-4xl sm:text-5xl">Momentos en La Calita</h1>
        <p className="mb-6 text-center text-ink-2">Noches de música, atardeceres y buena mesa frente al mar.</p>
        <GalleryAdminCta />
        {images.length === 0 ? (
          <p className="py-16 text-center text-ink-3">Aún no hay fotos. Se añaden desde cada evento.</p>
        ) : (
          <div className="mt-8">
            <GalleryGrid images={images} />
          </div>
        )}
      </div>
    </main>
  );
}
