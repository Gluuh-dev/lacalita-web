import type {CSSProperties} from 'react';

export const TITLE_GRADIENTS: Record<string, string> = {
  gold: 'linear-gradient(180deg,#f7e6bd,#e9ae74 45%,#b9853f)',
  orange: 'linear-gradient(180deg,#ffb16b,#f26b21 60%,#c9531a)',
  fire: 'linear-gradient(180deg,#ffd27a,#f26b21 45%,#d4530f)',
  cream: 'linear-gradient(180deg,#ffffff,#f4ede2 50%,#cdbfa8)'
};

/** Estilo de color del título: degradado (recorte de texto) o color plano. */
export function titleColorStyle(color: string, gradient?: string | null): CSSProperties {
  if (gradient && TITLE_GRADIENTS[gradient]) {
    return {
      backgroundImage: TITLE_GRADIENTS[gradient],
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      WebkitTextFillColor: 'transparent'
    };
  }
  return {color: color || '#ffffff'};
}

/** Chispas/brasas animadas subiendo (encima de la hamburguesa). */
export function Sparks() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {Array.from({length: 18}).map((_, k) => (
        <span
          key={k}
          className="lc-ember-dot absolute bottom-[8%] rounded-full"
          style={{left: `${(k * 53) % 96}%`, width: k % 4 ? 3 : 4, height: k % 4 ? 3 : 4, background: k % 3 ? '#f6a04a' : '#f26b21', animation: `lc-ember ${4 + (k % 5)}s linear ${(k % 6) * 0.5}s infinite`}}
        />
      ))}
    </div>
  );
}

/** Vídeo de efecto (humo/fuego) con el negro eliminado vía mezcla "screen".
 *  Centrado sobre la hamburguesa (derecha) y delante o detrás según `behind`. */
export function FxVideo({src, behind}: {src: string; behind?: boolean}) {
  // Caja centrada sobre la hamburguesa (su centro = centro de la burger),
  // así lo que sale en mitad del vídeo cae en mitad de la hamburguesa.
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-full w-[94%] -translate-x-1/2 -translate-y-1/2 md:left-[68%] md:w-[62%]" style={{zIndex: behind ? 1 : 5}}>
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        style={{
          mixBlendMode: 'screen',
          opacity: 0.85,
          WebkitMaskImage: 'radial-gradient(ellipse 60% 72% at 50% 50%, #000 46%, transparent 80%)',
          maskImage: 'radial-gradient(ellipse 60% 72% at 50% 50%, #000 46%, transparent 80%)'
        }}
      />
    </div>
  );
}

/** Humo animado suave (encima de la hamburguesa). */
export function Smoke() {
  return (
    <div
      className="lc-smoke pointer-events-none absolute inset-0 z-[5]"
      style={{background: 'radial-gradient(38% 42% at 52% 42%, rgba(232,232,232,.14), transparent 70%), radial-gradient(30% 36% at 60% 60%, rgba(210,210,210,.10), transparent 72%)', filter: 'blur(7px)'}}
    />
  );
}
