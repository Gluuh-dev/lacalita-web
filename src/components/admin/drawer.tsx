'use client';

import {X} from 'lucide-react';
import {useScrollLock} from '@/lib/use-scroll-lock';
import {useBackClose} from '@/lib/use-back-close';

export default function Drawer({
  open,
  title,
  onClose,
  width = 520,
  flush = false,
  children
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  width?: number;
  flush?: boolean; // el hijo gestiona su propio scroll + footer (sin padding)
  children: React.ReactNode;
}) {
  useScrollLock(open);
  useBackClose(open, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300]">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/45 duration-200 animate-in fade-in"
      />
      <div
        className="absolute inset-y-0 right-0 flex flex-col bg-bg shadow-xl duration-300 animate-in slide-in-from-right"
        style={{width: `min(94vw, ${width}px)`}}
      >
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="font-serif text-xl text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-md p-1 text-ink-2 hover:bg-surface-2"
          >
            <X className="size-5" />
          </button>
        </header>
        {flush ? (
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        ) : (
          <div className="flex-1 overflow-auto p-5">{children}</div>
        )}
      </div>
    </div>
  );
}
