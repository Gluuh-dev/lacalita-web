'use client';

import {useMenuStore, type MenuItem} from '@/components/menu/store';
import {syncVote} from '@/lib/vote';

// Favoritos son anónimos (localStorage): solo alterna. Y como favorito y voto
// son el mismo gesto, quitarlo desde cualquier sitio también retira el voto.
export function useFavGate() {
  const {toggleFav, isFav} = useMenuStore();
  return (item: MenuItem) => {
    const next = !isFav(item.id);
    toggleFav(item);
    syncVote(item.id, next);
  };
}
