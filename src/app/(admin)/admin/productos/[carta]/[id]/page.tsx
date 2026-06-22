import {notFound} from 'next/navigation';
import {requireUser} from '@/lib/auth';
import {getProductById, getMenusWithCategories, getAllergens} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import ProductForm from '../../product-form';

export default async function ProductEditPage({params}: {params: Promise<{carta: string; id: string}>}) {
  await requireUser();
  const {carta, id} = await params;
  const isNew = id === 'nuevo';
  const [product, allMenus, allergens] = await Promise.all([
    isNew ? Promise.resolve(null) : getProductById(id),
    getMenusWithCategories(),
    getAllergens()
  ]);
  if (!isNew && !product) notFound();
  const menu = allMenus.find((m) => m.slug === carta);
  const menus = menu ? [menu] : allMenus;
  return (
    <AdminShell title={isNew ? 'Nuevo producto' : 'Editar producto'}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ProductForm id={isNew ? null : id} product={product as any} menus={menus as any} allergens={allergens} cartaSlug={carta} />
    </AdminShell>
  );
}
