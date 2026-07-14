'use client';

import {useEffect, useRef, useState} from 'react';
import {Link} from '@/i18n/navigation';
import {todayRange, type Hours} from '@/lib/hours';

export type DayStop = {min: number; time: string; title: string; desc: string};
export type DayEvent = {id: string; title: string; startsAt: string};

const VBW = 1000; // ancho del viewBox: las etiquetas se colocan en % sobre él
const X0 = 90;
const X1 = 910;
// Los colores de la carta: del dorado de la mañana a la tinta de la noche.
const PUNTO = ['var(--brand)', 'var(--brand)', 'var(--brand-deep)', 'var(--ink)'];

// Parábola invertida: el sol sube al mediodía y baja al cerrar.
const curveY = (x: number) => 0.0007 * (x - 500) * (x - 500) + 55;
const hhmm = (m: number) => `${Math.floor(m / 60) % 24}:${String(m % 60).padStart(2, '0')}`;

export default function DayArc({
  hours,
  stops,
  events,
  nowLabel,
  closedLabel,
  todayLabel
}: {
  hours: Hours;
  stops: DayStop[];
  events: DayEvent[];
  nowLabel: string; // "Ahora"
  closedLabel: string; // "Cerrado · abrimos a las" (la hora se añade aquí)
  todayLabel: string; // "Hoy"
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<Date | null>(null);

  // La hora es la del visitante: solo se sabe en el cliente. Hasta entonces no
  // se pinta ni sol ni evento, y el arco se ve igual (sin salto de hidratación).
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const rango = todayRange(hours, now ?? new Date()) ?? {from: 540, to: 1440};
  const x = (min: number) => X0 + ((min - rango.from) / (rango.to - rango.from)) * (X1 - X0);

  const mins = now ? now.getHours() * 60 + now.getMinutes() : 0;
  // Antes de abrir, los minutos de madrugada pertenecen a la noche anterior.
  const minsHoy = now && mins < rango.from && rango.to > 1440 ? mins + 1440 : mins;
  const abierto = !!now && minsHoy >= rango.from && minsHoy < rango.to;

  // Eventos de hoy, dentro del horario: se marcan en el arco a su hora.
  const hoy = (now ? events : []).filter((e) => {
    const d = new Date(e.startsAt);
    return now && d.toDateString() === now.toDateString();
  });

  const sunX = x(abierto ? minsHoy : rango.from);
  const sunY = curveY(sunX);

  // En móvil el arco es más ancho que la pantalla: se centra en el sol, y el
  // resto del día queda a un dedo de distancia.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || el.scrollWidth <= el.clientWidth + 4) return;
    const stage = el.firstElementChild as HTMLElement | null;
    if (!stage) return;
    el.scrollTo({left: Math.max(0, (sunX / VBW) * stage.offsetWidth - el.clientWidth / 2), behavior: 'smooth'});
  }, [sunX]);

  const activa = abierto ? stops.reduce((acc, s, i) => (minsHoy >= s.min ? i : acc), -1) : -1;

  return (
    <div ref={scrollRef} className="mt-8 overflow-x-auto overflow-y-hidden px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-12 sm:px-0">
      {/* El ancho fijo en móvil deja sitio a las etiquetas de los extremos: sin
          él, la primera y la última se salen del contenedor y se cortan. */}
      <div className="relative mx-auto h-[340px] w-[900px] sm:h-[360px] sm:w-full sm:max-w-5xl">
        <svg viewBox="0 0 1000 280" preserveAspectRatio="xMidYMin meet" aria-hidden className="absolute inset-x-0 top-0 block w-full overflow-visible">
          <defs>
            <radialGradient id="lc-sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe6ad" stopOpacity=".9" />
              <stop offset="60%" stopColor="#f0b45f" stopOpacity=".35" />
              <stop offset="100%" stopColor="#f0b45f" stopOpacity="0" />
            </radialGradient>
          </defs>

          <path
            d={Array.from({length: 145}, (_, i) => 70 + i * 6)
              .map((px, i) => `${i ? 'L' : 'M'}${px},${curveY(px).toFixed(1)}`)
              .join(' ')}
            fill="none"
            stroke="var(--brand-deep)"
            strokeWidth="1.6"
            strokeDasharray="2 8"
            strokeLinecap="round"
          />

          {/* De la mañana (arena clara) a la noche (tinta de la carta). */}
          {stops.map((s, i) => (
            <circle key={s.min} cx={x(s.min)} cy={curveY(x(s.min))} r="8" fill={PUNTO[i] ?? 'var(--brand)'} />
          ))}

          {/* Evento de hoy: un punto marcado sobre la curva, a su hora. */}
          {hoy.map((e) => {
            const m = new Date(e.startsAt).getHours() * 60 + new Date(e.startsAt).getMinutes();
            const ex = x(m);
            return <circle key={e.id} cx={ex} cy={curveY(ex)} r="6" fill="var(--surface)" stroke="var(--brand-deep)" strokeWidth="3" />;
          })}

          {now && (
            <g>
              <circle className="lc-sun-pulse" cx={sunX} cy={sunY} r="26" fill="url(#lc-sun-glow)" />
              <circle cx={sunX} cy={sunY} r="11" fill={abierto ? 'var(--brand)' : 'var(--ink-3)'} stroke="var(--surface)" strokeWidth="3" />
              {abierto &&
                Array.from({length: 8}, (_, a) => {
                  const ang = (a * Math.PI) / 4;
                  return (
                    <line
                      key={a}
                      x1={sunX + Math.cos(ang) * 15}
                      y1={sunY + Math.sin(ang) * 15}
                      x2={sunX + Math.cos(ang) * 20}
                      y2={sunY + Math.sin(ang) * 20}
                      stroke="#f4b84e"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  );
                })}
            </g>
          )}
        </svg>

        {/* Píldora: la hora de ahora, o a qué hora abrimos. Va despegada del sol
            para no taparlo. */}
        {now && (
          <div
            className={`absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full px-3.5 py-1.5 font-adam text-[0.68rem] uppercase tracking-[0.14em] text-white ${
              abierto ? 'bg-ink' : 'bg-ink-3'
            }`}
            style={{left: `${(sunX / VBW) * 100}%`, top: `calc(${(sunY / 280) * 100}% - 2.6rem)`}}
          >
            {abierto ? `${nowLabel} · ${hhmm(mins)}` : `${closedLabel} ${hhmm(rango.from)}`}
          </div>
        )}

        {/* Evento de hoy: chip con el título, enlazado a su ficha. */}
        {hoy.map((e) => {
          const d = new Date(e.startsAt);
          const ex = x(d.getHours() * 60 + d.getMinutes());
          return (
            <Link
              key={e.id}
              href={`/eventos/${e.id}`}
              className="absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full border border-brand-deep/40 bg-surface px-3.5 py-1.5 font-adam text-[0.68rem] uppercase tracking-[0.14em] text-brand-deep transition hover:bg-brand-deep hover:text-on-primary"
              style={{left: `${(ex / VBW) * 100}%`, top: `calc(${(curveY(ex) / 280) * 100}% - 4.8rem)`}}
            >
              {todayLabel} · {d.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})} · {e.title}
            </Link>
          );
        })}

        {stops.map((s, i) => (
          <div
            key={s.min}
            className={`absolute bottom-0 w-[170px] -translate-x-1/2 px-2 text-center transition-opacity duration-500 sm:w-[200px] ${
              activa >= 0 && i !== activa ? 'opacity-55' : ''
            }`}
            style={{left: `${(x(s.min) / VBW) * 100}%`}}
          >
            <div className={`font-adam text-[0.62rem] uppercase tracking-[0.16em] ${i === activa ? 'text-ink' : 'text-brand-deep'}`}>{s.time}</div>
            <h3 className="mt-1.5 font-serif text-lg font-bold leading-tight text-ink sm:text-xl">{s.title}</h3>
            <p className="mt-1.5 text-[0.82rem] leading-snug text-ink-2">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
