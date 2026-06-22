'use client';

import {Trash2} from 'lucide-react';

export default function Confirm({
  open,
  title = '¿Eliminar?',
  message,
  confirmLabel = 'Eliminar',
  pending = false,
  onCancel,
  onConfirm
}: {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  pending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center p-6">
      <div onClick={onCancel} className="absolute inset-0 bg-black/45 duration-200 animate-in fade-in" />
      <div className="relative w-full max-w-sm rounded-[20px] border border-line bg-surface p-6 shadow-xl duration-200 animate-in zoom-in-95">
        <div className="mb-5 flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-danger/10 text-danger">
            <Trash2 className="size-5" />
          </span>
          <div>
            <h3 className="font-serif text-lg text-ink">{title}</h3>
            {message && <p className="mt-0.5 text-sm text-ink-2">{message}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="flex-1 rounded-full border border-line bg-surface px-4 py-2 text-sm transition hover:bg-surface-2 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="flex-1 rounded-full bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {pending ? 'Eliminando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
