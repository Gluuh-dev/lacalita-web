import {requireUser} from '@/lib/auth';
import {getSettings} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import SettingsForm from './settings-form';

export default async function AjustesPage() {
  await requireUser();
  const settings = await getSettings();
  return (
    <AdminShell title="Ajustes">
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
