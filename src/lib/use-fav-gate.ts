'use client';

import {useMenuStore, type MenuItem} from '@/components/menu/store';

// Favoritos son anónimos (localStorage), abiertos a cualquier cliente: solo alterna.
export function useFavGate() {
  const {toggleFav} = useMenuStore();
  return (item: MenuItem) => toggleFav(item);
}
