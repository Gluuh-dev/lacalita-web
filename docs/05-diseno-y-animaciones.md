# 05 — Diseño y animaciones

## Sistema de dos temas

Tokens de color/tipografía en Tailwind. La carta activa decide el tema. Se aplica con
un `data-theme` en el contenedor y variables CSS.

### Tema `calita` (restaurante / desayunos)
```
--bg:        #FAF6EF   (crema)
--surface:   #FFFFFF
--brand:     #E9AE74   (arena, color principal)
--brand-deep:#C98A4E
--ink:       #243B53   (azul mar profundo, texto/títulos)
--accent:    #2E6E8E   (azul mar)
font-display: serif elegante (p.ej. "Cormorant"/"Playfair")
font-body:    sans limpia (p.ej. "Inter"/"Nunito Sans")
```
Sensación: playa premium, espacios amplios, fotos grandes, mucho aire.

### Tema `burger` (hamburguesería)
```
--bg:        #FCFAF8
--surface:   #FFFFFF
--brand:     #F26B21   (naranja vivo)
--accent:    #FEDB71   (amarillo)
--ink:       #140F1F   (casi negro)
font-display: sans rotunda y pesada (p.ej. "Poppins"/"Montserrat" bold)
font-body:    sans (misma familia, peso normal)
```
Sensación: energía, apetito, contraste, tipografía grande.

> Mismo componente de carta, distinta piel y ritmo. No duplicamos lógica, solo tokens
> y un par de variantes de layout.

## Animaciones (Framer Motion)

Principios: **fluidas, con propósito, nunca molestas**. Respetar
`prefers-reduced-motion` (accesibilidad).

### Landing
- Hero: logo y lema con entrada en stagger; elementos decorativos (hojas/olas/
  ingredientes) flotando en loop lento (`y` + `rotate`, ease suave).
- Parallax sutil al hacer scroll en secciones.
- Cards de secciones que aparecen con `whileInView` (fade + slide up).

### Cartas
- Categorías: transición de filtro animada (`layout` animations).
- Cards de producto: hover con escala/elevación (en `burger` más marcado, en
  `calita` más sutil). Imagen con leve zoom.
- Cambio entre cartas: transición de tema (color crossfade) + cambio de ritmo.

### Detalle de producto
- Imagen/vídeo entra con escala + parallax.
- Texto (título, precio, descripción, alérgenos) en stagger.
- `ponytail:` si más adelante queremos transición compartida card→detalle, usar
  `layoutId` de Framer Motion. No al principio.

### Admin
- Transiciones discretas; feedback con Sonner (guardado, error, traducción lista).

## Componentes clave

- `ThemeProvider` (data-theme) · `LangSwitcher` (banderas) · `MenuTabs` ·
  `CategoryNav` · `ProductCard` · `ProductDetail` · `AllergenList` · `EventCard` ·
  `MediaPlayer` (img o vídeo) · `Hero`.

## Iconos de alérgenos

- Set propio (14 oficiales UE) en SVG, monocromos al color del tema.
- En la carta actual ya se usan iconos circulares; replicamos ese estilo.

## Responsive

- **Mobile-first** (el QR se abre en móvil). Desktop como mejora.
- Tipografías y espaciados fluidos (`clamp`).
