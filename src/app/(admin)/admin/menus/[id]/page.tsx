import {notFound} from 'next/navigation';
import {requireUser} from '@/lib/auth';
import {getMenuById} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import MenuForm from '../menu-form';

export default async function MenuEdit({
  params
}: {
  params: Promise<{id: string}>;
}) {
  await requireUser();
  const {id} = await params;
  const isNew = id === 'new';
  const menu = isNew ? null : await getMenuById(id);
  if (!isNew && !menu) notFound();
  return (
    <AdminShell title={isNew ? 'Nuevo menú' : 'Editar menú'}>
      <MenuForm id={isNew ? null : id} menu={menu} />
    </AdminShell>
  );
}
