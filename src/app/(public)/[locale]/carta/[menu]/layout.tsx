import CartaTabBar from '@/components/menu/carta-tabbar';

// Envuelve carta / favoritos / lista / vídeo / detalle con la tabbar de la carta.
export default function CartaMenuLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      {children}
      <CartaTabBar />
    </>
  );
}
