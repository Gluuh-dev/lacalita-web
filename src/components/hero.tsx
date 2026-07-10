'use client';

import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ChevronUp, X, ArrowRight, Play, Pause} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {useHeaderMode} from './header-mode';
import {inkOn, type HeroEvent} from '@/lib/hero';
import {useScrollLock} from '@/lib/use-scroll-lock';
import type {HeroSlide} from '@/lib/hero-types';

const FONT: Record<string, string> = {
  romance: "'Modern Romance', serif",
  eight: "'Eight One', sans-serif",
  display: 'var(--font-playfair), serif',
  adam: "'Adam', sans-serif",
  sans: 'var(--font-geist), sans-serif',
  // Tipografías de marca del cliente
  tosca: "'Tosca Zero', serif",
  alfa: 'var(--font-alfa), serif',
  vibes: 'var(--font-vibes), cursive',
  kaushan: 'var(--font-kaushan), cursive',
  cinzel: 'var(--font-cinzel), serif',
  montserrat: 'var(--font-montserrat), sans-serif'
};

// Líneas del rótulo: autorrelleno con el próximo evento, manual, o legado (rotulo/sub).
function getRotuloLines(slide: HeroSlide, events: HeroEvent[]): {text: string; color: string; font: string}[] {
  const ls = slide.rotuloLines ?? [];
  if (slide.rotuloAuto && events[0]) {
    const e = events[0];
    const out = [
      {text: e.title, color: ls[0]?.color ?? slide.color ?? '#e9ae74', font: ls[0]?.font ?? slide.font ?? 'romance'},
      {text: `${e.day} ${e.month} · ${e.time}`, color: ls[1]?.color ?? '#ffffff', font: ls[1]?.font ?? 'eight'}
    ];
    if (e.artist) out.push({text: `con ${e.artist}`, color: ls[2]?.color ?? 'rgba(255,255,255,.8)', font: ls[2]?.font ?? 'sans'});
    return out;
  }
  const manual = ls.filter((l) => l.text?.trim());
  if (manual.length) return manual;
  const legacy: {text: string; color: string; font: string}[] = [];
  if (slide.rotulo) legacy.push({text: slide.rotulo, color: slide.color ?? '#e9ae74', font: slide.font ?? 'romance'});
  if (slide.sub) legacy.push({text: slide.sub, color: '#ffffff', font: 'eight'});
  return legacy;
}
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

function EvRow({e, on, onClick, light = false}: {e: HeroEvent; on: boolean; onClick: () => void; light?: boolean}) {
  const txt = light ? '#2a1713' : '#fff';
  const sub = light ? 'rgba(42,23,19,.6)' : 'rgba(255,255,255,.62)';
  const idleBg = light ? 'rgba(42,23,19,.07)' : 'rgba(255,255,255,.08)';
  const idleArrow = light ? 'rgba(42,23,19,.4)' : 'rgba(255,255,255,.4)';
  return (
    <div onClick={onClick} style={{display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', background: on ? 'rgba(233,174,116,.16)' : 'transparent', borderRadius: 14, padding: 9}}>
      <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 44, padding: '5px 0', borderRadius: 8, background: on ? '#e9ae74' : idleBg, color: on ? '#3a2606' : txt, lineHeight: 1}}>
        <span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 17}}>{e.day}</span>
        <span style={{fontFamily: "'Adam',serif", fontSize: 9, letterSpacing: '0.1em', marginTop: 2}}>{e.month}</span>
      </span>
      <span style={{flex: 1, minWidth: 0}}>
        <span style={{display: 'block', fontFamily: FONT.display, fontWeight: 600, fontSize: 15, color: txt, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{e.title}</span>
        <span style={{display: 'block', fontSize: 12, color: sub}}>{e.artist}{e.artist && ' · '}{e.time}</span>
      </span>
      <ArrowRight className="size-4 shrink-0" style={{color: on ? '#e9ae74' : idleArrow}} />
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
      <div style={{marginTop: 12, textAlign: 'center', fontFamily: "'Adam',serif", textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: 11, color: 'rgba(255,255,255,.75)'}}>Ver todos los eventos →</div>
    </aside>
  );
}

