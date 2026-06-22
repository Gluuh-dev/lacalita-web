import {requireUser} from '@/lib/auth';
import {getSettings} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import HeroEditor from './hero-editor';

export default async function HeroPage() {
  await requireUser();
  const settings = await getSettings();
  return (
    <AdminShell title="Portada (Hero)">
      <HeroEditor initial={settings?.hero ?? []} />
    </AdminShell>
  );
}
