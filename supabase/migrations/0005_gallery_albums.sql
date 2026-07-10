-- ============================================================
-- GALERÍA: álbumes por fecha
-- ============================================================
-- La tabla existía solo en el proyecto de desarrollo (se creó a mano desde el
-- dashboard). Sin esto, un proyecto nuevo levantado desde las migraciones
-- arranca sin ella y /galeria y /admin/galeria fallan. Esta migración refleja
-- el DDL real y es idempotente, así que también puede aplicarse sobre el
-- proyecto que ya la tiene.

create table if not exists gallery_albums (
  id         uuid primary key default gen_random_uuid(),
  title      text not null default '',
  date       date,                              -- null = sin fecha; ordena al final
  images     text[] not null default '{}',      -- URLs públicas del bucket `media`
  position   int not null default 0,
  created_at timestamptz not null default now()
);

-- getGalleryAlbums(): order by date desc nulls last, position
create index if not exists gallery_albums_order on gallery_albums (date desc nulls last, position);

alter table gallery_albums enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'gallery_albums' and policyname = 'gallery_public_read') then
    create policy "gallery_public_read" on gallery_albums for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'gallery_albums' and policyname = 'gallery_auth_write') then
    create policy "gallery_auth_write" on gallery_albums for all to authenticated using (true) with check (true);
  end if;
end $$;
