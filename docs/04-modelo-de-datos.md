# 04 — Modelo de datos (Supabase / Postgres)

## ⚠️ Regla de oro: la base actual NO es la definitiva

El proyecto `szylffdzkjjrqlfyncqv` es de **desarrollo**. Cuando exista la base real,
hay que reproducir en ella TODO lo que hayamos hecho aquí. Para que eso sea posible:

- **Cada cambio de esquema va en un fichero de migración SQL** numerado en
  `supabase/migrations/NNNN_descripcion.sql`. Nunca se toca la base "a mano" sin dejar
  el SQL en el repo.
- Los ficheros son la **fuente de verdad**. Replicar en la real = ejecutarlos en orden
  (`supabase db push` o pegarlos en el SQL Editor).
- Los datos de contenido (carta) van en migraciones/seed aparte para poder cargarlos
  igual en la real.

Ficheros actuales:
- `supabase/migrations/0001_init.sql` — esquema completo + RLS + buckets.
- (seed de contenido: cuando se apruebe la carta, `0002_seed.sql`.)

## Principios

- **Idiomas inline:** cada campo traducible es un `jsonb` `{ "es": "...", "en": "...",
  "fr": "..." }`. Evita tablas de traducción y joins. Se auto-rellena al guardar (ver `06`).
- **Sin pedidos:** no hay carrito, usuarios cliente, ni pagos. Solo contenido.
- **Orden manual:** `position int` para reordenar arrastrando en el admin.
- **Medios** (imagen/vídeo): guardamos la URL pública de Supabase Storage.

## Tablas

### `menus` — las dos cartas
```sql
create table menus (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,         -- 'restaurante' | 'hamburgueseria'
  name        jsonb not null,               -- {es,en,fr}
  subtitle    jsonb,                        -- cabecera editable
  theme       text not null default 'calita', -- 'calita' | 'burger'
  header_image text,                        -- URL
  header_video text,                        -- URL (opcional)
  position    int not null default 0,
  updated_at  timestamptz default now()
);
```

### `categories` — categorías dentro de una carta
```sql
create table categories (
  id          uuid primary key default gen_random_uuid(),
  menu_id     uuid not null references menus(id) on delete cascade,
  name        jsonb not null,               -- {es,en,fr}
  description jsonb,
  image       text,
  position    int not null default 0,
  visible     boolean not null default true
);
create index on categories(menu_id, position);
```

### `products`
```sql
create table products (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  slug        text not null,                -- para URL detalle, único por carta
  name        jsonb not null,               -- {es,en,fr}
  description jsonb,                         -- {es,en,fr}
  price       numeric(8,2),                 -- precio único (null si usa variantes)
  image       text,                         -- URL foto
  video       text,                         -- URL vídeo (uno u otro, o ambos)
  featured    boolean not null default false,
  available   boolean not null default true,
  position    int not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index on products(category_id, position);
```

### `product_variants` — para precios tipo media/entera
```sql
-- Ej.: Tostada -> "Media" 0,80€ / "Entera" 1,20€. Si el producto tiene precio único,
-- no se crean variantes.
create table product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  name        jsonb not null,               -- {es,en,fr} ej "Media"/"Entera"
  price       numeric(8,2) not null,
  position    int not null default 0
);
```

### `allergens` — catálogo fijo (14 oficiales UE)
```sql
create table allergens (
  id    uuid primary key default gen_random_uuid(),
  code  text unique not null,               -- 'gluten','lacteos','huevos'...
  name  jsonb not null,                     -- {es,en,fr}
  icon  text not null                       -- nombre/URL del icono
);

create table product_allergens (
  product_id  uuid references products(id) on delete cascade,
  allergen_id uuid references allergens(id) on delete cascade,
  primary key (product_id, allergen_id)
);
```

### `events` — DJs, conciertos
```sql
create table events (
  id          uuid primary key default gen_random_uuid(),
  title       jsonb not null,               -- {es,en,fr}
  description jsonb,
  artist      text,                         -- nombre DJ / grupo
  kind        text default 'concierto',     -- 'concierto' | 'dj' | 'otro'
  starts_at   timestamptz not null,
  image       text,
  published   boolean not null default true,
  created_at  timestamptz default now()
);
create index on events(starts_at);
```

### `settings` — singleton (datos del local + bloques de landing)
```sql
create table settings (
  id          int primary key default 1 check (id = 1),
  hours       jsonb,        -- horarios por día
  address     text,
  maps_url    text,
  phone       text,
  email       text,
  social      jsonb,        -- {instagram, facebook, tiktok...}
  landing     jsonb,        -- bloques editables: hero, textos, lista de medios
  updated_at  timestamptz default now()
);
```

## Seguridad (RLS)

- **Lectura pública** de todo lo `visible/published/available` → la web la sirve sin login.
- **Escritura solo admin autenticado** (Supabase Auth). Un único rol admin para empezar.

```sql
alter table products enable row level security;
create policy "public read" on products for select using (available = true);
create policy "admin write" on products for all
  to authenticated using (true) with check (true);
-- mismo patrón en el resto de tablas
```

> `ponytail:` un solo admin = `to authenticated` basta. Si en el futuro hay varios
> roles, añadir tabla `profiles` con `role` y afinar policies.

## Storage (buckets)

- `media` (público): imágenes y vídeos de productos, categorías, cabeceras, eventos,
  landing. Subida solo desde admin.
