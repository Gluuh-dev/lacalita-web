'use client';

import {useEffect, useState} from 'react';
import {isOpenNow, type Hours} from '@/lib/hours';

export default function OpenStatus({hours, dark = false, className = ''}: {hours: Hours; dark?: boolean; className?: string}) {
  const [s, setS] = useState<{open: boolean; closesAt: string | null; opensAt: string | null} | null>(null);

  useEffect(() => {
    const update = () => setS(isOpenNow(hours));
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, [hours]);

  if (!s) return null;

  // "Cerrado" a secas no resuelve nada: lo que se pregunta el cliente es cuándo abre.
  const texto = s.open
    ? `Abierto ahora${s.closesAt ? ` · cierra a las ${s.closesAt}` : ''}`
    : `Cerrado${s.opensAt ? ` · abre a las ${s.opensAt}` : ' ahora'}`;

  const claro = s.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  const oscuro = s.open ? 'bg-green-500/15 text-green-300' : 'bg-white/[0.06] text-white/70';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${dark ? oscuro : claro} ${className}`}>
      <span className={`size-2 rounded-full ${s.open ? 'bg-green-500' : dark ? 'bg-white/40' : 'bg-red-500'}`} />
      {texto}
    </span>
  );
}
