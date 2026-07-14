'use client';

import {useState} from 'react';
import {Images, UtensilsCrossed, Music, Sun, Users} from 'lucide-react';
import GalleryGrid from '@/components/gallery-grid';

export type AlbumSection = {
  key: string;
  title: string;
  dateLabel: string;
  kind: string;
  imgs: string[];
};

// Los mismos chips que la carta: el filtro vive en cliente, sin recargar nada.
const TIPOS = [
  {value: 'todos', label: 'Todo', Icon: Images},
  {value: 'evento', label: 'Eventos', Icon: Music},
  {value: 'comida', label: 'Comida', Icon: UtensilsCrossed},
  {value: 'local', label: 'El local', Icon: Sun},
  {value: 'gente', label: 'Gente', Icon: Users}
];

export default function GalleryAlbums({sections}: {sections: AlbumSection[]}) {
  const [kind, setKind] = useState('todos');

  // Solo se ofrecen los filtros que tienen álbumes: nada de chips que no llevan a ningún sitio.
  const presentes = new Set(sections.map((s) => s.kind));
  const chips = TIPOS.filter((t) => t.value === 'todos' || presentes.has(t.value));
  const visibles = kind === 'todos' ? sections : sections.filter((s) => s.kind === kind);

  return (
    <>
      {chips.length > 2 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2.5">
          {chips.map(({value, label, Icon}) => {
            const on = kind === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setKind(value)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 font-adam text-[0.8125rem] uppercase tracking-[0.06em] transition ${
                  on ? 'border-brand bg-brand text-on-primary' : 'border-line bg-surface text-brand hover:border-brand/40'
                }`}
              >
                <Icon className="size-4 shrink-0" strokeWidth={2} />
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-12">
        {visibles.map((s) => (
          <section key={s.key}>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2">
              <h2 className="font-serif text-2xl">{s.title}</h2>
              {s.dateLabel && <span className="font-adam text-[0.72rem] uppercase tracking-[0.1em] text-ink-3">{s.dateLabel}</span>}
            </div>
            <GalleryGrid images={s.imgs} alt={s.title} />
          </section>
        ))}
      </div>
    </>
  );
}
