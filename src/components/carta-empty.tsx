import {UtensilsCrossed} from 'lucide-react';

// Estado vacío para cualquier carta sin productos.
export default function CartaEmpty({name}: {name: string}) {
  return (
    <div className="mx-auto flex min-h-[46vh] max-w-md flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-surface-sunken text-brand-deep">
        <UtensilsCrossed className="size-7" />
      </span>
      <h2 className="font-serif text-2xl">No hay {name} disponibles</h2>
      <p className="text-ink-2">Estamos preparando esta carta. Vuelve pronto.</p>
    </div>
  );
}
