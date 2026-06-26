import type {CSSProperties} from 'react';

export const TITLE_GRADIENTS: Record<string, string> = {
  red: 'linear-gradient(180deg,#e0705f,#c94a3c 55%,#9a2f24)',
  terra: 'linear-gradient(180deg,#e9a591,#d67a63 55%,#b85a44)',
  gold: 'linear-gradient(180deg,#f7e6bd,#e9ae74 45%,#b9853f)',
  orange: 'linear-gradient(180deg,#ffb16b,#f26b21 60%,#c9531a)',
  fire: 'linear-gradient(180deg,#ffd27a,#f26b21 45%,#d4530f)',
  cream: 'linear-gradient(180deg,#ffffff,#f4ede2 50%,#cdbfa8)'
};

/** Fondo a partir de los colores de borde muestreados (8 puntos): degradados radiales
 *  en cada esquina y punto medio para que el contorno de la imagen se funda con el fondo. */
export function edgeBackground(ec?: Record<string, string> | null): string | null {
  if (!ec) return null;
  // Coloca los colores de la imagen (que va en la mitad derecha) y los difumina suave
  // hacia la izquierda, cubriendo TODO el fondo sin cortes.
  const g = (x: string, y: string, c?: string) =>
    c ? `radial-gradient(70% 70% at ${x} ${y}, ${c}, transparent 78%)` : '';
  const parts = [
    g('100%', '50%', ec.rm),
    g('100%', '0%', ec.tr),
    g('100%', '100%', ec.br),
    g('74%', '0%', ec.tc),
    g('74%', '100%', ec.bc),
    g('50%', '0%', ec.tl),
    g('50%', '100%', ec.bl),
    g('48%', '50%', ec.lm)
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}

/** Igual que edgeBackground pero posicionando cada degradado en el punto REAL de la
 *  imagen en pantalla (box = {l,t,w,h} en % del contenedor). */
export function edgeBackgroundAt(ec: Record<string, string> | null | undefined, box: {l: number; t: number; w: number; h: number}): string | null {
  if (!ec) return null;
  const px = (fx: number) => `${(box.l + fx * box.w).toFixed(1)}%`;
  const py = (fy: number) => `${(box.t + fy * box.h).toFixed(1)}%`;
  const g = (fx: number, fy: number, c?: string) =>
    c ? `radial-gradient(42% 42% at ${px(fx)} ${py(fy)}, ${c}, transparent 70%)` : '';
  const parts = [
    g(0, 0, ec.tl), g(1, 0, ec.tr), g(0, 1, ec.bl), g(1, 1, ec.br),
    g(0.5, 0, ec.tc), g(0.5, 1, ec.bc), g(0, 0.5, ec.lm), g(1, 0.5, ec.rm)
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}

/** Estilo del texto: contorno (líneas sin relleno), degradado (preset o del propio
 *  color con 'auto'), o color plano. */
export function titleColorStyle(color: string, gradient?: string | null, outline?: boolean): CSSProperties {
  if (outline) {
    return {color: 'transparent', WebkitTextFillColor: 'transparent', WebkitTextStroke: `1.5px ${color || '#c94a3c'}`};
  }
  const grad = gradient === 'auto' && color
    ? `linear-gradient(180deg, color-mix(in srgb, ${color} 58%, white), ${color} 52%, color-mix(in srgb, ${color} 80%, black))`
    : gradient && TITLE_GRADIENTS[gradient]
      ? TITLE_GRADIENTS[gradient]
      : null;
  if (grad) {
    return {
      backgroundImage: grad,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      WebkitTextFillColor: 'transparent'
    };
  }
  return {color: color || '#ffffff'};
}

/** Aura cálida + anillos que laten DETRÁS de la hamburguesa (z bajo). */
export function BurgerAura() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden">
      {/* Resplandor */}
      <div
        className="absolute size-[80%] rounded-full"
        style={{background: 'radial-gradient(circle, rgba(214,122,99,.38), rgba(201,74,60,.14) 45%, transparent 68%)', filter: 'blur(10px)'}}
      />
      {/* Anillos que laten */}
      {[0, 1, 2].map((k) => (
        <span
          key={k}
          className="lc-pulse absolute rounded-full"
          style={{width: '44%', height: '44%', border: '1.5px solid rgba(201,74,60,.30)', animationDelay: `${k * 1.7}s`}}
        />
      ))}
    </div>
  );
}

/** Chispas/brasas animadas subiendo (encima de la hamburguesa). */
export function Sparks() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {Array.from({length: 20}).map((_, k) => (
        <span
          key={k}
          className="lc-ember-dot absolute bottom-[8%] rounded-full"
          style={{left: `${(k * 53) % 96}%`, width: k % 4 ? 3 : 5, height: k % 4 ? 3 : 5, background: k % 3 ? '#d67a63' : '#c94a3c', boxShadow: '0 0 7px rgba(201,74,60,.55)', animation: `lc-ember ${4 + (k % 5)}s linear ${(k % 6) * 0.5}s infinite`}}
        />
      ))}
    </div>
  );
}

/** Vídeo de efecto (humo/fuego) con el negro eliminado vía mezcla "screen".
 *  Centrado sobre la hamburguesa (derecha) y delante o detrás según `behind`. */
export function FxVideo({src, behind, x = 62, y = 50, scale = 1.1}: {src: string; behind?: boolean; x?: number; y?: number; scale?: number}) {
  // Posición/tamaño y mezcla "screen" directamente en el <video> (sin wrapper),
  // para que el negro se mezcle con la hamburguesa y desaparezca (no se aísla).
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="lc-fxvideo pointer-events-none absolute object-cover"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${90 * scale}%`,
        height: `${100 * scale}%`,
        transform: 'translate(-50%,-50%)',
        zIndex: behind ? 1 : 5,
        mixBlendMode: 'screen',
        WebkitMaskImage: 'radial-gradient(ellipse 82% 90% at 50% 50%, #000 62%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 82% 90% at 50% 50%, #000 62%, transparent 100%)'
      }}
    />
  );
}

/** Humo animado suave (encima de la hamburguesa). */
export function Smoke() {
  return (
    <div
      className="lc-smoke pointer-events-none absolute inset-0 z-[5]"
      style={{background: 'radial-gradient(38% 42% at 52% 42%, rgba(214,122,99,.18), transparent 70%), radial-gradient(30% 36% at 60% 60%, rgba(201,74,60,.12), transparent 72%)', filter: 'blur(8px)'}}
    />
  );
}
