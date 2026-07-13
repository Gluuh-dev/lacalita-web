// Palabra gigante de fondo (SABORES, EVENTOS, AGENDA…). SVG con textLength:
// el navegador encaja la palabra EXACTA en el ancho disponible, sin estimar
// métricas de la fuente — con spans se recortaba en según qué anchos de PC.
export default function Watermark({word, className = ''}: {word: string; className?: string}) {
  // Cada palabra necesita su propio id de filtro: con un id repetido el
  // navegador reutiliza el primero y el resto de cabeceras salen sin relieve.
  const id = `wm-${word.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 220"
      // Móvil: de lado a lado y más tenue; en PC deja aire y sube la presencia.
      className={`pointer-events-none absolute left-1/2 top-1/2 w-full max-w-[1080px] -translate-x-1/2 -translate-y-[47%] select-none opacity-65 md:w-[94%] md:opacity-100 ${className}`}
    >
      <defs>
        {/* Sombra INTERIOR: la letra parece hundida en el papel. Se recorta la
            silueta contra una copia de sí misma desplazada y difuminada. */}
        <filter id={id} x="-10%" y="-15%" width="120%" height="140%">
          <feOffset in="SourceAlpha" dx="0" dy="3" result="off" />
          <feGaussianBlur in="off" stdDeviation="3" result="blur" />
          <feComposite in="SourceAlpha" in2="blur" operator="out" result="inverse" />
          <feFlood floodColor="#000" floodOpacity="0.5" result="color" />
          <feComposite in="color" in2="inverse" operator="in" result="shadow" />
          <feComposite in="shadow" in2="SourceGraphic" operator="over" />
        </filter>
      </defs>
      <text
        x="500"
        y="180"
        textAnchor="middle"
        textLength="990"
        lengthAdjust="spacingAndGlyphs"
        className="font-cinzel"
        filter={`url(#${id})`}
        // El filo de luz por debajo remata el grabado: hundido arriba, brillo abajo.
        style={{
          fontSize: 205,
          fontWeight: 600,
          fill: 'currentColor',
          filter: 'drop-shadow(0 1.5px 0 rgba(255,255,255,.9))'
        }}
      >
        {word.toUpperCase()}
      </text>
    </svg>
  );
}
