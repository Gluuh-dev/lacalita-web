import {setRequestLocale} from 'next-intl/server';
import {MapPin, Phone, Mail, Clock, Navigation} from 'lucide-react';
import {getSettings} from '@/lib/queries';
import {normalizeHours, formatRanges} from '@/lib/hours';
import {altLanguages} from '@/lib/site';

export const revalidate = 300;

export function generateMetadata() {
  return {title: 'Dónde estamos · La Calita Beach Club', alternates: altLanguages('/ubicacion')};
}

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const settings = await getSettings();
  const hours = normalizeHours(settings?.hours);
  const q = encodeURIComponent(settings?.address || 'La Calita Salobreña');

  return (
    <main className="min-h-screen bg-bg pb-28 pt-20 text-ink">
      <div className="mx-auto max-w-3xl px-4">
        <div className="eyebrow mb-2 text-center">Dónde estamos</div>
        <h1 className="mb-8 text-center font-serif text-4xl sm:text-5xl">A pie de playa, en Salobreña</h1>

        <div className="overflow-hidden rounded-[20px] border border-line shadow-sm">
          <iframe title="Mapa La Calita" src={`https://www.google.com/maps?q=${q}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-72 w-full border-0" />
        </div>

        {settings?.maps_url && (
          <a href={settings.maps_url} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-on-primary transition hover:bg-brand-deep">
            <Navigation className="size-4" /> Cómo llegar
          </a>
        )}

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
                <a href={settings.social.instagram} target="_blank" rel="noreferrer" className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium">Instagram</a>
              )}
              {settings?.social?.facebook && (
                <a href={settings.social.facebook} target="_blank" rel="noreferrer" className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium">Facebook</a>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 rounded-[20px] border border-line bg-surface p-5">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="size-5 text-brand-deep" />
            <h2 className="font-serif text-xl">Horario</h2>
          </div>
          {hours.notice && <div className="mb-3 rounded-[14px] bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-700">{hours.notice}</div>}
          <ul className="flex flex-col">
            {hours.rows.map((row, i) => (
              <li key={i} className="flex items-center justify-between gap-4 border-b border-line py-2 text-sm last:border-0">
                <span className="font-medium">{row.label}</span>
                <span className="tabular-nums text-ink-2">{row.closed ? 'Cerrado' : formatRanges(row)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
