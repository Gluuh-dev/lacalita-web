import CartaTabBar from '@/components/menu/carta-tabbar';
import {getMenu} from '@/lib/queries';

// Envuelve carta / favoritos / lista / vídeo / detalle con la tabbar de la carta.
// Calcula si la carta tiene vídeos: sin ellos, la pestaña Vídeo sale apagada.
export default async function CartaMenuLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{menu: string}>;
}) {
  const {menu} = await params;
  const data = await getMenu(menu);
  const hasVideos = !!data?.categories?.some((c) => c.products?.some((p) => p.video));
  return (
    <>
      {children}
      <CartaTabBar hasVideos={hasVideos} />
    </>
  );
}
