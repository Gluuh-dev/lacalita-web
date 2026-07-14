import Watermark from '@/components/watermark';

// Cabecera de sección: palabra grabada de fondo, antesala espaciada y título
// con su punto. Full-bleed: la marca de agua no la recorta el contenedor.
export default function SectionHead({
  eyebrow,
  title,
  sub,
  bg,
  dark = false,
  h1 = false
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  bg?: string;
  dark?: boolean;
  h1?: boolean;
}) {
  const word = (bg ?? title).trim();
  const H = h1 ? 'h1' : 'h2';
  return (
    <div className="relative left-1/2 mb-9 w-screen -translate-x-1/2 overflow-hidden py-[clamp(2rem,6vw,4.5rem)] text-center [isolation:isolate] sm:mb-11">
      <Watermark word={word} dark={dark} />

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <p
          className="mb-[clamp(0.4rem,1vw,0.9rem)] font-montserrat font-medium uppercase text-[clamp(0.8rem,1.5vw,1.15rem)] leading-none tracking-[0.42em] max-[520px]:tracking-[0.3em]"
          style={{color: dark ? 'rgba(255,255,255,.75)' : '#b0895a', paddingLeft: '0.42em'}}
        >
          {eyebrow}
        </p>
        <H
          className="h-section font-serif"
          style={{color: dark ? '#fff' : '#23374f'}}
        >
          {title}
          <span className="ml-[0.02em] inline-block size-[0.16em] -translate-y-[0.02em] rounded-full align-baseline bg-[#c06a44]" />
        </H>
        {sub && (
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed sm:text-base" style={{color: dark ? 'rgba(255,255,255,.7)' : 'var(--ink-2)'}}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
