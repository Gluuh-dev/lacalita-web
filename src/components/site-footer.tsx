import {getTranslations} from 'next-intl/server';
import {MapPin, Phone, Mail, Navigation} from 'lucide-react';
import {IconBrandInstagram, IconBrandFacebook} from '@tabler/icons-react';
import {getSettings} from '@/lib/queries';

export default async function SiteFooter() {
  const t = await getTranslations('info');
  const tFooter = await getTranslations('footer');
  const settings = await getSettings();
  const year = new Date().getFullYear();

  return (
    // Solo PC: en móvil/tablet la tab-bar ya lleva a todo y este bloque ocupaba pantalla y media.
    <footer className="mt-auto hidden bg-[#1c160e] text-[#fbf7f0] xl:pointer-fine:block">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 text-center sm:grid-cols-3 sm:text-left">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-texto-debajo.svg" alt="La Calita" className="mx-auto mb-4 h-24 w-auto brightness-0 invert sm:mx-0" />
          <p className="mx-auto max-w-[28ch] text-sm text-[#fbf7f0]/70 sm:mx-0">
            {tFooter('tagline')}
          </p>
        </div>

        <div>
          <div className="eyebrow mb-4 !text-brand">{tFooter('contact')}</div>
          <ul className="flex flex-col gap-3 text-sm text-[#fbf7f0]/80">
            {settings?.address && (
              <li className="flex items-start justify-center gap-2 sm:justify-start">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <a href={settings.maps_url ?? '#'} target="_blank" rel="noreferrer">{settings.address}</a>
              </li>
            )}
            {settings?.phone && (
              <li className="flex items-center justify-center gap-2 sm:justify-start">
                <Phone className="size-4 text-brand" />
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center justify-center gap-2 sm:justify-start">
                <Mail className="size-4 text-brand" />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4 !text-brand">{t('follow')}</div>
          <div className="flex flex-wrap justify-center gap-2.5 sm:justify-start">
            {settings?.social?.instagram && (
              <a
                href={settings.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-brand hover:bg-brand hover:text-[#1c160e]"
              >
                <IconBrandInstagram size={19} stroke={1.8} className="text-brand transition group-hover:text-[#1c160e]" />
                Instagram
              </a>
            )}
            {settings?.social?.facebook && (
              <a
                href={settings.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-brand hover:bg-brand hover:text-[#1c160e]"
              >
                <IconBrandFacebook size={19} stroke={1.8} className="text-brand transition group-hover:text-[#1c160e]" />
                Facebook
              </a>
            )}
          </div>
          {settings?.maps_url && (
            <a href={settings.maps_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 font-adam text-[0.75rem] uppercase tracking-[0.1em] text-brand">
              <Navigation className="size-4" /> {t('directions')}
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 pb-[max(1.25rem,calc(env(safe-area-inset-bottom)+3.75rem))] text-center text-xs text-[#fbf7f0]/50 md:pb-5">
        © {year} La Calita Beach Club · Salobreña
      </div>
    </footer>
  );
}
