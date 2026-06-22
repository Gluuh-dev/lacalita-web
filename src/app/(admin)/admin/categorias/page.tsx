import {requireUser} from '@/lib/auth';
import {getCategoriesAdmin, getMenus} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import CategoriesManager from './categories-manager';

export default async function CategoriasList() {
  await requireUser();
  const [categories, menus] = await Promise.all([getCategoriesAdmin(), getMenus()]);
  return (
    <AdminShell title="Categorías">
      <CategoriesManager categories={categories} menus={menus} />
    </AdminShell>
  );
}
