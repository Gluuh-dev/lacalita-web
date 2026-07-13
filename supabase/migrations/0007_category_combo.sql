-- ============================================================
-- CATEGORÍAS: precio de "Hazlo menú" (patatas + bebida)
-- ============================================================
-- Si una categoría tiene combo_price, sus productos muestran en el detalle la
-- tarjeta "Hazlo menú": al activarla, ese importe se suma al precio del plato.
-- null = esa categoría no ofrece menú.

alter table categories add column if not exists combo_price numeric;
