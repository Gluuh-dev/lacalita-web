// Palabra gigante de fondo (SABORES, EVENTOS, AGENDA…). SVG con textLength:
// el navegador encaja la palabra EXACTA en el ancho disponible, sin estimar
// métricas de la fuente — con spans se recortaba en según qué anchos de PC.
export default function Watermark({word, className = ''}: {word: string; className?: string}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 220"
      // Móvil: de lado a lado y más tenue; en PC deja aire y sube la presencia.
      className={`pointer-events-none absolute left-1/2 top-1/2 w-full max-w-[1080px] -translate-x-1/2 -translate-y-[47%] select-none opacity-65 md:w-[94%] md:opacity-100 ${className}`}
    >
      <text
        x="500"
        y="180"
        textAnchor="middle"
        textLength="990"
        lengthAdjust="spacingAndGlyphs"
        className="font-cinzel"
        // Relieve: como grabada en el papel — luz arriba, sombra abajo.
        style={{
          fontSize: 205,
          fontWeight: 600,
          fill: 'currentColor',
          filter: 'drop-shadow(0 1px 0 rgba(255,255,255,.85)) drop-shadow(0 -1px 1px rgba(0,0,0,.10))'
        }}
      >
        {word.toUpperCase()}
      </text>
    </svg>
  );
}
