'use client';

import {useState, useTransition} from 'react';
import {toast} from 'sonner';
import Confirm from './confirm';

export default function DeleteButton({
  onDelete,
  label = 'Eliminar',
  confirmText = '¿Seguro que quieres eliminar esto?'
}: {
  onDelete: () => Promise<{ok: boolean; error?: string}>;
  label?: string;
  confirmText?: string;
}) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-danger hover:underline"
      >
        {label}
      </button>
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
            }
          })
        }
      />
    </>
  );
}
