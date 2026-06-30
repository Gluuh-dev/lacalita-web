'use client';

import {useState} from 'react';

// Toggle Próximos/Pasados en cliente → la página /eventos puede ser estática (sin searchParams).
// Recibe las dos listas ya renderizadas en el servidor (EventCard sigue siendo server component).
export default function EventsToggle({upcoming, past}: {upcoming: React.ReactNode; past: React.ReactNode}) {
  const [tab, setTab] = useState<'up' | 'past'>('up');
  const cls = (active: boolean) =>
    `rounded-full border px-5 py-2 font-adam text-[0.78rem] uppercase tracking-[0.08em] transition ${active ? 'border-brand bg-brand text-on-primary' : 'border-line bg-surface text-ink-2 hover:border-brand'}`;

  return (
    <>
      <div className="mb-7 flex justify-center gap-2">
        <button onClick={() => setTab('up')} className={cls(tab === 'up')}>Próximos</button>
        <button onClick={() => setTab('past')} className={cls(tab === 'past')}>Pasados</button>
      </div>
      <div className={tab === 'up' ? '' : 'hidden'}>{upcoming}</div>
      <div className={tab === 'past' ? '' : 'hidden'}>{past}</div>
    </>
  );
}
