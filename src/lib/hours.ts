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
