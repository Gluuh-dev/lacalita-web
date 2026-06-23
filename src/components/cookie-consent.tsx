'use client';

import {useEffect, useState} from 'react';
import {Link} from '@/i18n/navigation';

const KEY = 'lc_cookies';

// ponytail: consentimiento simple (aceptar/rechazar). No cargamos analítica/marketing
// todavía, así que "rechazar" solo guarda la elección. Si se añade analítica, leer
// localStorage.getItem('lc_cookies') === 'all' antes de cargarla.
export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {}
  }, []);

  if (!show) return null;

  const choose = (v: 'all' | 'essential') => {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    setShow(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[400] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border border-line bg-bg/95 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center">
        <p className="flex-1 text-sm text-ink-2">
          Usamos cookies propias necesarias para que la web funcione. Con tu permiso, también para medir el uso de forma anónima.{' '}
          <Link href="/legal/cookies" className="font-medium text-brand-deep underline">Más información</Link>.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => choose('essential')}
            className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink-2 transition hover:bg-surface-2 sm:flex-none"
          >
            Rechazar
          </button>
          <button
            onClick={() => choose('all')}
            className="flex-1 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-brand-deep sm:flex-none"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
