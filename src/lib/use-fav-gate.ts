'use client';

import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {useIsAdmin} from '@/lib/use-is-admin';
import {useMenuStore, type MenuItem} from '@/components/menu/store';

// Marcar favorito requiere sesión (solo existe el usuario admin). Si no hay sesión,
// avisa y lleva al login. /admin/login NO está localizado → usamos el router base.
export function useFavGate() {
  const isAdmin = useIsAdmin();
  const {toggleFav} = useMenuStore();
  const router = useRouter();
  return (item: MenuItem) => {
    if (!isAdmin) {
      toast('Inicia sesión para guardar favoritos');
      router.push('/admin/login');
      return;
    }
    toggleFav(item);
  };
}
