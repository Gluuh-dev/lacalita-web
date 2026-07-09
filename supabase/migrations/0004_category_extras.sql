-- 0004_category_extras.sql — Salsas/extras a nivel de CATEGORÍA (display-only, sin carrito).
-- Se muestran en el detalle de cada producto de la categoría ("Salsas para acompañar").
-- Convención del jsonb: [{"name":{"es","en","fr"},"price":number}]
alter table categories
  add column if not exists extras jsonb not null default '[]'::jsonb;
