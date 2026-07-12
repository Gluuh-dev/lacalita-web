-- ============================================================
-- CATEGORÍAS: rol para el configurador "Arma tu tostada"
-- ============================================================
-- 'normal'  : categoría corriente (por defecto).
-- 'base'    : sus productos son la base elegible (los panes).
-- 'topping' : sus productos son suplementos que se suman a la base.
-- Cuando una carta tiene ≥1 base y ≥1 topping, la web muestra un configurador
-- (pan arriba, relleno abajo) además de las listas normales.

alter table categories add column if not exists role text not null default 'normal';
