import {setRequestLocale} from 'next-intl/server';
import {MapPin, Phone, Mail, Clock, Navigation} from 'lucide-react';
import {getSettings} from '@/lib/queries';
import {normalizeHours, formatRanges} from '@/lib/hours';
import {altLanguages} from '@/lib/site';

export const revalidate = 300;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  await params;
  return {
    title: 'Dónde estamos · La Calita Burger',
    description: 'La Calita Burger en Salobreña: ubicación, horario y contacto. A pie de playa.',
    alternates: altLanguages('/burguer/local')
  };
}

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const settings = await getSettings();
  const hours = normalizeHours(settings?.hours);
  const q = encodeURIComponent(settings?.address || 'La Calita Salobreña');

  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 pb-28 pt-20 text-[#2a1713]">
      <div className="mx-auto max-w-2xl duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#c36148]/12 text-[#c36148]">
            <MapPin className="size-6" />
          </span>
          <div>
            <h1 className="font-eight text-3xl leading-none">Dónde estamos</h1>
            <p className="mt-1 text-sm text-[#2a1713]/55">A pie de playa, en Salobreña</p>
          </div>
        </div>

        {/* Mapa */}
        <div className="overflow-hidden rounded-[22px] border border-black/5 shadow-sm">
          <iframe
            title="Mapa La Calita"
            src={`https://www.google.com/maps?q=${q}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-64 w-full border-0"
          />
        </div>

        {settings?.maps_url && (
          <a href={settings.maps_url} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#c36148] px-6 py-3.5 font-semibold text-[#fdfbf7] transition hover:brightness-105">
            <Navigation className="size-4" /> Cómo llegar
          </a>
        )}

        {/* Contacto */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {settings?.address && (
            <div className="flex items-start gap-3 rounded-[16px] border border-black/5 bg-white px-4 py-3 shadow-sm">
              <MapPin className="mt-0.5 size-5 shrink-0 text-[#c36148]" />
              <span className="text-sm">{settings.address}</span>
            </div>
          )}
          {settings?.phone && (
            <a href={`tel:${settings.phone}`} className="flex items-center gap-3 rounded-[16px] border border-black/5 bg-white px-4 py-3 shadow-sm">
              <Phone className="size-5 shrink-0 text-[#c36148]" />
              <span className="text-sm font-semibold">{settings.phone}</span>
            </a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`} className="flex items-center gap-3 rounded-[16px] border border-black/5 bg-white px-4 py-3 shadow-sm">
              <Mail className="size-5 shrink-0 text-[#c36148]" />
              <span className="truncate text-sm">{settings.email}</span>
            </a>
          )}
          {(settings?.social?.instagram || settings?.social?.facebook) && (
            <div className="flex items-center gap-2 rounded-[16px] border border-black/5 bg-white px-4 py-3 shadow-sm">
              {settings?.social?.instagram && (
                <a href={settings.social.instagram} target="_blank" rel="noreferrer" className="rounded-full bg-[#c36148]/10 px-3 py-1 text-xs font-medium text-[#c36148]">Instagram</a>
              )}
              {settings?.social?.facebook && (
                <a href={settings.social.facebook} target="_blank" rel="noreferrer" className="rounded-full bg-[#c36148]/10 px-3 py-1 text-xs font-medium text-[#c36148]">Facebook</a>
              )}
            </div>
          )}
        </div>

        {/* Horario */}
        <div className="mt-4 rounded-[22px] border border-black/5 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="size-5 text-[#c36148]" />
            <h2 className="font-eight text-xl">Horario</h2>
          </div>
          {hours.notice && (
            <div className="mb-3 rounded-[14px] bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-700">{hours.notice}</div>
          )}
          <ul className="flex flex-col">
            {hours.rows.map((row, i) => (
              <li key={i} className="flex items-center justify-between gap-4 border-b border-black/5 py-2 text-sm last:border-0">
                <span className="font-medium">{row.label}</span>
                <span className="tabular-nums text-[#2a1713]/60">{row.closed ? 'Cerrado' : formatRanges(row)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
