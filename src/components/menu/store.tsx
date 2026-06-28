'use client';

import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {createClient} from '@/lib/supabase/client';

let _sb: ReturnType<typeof createClient> | null = null;
function bumpLikes(id: string, delta: number) {
  try {
    (_sb ??= createClient()).rpc('bump_likes', {pid: id, delta}).then(() => {}, () => {});
  } catch {
    /* no-op */
  }
}

export type MenuItem = {
  id: string;
  name: string;
  price: number | null;
  image: string | null;
  slug: string;
  menuSlug: string;
  video?: string | null;
  desc?: string;
  ingredients?: string[];
  allergens?: {code: string; icon: string; name: Record<string, string>}[];
};

type ListEntry = {item: MenuItem; qty: number; note?: string};
type Store = {
  favs: Record<string, MenuItem>;
  list: Record<string, ListEntry>;
  isFav: (id: string) => boolean;
  toggleFav: (i: MenuItem) => void;
  qty: (id: string) => number;
  add: (i: MenuItem) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  setNote: (id: string, note: string) => void;
  clear: () => void;
  favCount: number;
  listCount: number;
  open: MenuItem | null;
  setOpen: (i: MenuItem | null) => void;
  videos: MenuItem[];
  setVideos: (v: MenuItem[]) => void;
  videoOpen: boolean;
  openVideo: () => void;
  closeVideo: () => void;
};

const Ctx = createContext<Store | null>(null);
const FK = 'lc_favs';
const LK = 'lc_list';

export function MenuStoreProvider({children}: {children: React.ReactNode}) {
  const [favs, setFavs] = useState<Record<string, MenuItem>>({});
  const [list, setList] = useState<Record<string, ListEntry>>({});
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<MenuItem | null>(null);
  const [videos, setVideos] = useState<MenuItem[]>([]);
  const [videoOpen, setVideoOpen] = useState(false);

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
    const adding = !favs[i.id];
    setFavs((f) => {
      const n = {...f};
      if (adding) n[i.id] = i;
      else delete n[i.id];
      return n;
    });
    bumpLikes(i.id, adding ? 1 : -1);
  }, [favs]);
  const add = useCallback((i: MenuItem) => {
    setList((l) => ({...l, [i.id]: {item: i, qty: (l[i.id]?.qty ?? 0) + 1, note: l[i.id]?.note}}));
  }, []);
  const setNote = useCallback((id: string, note: string) => {
    setList((l) => (l[id] ? {...l, [id]: {...l[id], note: note.trim() || undefined}} : l));
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
    setNote,
    clear,
    favCount: Object.keys(favs).length,
    listCount: Object.values(list).reduce((s, x) => s + x.qty, 0),
    open,
    setOpen,
    videos,
    setVideos,
    videoOpen,
    openVideo: () => setVideoOpen(true),
    closeVideo: () => setVideoOpen(false)
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMenuStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useMenuStore fuera del provider');
  return c;
}
