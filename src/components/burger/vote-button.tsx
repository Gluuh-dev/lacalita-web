'use client';

import {Heart} from 'lucide-react';
import {useMenuStore, type MenuItem} from '@/components/menu/store';
import {syncVote, useVotes} from '@/lib/vote';

// Un solo corazón: guarda en favoritos y vota a la vez. El número es el voto
// público del plato; el relleno del corazón, que lo tienes en tus favoritos.
export default function VoteButton({item, votes, className = ''}: {item: MenuItem; votes: number; className?: string}) {
  const {isFav, toggleFav} = useMenuStore();
  const on = isFav(item.id);
  const count = useVotes(item.id, votes);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFav(item);
    syncVote(item.id, !on, votes);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition active:scale-90 ${on ? 'bg-brand text-on-primary' : 'bg-surface text-brand-deep ring-1 ring-line hover:ring-brand'} ${className}`}
    >
      <Heart className={`size-4 transition ${on ? 'scale-110' : ''}`} fill={on ? 'currentColor' : 'none'} />
      {count > 0 && count}
    </button>
  );
}
