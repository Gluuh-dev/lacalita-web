import {notFound} from 'next/navigation';
import {requireUser} from '@/lib/auth';
import {getProductById, getMenusWithCategories, getAllergens} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import ProductForm from '../product-form';

export default async function ProductoEdit({
  params
}: {
  params: Promise<{id: string}>;
}) {
  await requireUser();
  const {id} = await params;
  const isNew = id === 'new';
  const [product, menus, allergens] = await Promise.all([
    isNew ? Promise.resolve(null) : getProductById(id),
    getMenusWithCategories(),
    getAllergens()
  ]);
  if (!isNew && !product) notFound();
  return (
    <AdminShell title={isNew ? 'Nuevo producto' : 'Editar producto'}>
      <ProductForm
        id={isNew ? null : id}
        product={product}
        menus={menus}
        allergens={allergens}
      />
    </AdminShell>
  );
}
