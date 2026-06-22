'use client';

import {createContext, useContext, useState} from 'react';

type Mode = {overHero: boolean; hasMedia: boolean};

const Ctx = createContext<{mode: Mode; set: (m: Mode) => void}>({
  mode: {overHero: false, hasMedia: false},
  set: () => {}
});

export function HeaderModeProvider({children}: {children: React.ReactNode}) {
  const [mode, setMode] = useState<Mode>({overHero: false, hasMedia: false});
  return <Ctx.Provider value={{mode, set: setMode}}>{children}</Ctx.Provider>;
}

export const useHeaderMode = () => useContext(Ctx);
