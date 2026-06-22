import {notFound} from 'next/navigation';
import {requireUser} from '@/lib/auth';
import {getEventById} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import EventForm from '../event-form';

export default async function EventoEdit({
  params
}: {
  params: Promise<{id: string}>;
}) {
  await requireUser();
  const {id} = await params;
  const isNew = id === 'new';
  const event = isNew ? null : await getEventById(id);
  if (!isNew && !event) notFound();
  return (
    <AdminShell title={isNew ? 'Nuevo evento' : 'Editar evento'}>
      <EventForm id={isNew ? null : id} event={event} />
    </AdminShell>
  );
}
