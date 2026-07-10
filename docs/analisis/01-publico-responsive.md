# Web pública — responsive (móvil / tablet / PC) + i18n

> Severidad: 🔴 alta · 🟡 media · ⚪ baja. Todo verificado en código con `ruta:línea`.

Base sana que conviene conocer: `globals.css:258-262` ya blinda el scroll
horizontal (`overflow-x: clip` en `html,body`), los heros usan `svh/dvh` y las
barras inferiores respetan `env(safe-area-inset-bottom)`. Los problemas no son
de layout roto, sino de **solapes de elementos fijos, áreas táctiles, tablet
descuidada y —sobre todo— textos sin traducir**.

## 🔴 i18n — el hallazgo más grande

El sitio es trilingüe (ES/EN/FR, next-intl), pero hay **páginas enteras y
componentes de navegación en español fijo**. Un visitante inglés ve español en:

| Dónde | Qué |
|---|---|
| `eventos/[id]/page.tsx:122-203` | TODO el detalle: "Sobre el evento", "Cuenta atrás", "Fecha/Hora/Artista/Lugar", "Entradas", "Agotadas", "Comprar entradas", "Cómo llegar", "Más eventos"… |
| `galeria/page.tsx` | No importa next-intl: título, subtítulo, "Más fotos", estado vacío, metadata |
| `ubicacion/page.tsx` | No importa next-intl: "Dónde estamos", "Horario", "Cerrado", "Cómo llegar" |
| `components/site-tabbar.tsx:30-59` | Barra inferior móvil completa |
| `components/burger/burger-tabbar.tsx:26-67` | Barra burger completa |
| `header-bar.tsx:31-46` | "Inicio", "Desayunos", "Restaurante"… (existe `nav.home` sin usar) |
| `event-card.tsx:8` | Meses `['ENE','FEB','MAR'…]` fijos — chips de fecha en ES para EN/FR. Derivar de `Intl.DateTimeFormat(locale,{month:'short'})` |
| `event-card.tsx:41` + `lib/event-time.ts:5,21,22` | "Hoy", "Mañana", "Este finde", "¡Hoy!", "Falta(n) N día(s)" — alimentan portada, lista, detalle y navbar |
| `hero.tsx:578,599,607,617,646,676,686` | "Cómo llegar" (¡existe `info.location`!), "Próximos eventos", "con {artista}", "Ver todos los eventos" |
| Portada `page.tsx:120-368` | Eyebrows/títulos de sección, "Ver carta", "Cerrado", "Reservas"… |
| Carta | `menu-filters.tsx:87-141`, `product-item.tsx:61-87`, `product-detail.tsx:54-244`, `menu-tabbar.tsx` (~20 literales), `carta-empty.tsx:10-11` |
| Burger | `burger-hero.tsx:245-252`, `burger-landing.tsx:69-174` |
| `events-toggle.tsx:17-18` | "Próximos / Pasados" |
| `site-footer.tsx:17,22` | Descripción y "Contacto" |

**Arreglo**: mover a `messages/{es,en,fr}.json` por bloques (evento, galería,
ubicación, nav, tiempo, carta). Es trabajo mecánico pero voluminoso — Fase 3.

## Solapes de elementos fijos (móvil)

- 🟡 `hero.tsx:739` — El **play/pausa del hero** (`bottom-6 right-4 z-20`)
  queda **debajo de la tab-bar móvil** (`site-tabbar.tsx:45`, `fixed bottom-0
  z-40`, ~82px opacos): invisible e inpulsable. → `bottom-24` + z por encima,
  u ocultar la tab-bar sobre el hero.
- ⚪ `eventos/[id]/countdown-bar.tsx:33` — La cuenta atrás (`z-[51]`) flota
  **sobre el menú a pantalla completa** (overlay `z-[45]`). No bloquea
  (`pointer-events-none`) pero es un glitch visual. → Ocultarla con el menú
  abierto o bajar su z.
- ⚪ `burger-hero.tsx:313` — Paginador a `bottom-[5rem]` roza la BurgerTabBar
  (~2px). Al límite; vigilar en iPhones con safe-area grande.

## Áreas táctiles

- 🟡 Dots de paginadores: `snap-carousel.tsx:101` (8px), `burger-hero.tsx:318`
  (7px), `.lc-cat-dot` (`globals.css:377`). Área táctil mínima recomendada:
  44px. → Envolver cada dot en un hit-area invisible.
- ⚪ Botones `size-8`/`size-9` (32-36px) en `menu-tabbar.tsx:194-410` y
  `product-item.tsx:77-93`.

## Tablet (768-1023) — el rango olvidado

- ⚪ La agenda del hero (`hero.tsx:596`) y el sidebar del detalle de evento
  (`eventos/[id]:119`) solo existen desde `lg:` → una tablet vertical recibe
  el layout de móvil. Añadir variantes `md:`.
- ⚪ Reseñas de portada `page.tsx:270`: `1 → md:grid-cols-3` sin `sm:2` — a
  768px, 3 columnas de ~230px apretadas.

## Imágenes

- 🟡 `event-card.tsx:49` (layout fila) — `sizes="(max-width:768px) 100vw,
  420px"` para una miniatura que vive en una columna de **112-136px**:
  descarga 4-6× más imagen de la necesaria. → `sizes="136px"`.
- ⚪ Portada `page.tsx:296-300` — Galería con `<img>` plano, **sin lazy**, bajo
  el pliegue. → `next/image`.
- ⚪ `sizes` levemente desajustados en tarjetas de portada (`page.tsx:179,218`)
  y tile de evento (`event-card.tsx:75`).

## Contenido incorrecto mostrado al público

- 🟡 `burger-landing.tsx:116` — Si no hay favoritas, el VISITANTE lee una
  instrucción de admin: "Marca productos como destacados (o con votos) para
  que salgan aquí." → Mensaje neutro.
- 🟡 `menu-tabbar.tsx:148` — El vacío de favoritos dice "Pulsa el ♥ en las
  **hamburguesas**…" también en desayunos/restaurante/cócteles.

## Detalles menores

- ⚪ `eventos/[id]/page.tsx:224` — `capitalize` sobre la fecha → "Sábado, 12 De
  Julio" (capitaliza cada palabra). → `first-letter:uppercase`.
- ⚪ Nombres de artista largos en `font-vibes` gigante sin `line-clamp`
  (`eventos/page.tsx:76`, `eventos/[id]:110`).
- ⚪ `page.tsx:408` (SectionHead) — `w-screen` + scrollbar de PC descentra la
  marca de agua ~7px. Cosmético.
- ⚪ Menú a pantalla completa (`header-bar.tsx:113`): 6-7 enlaces `text-4xl` +
  selector de idioma pueden no caber en móviles bajos (~640px). Revisar.
