'use client';

import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Link} from '@/i18n/navigation';
import {useHeaderMode} from './header-mode';
import {inkOn, type HeroEvent} from '@/lib/hero';
import type {HeroSlide} from '@/lib/hero-types';

const FONT: Record<string, string> = {
  romance: "'Modern Romance', serif",
  eight: "'Eight One', sans-serif",
  display: 'var(--font-playfair), serif'
};
const LOGO_FILTER: Record<string, string> = {
  white: 'brightness(0) invert(1)',
  cream: 'brightness(0) invert(1)',
  brown: 'brightness(0)',
  ink: 'brightness(0)',
  orange: 'brightness(0) invert(1)'
};
const cover: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'};

function HeroButton({slide, bc, bt, pc, preview}: {slide: HeroSlide; bc: string; bt: string; pc: boolean; preview: boolean}) {
  const style: React.CSSProperties = {
    display: 'inline-block', background: bc, color: bt, borderRadius: 999,
    padding: pc ? '16px 30px' : '14px 26px', fontWeight: 700, fontSize: pc ? 17 : 16
  };
  if (preview || !slide.link) return <span style={style}>{slide.button}</span>;
  if (slide.link.startsWith('/')) return <Link href={slide.link} style={style}>{slide.button}</Link>;
  return <a href={slide.link} style={style}>{slide.button}</a>;
}

function Marquee({slide, pc}: {slide: HeroSlide; pc: boolean}) {
  if (!slide.marqueeOn || !slide.marquee) return null;
  const color = slide.marqueeColor || slide.color || '#e9ae74';
  const bg = slide.marqueeBg || '';
  const hasBg = !!bg;
  const dur = `${slide.marqueeSpeed || 18}s`;
  const txt = `${slide.marquee}   ·   `.repeat(4);
  const pos = `${typeof slide.marqueePos === 'number' ? slide.marqueePos : 50}%`;

  if (slide.marqueeOrient === 'vertical') {
    const rev = slide.marqueeDir === 'down';
    return (
      <div style={{position: 'absolute', top: 0, bottom: 0, left: pos, transform: 'translateX(-50%)', overflow: 'hidden', pointerEvents: 'none', zIndex: hasBg ? 4 : 1, background: bg || 'transparent', padding: hasBg ? '0 8px' : 0}}>
        <div className={`lc-mq-v${rev ? ' rev' : ''}`} style={{animationDuration: dur}}>
          {[0, 1].map((k) => (
            <span key={k} style={{writingMode: 'vertical-rl', fontFamily: FONT.eight, textTransform: 'uppercase', fontSize: pc ? 64 : 40, lineHeight: 1, color, opacity: hasBg ? 1 : 0.22, paddingBottom: 36}}>{txt}</span>
          ))}
        </div>
      </div>
    );
  }
  const rev = slide.marqueeDir === 'right';
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: pos, transform: 'translateY(-50%)', overflow: 'hidden', pointerEvents: 'none', zIndex: hasBg ? 4 : 1, background: bg || 'transparent', padding: hasBg ? '10px 0' : 0}}>
      <div className={`lc-mq${rev ? ' rev' : ''}`} style={{animationDuration: dur}}>
        {[0, 1].map((k) => (
          <span key={k} style={{fontFamily: FONT.eight, textTransform: 'uppercase', fontSize: pc ? 120 : 66, lineHeight: 1, color, opacity: hasBg ? 1 : 0.2, paddingRight: pc ? 70 : 40}}>{txt}</span>
        ))}
      </div>
    </div>
  );
}

function EvRow({e, on, onClick}: {e: HeroEvent; on: boolean; onClick: () => void}) {
  return (
    <div onClick={onClick} style={{display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', background: on ? 'rgba(233,174,116,.16)' : 'transparent', borderRadius: 14, padding: 9}}>
      <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 44, padding: '5px 0', borderRadius: 8, background: on ? '#e9ae74' : 'rgba(255,255,255,.08)', color: on ? '#3a2606' : '#fff', lineHeight: 1}}>
        <span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 17}}>{e.day}</span>
        <span style={{fontFamily: "'Adam',serif", fontSize: 9, letterSpacing: '0.1em', marginTop: 2}}>{e.month}</span>
      </span>
      <span style={{flex: 1, minWidth: 0}}>
        <span style={{display: 'block', fontFamily: FONT.display, fontWeight: 600, fontSize: 15, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{e.title}</span>
        <span style={{display: 'block', fontSize: 12, color: 'rgba(255,255,255,.62)'}}>{e.artist}{e.artist && ' · '}{e.time}</span>
      </span>
    </div>
  );
}

