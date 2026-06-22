import {notFound} from 'next/navigation';
import {requireUser} from '@/lib/auth';
import {getProductsAdmin, getMenusWithCategories} from '@/lib/queries';
import {tx} from '@/lib/localize';
import AdminShell from '@/components/admin/admin-shell';
import ProductsTable from '../products-table';

export default async function ProductosCarta({params}: {params: Promise<{carta: string}>}) {
  await requireUser();
  const {carta} = await params;
  const [allProducts, allMenus] = await Promise.all([getProductsAdmin(), getMenusWithCategories()]);
  const menu = allMenus.find((m) => m.slug === carta);
  if (!menu) notFound();
  const products = allProducts.filter((p) => p.categories?.menus?.slug === carta);
  return (
    <AdminShell title={`Productos · ${tx(menu.name, 'es')}`}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ProductsTable products={products as any} cartaSlug={carta} />
    </AdminShell>
  );
}
