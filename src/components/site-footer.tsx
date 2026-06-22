import {getTranslations} from 'next-intl/server';
import {getSettings} from '@/lib/queries';

export default async function SiteFooter() {
  const t = await getTranslations();
  const settings = await getSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-12 sm:grid-cols-2">
        <div className="space-y-3 text-sm text-ink-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-texto-debajo.svg" alt="La Calita" className="w-36" />
          {settings?.address && <p>{settings.address}</p>}
          {settings?.phone && <p>Tel. {settings.phone}</p>}
          <div className="flex gap-4 pt-1">
            {settings?.social?.instagram && (
              <a href={settings.social.instagram} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                Instagram
              </a>
            )}
            {settings?.social?.facebook && (
              <a href={settings.social.facebook} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                Facebook
              </a>
            )}
          </div>
        </div>

        {/* Plano del sitio (pon el SVG en public/brand/plano.svg) */}
        <a
          href={settings?.maps_url ?? '#'}
          target="_blank"
          rel="noreferrer"
          className="group relative block min-h-52 overflow-hidden rounded-[20px] border border-line bg-brand/10"
          style={{
            backgroundImage: 'url(/brand/plano.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl drop-shadow-lg transition group-hover:scale-110">
            📍
          </span>
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3 text-sm font-medium text-white">
            {t('info.directions')} →
          </span>
        </a>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-ink-3">
        © {year} La Calita Beach Club
      </div>
    </footer>
  );
}
