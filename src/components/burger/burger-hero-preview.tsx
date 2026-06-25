'use client';

import {useEffect, useRef, useState} from 'react';
import {Monitor, Smartphone, RotateCcw, UtensilsCrossed} from 'lucide-react';
import {Sparks, Smoke, titleColorStyle, BurgerAura} from './burger-fx';

const GOLD = '#d67a63'; // terracota (acento)
const RED = '#c94a3c'; // rojo principal
const FONT_CSS: Record<string, string> = {
  eight: "'Eight One', sans-serif",
  display: 'var(--font-playfair), serif',
  modern: "'Modern Romance', serif",
  adam: "'Adam', sans-serif",
  sans: 'var(--font-geist), sans-serif'
};

export type PreviewCfg = {
  image: string | null;
  name: string;
  eyebrow: string;
  price: string;
  font: string;
  color: string;
  behind: boolean;
  bgEffect: string;
  bgImage: string | null;
  titleScale: number;
  eyebrowScale: number;
  priceScale: number;
  showRings: boolean;
  overlayFx: string;
  gradient: string;
  fxSparks: boolean;
  fxSmoke: boolean;
  priceFont: string;
  priceColor: string;
  priceGradient: string;
  titleY: number;
  priceY: number;
  fxVideo: string;
  fxVideoBehind: boolean;
  fxVideoX: number;
  fxVideoY: number;
  fxVideoScale: number;
  bgColor: string;
};

function Bg({c}: {c: PreviewCfg}) {
  return (
    <>
      {c.showRings && <div className="pointer-events-none absolute right-0 top-0 h-[88%] w-[70%]" style={{backgroundImage: 'repeating-radial-gradient(circle at 100% 0%, transparent 0 26px, rgba(214,122,99,.20) 26px 28px)', WebkitMaskImage: 'radial-gradient(circle at 100% 0%, #000 0%, transparent 55%)', maskImage: 'radial-gradient(circle at 100% 0%, #000 0%, transparent 55%)'}} />}
      {c.bgEffect === 'image' && c.bgImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.bgImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{background: 'linear-gradient(90deg, rgba(253,251,247,.8) 0%, rgba(253,251,247,.28) 40%, transparent 68%)'}} />
        </>
      )}
      {c.bgEffect === 'smoke' && <div className="lc-smoke pointer-events-none absolute inset-0" style={{background: 'radial-gradient(45% 55% at 62% 42%, rgba(214,122,99,.16), transparent 70%)', filter: 'blur(8px)'}} />}
      {c.bgEffect === 'embers' && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3" style={{background: 'radial-gradient(60% 80% at 62% 100%, rgba(201,74,60,.2), transparent 68%)'}} />}
    </>
  );
}

function Nav() {
  return (
    <div className="absolute inset-x-0 top-0 z-[6] flex items-center justify-between px-10 py-5 font-adam uppercase tracking-[0.18em]" style={{fontSize: 11, color: 'rgba(42,23,19,.6)'}}>
      <span className="rounded-full" style={{width: 18, height: 18, background: GOLD}} />
      <div className="flex gap-6"><span>Carta</span><span>Ofertas</span><span>Local</span></div>
      <div className="flex gap-4"><span>Admin</span><span>ES</span></div>
    </div>
  );
}

function Burger({c, pc, animKey}: {c: PreviewCfg; pc: boolean; animKey: number}) {
  const eb = (pc ? 15 : 12) * c.eyebrowScale;
  const ts = (pc ? 96 : 46) * c.titleScale;
  const ps = (pc ? 64 : 38) * c.priceScale;
  return (
    <div className="relative flex h-full items-center justify-center">
      <BurgerAura />
      {c.eyebrow && (
        <div key={`e${animKey}`} className="lc-bfade absolute left-0 right-0 z-[3] text-center" style={{top: '7%'}}>
          <span className="inline-flex items-center font-adam uppercase" style={{gap: 8, letterSpacing: '0.28em', fontSize: eb, color: GOLD}}>
            <span style={{width: 24, height: 1, background: GOLD, opacity: 0.6}} />
            {c.eyebrow}
            <span style={{width: 24, height: 1, background: GOLD, opacity: 0.6}} />
          </span>
        </div>
      )}
      <div key={`n${animKey}`} className="lc-bfade absolute left-0 right-0 m-0 px-2 text-center font-extrabold uppercase" style={{top: `${c.titleY}%`, fontFamily: FONT_CSS[c.font] ?? FONT_CSS.eight, ...titleColorStyle(c.color || RED, c.gradient), zIndex: c.behind ? 1 : 3, fontSize: ts, lineHeight: 0.82, textShadow: '0 4px 16px rgba(0,0,0,.1)'}}>
        {c.name || 'Título'}
      </div>
      {c.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={`i${animKey}`} src={c.image} alt="" className="lc-slide-top" style={{height: '88%', maxWidth: '116%', objectFit: 'contain', zIndex: 2, WebkitMaskImage: 'radial-gradient(ellipse 84% 96% at 50% 50%, #000 86%, transparent 100%)', maskImage: 'radial-gradient(ellipse 84% 96% at 50% 50%, #000 86%, transparent 100%)'}} />
      ) : (
        <div className="flex items-center justify-center rounded-3xl border border-dashed text-black/15" style={{height: '60%', aspectRatio: '1', zIndex: 2, borderColor: 'rgba(42,23,19,.18)'}}>
          <UtensilsCrossed style={{width: 64, height: 64}} />
        </div>
      )}
      {c.price && (
        <div key={`p${animKey}`} className="lc-bfade absolute left-0 right-0 z-[4] text-center font-extrabold" style={{bottom: `${c.priceY}%`, fontFamily: FONT_CSS[c.priceFont] ?? FONT_CSS.eight, ...titleColorStyle(c.priceColor || GOLD, c.priceGradient), fontSize: ps, textShadow: '0 4px 14px rgba(0,0,0,.1)'}}>
          {c.price} €
        </div>
      )}
      {c.fxSparks && <Sparks />}
      {c.fxSmoke && <Smoke />}
    </div>
  );
}

