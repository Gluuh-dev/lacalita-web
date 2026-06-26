'use client';

import {useEffect, useRef, useState} from 'react';
import {X} from 'lucide-react';
import BurgerHeroPreview, {type PreviewCfg} from '@/components/burger/burger-hero-preview';
import {edgeBackgroundPts, type EdgePoint} from '@/components/burger/burger-fx';

export type ColorTarget = {key: string; label: string; set: (c: string) => void};

const MASK = 'radial-gradient(ellipse 62% 100% at 50% 50%, #000 40%, transparent 100%)';

export default function ImageColorPicker({
  image,
  cfg,
  targets,
  points,
  onPointsChange,
  onClose
}: {
  image: string;
  cfg: PreviewCfg;
  targets: ColorTarget[];
  points: EdgePoint[];
  onPointsChange: (p: EdgePoint[]) => void;
  onClose: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [picked, setPicked] = useState('');
  const [target, setTarget] = useState<string>('point'); // 'point' = punto de fondo
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

  const measure = () => {
    const s = stageRef.current, im = imgRef.current;
    if (!s || !im) return;
    const sr = s.getBoundingClientRect(), ir = im.getBoundingClientRect();
    if (!sr.width || !ir.width) return;
    setBox({l: ((ir.left - sr.left) / sr.width) * 100, t: ((ir.top - sr.top) / sr.height) * 100, w: (ir.width / sr.width) * 100, h: (ir.height / sr.height) * 100});
  };
  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  function handleClick(clientX: number, clientY: number) {
    const el = imgRef.current, c = canvasRef.current;
    if (!el || !c) return;
    const r = el.getBoundingClientRect();
    const fx = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const fy = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    let color = '';
    try {
      const ctx = c.getContext('2d');
      if (ctx) {
        const d = ctx.getImageData(Math.round(fx * (c.width - 1)), Math.round(fy * (c.height - 1)), 1, 1).data;
        color = '#' + [d[0], d[1], d[2]].map((n) => n.toString(16).padStart(2, '0')).join('');
      }
    } catch {
      return;
    }
    if (!color) return;
    setPicked(color);
    if (target === 'point') {
      onPointsChange([...points, {x: fx, y: fy, c: color}]);
    } else {
      targets.find((t) => t.key === target)?.set(color);
    }
  }

  const removePoint = (idx: number) => onPointsChange(points.filter((_, k) => k !== idx));
  const gradientBg = box ? edgeBackgroundPts(points, box) : null;
  const chips: {key: string; label: string}[] = [{key: 'point', label: '➕ Punto de fondo'}, ...targets.map((t) => ({key: t.key, label: t.label}))];

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-neutral-900">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
        <span className="font-medium">Editor visual — elige un destino y pulsa en la imagen para pintarlo</span>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
          <X className="size-5" />
        </button>
      </div>

      {/* Selector de destino */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 px-4 py-2.5">
        {chips.map((ch) => (
          <button
            key={ch.key}
            type="button"
            onClick={() => setTarget(ch.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${target === ch.key ? 'bg-white text-neutral-900' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
          >
            {ch.label}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-2 text-xs text-white/80">
          <span className="size-6 rounded-full border border-white/40" style={{background: picked || 'transparent'}} />
          {picked || 'sin color'}
        </span>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 overflow-auto p-3 lg:grid-cols-2">
        {/* Imagen donde pulsar */}
        <div className="flex flex-col">
          <div className="mb-1 text-xs text-white/60">Pulsa aquí para coger el color {target === 'point' ? '(añade un punto de fondo)' : `(pinta: ${targets.find((t) => t.key === target)?.label})`}</div>
          <div ref={stageRef} className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl" style={{background: cfg.bgColor || 'radial-gradient(90% 80% at 72% 42%, #fff4ef 0%, #fdfbf7 70%)'}}>
            {gradientBg && <div className="pointer-events-none absolute inset-0" style={{background: gradientBg}} />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={image}
              alt=""
              onLoad={measure}
              onClick={(e) => handleClick(e.clientX, e.clientY)}
              className="relative z-[1] max-h-[64vh] w-auto cursor-crosshair select-none"
              draggable={false}
              style={{WebkitMaskImage: MASK, maskImage: MASK}}
            />
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
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-white/60">
            <span>{points.length} punto(s) de fondo</span>
            {points.length > 0 && <button type="button" onClick={() => onPointsChange([])} className="underline hover:text-white">Quitar todos</button>}
          </div>
        </div>

        {/* Vista en vivo del hero */}
        <div className="rounded-xl bg-neutral-100 p-3">
          <BurgerHeroPreview cfg={cfg} />
        </div>
      </div>
    </div>
  );
}
