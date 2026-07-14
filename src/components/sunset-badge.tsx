'use client';

import {useEffect, useState} from 'react';
import {Sun} from 'lucide-react';
import {sunsetAt} from '@/lib/sunset';

// "Atardecer en 3h 20m" (o la hora exacta si ya ha pasado). Se calcula en el
// cliente: en el servidor daría la hora del servidor, no la del visitante.
export default function SunsetBadge({label, className = ''}: {label: string; className?: string}) {
  const [txt, setTxt] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      let s = sunsetAt(now);
      let manana = false;
      if (s.getTime() <= now.getTime()) {
        s = sunsetAt(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
        manana = true;
      }
      const hora = s.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'});
      if (manana) {
        setTxt(`Mañana a las ${hora}`);
        return;
      }
      const falta = Math.round((s.getTime() - now.getTime()) / 60_000);
      const h = Math.floor(falta / 60);
      const m = falta % 60;
      setTxt(h > 0 ? `Atardecer en ${h}h ${m}m` : `Atardecer en ${m}m`);
    };
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);

  if (!txt) return null;
  return (
    <div className={`flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.04] px-4 py-3 ${className}`}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e2a869]/15 text-[#e2a869]">
        <Sun className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-adam text-[0.62rem] uppercase tracking-[0.16em] text-white/45">{label}</span>
        <span className="block font-serif text-lg leading-tight text-white">{txt}</span>
      </span>
    </div>
  );
}
