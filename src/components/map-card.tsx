import Image from 'next/image';
import {Navigation} from 'lucide-react';

// Mapa de la casa: un dibujo propio en vez del iframe de Google (que además
// cargaba scripts de terceros y rompía el estilo). Al pulsar, abre las
// indicaciones para llegar.
export default function MapCard({
  href,
  label,
  className = 'h-64'
}: {
  href?: string | null;
  label: string;
  className?: string;
}) {
  // Se funde con el fondo: los bordes se desvanecen con una máscara de gradiente.
  // El dibujo ya es de por sí tenue, así que va a plena opacidad: rebajarla lo
  // deslavaba.
  const fade =
    'radial-gradient(120% 120% at 50% 45%, #000 70%, rgba(0,0,0,.6) 88%, transparent 100%)';

  const map = (
    <>
      <Image
        src="/mapa-la-calita-v5.webp"
        alt="La Calita, a pie de playa en Salobreña"
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
        style={{maskImage: fade, WebkitMaskImage: fade}}
      />
      {href && (
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
          <Navigation className="size-4" /> {label}
        </span>
      )}
    </>
  );

  const cls = `group relative block w-full overflow-hidden rounded-[22px] ${className}`;
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {map}
    </a>
  ) : (
    <div className={cls}>{map}</div>
  );
}
