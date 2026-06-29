'use client';

import {Upload} from 'lucide-react';
import {useIsAdmin} from '@/lib/use-is-admin';

// Solo admin: acceso directo a subir imágenes (se suben dentro de cada evento).
export default function GalleryAdminCta() {
  const isAdmin = useIsAdmin();
  if (!isAdmin) return null;
  return (
    <div className="mb-2 flex justify-center">
      <a
        href="/admin/eventos"
        className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <Upload className="size-4" /> Subir imágenes
      </a>
    </div>
  );
}
