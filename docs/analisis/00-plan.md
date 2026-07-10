# Análisis de mejoras — plan general

> Fecha: 10 de julio de 2026. Auditoría de código real (no suposiciones); cada
> hallazgo lleva `ruta:línea` en su documento. Este fichero es el índice y el
> orden de ataque propuesto.

| Doc | Área |
|---|---|
| [01-publico-responsive.md](01-publico-responsive.md) | Web pública: móvil / tablet / PC + i18n |
| [02-admin.md](02-admin.md) | Panel admin: consistencia, móvil, seguridad de guardado |
| [03-hero.md](03-hero.md) | `/admin/hero`: qué sobra, qué falta, drift preview↔web |
| [04-rendimiento.md](04-rendimiento.md) | Caché, imágenes, fuentes, JS, PWA |

## Los 8 problemas más serios (transversal)

1. **Guardado silencioso-fallido en el admin** — 7 server actions no validan
   sesión ni filas afectadas: con el token caducado (móvil en segundo plano)
   RLS bloquea el UPDATE, afecta 0 filas y la UI dice "Guardado". Pérdida de
   datos real. → [02-admin.md](02-admin.md#hallazgo-1)
2. **i18n roto en media web** — `/eventos/[id]`, `/galeria` y `/ubicacion`
   están enteras en español fijo, y también la navegación móvil, los meses
   (ENE/FEB…), y toda la cuenta atrás. Un visitante EN/FR ve español por todas
   partes. → [01-publico-responsive.md](01-publico-responsive.md)
3. **`/burguer` se sale del ISR sin querer** — `getAllergens()` usa `cookies()`
   → la landing entera se renderiza en cada visita y golpea Supabase cada vez.
   Arreglo pequeño, impacto grande. → [04-rendimiento.md](04-rendimiento.md)
4. **El LCP de la portada es un `<img>` plano** — el fondo del hero no pasa por
   `next/image`: sin AVIF/WebP, sin redimensionar, sin `priority`. La mayor
   ganancia de velocidad disponible. → [04-rendimiento.md](04-rendimiento.md)
5. **El play/pausa del hero queda tapado por la tab-bar móvil** (z-20 bajo
   z-40): invisible e inpulsable justo en móvil. → [01](01-publico-responsive.md)
6. **El hero tiene dos pintores** — `HeroView` (web) y `HeroStage` (preview del
   admin) reimplementan el mismo markup. Resultado: 8 diferencias documentadas
   entre lo que el admin ve y lo que la web enseña, incluida una opción
   (`anim`) que solo existe en la preview. → [03-hero.md](03-hero.md)
7. **Dos subidores de imágenes duplicados** — `MediaUpload` (paralelo, progreso
   real) y `HeroMedia` (secuencial, progreso **simulado** con `setInterval`).
   → [02-admin.md](02-admin.md)
8. **Esquema fuera de migraciones** — `burger_hero_slides`, `burger_offers`,
   `tickets`, columnas `votes/tag/ingredients/old_price/rating`… existen solo
   en la base de desarrollo. Al crear el proyecto de producción, todo eso
   faltará. (Ya se versionó `gallery_albums` en `0005`.)

## Plan por fases

### Fase 1 — Una tarde, sin riesgo (limpieza + arreglos puntuales)
- Borrar código muerto: rutas huérfanas `eventos|menus|categorias/[id]`,
  `admin-nav.tsx` + `logout-button.tsx`, `product-card.tsx`, tag `gallery`
  muerto, estado congelado del editor burger.
- Subir el play del hero por encima de la tab-bar; dar 44px de área táctil a
  los dots de los carruseles.
- `sizes` del event-card fila (100vw → 136px); `loading="lazy"` +
  `next/image` en la galería de la portada.
- Convertir Tosca Zero (620 KB TTF) y las otras 3 fuentes locales a WOFF2.
- Quitar el email de prueba del login; quitar los 2 textos de administrador
  visibles al público (burger-landing, menu-tabbar).
- Arreglar la marquesina del hero en móvil web (`pc` hardcodeado).

### Fase 2 — Un día (rendimiento + robustez del guardado)
- Helper `requireUserForAction()` en las 7 actions desprotegidas + comprobar
  filas afectadas.
- `getAllergens` → `supabasePublic` + `unstable_cache` (devuelve `/burguer` al ISR).
- Fondo del hero → `next/image` con `priority`.
- `Reveal` sin framer-motion (IntersectionObserver + keyframes ya existentes).
- Cachear `getMediaUsage` (hoy escanea el bucket entero en cada visita a
  `/admin/galeria`).

### Fase 3 — Dos días (i18n + consistencia)
- Mover TODOS los literales a `messages/{es,en,fr}.json`: detalle de evento,
  galería, ubicación, tab-bars, meses/cuenta atrás, carta. (El inventario
  completo está en 01.)
- Escalones `md:` para tablet (agenda del hero, sidebar del evento, reseñas).
- Homogeneizar admin: `FormFooter` + `btnEdit` + modal de confirmación en
  productos, hamburguesería, contenido, ajustes y hero; eventos a página
  propia como galería.
- Fusionar `HeroMedia` dentro de `MediaUpload` (variante `preview`).

### Fase 4 — El hero (refactor con criterio)
- **Un solo pintor**: la preview del admin pasa a ser `HeroView` escalado;
  se borra `HeroStage` (~200 líneas) y los 8 drifts desaparecen de raíz.
- Podar campos: `anim`, `eventBtn*`, legados (`showLogo`, `rotulo`, `sub`,
  `font`, `color`) con migración de datos al guardar.
- Un único selector de modo (hoy hay dos que se pisan).
- Ocultar controles inertes según modo (tint/blur/lema/… no aplican en póster).
- Añadir: duplicar diapositiva, programación por fechas, imagen específica
  para móvil. Detalle y justificación en [03-hero.md](03-hero.md).

### Fase 5 — Antes de producción
- Volcar TODO el esquema real a migraciones (burger, tickets, columnas extra).
- Generar `supabase/seed.sql` con las cartas reales.
- `generateStaticParams` en cartas y eventos.
- Decidir el service worker (cache-first para `/_next/static` o retirarlo) y
  añadir iconos PNG/maskable al manifest.

## Pendientes de contenido (no de código)
- Cartas de bebidas (refrescos, cervezas, vinos) sin transcribir.
- Foto de playa del hero por subir en `/admin/hero`.
