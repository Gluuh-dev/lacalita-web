'use client';

import {useEffect, useRef, useState} from 'react';
import {X, Plus} from 'lucide-react';
import {edgeBackgroundPts, type EdgePoint} from '@/components/burger/burger-fx';

export type ColorTarget = {label: string; set: (c: string) => void};

const MASK = 'radial-gradient(ellipse 62% 100% at 50% 50%, #000 40%, transparent 100%)';

export default function ImageColorPicker({
  image,
  points,
  onPointsChange,
  targets,
  bgColor,
  onClose
}: {
  image: string;
  points: EdgePoint[];
  onPointsChange: (p: EdgePoint[]) => void;
  targets: ColorTarget[];
  bgColor: string;
  onClose: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [picked, setPicked] = useState('');
  const [pos, setPos] = useState<{x: number; y: number} | null>(null);
  const [box, setBox] = useState<{l: number; t: number; w: number; h: number} | null>(null);

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

  useEffect(() => {
    const measure = () => {
      const s = stageRef.current, im = imgRef.current;
      if (!s || !im) return;
      const sr = s.getBoundingClientRect(), ir = im.getBoundingClientRect();
      if (!sr.width || !ir.width) return;
      setBox({l: ((ir.left - sr.left) / sr.width) * 100, t: ((ir.top - sr.top) / sr.height) * 100, w: (ir.width / sr.width) * 100, h: (ir.height / sr.height) * 100});
    };
    const t = setTimeout(measure, 60);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
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

  const gradientBg = box ? edgeBackgroundPts(points, box) : null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-3" onClick={onClose}>
      <div className="flex max-h-[96vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl bg-surface p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <span className="font-medium text-ink">Fondo de la imagen en el hero</span>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex size-8 items-center justify-center rounded-full bg-black/5 text-ink-2 hover:bg-black/10">
            <X className="size-4" />
          </button>
        </div>
        <p className="mb-3 text-xs text-ink-3">
          Así se verá en el hero. Los <b>puntos</b> generan el degradado de fondo que rodea la imagen para que no se vea el corte.
          Pulsa la imagen para coger un color de ahí; luego <b>añádelo como punto</b> o <b>píntalo</b> en un elemento.
        </p>

        {/* Escenario: muestra el degradado real alrededor de la imagen */}
        <div ref={stageRef} className="relative mx-auto flex h-[52vh] w-full items-center justify-center overflow-hidden rounded-xl" style={{background: bgColor || 'radial-gradient(90% 80% at 72% 42%, #fff4ef 0%, #fdfbf7 70%)'}}>
          {gradientBg && <div className="pointer-events-none absolute inset-0" style={{background: gradientBg}} />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={image}
            crossOrigin="anonymous"
            alt=""
            onClick={(e) => pick(e.clientX, e.clientY)}
            className="relative z-[1] max-h-[50vh] w-auto cursor-crosshair select-none"
            draggable={false}
            style={{WebkitMaskImage: MASK, maskImage: MASK}}
            onLoad={() => {
              const s = stageRef.current, im = imgRef.current;
              if (!s || !im) return;
              const sr = s.getBoundingClientRect(), ir = im.getBoundingClientRect();
              if (sr.width && ir.width) setBox({l: ((ir.left - sr.left) / sr.width) * 100, t: ((ir.top - sr.top) / sr.height) * 100, w: (ir.width / sr.width) * 100, h: (ir.height / sr.height) * 100});
            }}
          />
          {/* Marcadores de puntos (pulsa para quitar) */}
          {box && points.map((p, k) => (
            <button
              key={k}
              type="button"
              title="Quitar punto"
              onClick={(e) => {
                e.stopPropagation();
                removePoint(k);
              }}
              className="absolute z-[3] flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow"
              style={{left: `${box.l + p.x * box.w}%`, top: `${box.t + p.y * box.h}%`, background: p.c}}
            >
              ×
            </button>
          ))}
          {/* Punto recién elegido */}
          {box && pos && (
            <span className="pointer-events-none absolute z-[3] size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-white shadow-lg" style={{left: `${box.l + pos.x * box.w}%`, top: `${box.t + pos.y * box.h}%`, background: picked || 'transparent'}} />
          )}
        </div>

        {/* Color elegido */}
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-surface-sunken p-2">
          <span className="size-9 rounded-full border border-line-strong" style={{background: picked || '#ffffff'}} />
          <div className="text-sm">
            <div className="font-medium text-ink">{picked || '— pulsa en la imagen —'}</div>
            <div className="text-xs text-ink-3">Color elegido</div>
          </div>
          <button type="button" disabled={!picked} onClick={addPoint} className="ml-auto inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-on-primary transition hover:brightness-105 disabled:opacity-40">
            <Plus className="size-3.5" /> Añadir punto de fondo aquí
          </button>
        </div>

        {/* Pintar elemento con el color */}
        <div className="mt-3">
          <div className="mb-1 text-xs text-ink-3">Pintar un elemento con este color:</div>
          <div className="flex flex-wrap gap-2">
            {targets.map((t) => (
              <button key={t.label} type="button" disabled={!picked} onClick={() => t.set(picked)} className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-2 transition hover:border-brand disabled:opacity-40">
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-ink-3">
          <span>{points.length} punto(s) de fondo</span>
          {points.length > 0 && (
            <button type="button" onClick={() => onPointsChange([])} className="underline hover:text-brand">Quitar todos</button>
          )}
        </div>
      </div>
    </div>
  );
}