function Stage({c, pc, animKey}: {c: PreviewCfg; pc: boolean; animKey: number}) {
  const W = pc ? 1440 : 390;
  const H = pc ? 800 : 780;
  return (
    <div style={{width: W, height: H, position: 'relative', overflow: 'hidden', background: c.bgColor || 'radial-gradient(90% 80% at 72% 42%, #fff4ef 0%, #fdfbf7 70%)'}}>
      <Bg c={c} />
      <Nav />
      {pc ? (
        <div className="absolute inset-0 z-[2] flex items-center">
          <div style={{flex: 1, paddingLeft: 80, paddingRight: 24}}>
            <span style={{display: 'block', height: 56, width: 173, backgroundColor: GOLD, WebkitMaskImage: 'url(/brand/logo-texto-derecha.svg)', maskImage: 'url(/brand/logo-texto-derecha.svg)', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskSize: 'contain', maskSize: 'contain'}} />
            <div className="font-adam uppercase" style={{marginTop: 8, fontSize: 12, letterSpacing: '0.2em', color: GOLD}}>Smash burgers · a pie de playa</div>
            <p style={{marginTop: 18, maxWidth: 360, fontSize: 15, lineHeight: 1.55, color: 'rgba(42,23,19,.65)'}}>Carne fresca, pan brioche y queso fundido, frente al mar. Hechas al momento, sin atajos.</p>
            <div style={{marginTop: 24, display: 'flex', gap: 12}}>
              <span style={{borderRadius: 999, padding: '12px 22px', fontSize: 14, fontWeight: 600, background: RED, color: '#fdfbf7'}}>Ver la carta</span>
              <span style={{borderRadius: 999, padding: '11px 22px', fontSize: 14, fontWeight: 600, border: `1px solid ${RED}`, color: RED}}>Cómo llegar</span>
            </div>
          </div>
          <div style={{flex: 1, position: 'relative', height: '100%'}}>
            <Burger c={c} pc={pc} animKey={animKey} />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-[2] flex flex-col items-center px-5 pt-16 text-center">
          <span style={{display: 'block', height: 52, width: 60, backgroundColor: GOLD, WebkitMaskImage: 'url(/brand/logo-solo.svg)', maskImage: 'url(/brand/logo-solo.svg)', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskSize: 'contain', maskSize: 'contain'}} />
          <div className="font-adam uppercase" style={{marginTop: 6, fontSize: 10, letterSpacing: '0.2em', color: GOLD}}>Smash burgers · a pie de playa</div>
          <p style={{marginTop: 12, maxWidth: 300, fontSize: 13, lineHeight: 1.5, color: 'rgba(42,23,19,.65)'}}>Carne fresca, pan brioche y queso fundido, frente al mar.</p>
          <div style={{marginTop: 14, display: 'flex', gap: 10}}>
            <span style={{borderRadius: 999, padding: '9px 16px', fontSize: 12, fontWeight: 600, background: RED, color: '#fdfbf7'}}>Ver la carta</span>
            <span style={{borderRadius: 999, padding: '8px 16px', fontSize: 12, fontWeight: 600, border: `1px solid ${RED}`, color: RED}}>Cómo llegar</span>
          </div>
          <div style={{position: 'relative', flex: 1, width: '100%', marginTop: 8}}>
            <Burger c={c} pc={pc} animKey={animKey} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function BurgerHeroPreview({cfg}: {cfg: PreviewCfg}) {
  const [device, setDevice] = useState<'pc' | 'mobile'>('pc');
  const [animKey, setAnimKey] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const DW = device === 'pc' ? 1440 : 390;
  const DH = device === 'pc' ? 800 : 780;
  const scale = w ? w / DW : 0.3;

  return (
    <div className="lg:sticky lg:top-20">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-adam text-[0.66rem] uppercase tracking-[0.12em] text-ink-3">Previsualización · así se verá</div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setAnimKey((k) => k + 1)} aria-label="Recargar" className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs text-ink-2 hover:border-brand">
            <RotateCcw className="size-3.5" /> Recargar
          </button>
          <button type="button" onClick={() => setDevice('pc')} aria-label="PC" className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${device === 'pc' ? 'border-brand text-brand-deep' : 'border-line text-ink-2'}`}>
            <Monitor className="size-3.5" /> PC
          </button>
          <button type="button" onClick={() => setDevice('mobile')} aria-label="Móvil" className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${device === 'mobile' ? 'border-brand text-brand-deep' : 'border-line text-ink-2'}`}>
            <Smartphone className="size-3.5" /> Móvil
          </button>
        </div>
      </div>
      <div className={device === 'mobile' ? 'mx-auto w-[280px]' : ''}>
        <div ref={ref} className="overflow-hidden rounded-[18px] border border-line" style={{height: DH * scale}}>
          <div style={{width: DW, height: DH, transform: `scale(${scale})`, transformOrigin: 'top left'}}>
            <Stage c={cfg} pc={device === 'pc'} animKey={animKey} />
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-3">Proporciones reales. Pulsa “Recargar” para ver la animación de entrada.</p>
    </div>
  );
}
