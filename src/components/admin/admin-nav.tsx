import Link from 'next/link';
import LogoutButton from '@/app/(admin)/admin/logout-button';

const LINKS: [string, string][] = [
  ['/admin', 'Inicio'],
  ['/admin/hero', 'Portada'],
  ['/admin/productos', 'Productos'],
  ['/admin/categorias', 'Categorías'],
  ['/admin/menus', 'Menús'],
  ['/admin/eventos', 'Eventos'],
  ['/admin/ajustes', 'Ajustes']
];

export default function AdminNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-solo.svg" alt="" className="h-6 w-auto" />
          <span>Admin</span>
        </Link>
        <LogoutButton />
      </div>
      <nav className="mx-auto max-w-3xl overflow-x-auto px-4 pb-2">
        <ul className="flex gap-1 whitespace-nowrap text-sm">
          {LINKS.map(([href, text]) => (
            <li key={href}>
              <Link
                href={href}
                className="inline-block rounded-full px-3 py-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink"
              >
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
