// Palabra gigante de fondo (SABORES, EVENTOS, PLATOS…): solo el contorno, en un
// hilo del color de la tinta al 7 %. Nada de relleno ni de relieve.
export default function Watermark({word, className = '', dark = false}: {word: string; className?: string; dark?: boolean}) {
  return (
    <span
      aria-hidden
      className={`lc-outline pointer-events-none absolute left-1/2 top-8 z-0 -translate-x-1/2 select-none whitespace-nowrap font-serif font-extrabold leading-none ${className}`}
      style={{
        fontSize: '15vw',
        WebkitTextStroke: `1px color-mix(in srgb, ${dark ? '#fff' : 'var(--ink)'} 7%, transparent)`,
        color: 'transparent'
      }}
    >
      {word.toUpperCase()}
    </span>
  );
}
