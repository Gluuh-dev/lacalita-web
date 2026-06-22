'use client';

import {useState} from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {LayoutDashboard, Image as ImageIcon, UtensilsCrossed, LayoutGrid, BookOpen, Calendar, FileText, Settings, LogOut, Menu, ExternalLink, Sandwich} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';

const NAV = [
  {href: '/admin', label: 'Panel', Icon: LayoutDashboard},
  {href: '/admin/hero', label: 'Portada (Hero)', Icon: ImageIcon},
  {href: '/admin/productos', label: 'Productos', Icon: UtensilsCrossed},
  {href: '/admin/categorias', label: 'Categorías', Icon: LayoutGrid},
  {href: '/admin/menus', label: 'Menús / Cartas', Icon: BookOpen},
  {href: '/admin/hamburgueseria', label: 'Hamburguesería', Icon: Sandwich},
  {href: '/admin/eventos', label: 'Eventos', Icon: Calendar},
  {href: '/admin/contenido', label: 'Contenido', Icon: FileText},
  {href: '/admin/ajustes', label: 'Ajustes', Icon: Settings}
];

export default function AdminSidebar({title, children}: {title: string; children: React.ReactNode}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  async function logout() {
    await createClient().auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface-2 lg:grid lg:grid-cols-[260px_1fr]">
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/45 lg:hidden" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col overflow-y-auto bg-[#1c160e] p-3 text-[#fbf7f0] transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-2 px-2 pb-5 pt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-solo.svg" alt="" className="h-7 w-auto brightness-0 invert" />
          <span className="font-adam text-[0.8rem] uppercase tracking-[0.12em]">La Calita · Admin</span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV.map((n) => {
            const on = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${on ? 'bg-brand/20 font-semibold text-brand' : 'text-[#fbf7f0]/70 hover:bg-white/5 hover:text-white'}`}
              >
                <n.Icon className="size-[18px]" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#fbf7f0]/60 transition hover:bg-white/5 hover:text-white">
          <LogOut className="size-4" /> Cerrar sesión
        </button>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <button onClick={() => setOpen(true)} aria-label="Menú" className="rounded-md p-1 text-ink-2 lg:hidden">
              <Menu className="size-6" />
            </button>
            <h1 className="font-serif text-xl font-bold capitalize text-ink">{title}</h1>
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">En español</span>
          </div>
          <a href="/" target="_blank" rel="noreferrer" aria-label="Ver web pública" className="rounded-md p-1.5 text-ink-2 transition hover:bg-surface-2">
            <ExternalLink className="size-5" />
          </a>
        </header>
        <main className="p-5 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
