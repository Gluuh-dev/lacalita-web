'use client';

import {useState, useTransition} from 'react';
import {toast} from 'sonner';
import {card} from '@/components/admin/ui';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {normalizeHours, type Hours, type HoursRow} from '@/lib/hours';
import {saveSettings} from './actions';
import type {Settings} from '@/lib/queries';

export default function SettingsForm({settings}: {settings: Settings | null}) {
  const [pending, start] = useTransition();
  const [hours, setHours] = useState<Hours>(normalizeHours(settings?.hours));
  const [f, setF] = useState({
    address: settings?.address ?? '',
    phone: settings?.phone ?? '',
    email: settings?.email ?? '',
    maps_url: settings?.maps_url ?? '',
    instagram: settings?.social?.instagram ?? '',
    facebook: settings?.social?.facebook ?? '',
    landing: settings?.landing?.es ?? ''
  });
  const set = (k: keyof typeof f) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setF({...f, [k]: e.target.value});

  // --- helpers de horarios ---
  const patchRow = (i: number, patch: Partial<HoursRow>) =>
    setHours((h) => ({...h, rows: h.rows.map((r, j) => (j === i ? {...r, ...patch} : r))}));
  const patchRange = (i: number, k: number, key: 'from' | 'to', val: string) =>
    patchRow(i, {
      ranges: hours.rows[i].ranges.map((r, m) => (m === k ? {...r, [key]: val} : r))
    });
  const addRange = (i: number) =>
    patchRow(i, {ranges: [...hours.rows[i].ranges, {from: '17:00', to: '23:00'}]});
  const removeRange = (i: number, k: number) =>
    patchRow(i, {ranges: hours.rows[i].ranges.filter((_, m) => m !== k)});
  const addRow = () =>
    setHours((h) => ({
      ...h,
      rows: [...h.rows, {label: 'Nuevo día', closed: false, ranges: [{from: '09:00', to: '23:00'}]}]
    }));
  const removeRow = (i: number) =>
    setHours((h) => ({...h, rows: h.rows.filter((_, j) => j !== i)}));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await saveSettings({...f, hours});
      if (r.ok) toast.success('Guardado');
      else toast.error(r.error);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className={`${card} space-y-3`}>
        <Label>Texto de bienvenida (portada)</Label>
        <Textarea rows={2} value={f.landing} onChange={set('landing')} />
      </div>

      {/* Horarios flexibles */}
      <div className={`${card} space-y-4`}>
        <h2 className="font-medium">Horarios</h2>
        <div>
          <Label>Aviso de cierre temporal (opcional)</Label>
          <Input
            value={hours.notice}
            onChange={(e) => setHours({...hours, notice: e.target.value})}
            placeholder="Ej: Cerrado del 1 al 7 de enero por vacaciones"
          />
        </div>

        {hours.rows.map((row, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-black/10 p-3">
            <div className="flex items-center gap-2">
              <Input
                className="flex-1"
                value={row.label}
                onChange={(e) => patchRow(i, {label: e.target.value})}
              />
              <label className="flex items-center gap-2 whitespace-nowrap text-sm">
                <Checkbox
                  checked={row.closed}
                  onCheckedChange={(v) => patchRow(i, {closed: v === true})}
                />
                Cerrado
              </label>
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="text-sm text-destructive hover:underline"
              >
                ✕
              </button>
            </div>

            {!row.closed && (
              <div className="space-y-2">
                {row.ranges.map((r, k) => (
                  <div key={k} className="flex items-center gap-2">
                    <Input
                      type="time"
                      className="w-32"
                      value={r.from}
                      onChange={(e) => patchRange(i, k, 'from', e.target.value)}
                    />
                    <span className="text-muted-foreground">–</span>
                    <Input
                      type="time"
                      className="w-32"
                      value={r.to}
                      onChange={(e) => patchRange(i, k, 'to', e.target.value)}
                    />
                    {row.ranges.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRange(i, k)}
                        className="text-destructive"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {row.ranges.length < 2 && (
                  <button
                    type="button"
                    onClick={() => addRange(i)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Añadir franja (mañana/tarde)
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          + Añadir día
        </Button>
      </div>

      <div className={`${card} space-y-3`}>
        <h2 className="font-medium">Contacto y ubicación</h2>
        <div>
          <Label>Dirección</Label>
          <Input value={f.address} onChange={set('address')} />
        </div>
        <div>
          <Label>Enlace Google Maps</Label>
          <Input value={f.maps_url} onChange={set('maps_url')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Teléfono</Label>
            <Input value={f.phone} onChange={set('phone')} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={f.email} onChange={set('email')} />
          </div>
        </div>
      </div>

      <div className={`${card} space-y-3`}>
        <h2 className="font-medium">Redes</h2>
        <div>
          <Label>Instagram</Label>
          <Input value={f.instagram} onChange={set('instagram')} />
        </div>
        <div>
          <Label>Facebook</Label>
          <Input value={f.facebook} onChange={set('facebook')} />
        </div>
      </div>

      <Button disabled={pending}>{pending ? 'Guardando…' : 'Guardar'}</Button>
    </form>
  );
}
