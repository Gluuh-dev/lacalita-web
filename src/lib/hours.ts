export type HoursRange = {from: string; to: string};
export type HoursRow = {label: string; closed: boolean; ranges: HoursRange[]};
export type Hours = {notice: string; rows: HoursRow[]};

const DEFAULT: Hours = {
  notice: '',
  rows: [
    {label: 'Lunes a Viernes', closed: false, ranges: [{from: '09:00', to: '00:00'}]},
    {label: 'Sábado', closed: false, ranges: [{from: '09:00', to: '02:00'}]},
    {label: 'Domingo', closed: false, ranges: [{from: '09:00', to: '00:00'}]}
  ]
};

// Acepta el formato nuevo ({notice, rows}), el viejo ({lun_vie, sab, dom}) o nada.
export function normalizeHours(raw: unknown): Hours {
  const r = raw as Record<string, unknown> | null;
  if (r && Array.isArray(r.rows)) {
    return {notice: (r.notice as string) ?? '', rows: r.rows as HoursRow[]};
  }
  if (r && (r.lun_vie || r.sab || r.dom)) {
    const parse = (s: unknown): HoursRange[] => {
      const [from, to] = String(s ?? '')
        .split(/[–-]/)
        .map((x) => x.trim());
      return from && to ? [{from, to}] : [];
    };
    return {
      notice: '',
      rows: [
        {label: 'Lunes a Viernes', closed: !r.lun_vie, ranges: parse(r.lun_vie)},
        {label: 'Sábado', closed: !r.sab, ranges: parse(r.sab)},
        {label: 'Domingo', closed: !r.dom, ranges: parse(r.dom)}
      ]
    };
  }
  return DEFAULT;
}

export function formatRanges(row: HoursRow): string {
  return row.ranges.map((r) => `${r.from} – ${r.to}`).join('  ·  ');
}

const toMin = (s: string) => {
  const [h, m] = s.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

// Días de la semana mencionados en una etiqueta libre ("Lunes a Viernes", "Sábado"…).
// Índice = getDay() (0 domingo … 6 sábado).
function labelDays(label: string): Set<number> {
  const s = label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const order = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const mentioned = order.map((d, i) => (s.includes(d) ? i : -1)).filter((i) => i >= 0);
  const set = new Set<number>();
  if (mentioned.length >= 2 && /\ba\b|–|-|hasta/.test(s)) {
    for (let d = mentioned[0]; d <= mentioned[mentioned.length - 1]; d++) set.add(d);
  } else {
    mentioned.forEach((d) => set.add(d));
  }
  return set;
}

// Horario en el formato que entiende Google (openingHoursSpecification).
const DIAS_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export function openingSpec(hours: Hours) {
  const spec: {'@type': string; dayOfWeek: string[]; opens: string; closes: string}[] = [];
  for (const row of hours.rows) {
    if (row.closed) continue;
    const dias = [...labelDays(row.label)].map((d) => DIAS_SCHEMA[d]);
    if (!dias.length) continue;
    for (const r of row.ranges) {
      spec.push({'@type': 'OpeningHoursSpecification', dayOfWeek: dias, opens: r.from, closes: r.to});
    }
  }
  return spec;
}

// Franja de hoy en minutos desde medianoche. Si cierra de madrugada (09:00 – 02:00)
// el cierre se pasa de 1440 para que la línea del día no se corte al llegar a las 12.
export function todayRange(hours: Hours, now = new Date()): {from: number; to: number} | null {
  const day = now.getDay();
  for (const row of hours.rows) {
    if (row.closed || !labelDays(row.label).has(day)) continue;
    const r = row.ranges[0];
    if (!r) continue;
    const from = toMin(r.from);
    const to = toMin(r.to);
    return {from, to: to > from ? to : to + 1440};
  }
  return null;
}

// ¿Está abierto ahora? Devuelve también a qué hora cierra. Maneja rangos que cruzan
// medianoche (p. ej. 09:00 – 02:00).
export function isOpenNow(hours: Hours, now = new Date()): {open: boolean; closesAt: string | null; opensAt: string | null} {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  for (const row of hours.rows) {
    if (row.closed) continue;
    const days = labelDays(row.label);
    if (days.has(day)) {
      for (const r of row.ranges) {
        const from = toMin(r.from);
        const to = toMin(r.to);
        if (to > from ? mins >= from && mins < to : mins >= from) return {open: true, closesAt: r.to, opensAt: null};
      }
    }
    // Cierre que viene del día anterior (rango nocturno que cruza medianoche).
    if (days.has((day + 6) % 7)) {
      for (const r of row.ranges) {
        const from = toMin(r.from);
        const to = toMin(r.to);
        if (to <= from && mins < to) return {open: true, closesAt: r.to, opensAt: null};
      }
    }
  }
  // Cerrado: buscamos a qué hora abre — hoy si aún no ha abierto, si no el próximo día con horario.
  for (let add = 0; add < 8; add++) {
    const d = (day + add) % 7;
    for (const row of hours.rows) {
      if (row.closed || !labelDays(row.label).has(d)) continue;
      for (const r of row.ranges) {
        if (add > 0 || toMin(r.from) > mins) return {open: false, closesAt: null, opensAt: r.from};
      }
    }
  }
  return {open: false, closesAt: null, opensAt: null};
}
