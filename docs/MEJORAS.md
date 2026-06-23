# La Calita — Plan de mejoras

_Análisis del proyecto y hoja de ruta. Prioridad nº1: **que se vea perfecto en móvil**._
_Basado en análisis exhaustivo del código (junio 2026)._

Leyenda de prioridad: **P0** = crítico/ahora · **P1** = importante · **P2** = roadmap (posibles mejoras).

---

## Resumen

La base está bien montada: App Router + i18n, ISR (`revalidate=300`), Supabase con RLS, favoritos/lista en `localStorage`, admin CRUD completo, PWA. Lo que falta es **pulido de móvil, carga (skeletons), optimización de fondos/vídeo, y hacer los heroes configurables por separado en móvil y PC**. El resto (votos, emails, Stripe) queda como roadmap.

---

## P0 — Móvil perfecto (lo más importante)

### 1. Alturas: pasar a `dvh` donde haga falta
- **Estado:** el hero usa `100svh` (bien). Pero conviene revisar barras fijas y overlays.
- **Acción:** usar `100dvh` para contenedores a pantalla completa que deban seguir la barra dinámica del navegador móvil (la `svh` deja hueco cuando la barra se oculta). `svh` para el hero está bien; `dvh` para overlays/menús a pantalla completa.
- **Dónde:** `src/components/hero.tsx`, `src/components/burger/burger-hero.tsx`, overlays en `header-bar.tsx`, `menu/menu-tabbar.tsx`.

### 2. Scroll en móvil dentro de modales/sheets
- **Estado:** el bottom-sheet del producto (`menu-tabbar.tsx`) hace drag manual con `onTouchMove`; `useScrollLock` fija el body.
- **Riesgos:** scroll interno del sheet que no llega abajo, "scroll chaining" al body, y rebote en iOS.
- **Acción:**
  - El contenedor scrollable del sheet: `overflow-y:auto; overscroll-behavior:contain; -webkit-overflow-scrolling:touch`.
  - Asegurar `max-height` del sheet (`85dvh`) y que el área de contenido haga el scroll, no el body.
  - Mantener `useScrollLock` (ya guarda/restaura scrollY — correcto).
- **Dónde:** `src/components/menu/menu-tabbar.tsx`, `src/lib/use-scroll-lock.ts`.

### 3. Áreas táctiles y safe-area (notch / barra inferior)
- **Acción:** botones y la tab bar inferior con `min-height: 44px` y respetar `env(safe-area-inset-bottom)` (`padding-bottom: max(12px, env(safe-area-inset-bottom))`).
- **Dónde:** `menu-tabbar.tsx` (barra inferior), botones del hero.

### 4. Fondos del hero pesados en móvil
- Ver **P1 §6** (imágenes). En móvil el impacto es mayor: servir versión más pequeña.

### 5. Comprobación real en dispositivos
- Probar en iOS Safari y Android Chrome: scroll de cartas, apertura/cierre de sheet, botón atrás de Android (ya cubierto por `use-back-close.ts`), teclado abriendo en formularios admin.

---

## P0/P1 — Carga y rendimiento ("que cargue todo bien")

### 6. Optimizar fondos e imágenes
- **Problema:** los fondos del hero se pintan con `style={{background:url(...)}}` → **no pasan por `next/image`**, sin lazy-load ni redimensionado.
- **Acción:**
  - Donde sea fondo decorativo grande: usar `<Image fill priority>` (solo el hero visible inicial con `priority`, el resto `loading="lazy"`).
  - Convertir JPG de `public/burger/bg/` a **WebP/AVIF** y servir tamaños por breakpoint (`sizes`).
- **Dónde:** `hero.tsx`, `burger-hero.tsx`, `public/burger/bg/`.

