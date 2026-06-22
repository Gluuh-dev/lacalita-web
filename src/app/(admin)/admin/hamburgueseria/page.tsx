import {requireUser} from '@/lib/auth';
import {getBurgerSlidesAdmin, getBurgerOffersAdmin} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import BurgerAdmin from './burger-admin';

export default async function HamburgueseriaAdmin() {
  await requireUser();
  const [slides, offers] = await Promise.all([getBurgerSlidesAdmin(), getBurgerOffersAdmin()]);
  return (
    <AdminShell title="Hamburguesería">
      <BurgerAdmin slides={slides} offers={offers} />
    </AdminShell>
  );
}
