import {requireUser} from '@/lib/auth';
import {getSettings} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import ContentForm from './content-form';

export default async function ContenidoPage() {
  await requireUser();
  const settings = await getSettings();
  return (
    <AdminShell title="Contenido de la landing">
      <ContentForm initial={settings?.content ?? {}} />
    </AdminShell>
  );
}
