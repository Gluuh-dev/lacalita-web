'use client';

import {useEffect, useState} from 'react';
import QRCode from 'qrcode';
import {Download, Copy, Check} from 'lucide-react';
import {toast} from 'sonner';
import {btn, btnGhost, card} from '@/components/admin/ui';

export type QrTarget = {key: string; label: string; hint: string; url: string};

// Nivel alto de corrección de errores: un QR impreso en una mesa se raya, se
// mancha y se moja. Con 'H' sigue leyéndose con hasta un 30% dañado.
const OPCIONES = {errorCorrectionLevel: 'H' as const, margin: 2, color: {dark: '#243b53', light: '#ffffff'}};

function descargar(nombre: string, href: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = nombre;
  a.click();
}

export default function QrManager({targets}: {targets: QrTarget[]}) {
  const [pngs, setPngs] = useState<Record<string, string>>({});
  const [copiado, setCopiado] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    Promise.all(targets.map(async (t) => [t.key, await QRCode.toDataURL(t.url, {...OPCIONES, width: 1024})] as const)).then((pares) => {
      if (vivo) setPngs(Object.fromEntries(pares));
    });
    return () => {
      vivo = false;
    };
  }, [targets]);

  // El SVG se genera al pulsar: es el formato para imprenta (no pixela).
  const bajarSvg = async (t: QrTarget) => {
    const svg = await QRCode.toString(t.url, {...OPCIONES, type: 'svg'});
    const url = URL.createObjectURL(new Blob([svg], {type: 'image/svg+xml'}));
    descargar(`qr-${t.key}.svg`, url);
    URL.revokeObjectURL(url);
  };

  const copiar = async (t: QrTarget) => {
    await navigator.clipboard.writeText(t.url);
    setCopiado(t.key);
    toast.success('Enlace copiado');
    setTimeout(() => setCopiado(null), 1500);
  };

  return (
    <>
      <p className="mb-5 text-sm text-ink-3">
        Descárgalos e imprímelos. El PNG vale para pantalla y para imprimir en casa; el SVG es el que hay que mandar a la imprenta, porque no
        se pixela por grande que se ponga.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {targets.map((t) => (
          <div key={t.key} className={`${card} flex flex-col items-center text-center`}>
            <div className="flex size-44 items-center justify-center rounded-[16px] border border-line bg-white p-2">
              {pngs[t.key] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pngs[t.key]} alt={`QR de ${t.label}`} className="h-full w-full" />
              ) : (
                <span className="text-xs text-ink-3">Generando…</span>
              )}
            </div>

            <h2 className="mt-4 font-serif text-lg font-bold">{t.label}</h2>
            <p className="mt-1 text-xs text-ink-3">{t.hint}</p>
            <code className="mt-2 block max-w-full truncate rounded-full bg-surface-sunken px-3 py-1 text-[0.7rem] text-ink-2">{t.url}</code>

            <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={!pngs[t.key]}
                onClick={() => descargar(`qr-${t.key}.png`, pngs[t.key])}
                className={`${btn} inline-flex items-center gap-1.5`}
              >
                <Download className="size-4" /> PNG
              </button>
              <button type="button" onClick={() => bajarSvg(t)} className={`${btnGhost} inline-flex items-center gap-1.5`}>
                <Download className="size-4" /> SVG
              </button>
              <button type="button" onClick={() => copiar(t)} className={`${btnGhost} inline-flex items-center gap-1.5`}>
                {copiado === t.key ? <Check className="size-4" /> : <Copy className="size-4" />} Enlace
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
