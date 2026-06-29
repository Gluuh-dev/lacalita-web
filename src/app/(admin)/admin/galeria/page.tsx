import {requireUser} from '@/lib/auth';
import {getGalleryAlbumsAdmin} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import AlbumsManager from './albums-manager';

export default async function GaleriaAdmin() {
  await requireUser();
  const albums = await getGalleryAlbumsAdmin();
  return (
    <AdminShell title="Galería">
      <AlbumsManager albums={albums} />
    </AdminShell>
  );
}
