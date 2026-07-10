import {fmtBytes} from '@/lib/format-bytes';
import {STORAGE_LIMIT} from '@/lib/storage-usage';

// Barra de uso del bucket `media`. Server component: recibe el total ya sumado.
export default function StorageMeter({used}: {used: number}) {
  const pct = Math.min(100, Math.round((used / STORAGE_LIMIT) * 100));
  const free = Math.max(0, STORAGE_LIMIT - used);
  const tone = pct >= 90 ? 'bg-destructive' : pct >= 70 ? 'bg-amber-500' : 'bg-brand';

  return (
    <div className="mb-6 rounded-[20px] border border-line bg-surface p-4 shadow-sm">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-ink-2">Espacio usado</span>
        <span className="text-sm text-ink-3">
          <strong className="text-ink">{fmtBytes(used)}</strong> de {fmtBytes(STORAGE_LIMIT)} · {fmtBytes(free)} libres
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div className={`h-full rounded-full transition-all ${tone}`} style={{width: `${Math.max(pct, 1)}%`}} />
      </div>
      <div className="mt-1 text-right text-xs text-ink-3">{pct}%</div>
    </div>
  );
}
