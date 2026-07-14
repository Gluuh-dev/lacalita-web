import {setRequestLocale, getTranslations} from 'next-intl/server';
import {MapPin, Phone, Mail, Clock, Navigation} from 'lucide-react';
import {IconBrandInstagram, IconBrandFacebook} from '@tabler/icons-react';
import {getSettings} from '@/lib/queries';
import {normalizeHours, formatRanges} from '@/lib/hours';
import {pageMeta} from '@/lib/site';
import OpenStatus from '@/components/open-status';
import MapCard from '@/components/map-card';
import SectionHead from '@/components/section-head';

export const revalidate = 300;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta'});
  return pageMeta({title: t('ubicacionTitle'), description: t('ubicacionDesc'), path: '/ubicacion', locale});
}

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const settings = await getSettings();
  const hours = normalizeHours(settings?.hours);
  const q = encodeURIComponent(settings?.address || 'La Calita Salobreña');

  return (
    <main className="min-h-screen bg-bg pb-28 pt-20 text-ink">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHead eyebrow={t('location.eyebrow')} title={t('location.title')} sub={t('location.sub')} bg="Ubicación" h1 />
        <div className="-mt-6 mb-8 flex justify-center">
          <OpenStatus hours={hours} />
        </div>

        <MapCard href={settings?.maps_url} label={t('info.location')} className="mb-4 h-72" />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {settings?.address && (
            <div className="flex items-start gap-3 rounded-[16px] border border-line bg-surface px-4 py-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand-deep" />
              <span className="text-sm">{settings.address}</span>
            </div>
          )}
          {settings?.phone && (
            <a href={`tel:${settings.phone}`} className="flex items-center gap-3 rounded-[16px] border border-line bg-surface px-4 py-3">
              <Phone className="size-5 shrink-0 text-brand-deep" />
              <span className="text-sm font-semibold">{settings.phone}</span>
            </a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`} className="flex items-center gap-3 rounded-[16px] border border-line bg-surface px-4 py-3">
              <Mail className="size-5 shrink-0 text-brand-deep" />
              <span className="truncate text-sm">{settings.email}</span>
            </a>
          )}
          {(settings?.social?.instagram || settings?.social?.facebook) && (
            <div className="flex items-center gap-2 rounded-[16px] border border-line bg-surface px-4 py-3">
              {settings?.social?.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-brand hover:text-on-primary"
                >
                  <IconBrandInstagram size={16} stroke={2} /> Instagram
                </a>
              )}
              {settings?.social?.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-brand hover:text-on-primary"
                >
                  <IconBrandFacebook size={16} stroke={2} /> Facebook
                </a>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 rounded-[20px] border border-line bg-surface p-5">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="size-5 text-brand-deep" />
            <h2 className="font-serif text-xl">{t('location.hoursTitle')}</h2>
          </div>
          {hours.notice && <div className="mb-3 rounded-[14px] bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-700">{hours.notice}</div>}
          <ul className="flex flex-col">
            {hours.rows.map((row, i) => (
              <li key={i} className="flex items-center justify-between gap-4 border-b border-line py-2 text-sm last:border-0">
                <span className="font-medium">{row.label}</span>
                <span className="tabular-nums text-ink-2">{row.closed ? t('location.closed') : formatRanges(row)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
