'use client';

import {createContext, useCallback, useContext, useEffect, useState} from 'react';

export type MenuItem = {
  id: string;
  name: string;
  price: number | null;
  image: string | null;
  slug: string;
  menuSlug: string;
  video?: string | null;
  desc?: string;
  allergens?: {code: string; icon: string; name: Record<string, string>}[];
};

type Store = {
  favs: Record<string, MenuItem>;
  list: Record<string, {item: MenuItem; qty: number}>;
  isFav: (id: string) => boolean;
  toggleFav: (i: MenuItem) => void;
  qty: (id: string) => number;
  add: (i: MenuItem) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  favCount: number;
  listCount: number;
  open: MenuItem | null;
  setOpen: (i: MenuItem | null) => void;
};

const Ctx = createContext<Store | null>(null);
const FK = 'lc_favs';
const LK = 'lc_list';

export function MenuStoreProvider({children}: {children: React.ReactNode}) {
  const [favs, setFavs] = useState<Record<string, MenuItem>>({});
  const [list, setList] = useState<Record<string, {item: MenuItem; qty: number}>>({});
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<MenuItem | null>(null);

  useEffect(() => {
    try {
      setFavs(JSON.parse(localStorage.getItem(FK) || '{}'));
    } catch {}
    try {
      setList(JSON.parse(localStorage.getItem(LK) || '{}'));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(FK, JSON.stringify(favs));
  }, [favs, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(LK, JSON.stringify(list));
  }, [list, ready]);

  const toggleFav = useCallback((i: MenuItem) => {
    setFavs((f) => {
      const n = {...f};
      if (n[i.id]) delete n[i.id];
      else n[i.id] = i;
      return n;
    });
  }, []);
  const add = useCallback((i: MenuItem) => {
    setList((l) => ({...l, [i.id]: {item: i, qty: (l[i.id]?.qty ?? 0) + 1}}));
  }, []);
  const dec = useCallback((id: string) => {
    setList((l) => {
      const cur = l[id];
      if (!cur) return l;
      const q = cur.qty - 1;
      const n = {...l};
      if (q <= 0) delete n[id];
      else n[id] = {...cur, qty: q};
      return n;
    });
  }, []);
  const remove = useCallback((id: string) => {
    setList((l) => {
      const n = {...l};
      delete n[id];
      return n;
    });
  }, []);
  const clear = useCallback(() => setList({}), []);

  const value: Store = {
    favs,
    list,
    isFav: (id) => !!favs[id],
    toggleFav,
    qty: (id) => list[id]?.qty ?? 0,
    add,
    dec,
    remove,
    clear,
    favCount: Object.keys(favs).length,
    listCount: Object.values(list).reduce((s, x) => s + x.qty, 0),
    open,
    setOpen
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMenuStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useMenuStore fuera del provider');
  return c;
}