### 7. Vídeos: lazy + poster
- **Problema:** `<video autoPlay loop muted>` sin `poster` ni `preload="none"` → descarga aunque no se vea.
- **Acción:** `preload="metadata"` (ya en FX) o `none`; añadir `poster` (primer frame) para que se vea algo al instante; pausar vídeos fuera de viewport con `IntersectionObserver` (ya se hace en reels — replicar en hero FX si hace falta).
- **Dónde:** `burger-fx.tsx` (FxVideo), reels en carta.

### 8. Skeletons en TODO (estados de carga uniformes)
- **Estado:** solo hay `loading.tsx` en `/carta/[menu]` y `/eventos`. Faltan en muchas vistas.
- **Acción:** crear un `Skeleton` reutilizable (o el de shadcn) y añadir:
  - `loading.tsx` en: home `/`, `/carta`, `/carta/[menu]/[producto]`, `/hamburgueseria`, `/eventos/[id]`, y en **admin** (`/admin/*`).
  - **Suspense** alrededor de los listados que cargan datos (cartas, ofertas, favoritas) con su skeleton.
  - Placeholder en la **ficha de producto del modal** (ahora carga sin estado de carga).
- **Dónde:** `src/components/ui/skeleton.tsx` (añadir con shadcn), `app/.../loading.tsx`, `menu-tabbar.tsx`.

### 9. `blur` placeholder en imágenes de producto
- **Acción:** `placeholder="blur"` con `blurDataURL` (o color) en `product-card`, `product-item`, ofertas → evita el "salto" al cargar.

---

## P1 — Heroes configurables por separado en móvil y PC (dos configuraciones independientes)

**Objetivo:** que en el admin se pueda ajustar el hero del **restaurante** y el de la **hamburguesería** con **dos configuraciones independientes: una para PC y otra para móvil** (posiciones, tamaños, qué se ve, fondos), no una sola compartida.

### Estado actual
- **Hero restaurante** (`hero.tsx` + `HeroSlide` en `hero-types.ts`): config única; el responsive es solo CSS (`clamp()`, breakpoints).
- **Hero hamburguesería** (`burger-hero.tsx` + `BurgerSlide`): config única; ya tiene posiciones (`titleY`, `priceY`, `fxVideoX/Y/Scale`) pero **compartidas** PC/móvil (solo el vídeo se fuerza al centro en móvil por CSS).

### Diseño propuesto (mismo patrón para ambos)
1. **Modelo de datos:** añadir un bloque de **overrides móviles** opcional. Dos opciones:
   - **A (recomendada, simple):** columnas/JSON `mobile` que solo guarda los campos que cambian en móvil (`{titleScale, titleY, priceY, contentAlign, bgImage, fxVideoX/Y/Scale, ...}`). Si un campo móvil es `null`, hereda el de PC.
   - B: duplicar todos los campos con sufijo `_m` (más columnas, menos elegante).
2. **Lectura en runtime:** el componente detecta viewport (ya calcula `pc`) y aplica `cfg = pc ? base : {...base, ...mobile}`.
3. **Editor (admin):** el toggle **PC / Móvil** que ya existe en la previsualización pasa a **cambiar qué configuración se edita** (no solo previsualizar). Botón "Copiar de PC a móvil" para partir de la misma base.
4. **Previsualización:** ya hay preview PC/Móvil (`burger-hero-preview.tsx`) — conectarla a la config que corresponda.

### Esfuerzo / dónde
- DB: migración (campos `mobile` jsonb en `hero_slides` y `burger_hero_slides`).
- `hero-types.ts`, `queries.ts` (tipos), `hero.tsx`, `burger-hero.tsx` (merge PC/móvil).
- Editores: `admin/hero/[id]`, `admin/hamburgueseria/hero/[id]`, `burger-slide-editor.tsx`, `burger-hero-preview.tsx`.
- **Ponderado:** medio. Recomendado empezar por la hamburguesería (ya tiene posiciones) y luego el restaurante.

