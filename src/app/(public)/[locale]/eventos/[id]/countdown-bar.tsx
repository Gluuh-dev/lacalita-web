'use client';

import {useEffect, useState} from 'react';

import {faltan} from '@/lib/event-time';

const p = (n: number) => String(n).padStart(2, '0');

// Cuenta atrás del evento, centrada en la barra de navegación (solo móvil:
// en PC ya está la del panel lateral). A más de un día, días; dentro del
// último día, reloj hh:mm:ss.
export default function CountdownBar({startsAt}: {startsAt: string}) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const target = new Date(startsAt).getTime();
    const tick = () => {
      const ms = target - Date.now();
      if (ms <= 0) return setLabel(null);
      const days = Math.floor(ms / 86400000);
      if (days >= 1) return setLabel(faltan(days));
      setLabel(`${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)}`);
    };
    tick(); // setInterval no dispara hasta pasado el intervalo.
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startsAt]);

  // Null en el primer render: la hora del servidor y la del cliente no coinciden.
  if (!label) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[51] flex h-14 items-center justify-center lg:hidden">
      <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 font-montserrat text-[0.7rem] font-semibold uppercase tracking-[0.12em] tabular-nums text-white shadow-sm backdrop-blur">
        {label}
      </span>
    </div>
  );
}
