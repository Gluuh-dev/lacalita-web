import {requireUser} from '@/lib/auth';
import {getProductsAdmin, getMenusWithCategories, getAllergens} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import ProductsTable from './products-table';

export default async function ProductosList() {
  await requireUser();
  const [products, menus, allergens] = await Promise.all([
    getProductsAdmin(),
    getMenusWithCategories(),
    getAllergens()
  ]);
  return (
    <AdminShell title="Productos">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ProductsTable products={products as any} menus={menus as any} allergens={allergens} />
    </AdminShell>
  );
}
