'use client';

import {useEffect, useRef, useState} from 'react';
import {X, Plus} from 'lucide-react';
import type {EdgePoint} from '@/components/burger/burger-fx';

export type ColorTarget = {label: string; set: (c: string) => void};

export default function ImageColorPicker({
  image,
  points,
  onPointsChange,
  targets,
  onClose
}: {
  image: string;
  points: EdgePoint[];
  onPointsChange: (p: EdgePoint[]) => void;
  targets: ColorTarget[];
  onClose: () => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [picked, setPicked] = useState('');
  const [pos, setPos] = useState<{x: number; y: number} | null>(null);

  useEffect(() => {
    const im = new window.Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => {
      const c = document.createElement('canvas');
      c.width = im.naturalWidth || 1000;
      c.height = im.naturalHeight || 1000;
      const ctx = c.getContext('2d');
      if (ctx) ctx.drawImage(im, 0, 0, c.width, c.height);
      canvasRef.current = c;
    };
    im.src = image;
  }, [image]);

  function pick(clientX: number, clientY: number) {
    const el = imgRef.current, c = canvasRef.current;
    if (!el || !c) return;
    const r = el.getBoundingClientRect();
    const fx = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const fy = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    setPos({x: fx, y: fy});
    try {
      const ctx = c.getContext('2d');
      if (!ctx) return;
      const d = ctx.getImageData(Math.round(fx * (c.width - 1)), Math.round(fy * (c.height - 1)), 1, 1).data;
      setPicked('#' + [d[0], d[1], d[2]].map((n) => n.toString(16).padStart(2, '0')).join(''));
    } catch {
      /* CORS */
    }
  }

  const addPoint = () => {
    if (!pos || !picked) return;
    onPointsChange([...points, {x: pos.x, y: pos.y, c: picked}]);
  };
  const removePoint = (idx: number) => onPointsChange(points.filter((_, k) => k !== idx));

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-3" onClick={onClose}>
      <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl bg-surface p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-medium text-ink">Colores de la imagen — pulsa donde quieras</span>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex size-8 items-center justify-center rounded-full bg-black/5 text-ink-2 hover:bg-black/10">
            <X className="size-4" />
          </button>
        </div>

        <div className="relative mx-auto flex max-h-[55vh] items-center justify-center overflow-hidden rounded-xl bg-surface-sunken">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={image}
            crossOrigin="anonymous"
            alt=""
            onClick={(e) => pick(e.clientX, e.clientY)}
            className="max-h-[55vh] w-auto cursor-crosshair select-none"
            draggable={false}
          />
          {/* Puntos de degradado guardados (pulsa para quitar) */}
          {points.map((p, k) => (
            <button
              key={k}
              type="button"
              title="Quitar punto"
              onClick={(e) => {
                e.stopPropagation();
                removePoint(k);
              }}
              className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
              style={{left: `${p.x * 100}%`, top: `${p.y * 100}%`, background: p.c}}
            />
          ))}
          {/* Punto recién elegido */}
          {pos && (
            <span className="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-white shadow-lg" style={{left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, background: picked || 'transparent'}} />
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="size-8 rounded-full border border-line-strong" style={{background: picked || '#ffffff'}} />
          <span className="text-sm text-ink-2">{picked || 'Pulsa en la imagen para coger un color'}</span>
          <button type="button" disabled={!picked} onClick={addPoint} className="ml-auto inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-ink-2 transition hover:border-brand disabled:opacity-40">
            <Plus className="size-3.5" /> Añadir punto de degradado
          </button>
        </div>

        <div className="mt-3">
          <div className="mb-1 text-xs text-ink-3">Aplicar el color elegido a:</div>
          <div className="flex flex-wrap gap-2">
            {targets.map((t) => (
              <button key={t.label} type="button" disabled={!picked} onClick={() => t.set(picked)} className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-2 transition hover:border-brand disabled:opacity-40">
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-xs text-ink-3">
          Los <b>puntos de degradado</b> ({points.length}) marcan de dónde sale cada color del fondo para fundir la imagen. Pulsa un punto para quitarlo.
        </p>
      </div>
    </div>
  );
}
