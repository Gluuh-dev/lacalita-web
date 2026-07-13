'use client';

import {useEffect, useSyncExternalStore} from 'react';
import {createClient} from '@/lib/supabase/client';

// Favorito y voto son el mismo gesto: al marcar el corazón se suma un voto.
// lc_votes lleva la cuenta de lo ya sumado por este dispositivo, así nadie vota
// dos veces al mismo plato (ni al volver de una versión antigua de la web).
const KEY = 'lc_votes';
let _sb: ReturnType<typeof createClient> | null = null;
const sb = () => (_sb ??= createClient());

function read(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

// ---- Contadores en vivo -----------------------------------------------------
// La carta es ISR: el número de votos que trae el HTML puede ir atrasado. Cada
// corazón pide su cuenta al montar y se agrupan todas en una sola consulta.
const counts = new Map<string, number>();
const listeners = new Set<() => void>();
let pending: string[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

async function flush() {
  timer = null;
  const ids = pending;
  pending = [];
  if (!ids.length) return;
  const {data} = await sb().from('products').select('id, votes').in('id', ids);
  for (const row of data ?? []) counts.set(row.id, row.votes ?? 0);
  emit();
}

function request(id: string) {
  if (counts.has(id)) return;
  pending.push(id);
  timer ??= setTimeout(flush, 30);
}

/** Votos del plato: los de la BD en cuanto llegan; mientras, los del HTML. */
export function useVotes(id: string, fallback: number) {
  useEffect(() => {
    request(id);
  }, [id]);
  const live = useSyncExternalStore(
    subscribe,
    () => counts.get(id),
    () => undefined
  );
  return live ?? fallback;
}

/** Pone el voto de este dispositivo a `on` y actualiza el contador en pantalla. */
export function syncVote(id: string, on: boolean, fallback = 0) {
  const map = read();
  const was = !!map[id];
  if (was === on) return;
  if (on) map[id] = true;
  else delete map[id];
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {}
  const delta = on ? 1 : -1;
  counts.set(id, Math.max(0, (counts.get(id) ?? fallback) + delta));
  emit();
  try {
    sb()
      .rpc('bump_votes', {pid: id, delta})
      .then(
        () => {},
        () => {}
      );
  } catch {}
}