// Modo 'poster': cartel de evento. Fondo (slide.media) + palmeras SVG + logo +
// textos del evento + foto del artista. Se dimensiona con container queries
// (cqw) para escalar igual en la web y en el preview escalado del admin.
function PosterView({slide}: {slide: HeroSlide}) {
  const BROWN = '#4c2f08';
  const TERRA = '#a2502b';
  const SUN = '#c0683d';
  const logoSrc = logoOf(slide);
  const rawLogo = slide.logoColor || 'white';
  const logoCol =
    rawLogo === 'white' || rawLogo === '#ffffff' ? BROWN : LOGO_NAMED[rawLogo] ?? rawLogo;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', containerType: 'size', background: '#f9e4c6', color: BROWN}}>
      {slide.media ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={slide.media} alt="" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
      ) : null}
      {slide.darken ? <div style={{position: 'absolute', inset: 0, background: '#140f08', opacity: (slide.darken || 0) / 100}} /> : null}
      {/* Palmeras como sombras suaves a los lados */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/palmeras/palmera-05.svg" alt="" style={{position: 'absolute', left: '-5%', bottom: '-8%', height: '92cqh', zIndex: 1, opacity: 0.12, filter: 'blur(0.5px)'}} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/palmeras/palmera-03.svg" alt="" style={{position: 'absolute', right: '-6%', bottom: '-10%', height: '96cqh', zIndex: 1, opacity: 0.12, transform: 'scaleX(-1)', filter: 'blur(0.5px)'}} />
      <div style={{position: 'absolute', inset: 0, zIndex: 4, display: 'grid', gridTemplateColumns: '1fr 40%', alignItems: 'center', padding: '0 5cqw', boxSizing: 'border-box'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0}}>
          {logoSrc && (
            <span
              style={{
                display: 'block', height: '5cqw', width: `${5 * (LOGO_ASPECT[slide.logoVariant ?? 'debajo'] ?? 1)}cqw`,
                marginBottom: '1cqw', backgroundColor: logoCol,
                WebkitMaskImage: `url(${logoSrc})`, maskImage: `url(${logoSrc})`,
                WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain', maskSize: 'contain',
                WebkitMaskPosition: 'left center', maskPosition: 'left center'
              }}
            />
          )}
          {slide.eyebrow ? <div style={{fontFamily: FONT.adam, textTransform: 'uppercase', letterSpacing: '0.4em', color: TERRA, fontSize: '1.15cqw', marginTop: '1.4cqw'}}>{slide.eyebrow}</div> : null}
          {slide.posterTitle ? <div style={{fontFamily: FONT.eight, textTransform: 'uppercase', color: BROWN, lineHeight: 0.84, fontSize: '7cqw', marginTop: '0.5cqw'}}>{slide.posterTitle}</div> : null}
          {slide.posterScript ? <div style={{fontFamily: FONT.romance, color: SUN, fontSize: '4cqw', lineHeight: 1, marginTop: '0.2cqw'}}>{slide.posterScript}</div> : null}
          {slide.posterName ? <div style={{fontFamily: FONT.romance, color: BROWN, fontSize: '4.4cqw', lineHeight: 0.9, marginTop: '1.6cqw', textShadow: '0 2px 10px rgba(251,243,228,.6)'}}>{slide.posterName}</div> : null}
          {slide.posterDate || slide.posterTime ? (
            <div style={{display: 'flex', border: '0.14cqw solid rgba(74,47,8,.55)', borderRadius: '1cqw', overflow: 'hidden', marginTop: '1.6cqw', background: 'rgba(251,243,228,.4)'}}>
              {slide.posterDate ? <div style={{padding: '0.7cqw 1.3cqw', fontFamily: FONT.eight, color: BROWN, fontSize: '1.5cqw'}}>{slide.posterDate}</div> : null}
              {slide.posterTime ? <div style={{padding: '0.7cqw 1.3cqw', fontFamily: FONT.eight, color: BROWN, fontSize: '1.5cqw', borderLeft: '0.14cqw solid rgba(74,47,8,.4)'}}>{slide.posterTime}</div> : null}
            </div>
          ) : null}
          {slide.posterLoc ? <div style={{fontFamily: FONT.adam, textTransform: 'uppercase', letterSpacing: '0.2em', color: BROWN, fontSize: '1cqw', marginTop: '1.6cqw'}}>◆ {slide.posterLoc}</div> : null}
        </div>
        <div style={{position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 3}}>
          {slide.posterPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slide.posterPhoto} alt={slide.posterName || ''} style={{maxWidth: '100%', maxHeight: '92%', objectFit: 'contain', objectPosition: 'bottom center'}} />
          ) : (
            <div style={{width: '80%', height: '86%', alignSelf: 'flex-end', border: '0.2cqw dashed rgba(74,47,8,.45)', borderRadius: '50% 50% 44% 44%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.adam, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(58,36,8,.55)', fontSize: '1.1cqw', textAlign: 'center', lineHeight: 1.5}}>Foto del<br />artista</div>
          )}
        </div>
      </div>
    </div>
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
  if (slide.heroMode === 'poster') return <PosterView slide={slide} />;
  // Igual que en la web: en PC el cartel completo sobre su desenfoque; en móvil
  // llena la pantalla (recorta arriba/abajo).
  if (slide.mediaFit === 'contain' && slide.media) {
    return (
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#243b53'}}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.media} alt="" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(24px)', transform: 'scale(1.25)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,.30)'}} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.media}
          alt=""
          style={
            pc
              ? {position: 'relative', zIndex: 10, maxHeight: '92%', maxWidth: '92%', objectFit: 'contain', borderRadius: 16, boxShadow: '0 20px 50px rgba(0,0,0,.5)'}
              : {position: 'relative', zIndex: 10, maxHeight: '84%', maxWidth: '96%', objectFit: 'contain', borderRadius: 12, boxShadow: '0 20px 50px rgba(0,0,0,.5)'}
          }
        />
      </div>
    );
  }
  const bc = slide.btnColor || '#e9ae74';
  const bt = inkOn(bc);
  const agenda = slide.heroMode === 'agenda';
  const animCls = slide.anim === 'slide' ? 'lc-hero-slide' : slide.anim === 'none' ? '' : 'lc-hero-fade';
  const logoSrc = logoOf(slide);
  const logoVariant = slide.logoVariant ?? (slide.showLogo ? 'debajo' : 'none');
  const align = slide.contentAlign ?? 'left';
  const ai = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  const ta = (align === 'center' ? 'center' : align === 'right' ? 'right' : 'left') as 'center' | 'right' | 'left';

  const rLines = slide.heroMode === 'rotulo' ? getRotuloLines(slide, events) : [];
  const rotuloDesktop = rLines.length > 0 && pc;
  const rotuloMobile = rLines.length > 0 && !pc;

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#243b53'}}>
      {/* fondo */}
      {slide.mediaType === 'video' && slide.media ? (
        <video src={slide.media} poster={slide.poster} autoPlay muted loop playsInline preload="metadata" style={cover} />
      ) : slide.media ? (
        <div style={{...cover, background: `center/cover url(${slide.media})`}} />
      ) : (
        <div style={{...cover, background: 'radial-gradient(130% 115% at 78% 12%, #ffe6c2 0%, #f6bd82 22%, #e0955a 44%, #b96e42 64%, #5e3620 100%)'}} />
      )}
      {slide.tint && (slide.tintOpacity ?? 0) > 0 ? (
        <div style={{...cover, background: slide.tint, opacity: (slide.tintOpacity ?? 0) / 100}} />
      ) : null}
      <div style={{...cover, background: 'linear-gradient(to bottom, rgba(20,15,8,.3) 0%, rgba(20,15,8,.1) 40%, rgba(20,15,8,.55) 100%)'}} />
      <div style={{...cover, background: '#140f08', opacity: (slide.darken || 0) / 100}} />
      <div style={{position: 'absolute', top: '-14%', right: '-6%', width: pc ? 560 : 280, height: pc ? 560 : 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,174,116,.5), transparent 65%)'}} />

      {/* Palmeras negras en las 4 esquinas */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/palmeras/palm-sup-iz.svg" alt="" style={{position: 'absolute', left: 0, top: 0, width: pc ? 190 : 92, opacity: 0.45, zIndex: 1}} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/palmeras/palm-sup-der.svg" alt="" style={{position: 'absolute', right: 0, top: 0, width: pc ? 190 : 92, opacity: 0.45, zIndex: 1}} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/palmeras/palm-inf-iz.svg" alt="" style={{position: 'absolute', left: 0, bottom: 0, width: pc ? 190 : 92, opacity: 0.45, zIndex: 1}} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/palmeras/palm-inf-der.svg" alt="" style={{position: 'absolute', right: 0, bottom: 0, width: pc ? 190 : 92, opacity: 0.45, zIndex: 1}} />

      <Marquee slide={slide} pc={pc} />

      {/* contenido */}
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', zIndex: 3}}>
        <div style={{width: pc ? 1180 : '100%', margin: '0 auto', padding: pc ? '0 40px' : '0 24px', boxSizing: 'border-box', display: pc && agenda && events.length > 0 ? 'grid' : 'flex', gridTemplateColumns: pc && agenda && events.length > 0 ? 'minmax(0,1fr) 340px' : undefined, gap: 48, alignItems: 'center'}}>
          <div key={animKey} className={animCls} style={{display: 'flex', flexDirection: 'column', alignItems: pc ? ai : 'center', textAlign: pc ? ta : 'center', maxWidth: pc ? 660 : '100%', margin: pc ? (align === 'center' ? '0 auto' : 0) : '0 auto', color: '#fff'}}>
            {logoSrc &&
              (() => {
                const h =
                  logoVariant === 'debajo' ? (pc ? 112 : 80)
                  : logoVariant === 'solo' ? (pc ? 80 : 64)
                  : logoVariant === 'texto' ? (pc ? 40 : 32)
                  : (pc ? 56 : 44); // derecha
                return (
                  <span
                    style={{
                      display: 'block',
                      height: h,
                      width: h * (LOGO_ASPECT[logoVariant] ?? 1),
                      marginBottom: pc ? 22 : 18,
                      backgroundColor: logoColorOf(slide),
                      WebkitMaskImage: `url(${logoSrc})`,
                      maskImage: `url(${logoSrc})`,
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center'
                    }}
                  />
                );
              })()}
            {slide.eyebrow && <div style={{fontFamily: FONT[slide.eyebrowFont ?? 'adam'], textTransform: 'uppercase', letterSpacing: '0.22em', fontSize: (pc ? 14 : 12) * (slide.eyebrowScale ?? 1), color: slide.eyebrowColor || 'var(--brand)', marginBottom: 16}}>{slide.eyebrow}</div>}
            {slide.lema && <div style={{fontFamily: FONT[slide.lemaFont ?? 'display'], fontWeight: 800, fontSize: (pc ? 54 : 32) * (slide.lemaScale ?? 1), lineHeight: 1.05, marginBottom: 20, textWrap: 'balance', color: slide.lemaColor || '#fff'}}>{slide.lema}</div>}
            {slide.bienvenida && <div style={{fontFamily: FONT[slide.bienvenidaFont ?? 'sans'], fontSize: (pc ? 18 : 16) * (slide.bienvenidaScale ?? 1), color: slide.bienvenidaColor || 'rgba(255,255,255,.86)', maxWidth: 440, marginBottom: 28, lineHeight: 1.5}}>{slide.bienvenida}</div>}
            {slide.button && <HeroButton slide={slide} bc={bc} bt={bt} pc={pc} preview={preview} />}

            {rotuloMobile && (
              <div style={{marginTop: 34, textAlign: 'center'}}>
                {rLines.map((l, i) => (
                  <div key={i} style={{fontFamily: FONT[l.font] || FONT.romance, fontSize: i === 0 ? 40 : 18, lineHeight: 1.1, color: l.color, marginTop: i ? 6 : 0}}>{l.text}</div>
                ))}
                {slide.eventBtn && <a href={slide.eventBtnLink || '/eventos'} style={{display: 'inline-block', marginTop: 14, background: bc, color: bt, borderRadius: 999, padding: '12px 24px', fontWeight: 700, fontSize: 15}}>{slide.eventBtnText}</a>}
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
          {rLines.map((l, i) => (
            <div key={i} style={{fontFamily: FONT[l.font] || FONT.romance, fontSize: i === 0 ? 56 : 22, lineHeight: 1.1, color: l.color, marginTop: i ? 8 : 0}}>{l.text}</div>
          ))}
          {slide.eventBtn && <a href={slide.eventBtnLink || '/eventos'} style={{display: 'inline-block', marginTop: 14, background: bc, color: bt, borderRadius: 999, padding: '12px 24px', fontWeight: 700, fontSize: 15}}>{slide.eventBtnText}</a>}
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
  const DW = pc ? 1920 : 390;
  const DH = pc ? 1080 : 800;
  const scale = w ? w / DW : 0.3;
  return (
    <div ref={ref} style={{width: '100%', height: DH * scale, position: 'relative', overflow: 'hidden', borderRadius: 'var(--r-md)'}}>
      <div style={{position: 'absolute', top: 0, left: 0, width: DW, height: DH, transform: `scale(${scale})`, transformOrigin: 'top left'}}>
        <HeroStage slide={slide} events={events} pc={pc} animKey={animKey} preview />
      </div>
    </div>
  );
}

const LOGO_NAMED: Record<string, string> = {
  white: '#ffffff',
  cream: '#faf6ef',
  brown: '#4c2f08',
  ink: '#243b53',
  orange: '#f26b21'
};
const LOGO_ASPECT: Record<string, number> = {solo: 1.15, debajo: 0.95, derecha: 3.1, texto: 4.4};
function logoColorOf(slide: HeroSlide): string {
  const c = slide.logoColor || '#ffffff';
  return LOGO_NAMED[c] ?? c;
}
const LOGO_SRC: Record<string, string> = {
  solo: '/brand/logo-solo.svg',
  debajo: '/brand/logo-texto-debajo.svg',
  derecha: '/brand/logo-texto-derecha.svg',
  texto: '/brand/texto-lacalita-derecha.svg'
};
// altura responsive por variante (debajo es alto, derecha/solo/texto más bajos)
const LOGO_H: Record<string, string> = {
  solo: 'h-16 sm:h-20',
  debajo: 'h-20 sm:h-24 lg:h-28',
  derecha: 'h-11 sm:h-14',
  texto: 'h-8 sm:h-10'
};
function logoOf(slide: HeroSlide): string | null {
  const v = slide.logoVariant ?? (slide.showLogo ? 'debajo' : 'none');
  return v === 'none' ? null : LOGO_SRC[v] ?? null;
}

/** Vista responsive de una diapositiva (lo que se ve en la web). */
function HeroView({slide, events}: {slide: HeroSlide; events: HeroEvent[]}) {
  const [active, setActive] = useState(0);
  const [sheet, setSheet] = useState(false);
  const [drag, setDrag] = useState(0);
  const dragY = useRef<number | null>(null);

  const agenda = slide.heroMode === 'agenda';
  const evs = events.slice(0, 4);
  const hasEvents = evs.length > 0;
  const feat = evs[active] || evs[0];
  const bc = slide.btnColor || '#e9ae74';
  const bt = inkOn(bc);
  const logoSrc = logoOf(slide);
  const align = slide.contentAlign ?? 'left';
  const colAlign = align === 'center' ? 'lg:items-center lg:text-center' : align === 'right' ? 'lg:items-end lg:text-right' : 'lg:items-start lg:text-left';
  const btnAlign = align === 'center' ? 'lg:justify-center' : align === 'right' ? 'lg:justify-end' : 'lg:justify-start';
  const rLines = slide.heroMode === 'rotulo' ? getRotuloLines(slide, events) : [];

  useEffect(() => {
    if (!agenda || evs.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % evs.length), 4200);
    return () => clearInterval(t);
  }, [agenda, evs.length]);
  useEffect(() => {
    if (sheet) setDrag(0);
  }, [sheet]);
  useScrollLock(sheet);

  if (slide.heroMode === 'poster') return <PosterView slide={slide} />;

  // Cartel vertical completo: imagen a tamaño real (contain) sobre una copia
  // de sí misma ampliada y difuminada de fondo. Todo el slide enlaza al evento.
  if (slide.mediaFit === 'contain' && slide.media) {
    // El cartel se ve SIEMPRE entero (contain): recortarlo se comía el título,
    // la fecha o los laterales. Se agranda hasta donde quepa, dejando abajo el
    // hueco justo para el paginador y el botón de eventos.
    const Poster = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={slide.media}
        alt=""
        className="max-h-full max-w-full rounded-xl object-contain shadow-2xl lg:rounded-2xl"
      />
    );
    const wrapCls = 'absolute inset-0 z-10 flex items-center justify-center p-3 pb-24 lg:p-10';
    return (
      <div className="relative h-full w-full overflow-hidden bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.media} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl" />
        <div className="absolute inset-0 bg-black/30" />
        {slide.link ? (
          <Link href={slide.link} className={wrapCls}>
            {Poster}
          </Link>
        ) : (
          <div className={wrapCls}>{Poster}</div>
        )}
      </div>
    );
  }

  const showAgenda = agenda && hasEvents;

  return (
    <div className="relative flex h-full w-full items-center overflow-hidden pb-28 lg:pb-0">
      {/* fondo */}
      {slide.mediaType === 'video' && slide.media ? (
        <video src={slide.media} poster={slide.poster} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
      ) : slide.media ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={slide.media} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        // Sin media: atardecer de playa (marca), no el azul marino de relleno.
        <div className="absolute inset-0" style={{background: 'radial-gradient(130% 115% at 78% 12%, #ffe6c2 0%, #f6bd82 22%, #e0955a 44%, #b96e42 64%, #5e3620 100%)'}} />
      )}
      {/* Capa de color: tiñe el fondo dejando que la foto aporte la textura. */}
      {slide.tint && (slide.tintOpacity ?? 0) > 0 ? (
        <div className="absolute inset-0" style={{background: slide.tint, opacity: (slide.tintOpacity ?? 0) / 100}} />
      ) : null}
      <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(20,15,8,.32) 0%, rgba(20,15,8,.12) 40%, rgba(20,15,8,.55) 100%)'}} />
      <div className="absolute inset-0 bg-[#140f08]" style={{opacity: (slide.darken || 0) / 100}} />
      <div className="pointer-events-none absolute -right-20 -top-24 size-[clamp(220px,40vw,520px)] rounded-full" style={{background: 'radial-gradient(circle, rgba(233,174,116,.45), transparent 65%)'}} />

      {/* Palmeras negras (siluetas) en las 4 esquinas, 45% */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/palmeras/palm-sup-iz.svg" alt="" className="absolute left-0 top-0 w-[clamp(88px,13vw,200px)] opacity-45" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/palmeras/palm-sup-der.svg" alt="" className="absolute right-0 top-0 w-[clamp(88px,13vw,200px)] opacity-45" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/palmeras/palm-inf-iz.svg" alt="" className="absolute bottom-0 left-0 w-[clamp(88px,13vw,200px)] opacity-45" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/palmeras/palm-inf-der.svg" alt="" className="absolute bottom-0 right-0 w-[clamp(88px,13vw,200px)] opacity-45" />
      </div>

      <Marquee slide={slide} pc />

      {/* contenido */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <div className={`grid items-center gap-8 ${showAgenda ? 'lg:grid-cols-[minmax(0,1fr)_360px]' : ''}`}>
          <div className={`flex flex-col items-center text-center text-white ${colAlign}`}>
            {logoSrc && (
              <span
                aria-label="La Calita"
                role="img"
                className={`mb-5 block ${LOGO_H[slide.logoVariant ?? 'debajo'] ?? LOGO_H.debajo}`}
                style={{
                  aspectRatio: String(LOGO_ASPECT[slide.logoVariant ?? 'debajo'] ?? 1),
                  backgroundColor: logoColorOf(slide),
                  WebkitMaskImage: `url(${logoSrc})`,
                  maskImage: `url(${logoSrc})`,
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center'
                }}
              />
            )}
            {slide.eyebrow && (
              <div className="mb-3 uppercase tracking-[0.22em]" style={{fontFamily: FONT[slide.eyebrowFont ?? 'adam'], color: slide.eyebrowColor || 'var(--brand)', fontSize: `calc(0.8rem * ${slide.eyebrowScale ?? 1})`}}>{slide.eyebrow}</div>
            )}
            {slide.lema && (
              <h1 className="font-extrabold leading-[1.05]" style={{fontFamily: FONT[slide.lemaFont ?? 'display'], color: slide.lemaColor || '#fff', textWrap: 'balance', fontSize: `calc(clamp(2rem, 5.2vw, 3.4rem) * ${slide.lemaScale ?? 1})`}}>{slide.lema}</h1>
            )}
            {slide.bienvenida && (
              <p className="mt-4 max-w-md leading-relaxed" style={{fontFamily: FONT[slide.bienvenidaFont ?? 'sans'], color: slide.bienvenidaColor || 'rgba(255,255,255,.86)', fontSize: `calc(1rem * ${slide.bienvenidaScale ?? 1})`}}>{slide.bienvenida}</p>
            )}
            <div className={`mt-7 flex flex-wrap items-center justify-center gap-3 ${btnAlign}`}>
              {slide.button &&
                (slide.link?.startsWith('/') ? (
                  <Link href={slide.link} className="inline-flex items-center rounded-full border border-transparent px-6 py-3 font-semibold shadow-sm transition hover:brightness-105" style={{background: bc, color: bt}}>
                    {slide.button}
                  </Link>
                ) : (
                  <a href={slide.link || '#'} className="inline-flex items-center rounded-full border border-transparent px-6 py-3 font-semibold shadow-sm transition hover:brightness-105" style={{background: bc, color: bt}}>
                    {slide.button}
                  </a>
                ))}
              <a href="#info" className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                Cómo llegar
              </a>
            </div>

            {rLines.length > 0 && (
              <div className="mt-8 text-center lg:hidden">
                {rLines.map((l, i) => (
                  <div key={i} style={{fontFamily: FONT[l.font] || FONT.romance, color: l.color, fontSize: i === 0 ? 'clamp(1.8rem, 7vw, 2.4rem)' : '1.05rem', lineHeight: 1.12, marginTop: i ? 4 : 0}}>{l.text}</div>
                ))}
                {slide.eventBtn && (
                  <a href={slide.eventBtnLink || '/eventos'} className="mt-3 inline-block rounded-full px-5 py-2.5 text-sm font-semibold" style={{background: bc, color: bt}}>{slide.eventBtnText}</a>
                )}
              </div>
            )}
          </div>

          {/* agenda escritorio */}
          {showAgenda && (
            <aside className="hidden rounded-[24px] border border-white/15 bg-black/35 p-5 text-white backdrop-blur-md lg:block">
              <div className="mb-4 flex items-center gap-2">
                <span className="size-2 rounded-full bg-brand" />
                <span className="font-adam text-[0.7rem] uppercase tracking-[0.2em] text-white/80">Próximos eventos</span>
              </div>
              <Link href="/eventos" className="mb-3 flex h-[8.5rem] flex-col justify-center border-b border-white/15 pb-4">
                <div className="line-clamp-2 text-[1.9rem] leading-tight" style={{color: slide.color, fontFamily: FONT[slide.font] || FONT.romance}}>{feat?.title}</div>
                <div className="mt-1.5 text-base" style={{fontFamily: FONT.eight}}>{feat?.day} {feat?.month} · {feat?.time}</div>
                <div className="mt-1 min-h-[1.25rem] text-sm text-white/70">{feat?.artist ? `con ${feat.artist}` : ''}</div>
              </Link>
              <ul className="flex flex-col">
                {evs.map((e, idx) => (
                  <li key={e.id} onMouseEnter={() => setActive(idx)}>
                    <EvRow e={e} on={idx === active} onClick={() => {}} />
                  </li>
                ))}
              </ul>
              <Link href="/eventos" className="mt-3 flex items-center justify-center gap-1.5 font-adam text-[0.7rem] uppercase tracking-[0.12em] text-white/75 hover:text-white">
                Ver todos los eventos <ArrowRight className="size-3.5" />
              </Link>
            </aside>
          )}
        </div>
      </div>

      {/* rótulo de evento posicionado (escritorio) */}
      {rLines.length > 0 && (
        <div className="absolute right-10 hidden max-w-md text-right lg:block" style={{top: `${slide.rotuloY ?? 68}%`, transform: 'translateY(-50%)'}}>
          {rLines.map((l, i) => (
            <div key={i} style={{fontFamily: FONT[l.font] || FONT.romance, color: l.color, fontSize: i === 0 ? 'clamp(2rem, 3vw, 3rem)' : '1.3rem', lineHeight: 1.12, marginTop: i ? 6 : 0}}>{l.text}</div>
          ))}
          {slide.eventBtn && (
            <a href={slide.eventBtnLink || '/eventos'} className="mt-3 inline-block rounded-full px-6 py-3 font-semibold" style={{background: bc, color: bt}}>{slide.eventBtnText}</a>
          )}
        </div>
      )}

      {/* móvil: botón + bottom-sheet de eventos */}
      {hasEvents && (
        <>
          <button
            onClick={() => setSheet(true)}
            className="absolute inset-x-4 bottom-[5.5rem] z-20 flex items-center justify-between gap-3 rounded-full border border-white/20 bg-black/45 px-4 py-3 text-white backdrop-blur lg:hidden"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="size-2 shrink-0 rounded-full bg-brand" />
              <span className="min-w-0 text-left">
                <span className="block font-adam text-[0.58rem] uppercase tracking-[0.16em] text-white/70">Próximos eventos</span>
                <span className="block truncate text-sm font-medium">{feat?.title} · {feat?.day} {feat?.month}</span>
              </span>
            </span>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-on-primary"><ChevronUp className="size-4" /></span>
          </button>

          <div className={`fixed inset-0 z-[200] lg:hidden ${sheet ? '' : 'hidden'}`}>
            <div onClick={() => setSheet(false)} className={`absolute inset-x-0 bottom-0 top-14 bg-black/50 transition-opacity duration-300 ${sheet ? 'opacity-100' : 'opacity-0'}`} />
            <div
              className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-[26px] bg-bg p-4 pb-8 text-ink shadow-2xl"
              style={{transform: sheet ? `translateY(${drag}px)` : 'translateY(100%)', transition: drag ? 'none' : 'transform .34s cubic-bezier(0.16,1,0.3,1)'}}
              onTouchStart={(e) => (dragY.current = e.touches[0].clientY)}
              onTouchMove={(e) => {
                if (dragY.current != null) {
                  const d = e.touches[0].clientY - dragY.current;
                  if (d > 0) setDrag(d);
                }
              }}
              onTouchEnd={() => {
                if (drag > 110) setSheet(false);
                setDrag(0);
                dragY.current = null;
              }}
            >
              <div onClick={() => setSheet(false)} className="mx-auto mb-3 h-1.5 w-11 cursor-pointer rounded-full bg-ink/20" />
              <div className="mb-3 flex items-center justify-between">
                <span className="font-serif text-xl">Próximos eventos</span>
                <button onClick={() => setSheet(false)} aria-label="Cerrar" className="rounded-full bg-ink/10 p-1.5"><X className="size-5" /></button>
              </div>
              <ul className="flex flex-col">
                {evs.map((e) => (
                  <li key={e.id}>
                    <EvRow e={e} on={false} onClick={() => setSheet(false)} light />
                  </li>
                ))}
              </ul>
              <Link href="/eventos" className="mt-4 block rounded-full bg-brand py-2.5 text-center text-sm font-semibold text-on-primary">Ver todos los eventos</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Hero público: carrusel responsive a pantalla completa. */
// Duración de cada diapositiva en automático (igual que el hero de burger).
const SLIDE_MS = 6000;

export default function Hero({slides, events}: {slides: HeroSlide[]; events: HeroEvent[]}) {
  const {set} = useHeaderMode();
  const [i, setI] = useState(0);
  // Arranca en automático. Pon `false` si quieres que espere a que pulsen Play.
  const [playing, setPlaying] = useState(true);
  const sx = useRef(0);
  const stepTimer = useRef<number | null>(null);
  const n = slides.length;

  useEffect(() => {
    set({overHero: true, hasMedia: true});
    return () => set({overHero: false, hasMedia: false});
  }, [set]);
  // Un temporizador por diapositiva: se reinicia en cada cambio (automático o
  // manual), así la barra de progreso va sincronizada con el avance real.
  useEffect(() => {
    if (!playing || n <= 1) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), SLIDE_MS);
    return () => clearTimeout(t);
  }, [playing, n, i]);
  useEffect(() => () => {
    if (stepTimer.current) window.clearInterval(stepTimer.current);
  }, []);

  // Al pulsar un punto, recorre las diapositivas intermedias en vez de saltar.
  const goTo = (target: number) => {
    if (target === i || target < 0 || target >= n) return;
    if (stepTimer.current) {
      window.clearInterval(stepTimer.current);
      stepTimer.current = null;
    }
    const dir = target > i ? 1 : -1;
    // Primer paso inmediato: setInterval no dispara hasta pasado el intervalo,
    // y eso hacía que la pulsación tardara 240ms en notarse.
    setI(i + dir);
    if (i + dir === target) return;
    stepTimer.current = window.setInterval(() => {
      setI((x) => {
        const nx = x + dir;
        if (nx === target && stepTimer.current) {
          window.clearInterval(stepTimer.current);
          stepTimer.current = null;
        }
        return nx;
      });
    }, 240);
  };

  if (!n) return null;
  const cur = slides[i % n];

  return (
    <section
      className="relative h-[100svh] w-full overflow-hidden bg-ink"
      onTouchStart={(e) => (sx.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - sx.current;
        if (Math.abs(dx) > 50) setI((x) => (x + (dx < 0 ? 1 : n - 1)) % n);
      }}
    >
      <HeroView key={i} slide={cur} events={events} />
      {n > 1 && (
        <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-2.5 lg:bottom-8">
          <div className="flex h-10 items-center gap-2 rounded-full bg-black/30 px-4 backdrop-blur">
            {slides.map((_, k) => {
              const active = k === i;
              return (
                // -m-2/p-2 agranda el área pulsable sin cambiar el tamaño visible.
                <button
                  key={k}
                  type="button"
                  onClick={() => goTo(k)}
                  aria-label={`Diapositiva ${k + 1}`}
                  className="group -m-2 p-2"
                >
                  <span
                    className="relative block h-[7px] overflow-hidden rounded-full transition-all duration-300 group-hover:brightness-150 group-active:scale-90"
                    style={{width: active ? 24 : 7, background: active ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.4)'}}
                  >
                    {active && (
                      <span
                        key={`${i}-${playing}`}
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={playing ? {background: '#e9ae74', animation: `lc-prog ${SLIDE_MS}ms linear forwards`} : {background: '#e9ae74', width: '100%'}}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pausar' : 'Reproducir'}
            title={playing ? 'Pausar' : 'Reproducir'}
            className="flex size-10 items-center justify-center rounded-full bg-black/30 text-white ring-1 ring-white/10 backdrop-blur transition hover:scale-105 hover:bg-black/50 hover:ring-white/30 active:scale-95"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
          </button>
        </div>
      )}
    </section>
  );
}
