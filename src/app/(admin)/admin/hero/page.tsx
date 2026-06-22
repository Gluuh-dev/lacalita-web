import {requireUser} from '@/lib/auth';
import {getSettings, getUpcomingEvents} from '@/lib/queries';
import {toHeroEvents} from '@/lib/hero';
import AdminShell from '@/components/admin/admin-shell';
import HeroEditor from './hero-editor';

export default async function HeroPage() {
  await requireUser();
  const [settings, events] = await Promise.all([getSettings(), getUpcomingEvents(6)]);
  return (
    <AdminShell title="Portada (Hero)">
      <HeroEditor initial={settings?.hero ?? []} events={toHeroEvents(events, 'es')} />
    </AdminShell>
  );
}
