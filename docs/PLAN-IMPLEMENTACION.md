# La Calita — Plan de implementación y mejora

_Plan de ejecución único. Consolida `MEJORAS.md` (rendimiento/móvil) y `DISENO-UX.md` (diseño/UX/legal)._
_Prioridad nº1: que se vea **perfecto en móvil**. Junio 2026._

Marca cada tarea al completarla. Esfuerzo: 🟢 rápido (≤medio día) · 🟡 medio (1–2 días) · 🔴 grande (varios días).

---

## Fase 0 — Base móvil + legal (hacer ya)

> Lo imprescindible: que el móvil sea perfecto y cumplir la ley de cookies.

- [x] 🟢 **Scroll en sheets/modales**: `overscroll-behavior:contain` + `max-height:85dvh` (antes `85vh`); el contenido scrollea, no el body. _(MEJORAS §2)_ — `menu-tabbar.tsx`
- [x] 🟢 **Alturas `dvh`** en sheets/modal (tab bar y producto a `dvh`). El overlay del header usa `inset-0` (ya robusto). _(MEJORAS §1)_
- [x] 🟢 **Safe-area + áreas táctiles** en la tab bar y sheets (`env(safe-area-inset-bottom)`). _(MEJORAS §3)_ — `menu-tabbar.tsx`
- [x] 🟡 **Banner de cookies (RGPD)** Aceptar/Rechazar + Política de cookies. _(DISENO §9)_ — `cookie-consent.tsx`, `/legal/cookies` (config granular → Fase 5)
- [ ] 🟢 **Probar en iOS Safari + Android Chrome** (scroll cartas, sheet, teclado admin, botón atrás). _(manual)_

## Fase 1 — Navegación e idioma (UX inmediata)

- [ ] 🟢 **LangSwitcher único** (es/en/fr) igual en todas las páginas, mantiene la ruta. _(DISENO §1.2)_ — nuevo `lang-switcher.tsx` + `header-bar.tsx`, `burger-header.tsx`
- [ ] 🟢 **Botón "volver a la landing"** en el navbar (burger→`/hamburgueseria`, restaurante→`/`). _(DISENO §1.1)_ — headers, `hide-on-burger.tsx`
- [ ] 🟡 **Header animado**: aparición al montar + ocultar al bajar / mostrar al subir. _(DISENO §1.3)_ — hook `useHideOnScroll`, headers

## Fase 2 — Carga y rendimiento ("que cargue todo bien")

- [ ] 🟡 **Skeletons en todas las vistas** (home, `/carta`, ficha producto, `/hamburgueseria`, detalle evento, admin) + Suspense en listados. _(MEJORAS §8)_ — `ui/skeleton.tsx`, `loading.tsx`
- [ ] 🟡 **Optimizar fondos**: pasar `background:url()` a `next/image` + **WebP/AVIF** por breakpoint. _(MEJORAS §6)_ — `hero.tsx`, `burger-hero.tsx`, `public/burger/bg/`
- [ ] 🟢 **Vídeos lazy + poster** (`preload`, `poster`, pausa fuera de viewport). _(MEJORAS §7)_ — `burger-fx.tsx`, reels
- [ ] 🟢 **`blur` placeholder** en imágenes de producto/ofertas. _(MEJORAS §9)_
- [ ] 🟢 **`error.tsx`** para que un fallo de datos no rompa la página. _(MEJORAS §P1)_

## Fase 3 — Diseño estilo McDonald's / Burger King (impacto visual)

- [ ] 🔴 **Oferta a página completa** (no modal): hero a pantalla completa (marquesina, foto, precio gigante, banda CTA) reutilizando el motor del hero burger. _(DISENO §4)_ — nueva ruta `hamburgueseria/oferta/[slug]`, `burger-hero.tsx`, admin oferta
- [ ] 🟡 **Carrusel horizontal de categorías** + botón "Ver toda la carta" (snap + flechas + arrastre, vecinas asomando). _(DISENO §5)_ — `burger-landing.tsx`, home
- [ ] 🟢 **Aparición al scroll con stagger** aplicada a más bloques. _(DISENO §5,10)_ — `reveal.tsx`
- [ ] 🟡 **Tabs de categoría pegajosas** en la carta (móvil) + cabeceras tipo banner. _(DISENO §5)_

## Fase 4 — Heroes configurables móvil/PC (y admin 3 tamaños)

- [ ] 🔴 **Config independiente móvil/PC** en los dos heroes (override `mobile` que hereda de PC; el toggle del editor edita cada uno). _(MEJORAS §P1 heroes)_ — migración DB, `hero-types.ts`, `hero.tsx`, `burger-hero.tsx`, editores
- [ ] 🟡 **Preview admin en 3 tamaños** (móvil/tablet/PC) en todas las vistas con preview. _(DISENO §2)_ — `burger-hero-preview.tsx`, editores
- [ ] 🟢 **Foto obligatoria + vídeo opcional** en productos (validación). _(DISENO §3)_ — product form, cards
- [ ] 🟡 **Admin usable en móvil** (tablas con scroll/tarjetas, forms en una columna).

## Fase 5 — Contenido y secciones de pie

- [ ] 🟢 **Bloque "Síguenos"** (redes) con URLs en Ajustes. _(DISENO §6.1)_
- [ ] 🟢 **Bloque "Encuéntranos / Cómo llegar"** (mapa + dirección). _(DISENO §6.2)_
- [ ] 🟡 **Tab bar de navegación unificada** (`TabBar` reutilizable). _(DISENO §7)_
- [ ] 🟡 **FAQ / Sin gluten / Contacto / Legales** (aviso legal, privacidad, términos). _(DISENO §8)_

## Fase 6 — Roadmap (módulos, según contrate el cliente)

- [ ] 🟡 **Votación pública de productos** (la DB ya tiene `votes`/`rating`, falta UI). _(MEJORAS §P2)_
- [ ] 🔴 **Login de usuarios + favoritos/listas en DB** (persisten entre dispositivos). _(MEJORAS §P2)_
- [ ] 🔴 **Emails de novedades** (captación + Resend/Brevo + aviso al publicar). _(MEJORAS §P2)_
- [ ] 🔴 **Stripe**: entradas de eventos (aforo + QR) y pedido/pago de hamburguesas + webhooks. _(MEJORAS §P2)_
- [ ] 🟡 **Despliegue en Netlify** (verificar Next 16: middleware/ISR). _(propuesta)_

---

## Dependencias / orden

- **Fase 0 y 1** primero (rápidas, alto impacto, una legal).
- **Fase 3** (oferta full-page) usa el motor de hero → si se hace antes la **Fase 4** (config móvil/PC), la oferta ya nace con esa config. Si no, se adapta luego.
- **Roadmap (Fase 6)**: el **login** habilita votos por usuario y favoritos en DB; los **emails** se enganchan con Stripe (confirmaciones/QR).

## Estado actual (resumen del análisis)

Ya hecho: App Router + i18n, ISR, Supabase RLS, favoritos/lista en localStorage, admin CRUD completo, PWA, hero burger con efectos+posición configurables, vídeo FX con `screen` y posición móvil/PC, propuesta+factura.
Pendiente: todo lo de las fases 0–6 de arriba.

> Detalle técnico de cada punto: ver `MEJORAS.md` y `DISENO-UX.md`.
