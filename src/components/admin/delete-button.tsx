'use client';

import {useState, useTransition} from 'react';
import {toast} from 'sonner';
import {Trash2} from 'lucide-react';
import Confirm from './confirm';

export default function DeleteButton({
  onDelete,
  label = 'Eliminar',
  confirmText = '¿Seguro que quieres eliminar esto?',
  icon = false,
  onDone
}: {
  onDelete: () => Promise<{ok: boolean; error?: string}>;
  label?: string;
  confirmText?: string;
  icon?: boolean; // solo papelera (para filas densas de tablas)
  onDone?: () => void; // p. ej. router.refresh() si la action no revalida el admin
}) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);

  return (
    <>
      {icon ? (
        <button type="button" onClick={() => setOpen(true)} aria-label={label} className="rounded-md p-1.5 text-ink-3 transition hover:bg-surface-2 hover:text-danger">
          <Trash2 className="size-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-danger/30 px-3 py-1.5 text-sm font-medium text-danger transition hover:bg-danger/10"
        >
          <Trash2 className="size-3.5" /> {label}
        </button>
      )}
      <Confirm
        open={open}
        message={confirmText}
        pending={pending}
        onCancel={() => !pending && setOpen(false)}
        onConfirm={() =>
          start(async () => {
            const r = await onDelete();
            if (r && !r.ok) toast.error(r.error);
            else {
              toast.success('Eliminado');
              setOpen(false);
              onDone?.();
            }
          })
        }
      />
    </>
  );
}
