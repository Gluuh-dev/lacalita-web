'use client';

import {Link} from '@/i18n/navigation';
import HeroCaption from './hero-caption';
import type {HeroSlide} from '@/lib/queries';

// Composición de UNA diapositiva del hero. La usan la web y la preview del admin.
export default function HeroStage({
  slide,
  tagline,
  intro,
  ctaLabel,
  ctaHref,
  preview = false,
  onEnded
}: {
  slide: HeroSlide;
  tagline: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
  preview?: boolean;
  onEnded?: () => void;
}) {
  const light = slide.logoLight;
  const caps = slide.captions ?? [];
  const btn =
    'rounded-full bg-brand px-8 py-3 font-semibold text-on-primary shadow-md transition hover:bg-brand-deep';

  const cta = preview ? (
    <span className={btn}>{ctaLabel}</span>
  ) : ctaHref.startsWith('http') ? (
    <a href={ctaHref} className={btn}>
      {ctaLabel}
    </a>
  ) : (
    <Link href={ctaHref} className={btn}>
      {ctaLabel}
    </Link>
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {slide.url ? (
        slide.type === 'video' ? (
          <video
            src={slide.url}
            poster={slide.poster}
            autoPlay
            muted
            playsInline
            loop={preview ? true : slide.loop}
            onEnded={preview ? undefined : onEnded}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={slide.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )
      ) : null}
      {slide.url && (
        <div className="absolute inset-0 bg-black" style={{opacity: slide.overlay / 100}} />
      )}

      <div className="relative z-10 flex h-full flex-col items-center justify-start gap-6 px-6 pb-16 pt-28 text-center sm:justify-center sm:pt-16">
        <p className={`text-sm uppercase tracking-[0.3em] ${light ? 'text-white/90' : 'text-brand-deep'}`}>
          {tagline}
        </p>
        <h1 className="sr-only">La Calita</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-texto-debajo.svg"
          alt="La Calita"
          className={`w-64 max-w-[80vw] sm:w-80 ${light ? 'brightness-0 invert' : ''}`}
        />
        <p className={`max-w-md text-lg ${light ? 'text-white/90' : 'text-ink/80'}`}>{intro}</p>
        {cta}
      </div>

      {caps.map((c, ci) =>
        c.text || c.src ? <HeroCaption key={`d${ci}`} caption={c} /> : null
      )}

      {caps.some((c) => c.text || c.src) && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-56 bg-gradient-to-t from-black/45 to-transparent sm:hidden" />
          <div className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-4 sm:hidden">
            {caps.map((c, ci) =>
              c.text || c.src ? <HeroCaption key={`m${ci}`} caption={c} variant="mobile" /> : null
            )}
          </div>
        </>
      )}
    </div>
  );
}
