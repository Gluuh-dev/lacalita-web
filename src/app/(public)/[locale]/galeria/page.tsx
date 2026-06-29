import {setRequestLocale} from 'next-intl/server';
import {getUpcomingEvents, getPastEvents, getSettings} from '@/lib/queries';
import {tx} from '@/lib/localize';
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

  // Las fotos se suben dentro de cada evento → aquí salen agrupadas por evento (más reciente primero).
  const events = [...up, ...past]
    .map((e) => ({...e, imgs: e.images?.length ? e.images : e.image ? [e.image] : []}))
    .filter((e) => e.imgs.length > 0)
    .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime());
  const legacy = (settings?.content?.gallery ?? []).filter(Boolean);

  return (
    <main className="min-h-screen bg-bg pb-28 pt-20 text-ink">
      <div className="mx-auto max-w-6xl px-4">
        <div className="eyebrow mb-2 text-center">Galería</div>
        <h1 className="mb-4 text-center font-serif text-4xl sm:text-5xl">Momentos en La Calita</h1>
        <p className="mb-6 text-center text-ink-2">Noches de música, atardeceres y buena mesa frente al mar.</p>
        <GalleryAdminCta />

        {events.length === 0 && legacy.length === 0 ? (
          <p className="py-16 text-center text-ink-3">Aún no hay fotos. Se añaden desde cada evento.</p>
        ) : (
          <div className="mt-8 flex flex-col gap-12">
            {events.map((e) => {
              const fecha = new Intl.DateTimeFormat(locale, {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date(e.starts_at));
              return (
                <section key={e.id}>
                  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2">
                    <h2 className="font-serif text-2xl">{tx(e.title, locale)}</h2>
                    <span className="font-adam text-[0.72rem] uppercase tracking-[0.1em] text-ink-3">{fecha}</span>
                  </div>
                  <GalleryGrid images={e.imgs} />
                </section>
              );
            })}
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
