'use client';

import {useState} from 'react';
import {Link} from '@/i18n/navigation';
import {Settings, Menu, X} from 'lucide-react';
import LangSwitcher from '@/components/lang-switcher';
import {useHideOnScroll} from '@/lib/use-hide-on-scroll';

const NAV = [
  {label: 'Carta', href: '/carta/hamburgueseria', internal: true},
  {label: 'Ofertas', href: '#ofertas', internal: false},
  {label: 'Local', href: '#local', internal: false}
];

export default function BurgerHeader({locale: _locale}: {locale: string}) {
  const [open, setOpen] = useState(false);
  const {hidden, scrolled} = useHideOnScroll();
  // Arriba (sobre el hero oscuro) = texto claro; al hacer scroll (sobre crema) = oscuro.
  const light = !scrolled;
  const navCls = light ? 'text-white/80 transition hover:text-white' : 'text-[#2a1713]/70 transition hover:text-[#c94a3c]';

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 animate-in fade-in slide-in-from-top duration-500 ${hidden && !open ? '-translate-y-full' : ''} ${scrolled ? 'border-b border-black/5 bg-[#fdfbf7]/90 backdrop-blur-md' : ''}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/hamburgueseria" aria-label="La Calita Burger">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-solo.svg" alt="" className={`h-8 w-auto ${light ? 'brightness-0 invert' : ''}`} />
        </Link>

        {/* Escritorio */}
        <nav className="hidden items-center gap-6 font-adam text-[0.7rem] uppercase tracking-[0.18em] md:flex">
          {NAV.map((n) =>
            n.internal ? (
              <Link key={n.label} href={n.href} className={navCls}>{n.label}</Link>
            ) : (
              <a key={n.label} href={n.href} className={navCls}>{n.label}</a>
            )
          )}
        </nav>
        <div className={`hidden items-center gap-4 md:flex ${light ? 'text-white/80' : 'text-[#2a1713]/70'}`}>
          <a href="/admin" className={`flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.14em] transition ${light ? 'hover:text-white' : 'hover:text-[#c94a3c]'}`}>
            <Settings className="size-3.5" /> Admin
          </a>
          <LangSwitcher />
        </div>

        {/* Móvil: botón */}
        <button onClick={() => setOpen(true)} aria-label="Menú" className={`flex size-10 items-center justify-center rounded-full backdrop-blur md:hidden ${light ? 'bg-white/15 text-white' : 'bg-black/5 text-[#2a1713]'}`}>
          <Menu className="size-5" />
        </button>
      </div>

      {/* Móvil: overlay (crema) */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[#fdfbf7]/97 backdrop-blur-md md:hidden">
          <div className="flex items-center justify-between px-5 py-3.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-solo.svg" alt="" className="h-8 w-auto" />
            <button onClick={() => setOpen(false)} aria-label="Cerrar" className="flex size-10 items-center justify-center rounded-full bg-black/5 text-[#2a1713]">
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-7 font-adam text-lg uppercase tracking-[0.18em] text-[#2a1713]">
            {NAV.map((n) =>
              n.internal ? (
                <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="hover:text-[#c94a3c]">{n.label}</Link>
              ) : (
                <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="hover:text-[#c94a3c]">{n.label}</a>
              )
            )}
            <a href="/admin" onClick={() => setOpen(false)} className="mt-4 flex items-center gap-2 text-sm text-[#2a1713]/70">
              <Settings className="size-4" /> Admin
            </a>
            <div className="mt-2 scale-125"><LangSwitcher /></div>
          </nav>
        </div>
      )}
    </header>
  );
}
