'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

// Toggle Próximos/Pasados en cliente → la página /eventos puede ser estática (sin searchParams).
// Recibe las dos listas ya renderizadas en el servidor (EventCard sigue siendo server component).
export default function EventsToggle({upcoming, past}: {upcoming: React.ReactNode; past: React.ReactNode}) {
  const t = useTranslations('events');
  const [tab, setTab] = useState<'up' | 'past'>('up');
  // Control segmentado: una sola cápsula, no dos botones sueltos.
  const cls = (active: boolean) =>
    `rounded-full px-6 py-2 font-montserrat text-[0.74rem] font-semibold uppercase tracking-[0.14em] transition ${active ? 'bg-brand text-on-primary shadow-sm' : 'text-ink-3 hover:text-ink'}`;

  return (
    <>
      <div className="mb-9 flex justify-center">
        <div className="inline-flex gap-1 rounded-full border border-line bg-surface p-1 shadow-sm">
          <button onClick={() => setTab('up')} className={cls(tab === 'up')}>{t('tabUpcoming')}</button>
          <button onClick={() => setTab('past')} className={cls(tab === 'past')}>{t('tabPast')}</button>
        </div>
      </div>
      <div className={tab === 'up' ? '' : 'hidden'}>{upcoming}</div>
      <div className={tab === 'past' ? '' : 'hidden'}>{past}</div>
    </>
  );
}
