import {notFound} from 'next/navigation';
import {requireUser} from '@/lib/auth';
import {getBurgerOffersAdmin} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import BurgerOfferEditor from '../../burger-offer-editor';

export default async function BurgerOfferPage({params}: {params: Promise<{id: string}>}) {
  await requireUser();
  const {id} = await params;
  const isNew = id === 'nuevo';
  const offer = isNew ? null : (await getBurgerOffersAdmin()).find((o) => o.id === id) ?? null;
  if (!isNew && !offer) notFound();
  return (
    <AdminShell title={isNew ? 'Nueva oferta' : 'Editar oferta'}>
      <BurgerOfferEditor offer={offer} />
    </AdminShell>
  );
}
