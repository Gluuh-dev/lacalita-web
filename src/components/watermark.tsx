// Palabra gigante grabada en el fondo (SABORES, EVENTOS, AGENDA…).
// Letterpress con text-shadow: la letra es casi del color del papel y solo se ve
// por su relieve — filo de luz por debajo, sombra hundida por arriba.
export default function Watermark({word, className = '', dark = false}: {word: string; className?: string; dark?: boolean}) {
  const shadow = dark
    ? '0 1px 0 rgba(255,255,255,.12), 0 -1px 1px rgba(0,0,0,.6), 0 2px 3px rgba(255,255,255,.05)'
    : '0 1px 0 #fdfaf3, 0 -1px 1px #cbc3b2, 0 2px 3px rgba(255,255,255,.6)';
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-serif font-bold leading-none tracking-[0.04em] ${className}`}
      style={{
        fontSize: 'clamp(110px, 24vw, 300px)',
        color: dark ? 'rgba(255,255,255,.06)' : '#e7e0d1',
        textShadow: shadow
      }}
    >
      {word.toUpperCase()}
    </span>
  );
}
