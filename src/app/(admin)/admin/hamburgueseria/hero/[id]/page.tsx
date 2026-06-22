import {notFound} from 'next/navigation';
import {requireUser} from '@/lib/auth';
import {getBurgerSlidesAdmin} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import BurgerSlideEditor from '../../burger-slide-editor';

export default async function BurgerSlidePage({params}: {params: Promise<{id: string}>}) {
  await requireUser();
  const {id} = await params;
  const isNew = id === 'nuevo';
  const slide = isNew ? null : (await getBurgerSlidesAdmin()).find((s) => s.id === id) ?? null;
  if (!isNew && !slide) notFound();
  return (
    <AdminShell title={isNew ? 'Nueva diapositiva' : 'Editar diapositiva'}>
      <BurgerSlideEditor slide={slide} />
    </AdminShell>
  );
}
