# /admin/hero — autopsia: qué sobra, qué se queda, qué falta

> Ficheros: `src/components/hero.tsx` (**746 líneas**),
> `src/app/(admin)/admin/hero/hero-editor.tsx` (**583**),
> `src/lib/hero-types.ts` (145). `HeroSlide` tiene **59 campos**.

## La raíz de casi todo: dos pintores

El hero se dibuja **dos veces con dos códigos distintos**:

- `HeroView` (hero.tsx:435) — lo que ve la web (Tailwind, responsive real).
- `HeroStage` (hero.tsx:224) — lo que ve el admin en la preview (estilos
  inline en px, reimplementación manual del mismo markup).

Solo `PosterView` se comparte (por eso el modo póster no tiene drift). Cada
campo nuevo hay que pintarlo dos veces, y cuando alguien olvida uno de los dos
lados nace una mentira: el admin ve una cosa y la web otra. Hay **8
documentadas** (abajo). **La solución no es corregir las 8: es tener un solo
pintor** — que la preview escale el propio `HeroView` — y borrar `HeroStage`
(~200 líneas). Después de eso, el drift es imposible por construcción.

## Drift preview ↔ web (lo que el admin ve y no es verdad)

| # | Qué | Evidencia |
|---|---|---|
| A | **`anim` (fade/slide) solo anima la PREVIEW; la web nunca anima** | control E:337; usado H:262; HeroView no lo lee |
| B | La web pinta SIEMPRE un 2º botón "Cómo llegar"; la preview no | H:577 vs H:336 |
| C | Panel agenda PC: dos implementaciones (340 vs 360px; destacado clicable solo en web; artista en fuentes distintas; eventBtn solo en preview; rotación solo en web) | H:141-160 vs H:595-620 |
| D | Agenda móvil: la preview pinta una caja inline; la web usa pill + bottom-sheet (que la preview no enseña nunca) | H:347 vs H:637-688 |
| E | Modo `contain` (cartel): blur 24px vs 40px, radios y paddings distintos, enlace solo en web | H:240-257 vs H:467-494 |
| F | **Marquesina: la web móvil usa tamaños de PC** (`<Marquee pc />` hardcodeado) — bug real hoy | H:531 |
| G | Tamaños finos (logo, eyebrow, botón, contenedor) en px fijos vs clamp — divergen en anchos intermedios | H:304-335 vs H:534-576 |
| H | El play/pausa del carrusel solo existe en la web | H:733 |

F es un bug arreglable ya, independiente del refactor.

## SOBRA (propuesta de poda)

Los datos viven en `settings.hero` (JSON); quitar un campo = dejar de
escribirlo y migrar al guardar. Nada de esto necesita migración de BD.

1. **`anim`** — muerto en la web (drift A). O se implementa de verdad en
   `HeroView` o se elimina; el carrusel ya remonta cada slide con `key`.
   Recomendación: **eliminar**.
2. **`eventBtn`, `eventBtnText`, `eventBtnLink`** — solo funcionan en modo
   rótulo; en agenda el público los ignora (y la agenda ya trae su propio
   "Ver todos los eventos"). Redundantes con `button`/`link`. **Eliminar.**
3. **Legados no editables** (ningún control, solo fallback de datos viejos):
   `showLogo`, `rotulo`, `sub`, `font`, `color`. Migrar los datos existentes
   (rotulo/sub → rotuloLines) y **eliminar los 5 campos**.
4. **Doble selector de modo** — `heroMode` se elige en DOS tarjetas (Tipo
   Normal/Póster E:142 y Zona de eventos E:300), y pasar de Póster a Normal
   resetea a `boton` perdiendo la elección anterior. **Un único selector de 4
   modos.**
5. **`rotuloAuto`** — duplica la agenda (ambos pintan "el próximo evento").
   Candidato a eliminar si el cliente no lo usa; como mínimo, documentar.
6. **Marquesina (8 campos)** — viva pero sobredimensionada:
   orient/dir/pos son ajustes que nadie retoca. Esconder tras un "Avanzado"
   o reducir a on/texto/velocidad/colores.
7. **Controles inertes según modo** — en póster y en `contain` se ignoran
   tint/tintOpacity/blur/radial/lema/bienvenida/button/marquee/contentAlign,
   pero el editor los muestra igual: el admin mueve sliders que no hacen
   nada. **Ocultar lo que no aplica al modo activo** (no es borrar campos,
   es UI).

## NO SOBRA (parece mucho, pero se usa todo)

Fondo (`media/mediaType/mediaFit/poster/darken/tint/tintOpacity/blur/radial`),
logo (`logoVariant/logoColor/logoScale`), los tres textos con
color/escala/fuente, `button/link/btnColor`, `contentAlign`, los 7 `poster*`
(modo póster), `rotuloLines`/`rotuloY` (modo rótulo), y la agenda. Cada uno
tiene control en el editor y render en la web (inventario completo verificado
campo a campo; los 59 tienen veredicto).

## FALTA (verificado que NO existe hoy)

| Qué | Por qué | Ya existe algo |
|---|---|---|
| **Programación por fechas** (`activeFrom/activeUntil`) | Las slides de evento caducan solas — hoy hay que acordarse de desactivarlas a mano | Solo `active` manual |
| **Duplicar diapositiva** | Montar la del viernes a partir de la del sábado | Solo crear desde cero (E:63) |
| **Imagen específica para móvil** (`mediaMobile`) | Un cartel 9:16 y un paisaje 16:9 no pueden compartir recorte | Solo `mediaFit: contain` como paliativo |
| Aviso de contraste texto/fondo | El cliente elegirá colores ilegibles; `inkOn()` (lib/hero.ts:31) ya calcula luminancia — reutilizable como aviso | Solo auto-tinta del botón |
| Drag & drop para reordenar | Comodidad | **Ya hay flechas ▲▼** (E:112) — suficiente, baja prioridad |

Ya existe y NO hay que añadir: reordenar (flechas), activar/ocultar por slide,
toggle preview móvil/PC (E:479), portada no eliminable, poster de vídeo
automático.

## Orden recomendado

1. Bug F (marquesina móvil) — una línea, ya.
2. Poda 1-4 + ocultar controles inertes (7) — un par de horas, el editor se
   entiende de golpe.
3. **Un solo pintor** (borrar HeroStage, preview = HeroView escalado) — el
   cambio estructural; después de él, B/C/D/E/G desaparecen sin trabajo.
4. Añadidos: duplicar → programación por fechas → mediaMobile, por ese orden
   (utilidad/esfuerzo).
