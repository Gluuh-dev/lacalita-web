import {getTranslations} from 'next-intl/server';
import {MapPin, Phone, Mail, Navigation} from 'lucide-react';
import {getSettings} from '@/lib/queries';

export default async function SiteFooter() {
  const t = await getTranslations('info');
  const settings = await getSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[#1c160e] text-[#fbf7f0]">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-texto-debajo.svg" alt="La Calita" className="mb-4 h-24 w-auto brightness-0 invert" />
          <p className="max-w-[28ch] text-sm text-[#fbf7f0]/70">
            Beach club, restaurante y cafetería frente al mar en Salobreña.
          </p>
        </div>

        <div>
          <div className="eyebrow mb-4 !text-brand">Contacto</div>
          <ul className="flex flex-col gap-3 text-sm text-[#fbf7f0]/80">
            {settings?.address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <a href={settings.maps_url ?? '#'} target="_blank" rel="noreferrer">{settings.address}</a>
              </li>
            )}
            {settings?.phone && (
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-brand" />
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-brand" />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4 !text-brand">{t('follow')}</div>
          <div className="flex flex-wrap gap-2">
            {settings?.social?.instagram && (
              <a href={settings.social.instagram} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20">
                Instagram
              </a>
            )}
            {settings?.social?.facebook && (
              <a href={settings.social.facebook} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20">
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
      <div className="border-t border-white/10 py-5 text-center text-xs text-[#fbf7f0]/50">
        © {year} La Calita Beach Club · Salobreña
      </div>
    </footer>
  );
}