### Unificar el patrón de los dos heroes
- Los dos heroes tienen tipos/esquemas distintos. No hace falta fusionarlos, pero **comparte el mecanismo de override móvil** para no mantener dos sistemas distintos.

---

## P1 — Otros pulidos

- **Validación i18n:** avisar en el admin si un texto tiene ES pero le falta EN/FR (los campos `i18n` pueden quedar incompletos). Indicador visual + botón "Generar traducciones" (ya existe `/api/translate`).
- **Suspense + streaming** en home para que el hero aparezca antes que el resto.
- **Errores:** añadir `error.tsx` (hoy no hay) para que un fallo de datos no rompa toda la página.
- **Imágenes de fondo duplicadas** entre `next/image` y `background-url`: unificar.

---

## P2 — Roadmap (posibles mejoras)

> Todo lo siguiente queda **apuntado como mejora futura**, no incluido en la web base.

### Votación de productos (la gente vota)
- **Estado:** la DB ya tiene `votes` y `rating` en `products`, pero **no hay UI pública** para votar (solo se edita en admin).
- **Mejora:** botón de voto/valoración (★) en la ficha de producto y en "las más votadas" de la hamburguesería. Anti-abuso: 1 voto por dispositivo (localStorage) o por usuario si hay login. Endpoint `POST /api/vote` con `rpc` en Supabase (incremento atómico).

### Favoritos/guardados de la gente (persistentes)
- **Estado:** favoritos y "mi lista" viven solo en `localStorage` (`lc_favs`, `lc_list`) → no sincronizan entre dispositivos.
- **Mejora:** **login de usuarios públicos** (Supabase Auth, magic link / Google) para **guardar favoritos y listas en la base de datos** y recuperarlos en cualquier dispositivo. Tabla `user_favorites`/`user_lists` con RLS por usuario.

### Envío de correos de novedades ("mandar correos de lo nuevo")
- **Estado:** no implementado.
- **Mejora:**
  - **Captación de emails** (alta a novedades) + tabla `subscribers`.
  - **Email transaccional** con **Resend** (plan gratuito hasta cierto volumen) o Brevo.
  - **Aviso automático de novedades**: cuando se publica un producto/evento/oferta nuevo, enviar boletín. Disparador: server action tras `revalidatePath`, o un cron.
  - Confirmaciones y entradas con **QR** cuando exista el módulo de eventos.

### Stripe — pagos, entradas y pedidos
- **Estado:** carrito es solo visual ("muéstraselo al camarero"); no hay checkout.
- **Mejora (cuando se contrate el módulo):**
  - **Stripe Checkout** (sin cuota fija, ~1,5 % + 0,25 €/venta).
  - **Entradas de eventos**: aforo, tipos de entrada, pago, **entrada con QR** y validación en puerta.
  - **Pedido y pago de hamburguesas**: carrito real + pago + gestión de pedidos en el panel + aviso al local.
  - Webhooks de Stripe → marcar pagado, generar QR, enviar email (engancha con el punto de emails).
- **Dónde:** nuevas rutas `/api/checkout`, `/api/stripe/webhook`, tablas `orders`/`tickets`, panel de gestión.

### Otras posibles mejoras
- **Reseñas/comentarios** de clientes.
- **Reserva de mesa** (franjas + aforo).
- **Analítica** privacy-friendly (Plausible/Umami).
- **Notificaciones** push/email de pedidos y reservas.
- **WhatsApp** para reservas/consultas.

---

## Orden sugerido de ejecución

1. **P0 móvil**: scroll en sheets, `dvh`, safe-area, áreas táctiles. _(rápido, alto impacto)_
2. **Carga**: skeletons en todas las vistas + optimizar fondos (WebP) y vídeos (poster/lazy).
3. **Heroes PC/móvil independientes** (empezar por hamburguesería).
4. **Roadmap P2** según lo que contrate el cliente (votos → favoritos en DB + login → emails → Stripe).
