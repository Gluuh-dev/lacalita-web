'use client';

import {motion, useReducedMotion, type MotionProps} from 'framer-motion';
import {cn} from '@/lib/utils';
import type {HeroCaption as Caption} from '@/lib/queries';

const GRID: Record<string, string> = {
  'top-left': 'items-start justify-start text-left',
  top: 'items-start justify-center text-center',
  'top-right': 'items-start justify-end text-right',
  left: 'items-center justify-start text-left',
  center: 'items-center justify-center text-center',
  right: 'items-center justify-end text-right',
  'bottom-left': 'items-end justify-start text-left',
  bottom: 'items-end justify-center text-center',
  'bottom-right': 'items-end justify-end text-right'
};

const TEXT =
  'uppercase font-extrabold tracking-[0.12em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]';

export default function HeroCaption({
  caption,
  variant = 'desktop'
}: {
  caption: Caption;
  variant?: 'desktop' | 'mobile';
}) {
  const reduce = useReducedMotion();
  const dur = Math.max(4, 32 - caption.speed * 2.6);
  const isImg = caption.kind === 'image' && !!caption.src;
  const moving = caption.anim === 'marquee' || caption.anim === 'marquee-y';
  const op = caption.opacity / 100;
  const fontCls = caption.font === 'modern' ? 'font-modern' : caption.font === 'eight' ? 'font-eight' : '';
  const oy = caption.offsetY ?? 0;
  const fs = caption.fontSize ? {fontSize: `${caption.fontSize}px`} : {};

  const item = (key: string | number, extra = '') =>
    isImg ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img key={key} src={caption.src!} alt="" className={cn('w-auto px-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]', extra)} style={{opacity: op}} />
    ) : (
      <span key={key} className={cn(TEXT, fontCls, 'whitespace-nowrap px-8 [filter:blur(0.8px)]', extra)} style={{color: caption.color, opacity: op, ...fs}}>
        {caption.text}
      </span>
    );

  // ---------- MÓVIL: horizontal, apilado por el contenedor padre ----------
  if (variant === 'mobile') {
    if (moving && !reduce) {
      return (
        <div className="flex w-full overflow-hidden">
          <motion.div className="flex" animate={{x: ['0%', '-50%']}} transition={{duration: dur, repeat: Infinity, ease: 'linear'}}>
            <div className="flex shrink-0">{Array.from({length: 5}).map((_, k) => item(`a${k}`, isImg ? 'h-20' : 'text-5xl'))}</div>
            <div className="flex shrink-0">{Array.from({length: 5}).map((_, k) => item(`b${k}`, isImg ? 'h-20' : 'text-5xl'))}</div>
          </motion.div>
        </div>
      );
    }
    return (
      <motion.div
        initial={reduce ? false : {opacity: 0, y: 8}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
        className="w-full px-4 text-center"
      >
        {isImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={caption.src!} alt="" className="mx-auto h-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]" style={{opacity: op, width: `${Math.min(caption.size ?? 30, 55)}%`}} />
        ) : (
          <span className={cn(TEXT, fontCls, 'text-2xl')} style={{color: caption.color, opacity: op, background: caption.bg ?? undefined, ...fs}}>
            {caption.text}
          </span>
        )}
      </motion.div>
    );
  }

  // ---------- ESCRITORIO: cintas ----------
  if (moving && !reduce) {
    const vertical = caption.anim === 'marquee-y';
    const vBand = caption.position.startsWith('top') ? 'top-6' : caption.position.startsWith('bottom') ? 'bottom-6' : 'top-1/2 -translate-y-1/2';
    const hBand = caption.position.includes('left') ? 'left-6' : caption.position.includes('right') ? 'right-6' : 'left-1/2 -translate-x-1/2';
    const Group = (p: string) => (
      <div className={vertical ? 'flex shrink-0 flex-col' : 'flex shrink-0'}>
        {Array.from({length: 6}).map((_, k) => item(`${p}${k}`, isImg ? 'h-24 sm:h-32' : 'text-5xl sm:text-7xl'))}
      </div>
    );
    return (
      <div
        className={cn('pointer-events-none absolute z-20 hidden overflow-hidden sm:flex', vertical ? `inset-y-0 ${hBand}` : `inset-x-0 ${vBand}`)}
        style={{
          ...(caption.bg ? {background: caption.bg} : {}),
          ...(oy ? {transform: `translateY(${oy}px)`} : {})
        }}
      >
        <motion.div className={vertical ? 'flex flex-col' : 'flex'} animate={vertical ? {y: ['0%', '-50%']} : {x: ['0%', '-50%']}} transition={{duration: dur, repeat: Infinity, ease: 'linear'}}>
          {Group('a')}
          {Group('b')}
        </motion.div>
      </div>
    );
  }

  // ---------- ESCRITORIO: texto/imagen única posicionada ----------
  const motionProps: MotionProps = (() => {
    if (reduce || caption.anim === 'none') return {};
    if (caption.anim === 'fade') return {initial: {opacity: 0}, animate: {opacity: 1}, transition: {duration: 1}};
    if (caption.anim === 'diagonal')
      return {animate: {x: ['-110%', '110%'], y: ['-60%', '60%']}, transition: {duration: dur, repeat: Infinity, ease: 'linear'}};
    const from = caption.position.includes('left')
      ? {x: '-60%', opacity: 0}
      : caption.position.includes('right')
        ? {x: '60%', opacity: 0}
        : caption.position.startsWith('top')
          ? {y: '-60%', opacity: 0}
          : caption.position.startsWith('bottom')
            ? {y: '60%', opacity: 0}
            : {opacity: 0};
    return {initial: from, animate: {x: 0, y: 0, opacity: 1}, transition: {duration: 0.8, ease: 'easeOut'}};
  })();

  const lateral = caption.position.includes('left') || caption.position.includes('right');

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-20 hidden overflow-hidden p-6 sm:flex', GRID[caption.position] ?? GRID.bottom)}
      style={oy ? {transform: `translateY(${oy}px)`} : undefined}
    >
      <motion.div {...motionProps} className={lateral ? 'max-w-[40%]' : 'max-w-[80%]'}>
        {isImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={caption.src!} alt="" className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]" style={{opacity: op, width: `${caption.size ?? 30}vw`}} />
        ) : (
          <span
            className={cn(TEXT, fontCls, 'inline-block whitespace-pre-line px-4 py-2 text-4xl sm:text-6xl', caption.bg ? 'rounded-xl' : '')}
            style={{color: caption.color, opacity: op, background: caption.bg ?? undefined, writingMode: caption.orientation === 'vertical' ? 'vertical-rl' : undefined, ...fs}}
          >
            {caption.text}
          </span>
        )}
      </motion.div>
    </div>
  );
}