function AgendaPanel({slide, events, bc, bt}: {slide: HeroSlide; events: HeroEvent[]; bc: string; bt: string}) {
  const [active, setActive] = useState(0);
  const evs = events.slice(0, 4);
  const feat = evs[active] || ({} as HeroEvent);
  return (
    <aside style={{width: 340, flex: '0 0 340px', background: 'rgba(20,15,8,.34)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,.16)', borderRadius: 28, padding: 22, color: '#fff'}}>
      <div style={{fontFamily: "'Adam',serif", textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 12, color: 'rgba(255,255,255,.8)', marginBottom: 16}}>Próximos eventos</div>
      <div style={{borderBottom: '1px solid rgba(255,255,255,.14)', paddingBottom: 16, marginBottom: 10}}>
        <div style={{fontFamily: FONT[slide.font] || FONT.romance, fontSize: 32, lineHeight: 1.02, color: slide.color}}>{feat.title}</div>
        <div style={{fontFamily: FONT.eight, fontSize: 16, marginTop: 7}}>{feat.day} {feat.month} · {feat.time}</div>
        {feat.artist && <div style={{fontSize: 13, color: 'rgba(255,255,255,.7)', marginTop: 5}}>con {feat.artist}</div>}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
        {evs.map((e, i) => <EvRow key={e.id} e={e} on={i === active} onClick={() => setActive(i)} />)}
      </div>
      {slide.eventBtn && <div style={{marginTop: 14, textAlign: 'center', background: bc, color: bt, borderRadius: 999, padding: 11, fontWeight: 700, fontSize: 14}}>{slide.eventBtnText}</div>}
    </aside>
  );
}

export function HeroStage({
  slide,
  events = [],
  pc,
  animKey = 0,
  preview = false
}: {
  slide: HeroSlide;
  events?: HeroEvent[];
  pc: boolean;
  animKey?: number;
  preview?: boolean;
}) {
  const bc = slide.btnColor || '#e9ae74';
  const bt = inkOn(bc);
  const agenda = slide.heroMode === 'agenda';
  const animCls = slide.anim === 'slide' ? 'lc-hero-slide' : slide.anim === 'none' ? '' : 'lc-hero-fade';

  const rotuloDesktop = slide.heroMode === 'rotulo' && slide.rotulo && pc;
  const rotuloMobile = slide.heroMode === 'rotulo' && slide.rotulo && !pc;

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#243b53'}}>
      {/* fondo */}
      {slide.mediaType === 'video' && slide.media ? (
        <video src={slide.media} poster={slide.poster} autoPlay muted loop playsInline style={cover} />
      ) : slide.media ? (
        <div style={{...cover, background: `center/cover url(${slide.media})`}} />
      ) : (
        <div style={{...cover, background: 'radial-gradient(120% 90% at 70% 10%, #3f88a6 0%, #2e6e8e 35%, #243b53 80%)'}} />
      )}
      <div style={{...cover, background: 'linear-gradient(to bottom, rgba(20,15,8,.3) 0%, rgba(20,15,8,.1) 40%, rgba(20,15,8,.55) 100%)'}} />
      <div style={{...cover, background: '#140f08', opacity: (slide.darken || 0) / 100}} />
      <div style={{position: 'absolute', top: '-14%', right: '-6%', width: pc ? 560 : 280, height: pc ? 560 : 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,174,116,.5), transparent 65%)'}} />

      <Marquee slide={slide} pc={pc} />

      {/* contenido */}
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', zIndex: 3}}>
        <div style={{width: pc ? 1180 : '100%', margin: '0 auto', padding: pc ? '0 40px' : '0 24px', boxSizing: 'border-box', display: pc && agenda ? 'grid' : 'flex', gridTemplateColumns: pc && agenda ? 'minmax(0,1fr) 340px' : undefined, gap: 48, alignItems: 'center'}}>
          <div key={animKey} className={animCls} style={{display: 'flex', flexDirection: 'column', alignItems: pc ? 'flex-start' : 'center', textAlign: pc ? 'left' : 'center', maxWidth: pc ? 660 : '100%', margin: pc ? 0 : '0 auto', color: '#fff'}}>
            {slide.showLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/brand/logo-texto-debajo.svg" alt="" style={{height: pc ? 132 : 100, marginBottom: pc ? 22 : 18, filter: LOGO_FILTER[slide.logoColor] || LOGO_FILTER.white}} />
            )}
            {slide.eyebrow && <div style={{fontFamily: "'Adam',serif", textTransform: 'uppercase', letterSpacing: '0.22em', fontSize: pc ? 14 : 12, color: 'var(--brand)', marginBottom: 16}}>{slide.eyebrow}</div>}
            {slide.lema && <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: pc ? 76 : 42, lineHeight: 1.03, marginBottom: 20, textWrap: 'balance'}}>{slide.lema}</div>}
            {slide.bienvenida && <div style={{fontSize: pc ? 18 : 16, color: 'rgba(255,255,255,.86)', maxWidth: 440, marginBottom: 28, lineHeight: 1.5}}>{slide.bienvenida}</div>}
            {slide.button && <HeroButton slide={slide} bc={bc} bt={bt} pc={pc} preview={preview} />}

            {rotuloMobile && (
              <div style={{marginTop: 34, textAlign: 'center'}}>
                <div style={{fontFamily: FONT[slide.font] || FONT.romance, fontSize: 40, lineHeight: 1.02, color: slide.color}}>{slide.rotulo}</div>
                {slide.sub && <div style={{fontFamily: FONT.eight, fontSize: 18, letterSpacing: '0.05em', color: '#fff', marginTop: 8}}>{slide.sub}</div>}
                {slide.eventBtn && <div style={{display: 'inline-block', marginTop: 14, background: bc, color: bt, borderRadius: 999, padding: '12px 24px', fontWeight: 700, fontSize: 15}}>{slide.eventBtnText}</div>}
              </div>
            )}

            {agenda && !pc && events.length > 0 && (
              <div style={{marginTop: 28, width: '100%', maxWidth: 360, background: 'rgba(20,15,8,.34)', border: '1px solid rgba(255,255,255,.16)', borderRadius: 22, padding: 16, textAlign: 'left'}}>
                <div style={{fontFamily: "'Adam',serif", textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: 10, color: 'rgba(255,255,255,.7)', marginBottom: 10}}>Próximos eventos</div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
                  {events.slice(0, 4).map((e) => <EvRow key={e.id} e={e} on={false} onClick={() => {}} />)}
                </div>
              </div>
            )}
          </div>
          {pc && agenda && events.length > 0 && <AgendaPanel slide={slide} events={events} bc={bc} bt={bt} />}
        </div>
      </div>

      {rotuloDesktop && (
        <div style={{position: 'absolute', right: 40, top: `${slide.rotuloY != null ? slide.rotuloY : 68}%`, transform: 'translateY(-50%)', textAlign: 'right', maxWidth: 460, zIndex: 4}}>
          <div style={{fontFamily: FONT[slide.font] || FONT.romance, fontSize: 56, lineHeight: 1.02, color: slide.color}}>{slide.rotulo}</div>
          {slide.sub && <div style={{fontFamily: FONT.eight, fontSize: 22, letterSpacing: '0.05em', color: '#fff', marginTop: 10}}>{slide.sub}</div>}
          {slide.eventBtn && <div style={{display: 'inline-block', marginTop: 14, background: bc, color: bt, borderRadius: 999, padding: '12px 24px', fontWeight: 700, fontSize: 15}}>{slide.eventBtnText}</div>}
        </div>
      )}
    </div>
  );
}

