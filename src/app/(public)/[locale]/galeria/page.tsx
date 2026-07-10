import {setRequestLocale} from 'next-intl/server';
import {getGalleryAlbums, getSettings} from '@/lib/queries';
import {altLanguages} from '@/lib/site';
import GalleryGrid from '@/components/gallery-grid';
import GalleryAdminCta from '@/components/gallery-admin-cta';

export const revalidate = 300;

export function generateMetadata() {
  return {title: 'Galería · La Calita Beach Club', alternates: altLanguages('/galeria')};
}

type Section = {key: string; title: string; dateLabel: string; imgs: string[]};

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const [albums, settings] = await Promise.all([getGalleryAlbums(), getSettings()]);
  const fmt = (d: string) => new Intl.DateTimeFormat(locale, {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date(d));

  // Única fuente: los álbumes del admin. Antes, si no había ninguno, se colaban
  // aquí los carteles de los eventos, que no son fotos de la galería.
  const sections: Section[] = albums
    .filter((a) => a.images.length > 0)
    .map((a) => ({key: a.id, title: a.title || (a.date ? fmt(a.date) : 'Galería'), dateLabel: a.date ? fmt(a.date) : '', imgs: a.images}));

  const legacy = (settings?.content?.gallery ?? []).filter(Boolean);

  return (
    <main className="min-h-screen bg-bg pb-28 pt-20 text-ink">
      <div className="mx-auto max-w-6xl px-4">
        <div className="eyebrow mb-2 text-center">Galería</div>
        <h1 className="mb-4 text-center font-serif text-4xl sm:text-5xl">Momentos en La Calita</h1>
        <p className="mb-6 text-center text-ink-2">Noches de música, atardeceres y buena mesa frente al mar.</p>
        <GalleryAdminCta />

        {sections.length === 0 && legacy.length === 0 ? (
          <p className="py-16 text-center text-ink-3">Aún no hay fotos en la galería.</p>
        ) : (
          <div className="mt-8 flex flex-col gap-12">
            {sections.map((s) => (
              <section key={s.key}>
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2">
                  <h2 className="font-serif text-2xl">{s.title}</h2>
                  {s.dateLabel && <span className="font-adam text-[0.72rem] uppercase tracking-[0.1em] text-ink-3">{s.dateLabel}</span>}
                </div>
                <GalleryGrid images={s.imgs} alt={s.title} />
              </section>
            ))}
            {legacy.length > 0 && (
              <section>
                <h2 className="mb-4 border-b border-line pb-2 font-serif text-2xl">Más fotos</h2>
                <GalleryGrid images={legacy} />
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
