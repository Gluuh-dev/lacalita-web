import {notFound} from 'next/navigation';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {requireUser} from '@/lib/auth';
import {getGalleryAlbumsAdmin, getAllEvents} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import AlbumForm from '../album-form';

// Página completa para el álbum: el cajón lateral se quedaba corto para subir
// decenas de fotos de una tacada.
export default async function AlbumPage({params}: {params: Promise<{id: string}>}) {
  await requireUser();
  const {id} = await params;
  const esNuevo = id === 'nuevo';

  const [albums, events] = await Promise.all([getGalleryAlbumsAdmin(), getAllEvents()]);
  const album = esNuevo ? null : (albums.find((a) => a.id === id) ?? null);
  if (!esNuevo && !album) notFound();

  // Para poder enlazar el álbum con el evento del que salió.
  const opciones = events.map((e) => ({
    id: e.id,
    title: `${typeof e.title === 'object' ? (e.title as Record<string, string>).es ?? '' : e.title} · ${new Date(e.starts_at).toLocaleDateString('es-ES')}`
  }));

  return (
    <AdminShell title={esNuevo ? 'Nuevo álbum' : album?.title || 'Álbum'}>
      <Link href="/admin/galeria" className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-3 transition hover:text-ink">
        <ArrowLeft className="size-4" /> Volver a la galería
      </Link>
      <AlbumForm id={esNuevo ? null : id} album={album} events={opciones} />
    </AdminShell>
  );
}
