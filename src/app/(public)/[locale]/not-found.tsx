import {Link} from '@/i18n/navigation';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 pt-24 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-brand-deep">404</p>
      <h1 className="font-serif text-4xl">Página no encontrada</h1>
      <p className="text-ink-2">La página que buscas no existe o se ha movido.</p>
      <Link
        href="/"
        className="rounded-full bg-brand px-6 py-2.5 font-semibold text-on-primary shadow-sm transition hover:bg-brand-deep"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
