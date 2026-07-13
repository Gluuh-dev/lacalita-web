// Palabra gigante de fondo (SABORES, EVENTOS, AGENDA…). SVG con textLength:
// el navegador encaja la palabra EXACTA en el ancho disponible, sin estimar
// métricas de la fuente — con spans se recortaba en según qué anchos de PC.
export default function Watermark({word, className = '', dark = false}: {word: string; className?: string; dark?: boolean}) {
  // Cada palabra necesita su propio id de filtro: con un id repetido el
  // navegador reutiliza el primero y el resto de cabeceras salen sin relieve.
  const id = `wm-${word.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 220"
      // Móvil: a sangre, se sale por los lados y gana presencia. PC: contenida,
      // porque a pantalla completa se volvía descomunal.
      className={`pointer-events-none absolute left-1/2 top-1/2 w-[130%] max-w-none -translate-x-1/2 -translate-y-[47%] select-none opacity-65 md:w-[82%] md:max-w-[1000px] md:opacity-100 ${className}`}
    >
      <defs>
        {/* Hueco en el papel. La clave del letterpress: la letra es del MISMO
            color que el fondo, así que solo se ve por su relieve — sombra dentro
            arriba, luz dentro abajo. Si la letra es más oscura que el fondo, el
            ojo la lee como texto encima y no como hueco. */}
        <filter id={id} x="-15%" y="-25%" width="130%" height="160%">
          {/* sombra dentro, arriba: el borde superior del hueco */}
          <feOffset in="SourceAlpha" dx="0" dy="3" result="offDark" />
          <feGaussianBlur in="offDark" stdDeviation="2.5" result="blurDark" />
          <feComposite in="SourceAlpha" in2="blurDark" operator="out" result="cutDark" />
          <feFlood floodColor={dark ? '#000' : '#9a9286'} floodOpacity={dark ? '0.9' : '0.45'} result="colDark" />
          <feComposite in="colDark" in2="cutDark" operator="in" result="shadow" />

          {/* luz dentro, abajo: el canto iluminado del hueco */}
          <feOffset in="SourceAlpha" dx="0" dy="-2.5" result="offLight" />
          <feGaussianBlur in="offLight" stdDeviation="2" result="blurLight" />
          <feComposite in="SourceAlpha" in2="blurLight" operator="out" result="cutLight" />
          <feFlood floodColor="#fff" floodOpacity={dark ? '0.25' : '0.95'} result="colLight" />
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
        // El relleno es el color del fondo (un pelín más oscuro para dar cuerpo),
        // no un gris: lo que se ve es el hueco, no la letra.
        style={{
          fontSize: 205,
          fontWeight: 600,
          fill: 'currentColor',
          filter: `drop-shadow(0 1.5px 0.5px rgba(255,255,255,${dark ? 0.12 : 0.9}))`
        }}
      >
        {word.toUpperCase()}
      </text>
    </svg>
  );
}
