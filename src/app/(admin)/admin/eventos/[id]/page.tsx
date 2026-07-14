import {notFound} from 'next/navigation';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {requireUser} from '@/lib/auth';
import {createClient} from '@/lib/supabase/server';
import AdminShell from '@/components/admin/admin-shell';
import EventForm from '../event-form';
import type {EventRow} from '@/lib/queries';

// Página completa para el evento: el cajón lateral se quedaba corto para la
// galería de imágenes (mismo motivo por el que galería tiene página propia).
export default async function EventoAdminPage({params}: {params: Promise<{id: string}>}) {
  await requireUser();
  const {id} = await params;
  const esNuevo = id === 'nuevo';

  let event: EventRow | null = null;
  if (!esNuevo) {
    const supabase = await createClient();
    const {data} = await supabase.from('events').select('*').eq('id', id).single();
    if (!data) notFound();
    event = data as EventRow;
  }

  return (
    <AdminShell title={esNuevo ? 'Nuevo evento' : 'Editar evento'}>
      <Link href="/admin/eventos" className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-3 transition hover:text-ink">
        <ArrowLeft className="size-4" /> Volver a eventos
      </Link>
      <div className="w-full">
        <EventForm id={esNuevo ? null : id} event={event} />
      </div>
    </AdminShell>
  );
}
