'use client';

import {createClient} from '@/lib/supabase/client';

// Favorito y voto son el mismo gesto: al marcar el corazón se suma un voto.
// lc_votes lleva la cuenta de lo ya sumado por este dispositivo, así nadie vota
// dos veces al mismo plato (ni al volver de una versión antigua de la web).
const KEY = 'lc_votes';
let _sb: ReturnType<typeof createClient> | null = null;

function read(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function hasVoted(id: string) {
  return !!read()[id];
}

/** Pone el voto de este dispositivo a `on`. Devuelve el delta aplicado (-1, 0 o 1). */
export function syncVote(id: string, on: boolean): number {
  const map = read();
  const was = !!map[id];
  if (was === on) return 0;
  if (on) map[id] = true;
  else delete map[id];
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {}
  const delta = on ? 1 : -1;
  try {
    (_sb ??= createClient()).rpc('bump_votes', {pid: id, delta}).then(
      () => {},
      () => {}
    );
  } catch {}
  return delta;
}
