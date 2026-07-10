import {requireUser} from '@/lib/auth';
import {getGalleryAlbumsAdmin} from '@/lib/queries';
import {getMediaUsage, bytesOf} from '@/lib/storage-usage';
import AdminShell from '@/components/admin/admin-shell';
import StorageMeter from '@/components/admin/storage-meter';
import AlbumsManager from './albums-manager';

export default async function GaleriaAdmin() {
  await requireUser();
  const [albums, usage] = await Promise.all([getGalleryAlbumsAdmin(), getMediaUsage()]);

  // Peso real de cada álbum (suma de sus ficheros en Storage).
  const albumBytes = Object.fromEntries(albums.map((a) => [a.id, bytesOf(a.images, usage.sizes)]));

  return (
    <AdminShell title="Galería">
      <StorageMeter used={usage.total} />
      <AlbumsManager albums={albums} albumBytes={albumBytes} />
    </AdminShell>
  );
}
