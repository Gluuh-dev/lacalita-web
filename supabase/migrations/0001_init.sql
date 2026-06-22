-- 0001_init.sql — Esquema inicial La Calita
-- Base de DESARROLLO (szylffdzkjjrqlfyncqv). Reproducir tal cual en la base real.
-- Idiomas inline como jsonb {es,en,fr}. Sin pedidos/carrito/pagos.

-- ============================================================
-- TABLAS
-- ============================================================

create table if not exists menus (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,            -- 'restaurante' | 'hamburgueseria'
  name         jsonb not null,                  -- {es,en,fr}
  subtitle     jsonb,
  theme        text not null default 'calita',  -- 'calita' | 'burger'
  header_image text,
  header_video text,
  position     int not null default 0,
  updated_at   timestamptz not null default now()
);

create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  menu_id     uuid not null references menus(id) on delete cascade,
  name        jsonb not null,
  description jsonb,
  image       text,
  position    int not null default 0,
  visible     boolean not null default true
);
create index if not exists categories_menu_pos on categories(menu_id, position);

create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  slug        text not null,                    -- para URL detalle
  name        jsonb not null,
  description jsonb,
  price       numeric(8,2),                     -- null si usa variantes
  image       text,
  video       text,
  featured    boolean not null default false,
  available   boolean not null default true,
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists products_cat_pos on products(category_id, position);
create unique index if not exists products_cat_slug on products(category_id, slug);

create table if not exists product_variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name       jsonb not null,                    -- {es,en,fr} ej "Media"/"Entera"
  price      numeric(8,2) not null,
  position   int not null default 0
);

create table if not exists allergens (
  id   uuid primary key default gen_random_uuid(),
  code text unique not null,                    -- 'gluten','lacteos',...
  name jsonb not null,
  icon text not null
);

create table if not exists product_allergens (
  product_id  uuid references products(id) on delete cascade,
  allergen_id uuid references allergens(id) on delete cascade,
  primary key (product_id, allergen_id)
);

create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  title       jsonb not null,
  description jsonb,
  artist      text,
  kind        text not null default 'concierto', -- 'concierto'|'dj'|'otro'
  starts_at   timestamptz not null,
  image       text,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists events_starts on events(starts_at);

create table if not exists settings (
  id         int primary key default 1 check (id = 1),
  hours      jsonb,
  address    text,
  maps_url   text,
  phone      text,
  email      text,
  social     jsonb,
  landing    jsonb,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- RLS: lectura pública de lo publicado, escritura solo admin autenticado
-- ============================================================

alter table menus             enable row level security;
alter table categories        enable row level security;
alter table products          enable row level security;
alter table product_variants  enable row level security;
alter table allergens         enable row level security;
alter table product_allergens enable row level security;
alter table events            enable row level security;
alter table settings          enable row level security;

-- Lectura pública
create policy "public read menus"     on menus             for select using (true);
create policy "public read cats"      on categories        for select using (visible = true);
create policy "public read products"  on products          for select using (available = true);
create policy "public read variants"  on product_variants  for select using (true);
create policy "public read allergens" on allergens         for select using (true);
create policy "public read prod_all"  on product_allergens for select using (true);
create policy "public read events"    on events            for select using (published = true);
create policy "public read settings"  on settings          for select using (true);

-- Escritura solo autenticado (un único admin para empezar)
create policy "admin write menus"     on menus             for all to authenticated using (true) with check (true);
create policy "admin write cats"      on categories        for all to authenticated using (true) with check (true);
create policy "admin write products"  on products          for all to authenticated using (true) with check (true);
create policy "admin write variants"  on product_variants  for all to authenticated using (true) with check (true);
create policy "admin write allergens" on allergens         for all to authenticated using (true) with check (true);
create policy "admin write prod_all"  on product_allergens for all to authenticated using (true) with check (true);
create policy "admin write events"    on events            for all to authenticated using (true) with check (true);
create policy "admin write settings"  on settings          for all to authenticated using (true) with check (true);

-- ============================================================
-- STORAGE: bucket público de medios (subida solo admin)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
create policy "admin write media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
create policy "admin update media" on storage.objects
  for update to authenticated using (bucket_id = 'media');
create policy "admin delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
