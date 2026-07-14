-- ============================================================
-- GALERÍA: tipo de álbum, portada elegida y vínculo con el evento
-- ============================================================
-- kind separa las fotos de la noche del sábado de las del plato:
--   evento | comida | local | gente
-- cover: la foto que manda en la rejilla (antes era siempre la primera).
-- event_id: si el álbum salió de un evento, para enseñarlo en su ficha.

alter table gallery_albums add column if not exists kind text not null default 'evento';
alter table gallery_albums add column if not exists cover text;
alter table gallery_albums add column if not exists event_id uuid references events(id) on delete set null;

-- ============================================================
-- RESEÑAS: tabla propia (antes vivían en settings.content, que nadie rellenaba)
-- ============================================================
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  text text not null,
  rating int not null default 5 check (rating between 1 and 5),
  source text,                       -- Google, TripAdvisor…
  date date,
  visible boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);

alter table reviews enable row level security;

-- Las lee cualquiera (son públicas); solo el admin autenticado las toca.
drop policy if exists "reviews_public_read" on reviews;
create policy "reviews_public_read" on reviews for select using (visible);

drop policy if exists "reviews_admin_all" on reviews;
create policy "reviews_admin_all" on reviews for all to authenticated using (true) with check (true);
