'use client';

import {useEffect, useState} from 'react';
import {Heart} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';

const KEY = 'lc_votes';
function getVoted(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}
let _sb: ReturnType<typeof createClient> | null = null;

// Botón de voto/valoración: 1 voto por dispositivo (localStorage). Suma/resta en BD.
export default function VoteButton({id, votes, className = ''}: {id: string; votes: number; className?: string}) {
  const [voted, setVoted] = useState(false);
  const [count, setCount] = useState(votes);

  useEffect(() => {
    setVoted(!!getVoted()[id]);
  }, [id]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const map = getVoted();
    const now = !map[id];
    if (now) map[id] = true;
    else delete map[id];
    try {
      localStorage.setItem(KEY, JSON.stringify(map));
    } catch {}
    setVoted(now);
    setCount((c) => Math.max(0, c + (now ? 1 : -1)));
    try {
      (_sb ??= createClient()).rpc('bump_votes', {pid: id, delta: now ? 1 : -1}).then(() => {}, () => {});
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={voted}
      aria-label={voted ? 'Quitar voto' : 'Votar'}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold shadow-sm backdrop-blur transition active:scale-90 ${voted ? 'bg-[#c36148] text-white' : 'bg-white/90 text-[#c36148]'} ${className}`}
    >
      <Heart className={`size-4 transition ${voted ? 'scale-110' : ''}`} fill={voted ? 'currentColor' : 'none'} />
      {count}
    </button>
  );
}
