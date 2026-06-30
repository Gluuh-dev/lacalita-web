'use client';

import {useEffect, useState} from 'react';
import {isOpenNow, type Hours} from '@/lib/hours';

export default function OpenStatus({hours, className = ''}: {hours: Hours; className?: string}) {
  const [s, setS] = useState<{open: boolean; closesAt: string | null} | null>(null);

  useEffect(() => {
    const update = () => setS(isOpenNow(hours));
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, [hours]);

  if (!s) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${s.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} ${className}`}>
      <span className={`size-2 rounded-full ${s.open ? 'bg-green-500' : 'bg-red-500'}`} />
      {s.open ? `Abierto ahora${s.closesAt ? ` · cierra a las ${s.closesAt}` : ''}` : 'Cerrado ahora'}
    </span>
  );
}