/** Previsualización escalada al ancho del contenedor (admin). */
export function HeroPreview({slide, events, device, animKey = 0}: {slide: HeroSlide; events: HeroEvent[]; device: 'pc' | 'mobile'; animKey?: number}) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const pc = device === 'pc';
  const DW = pc ? 1280 : 390;
  const DH = pc ? 720 : 800;
  const scale = w ? w / DW : 0.3;
  return (
    <div ref={ref} style={{width: '100%', height: DH * scale, position: 'relative', overflow: 'hidden', borderRadius: 'var(--r-md)'}}>
      <div style={{position: 'absolute', top: 0, left: 0, width: DW, height: DH, transform: `scale(${scale})`, transformOrigin: 'top left'}}>
        <HeroStage slide={slide} events={events} pc={pc} animKey={animKey} preview />
      </div>
    </div>
  );
}

/** Hero público: carrusel a pantalla completa (escala tipo "cover"). */
export default function Hero({slides, events}: {slides: HeroSlide[]; events: HeroEvent[]}) {
  const {set} = useHeaderMode();
  const [i, setI] = useState(0);
  const [vp, setVp] = useState({w: 0, h: 0});
  const sx = useRef(0);

  useEffect(() => {
    const u = () => setVp({w: window.innerWidth, h: window.innerHeight});
    u();
    window.addEventListener('resize', u);
    return () => window.removeEventListener('resize', u);
  }, []);
  useEffect(() => {
    set({overHero: true, hasMedia: true});
    return () => set({overHero: false, hasMedia: false});
  }, [set]);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) return null;
  const pc = vp.w >= 640;
  const DW = pc ? 1280 : 390;
  const DH = pc ? 720 : 800;
  const scale = vp.w ? Math.max(vp.w / DW, vp.h / DH) : 1;
  const cur = slides[i % slides.length];

  return (
    <section
      className="relative h-[100svh] w-full overflow-hidden bg-ink"
      onTouchStart={(e) => (sx.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - sx.current;
        if (Math.abs(dx) > 50) setI((x) => (x + (dx < 0 ? 1 : slides.length - 1)) % slides.length);
      }}
    >
      <div style={{position: 'absolute', top: '50%', left: '50%', width: DW, height: DH, transform: `translate(-50%, -50%) scale(${scale})`}}>
        <HeroStage key={i} slide={cur} events={events} pc={pc} animKey={i} />
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Diapositiva ${k + 1}`} className="h-2 rounded-full transition-all" style={{width: k === i ? 26 : 9, background: k === i ? '#e9ae74' : 'rgba(255,255,255,.4)'}} />
          ))}
        </div>
      )}
    </section>
  );
}
