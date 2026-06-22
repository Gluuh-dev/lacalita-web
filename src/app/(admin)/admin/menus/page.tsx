import {requireUser} from '@/lib/auth';
import {getMenus} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import MenusManager from './menus-manager';
import type {Menu} from '@/lib/queries';

export default async function MenusList() {
  await requireUser();
  const menus = await getMenus();
  return (
    <AdminShell title="Menús">
      <MenusManager menus={menus as unknown as Menu[]} />
    </AdminShell>
  );
}
