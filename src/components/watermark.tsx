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
      // Más ancha que la pantalla a propósito: la palabra se sale por los lados
      // (se recorta) y gana presencia, como un grabado a sangre.
      className={`pointer-events-none absolute left-1/2 top-1/2 w-[130%] max-w-none -translate-x-1/2 -translate-y-[47%] select-none opacity-65 md:w-[112%] md:opacity-100 ${className}`}
    >
      <defs>
        {/* Tallada: sombra dentro por arriba y filo de luz dentro por abajo.
            Se recorta la silueta contra copias de sí misma desplazadas. */}
        <filter id={id} x="-10%" y="-20%" width="120%" height="150%">
          {/* sombra interior (arriba) */}
          <feOffset in="SourceAlpha" dx="0" dy="5" result="offDark" />
          <feGaussianBlur in="offDark" stdDeviation="4" result="blurDark" />
          <feComposite in="SourceAlpha" in2="blurDark" operator="out" result="cutDark" />
          <feFlood floodColor="#000" floodOpacity="0.75" result="colDark" />
          <feComposite in="colDark" in2="cutDark" operator="in" result="shadow" />

          {/* filo de luz interior (abajo) */}
          <feOffset in="SourceAlpha" dx="0" dy="-4" result="offLight" />
          <feGaussianBlur in="offLight" stdDeviation="3" result="blurLight" />
          <feComposite in="SourceAlpha" in2="blurLight" operator="out" result="cutLight" />
          <feFlood floodColor="#fff" floodOpacity="0.9" result="colLight" />
          <feComposite in="colLight" in2="cutLight" operator="in" result="light" />

          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="light" />
            <feMergeNode in="shadow" />
          </feMerge>
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
        // Remate exterior: un hilo de luz por debajo termina de hundir la letra.
        style={{
          fontSize: 205,
          fontWeight: 600,
          fill: 'currentColor',
          filter: 'drop-shadow(0 2px 0 rgba(255,255,255,.95))'
        }}
      >
        {word.toUpperCase()}
      </text>
    </svg>
  );
}
