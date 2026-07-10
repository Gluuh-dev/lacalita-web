'use client';

import Link from 'next/link';
import {btn, btnGhost} from './ui';

// Pie pegado al fondo con Guardar y Cancelar. Los formularios del admin son
// largos: el botón de guardar quedaba al final y había que bajar a buscarlo.
// Funciona igual dentro del cajón lateral (que hace scroll) que en una página.
export default function FormFooter({
  pending,
  onCancel,
  cancelHref,
  label = 'Guardar',
  extra
}: {
  pending?: boolean;
  onCancel?: () => void; // cajón: cerrarlo
  cancelHref?: string; // página: volver al listado
  label?: string;
  extra?: React.ReactNode; // acciones a la izquierda (p. ej. Eliminar)
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-1 mt-6 flex items-center justify-end gap-2 border-t border-line bg-bg/95 px-1 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
      {extra && <div className="mr-auto">{extra}</div>}
      {cancelHref ? (
        <Link href={cancelHref} className={btnGhost}>
          Cancelar
        </Link>
      ) : (
        <button type="button" onClick={onCancel} className={btnGhost}>
          Cancelar
        </button>
      )}
      <button type="submit" disabled={pending} className={btn}>
        {pending ? 'Guardando…' : label}
      </button>
    </div>
  );
}
