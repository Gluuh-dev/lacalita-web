# La Calita — Fase final (autónoma)

_Plan a implementar sin interrupciones. Config de variables y pruebas → al final._

## Lote 1 — Flujos y bugs (rápido)
- [x] **Bug**: al añadir a la lista desde un modal/vídeo se cerraba y volvía a la home. Ahora "Añadir" añade + toast y **no cierra/navega**.
- [x] **Landing → carta por categoría**: el carrusel "elige tu antojo" enlaza a `/carta/hamburgueseria?cat=<id>` y la carta **abre esa categoría seleccionada**.
- [x] **Landing → producto**: las favoritas ya enlazan a la ficha del producto.
- [x] **Landing → oferta**: "Ver la oferta" abre la página de oferta a pantalla completa.

## Lote 2 — Carta hamburguesería: páginas en vez de modales (móvil)
- [ ] En la carta de la hamburguesería, al pulsar un producto **navega a su página** `/carta/hamburgueseria/[slug]` (no modal). Más funcional para la compra futura.

## Lote 3 — Favoritos con login
- [ ] Para marcar favorito hay que **estar logueado** (único usuario: el admin existente). Si no, lleva a `/admin/login`.
- [ ] (No registro público; solo el admin creado.)

## Lote 4 — Eventos con entradas
- [ ] DB: `event_tickets` (tipos, precio, aforo) y `ticket_orders`.
- [ ] Admin: gestionar entradas por evento (crear tipos, precio, aforo, activar).
- [ ] Público: en el detalle del evento, **comprar/reservar entradas** (UI lista; pasarela Stripe se conecta al final con las claves).

## Lote 5 — Pulido y mejoras varias
- [ ] Reveal/animaciones de aparición en más secciones.
- [ ] Estados vacíos y skeletons donde falten (admin).
- [ ] Consistencia visual (botones, precios), accesibilidad.

## Final (cuando todo esté)
- [ ] Configurar variables de entorno (Stripe, etc.).
- [ ] Pruebas en móvil/tablet/PC y arreglo de detalles.
