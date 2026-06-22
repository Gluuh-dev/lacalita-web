import {requireUser} from '@/lib/auth';
import {getAllEvents} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import EventsManager from './events-manager';

export default async function EventosList() {
  await requireUser();
  const events = await getAllEvents();
  return (
    <AdminShell title="Eventos">
      <EventsManager events={events} />
    </AdminShell>
  );
}
