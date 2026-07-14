import {setRequestLocale, getTranslations} from 'next-intl/server';
import {getGalleryAlbums, getSettings} from '@/lib/queries';
import {pageMeta} from '@/lib/site';
import GalleryGrid from '@/components/gallery-grid';
import GalleryAlbums from '@/components/gallery-albums';
import GalleryAdminCta from '@/components/gallery-admin-cta';

export const revalidate = 300;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta'});
  return pageMeta({title: t('galeriaTitle'), description: t('galeriaDesc'), path: '/galeria', locale});
}

type Section = {key: string; title: string; dateLabel: string; kind: string; imgs: string[]};

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('gallery');
  const [albums, settings] = await Promise.all([getGalleryAlbums(), getSettings()]);
  const fmt = (d: string) => new Intl.DateTimeFormat(locale, {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date(d));

  // Única fuente: los álbumes del admin. Antes, si no había ninguno, se colaban
  // aquí los carteles de los eventos, que no son fotos de la galería.
  const sections: Section[] = albums
    .filter((a) => a.images.length > 0)
    .map((a) => ({
      key: a.id,
      title: a.title || (a.date ? fmt(a.date) : t('untitled')),
      dateLabel: a.date ? fmt(a.date) : '',
      kind: a.kind ?? 'evento',
      imgs: a.images
    }));

  const legacy = (settings?.content?.gallery ?? []).filter(Boolean);

  return (
    <main className="min-h-screen bg-bg pb-28 pt-20 text-ink">
      <div className="mx-auto max-w-6xl px-4">
        <div className="eyebrow mb-2 text-center">{t('title')}</div>
        <h1 className="h-section mb-4 text-center font-serif">{t('heading')}</h1>
        <p className="mb-6 text-center text-ink-2">{t('sub')}</p>
        <GalleryAdminCta />

        {sections.length === 0 && legacy.length === 0 ? (
          <p className="py-16 text-center text-ink-3">{t('empty')}</p>
        ) : (
          <div className="mt-8 flex flex-col gap-12">
            <GalleryAlbums sections={sections} />
            {legacy.length > 0 && (
              <section>
                <h2 className="mb-4 border-b border-line pb-2 font-serif text-2xl">{t('more')}</h2>
                <GalleryGrid images={legacy} />
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
