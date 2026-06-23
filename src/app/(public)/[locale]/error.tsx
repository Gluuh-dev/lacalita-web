'use client';

export default function Error({reset}: {error: Error & {digest?: string}; reset: () => void}) {
  return (
    <main className="mx-auto flex min-h-[60svh] max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-serif text-2xl font-bold">Algo ha ido mal</h1>
      <p className="text-ink-2">No hemos podido cargar esta página. Inténtalo de nuevo.</p>
      <button onClick={reset} className="rounded-full bg-brand px-5 py-2.5 font-semibold text-on-primary transition hover:bg-brand-deep">
        Reintentar
      </button>
    </main>
  );
}
