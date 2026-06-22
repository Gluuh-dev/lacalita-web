import {notFound} from 'next/navigation';
import {requireUser} from '@/lib/auth';
import {getCategoryById, getMenus} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import CategoryForm from '../category-form';

export default async function CategoriaEdit({
  params
}: {
  params: Promise<{id: string}>;
}) {
  await requireUser();
  const {id} = await params;
  const isNew = id === 'new';
  const [category, menus] = await Promise.all([
    isNew ? Promise.resolve(null) : getCategoryById(id),
    getMenus()
  ]);
  if (!isNew && !category) notFound();
  return (
    <AdminShell title={isNew ? 'Nueva categoría' : 'Editar categoría'}>
      <CategoryForm id={isNew ? null : id} category={category} menus={menus} />
    </AdminShell>
  );
}
