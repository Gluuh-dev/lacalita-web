# Panel /admin — consistencia, móvil y robustez

> Severidad: 🔴 alta · 🟡 media · ⚪ baja. Verificado con `ruta:línea`.

Seguridad de acceso: **correcta**. Las 20 rutas llaman `requireUser()`, la
escritura real la protege RLS (`0001_init.sql:120-127`) y el proxy refresca la
sesión. El problema no es acceso indebido, es el hallazgo 1.

## 🔴 Hallazgo 1 — guardado silencioso-fallido {#hallazgo-1}

`eventos/actions.ts:32`, `menus/actions.ts:29`, `categorias/actions.ts:24`,
`hero/actions.ts:9`, `ajustes/actions.ts:21`, `contenido/actions.ts:32`,
`galeria/actions.ts:14` hacen `.update()/.upsert()` **sin validar sesión ni
comprobar filas afectadas**. Si el token caducó (típico: el móvil estuvo en
segundo plano), RLS bloquea el UPDATE → **0 filas, sin error** → la action
devuelve `{ok:true}` y el cliente ve "Guardado" **sin haberse guardado nada**.

`productos/actions.ts:35-38` y `hamburgueseria/actions.ts:69-75` ya están
blindadas (comprueban usuario y filas). **Arreglo raíz**: helper
`requireUserForAction()` llamado al principio de todas las actions + verificar
`count`/filas tras el update — un guard donde convergen todos los callers, no
parches por sección.

## 🟡 Duplicación de subidores

`MediaUpload` (222 líneas) vs `HeroMedia` (148) duplican comprimir → subir →
URL pública → poster → borrar. Diferencias reales:

| | MediaUpload | HeroMedia |
|---|---|---|
| Archivos | múltiple, **4 en paralelo** | uno |
| Progreso | **real** | **simulado** (`hero-media.tsx:39`, `setInterval` aleatorio hasta 92%) |
| maxDim | configurable | fijo 2000 |
| Usuarios | galería, eventos, menús, contenido | hero, productos, hamburguesería |

→ Fusionar: `MediaUpload` con variante `preview` (el chrome de HeroMedia) y
borrar `HeroMedia`.

## 🟡 Tabla de consistencia entre secciones

| Sección | Drawer/Página | FormFooter | btnEdit | Autosave | Uploader | Confirmar borrado |
|---|---|---|---|---|---|---|
| Hero | Página custom | ❌ propio | n/a | **híbrido** ⚠ | HeroMedia | n/a |
| Productos lista | Página+tabla | — | ❌ lápiz suelto | no | — | **`confirm()` nativo** ⚠ |
| Productos form | Página | ❌ propio | — | no | HeroMedia | — |
| Categorías | Drawer | ✅ | ✅ | no | — | ✅ modal |
| Menús | Drawer | ✅ | ✅ | no | MediaUpload | ✅ modal |
| Hamburguesería | Página | ❌ propio | ❌ lápiz | no | HeroMedia | **`confirm()` nativo** ⚠ |
| Eventos | Drawer | ✅ | ✅ | no | MediaUpload | ✅ modal |
| Galería | **Página propia** | ✅ | ✅ | ✅ debounce | MediaUpload | ✅ modal |
| Contenido | Página custom | ❌ suelto | n/a | no | MediaUpload | inline |
| Ajustes | Página custom | ❌ shadcn | n/a | no | — | n/a |

Patrón bueno consolidado: **Drawer/página + FormFooter + btnEdit + modal
Confirm** (categorías, menús, eventos, galería). Desalineados: hero,
productos, hamburguesería, contenido, ajustes.

Casos concretos:
- 🟡 `products-table.tsx:74` y `burger-admin.tsx:50,65` usan **`confirm()`
  nativo** del navegador; el resto usa el modal propio.
- 🟡 `products-table.tsx:172-177` y `burger-admin.tsx:97,130`: editar es un
  icono de lápiz suelto, no la píldora `btnEdit`.
- 🟡 Hero: autoguardado **híbrido** — estructura (añadir/borrar/reordenar)
  autoguarda (`hero-editor.tsx:55-85`), textos/colores requieren "Guardar
  portada" (`:465`). Editar un texto y navegar = se pierde; reordenar después
  = se guarda todo. Unificar.
- 🟡 Eventos mete una galería multi-imagen en un Drawer de 520px — el mismo
  motivo por el que galería pasó a página propia. **Candidato nº 1 a
  `/admin/eventos/[id]`.**

## 🟡 Código muerto

- Rutas huérfanas `eventos/[id]`, `menus/[id]`, `categorias/[id]` (admin):
  0 enlaces hacia ellas, convención `'new'` vs `'nuevo'`, y su Cancelar no
  hace nada (los forms reciben `onCancel` pensado para el Drawer). → Borrar.
- `admin-nav.tsx` + `logout-button.tsx`: par muerto (~62 líneas); el sidebar
  real tiene su propio logout. Además a admin-nav le faltan secciones.
- `burger-slide-editor.tsx:226-308`: estado congelado (`eyebrow`, `mediaY`,
  `eyebrowScale`, `overlayFx` sin setter; `fx_video*` hardcodeado en save).
- `album-form.tsx:57`: rama `onSaved` de Drawer ya inalcanzable. Vestigial.

## 🟡 Móvil (el cliente administrará desde el teléfono)

- `hero-editor.tsx:257,268` y `product-form.tsx:221` — `grid grid-cols-3` sin
  breakpoint: columnas de ~110px en 360px, selects/sliders aplastados. →
  1 columna en móvil (`grid-cols-1 sm:grid-cols-3`).
- `products-table.tsx:113` — tabla `min-w-[640px]` = scroll horizontal en
  móvil. → Vista de tarjetas bajo `sm`.
- Sidebar off-canvas y Drawers `min(94vw, 520px)`: correctos.

## Complejidad (líneas)

| Fichero | Líneas | Nota |
|---|---|---|
| `hero.tsx` | 746 | ver 03-hero.md |
| `burger-slide-editor.tsx` | 664 | `detectBg/detectVibrant/detectEdges` duplican ~150 líneas de carga imagen/vídeo → extraer `sampleImageOrVideo()` |
| `hero-editor.tsx` | 583 | extraer tarjetas Textos/Marquesina/Póster |

## ⚪ Menores

- `login/page.tsx:43` — `defaultValue="admin@lacalita.test"` en producción.
- `deleteProduct` (`productos/actions.ts:126`) sin el check de usuario que sí
  tienen sus hermanas del mismo fichero.
- `burger-admin.tsx:87,117` — vacíos inline en vez de `EmptyState`.
- `delete-button.tsx:24` — "Eliminar" como texto suelto junto a la píldora
  `btnEdit`: dos estilos en la misma fila.
- Tablas `burger_hero_slides`/`burger_offers` **fuera de migraciones** (su RLS
  no es verificable en el repo). Bloqueante para producción → Fase 5.
