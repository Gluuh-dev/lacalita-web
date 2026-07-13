// Palabra gigante grabada en el fondo (SABORES, EVENTOS, AGENDA…).
// Letterpress con text-shadow: la letra es casi del color del papel y solo se ve
// por su relieve — filo de luz abajo, sombra hundida arriba y halo de profundidad.
export default function Watermark({word, className = '', dark = false}: {word: string; className?: string; dark?: boolean}) {
  const shadow = dark
    ? '0 2px 1px rgba(255,255,255,.12), 0 -1px 2px rgba(0,0,0,.7), 0 -2px 4px rgba(0,0,0,.5), 0 3px 5px rgba(255,255,255,.06)'
    : '0 2px 1px #ffffff, 0 -1px 2px #cbc2ae, 0 -2px 4px rgba(160,148,124,.5), 0 3px 5px rgba(255,255,255,.9)';
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-serif font-bold leading-none tracking-[0.04em] ${className}`}
      style={{
        fontSize: 'clamp(120px, 26vw, 340px)',
        color: dark ? 'rgba(255,255,255,.05)' : '#f0eadd',
        textShadow: shadow
      }}
    >
      {word.toUpperCase()}
    </span>
  );
}
