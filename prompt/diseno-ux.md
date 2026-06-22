# Brief de diseño UX/UI — La Calita Beach Club

Eres un diseñador de producto UX/UI. Diseña la interfaz completa de la web de
**La Calita Beach Club**. Aquí tienes SOLO: la marca, la paleta de color, las
tipografías y **qué tiene que haber** en cada pantalla. El **estilo visual lo
decides tú** (jerarquía, formas, espaciados, composición, ilustración,
microinteracciones…). No hay imposiciones de "esto redondeado", "esto aquí", etc.

---

## 1. Marca y concepto

- **Negocio:** La Calita Beach Club — beach club con **restaurante**, **cafetería**,
  **desayunos/meriendas** y **hamburguesería**.
- **Ubicación:** C. Pº Marítimo s/n, 18680 Salobreña, Granada (playa).
- **Acceso principal:** QR en la mesa → carta digital. Es **solo informativo**:
  ver carta, precios y alérgenos. **Sin carrito ni pagos.**
- **Tono:** mediterráneo, playa, premium pero cercano. La hamburguesería tiene
  una identidad propia más energética.
- **Idiomas:** Español (defecto), Inglés, Francés.

## 2. Paleta de color

Hay **dos identidades** que conviven:

**Tema "Calita" (restaurante / desayunos / general):**
- Fondo: `#faf6ef`
- Superficie: `#ffffff`
- Color principal (marca): `#e9ae74`
- Principal oscuro: `#c98a4e`
- Texto/tinta: `#243b53`
- Acento: `#2e6e8e`

**Tema "Hamburguesería":**
- Fondo: `#fcfaf8`
- Superficie: `#ffffff`
- Color principal: `#f26b21`
- Principal oscuro: `#d4530f`
- Texto/tinta: `#140f1f`
- Acento: `#fedb71`

Color del logo (marrón): `#4c2f08`.

## 3. Tipografías disponibles

- **Display / títulos elegantes:** Playfair Display (serif).
- **Cuerpo / interfaz:** Geist (sans).
- **Menú / navegación:** Adam.
- **Rótulos del hero (textos animados):** Modern Romance, Eight One.
- Logo: SVG propio.

## 4. Restricciones (no de estilo, de producto)

- **Mobile-first** (la mayoría entra por el QR en el móvil), pero también debe verse
  bien en escritorio.
- **Trilingüe** ES/EN/FR (selector de idioma).
- **Accesible** (contraste, tamaños legibles, navegación por teclado).
- **PWA** instalable.
- **Rendimiento**: imágenes/vídeos optimizados, carga rápida en conexión lenta.
- Dos pieles visuales (Calita y Hamburguesería) coherentes entre sí.

---

## 5. LANDING (página de inicio) — qué debe haber

- **Cabecera/navegación** (en todas las páginas públicas): logo, enlaces a Carta,
  Eventos y Ubicación, selector de idioma, y menú para móvil. Acceso a admin si la
  persona ha iniciado sesión.
- **Portada (hero):** a pantalla completa. Admite **imagen o vídeo de fondo** (uno o
  varios, en bucle/diapositivas), con el **logo**, un **lema corto**, una **frase de
  bienvenida** y un **botón de acción** (ej. "Ver la carta"). Además puede haber
  **rótulos/textos sobreimpresos** (p. ej. evento + día + hora) que pueden moverse,
  y opcionalmente un **logo/sello** de un artista o DJ.
- **Próximos eventos:** lista de los próximos eventos (DJ, conciertos…). Cada evento:
  fecha y hora, nombre, artista/DJ, imagen, descripción breve. Enlace a "ver todos".
- **Información del local:** horarios (incluye posibilidad de **aviso de cierre
  temporal** y **franjas mañana/tarde**), dirección con enlace a Google Maps, y
  redes sociales (Instagram, Facebook). Aquí encaja también un **plano/mapa** del sitio.
- **Pie de página:** datos de contacto, redes, plano y enlace a Maps.

## 6. CARTA — qué debe haber

- **Selector de cartas:** tres entradas → **Desayunos & Meriendas**, **Restaurante**
  y **Hamburguesería**. Cada una con su identidad visual (Hamburguesería usa su tema).
- **Página de cada carta:**
  - Cabecera de la carta (nombre, subtítulo, imagen/vídeo opcional).
  - **Filtros por categoría** (ej. Ensaladas, Entrantes, Principales, Cafés, Burgers…):
    al elegir una, se muestran solo esos platos **con transición animada** (no es
    necesario que recargue ni desplace).
  - **Tarjetas de producto:** foto o vídeo, nombre, descripción corta, **precio**
    (o "desde X" si tiene variantes media/entera), e **iconos de alérgenos**.
  - **Leyenda de alérgenos** (los 14 oficiales de la UE, con icono propio).
- **Detalle de producto** (página propia, compartible e indexable): foto/vídeo grande,
  nombre, descripción completa, precio(s)/variantes, alérgenos con nombre, y volver
  a la carta. Hereda el tema de su carta.
- **Eventos:** página con la agenda (lista por día) y **detalle de cada evento**
  (imagen/galería, descripción y, si hay, vídeo).

## 7. ADMIN (panel de gestión, en español, privado) — qué debe haber

Acceso con **login** (email + contraseña). Una vez dentro, navegación entre secciones.
Todo lo que se introduce está en español; el inglés y francés se autocompletan al guardar.

- **Inicio/Panel:** resumen con contadores (productos, categorías, menús, eventos) y
  accesos directos.
- **Portada (Hero):** gestor de la portada. Crear varias **diapositivas**; en cada una:
  subir **imagen o vídeo**, ajustar oscurecido del fondo, añadir **textos/rótulos**
  (con tipografía, tamaño, color, fondo opcional, transparencia, posición, orientación,
  animación, velocidad y desplazamiento) y/o **logos/sellos**, y un **botón** (texto y
  enlace). Debe ofrecer **previsualización** de cómo queda (PC y móvil).
- **Productos:** listado con filtro por carta y CRUD completo. Por producto: carta y
  categoría, nombre, descripción, precio o **variantes** (media/entera), **alérgenos**,
  **imagen y vídeo**, destacado y disponible.
- **Categorías:** CRUD por carta, orden y visibilidad.
- **Menús/Cartas:** editar cabeceras (nombre, subtítulo, tema, imagen/vídeo de cabecera).
- **Eventos:** CRUD con título, descripción, artista, tipo (DJ/concierto/otro), fecha y
  hora, **galería de imágenes** y vídeo, publicado o borrador.
- **Ajustes:** texto de bienvenida, **horarios** (aviso de cierre temporal + franjas),
  dirección y enlace a Maps, teléfono, email y redes.

Patrones del admin: subir media **arrastrando o pulsando**, ver **barra de progreso**,
y poder **cambiar/eliminar** la media (que se borra también del almacenamiento).

---

## 8. Entregables que se esperan del diseño

- Sistema de diseño: paleta aplicada, tipografías, componentes (navegación, tarjetas,
  botones, formularios, etiquetas de alérgenos, tarjetas de evento, controles del hero…).
- Pantallas: landing, selector de carta, carta (las tres), detalle de producto, eventos
  y detalle de evento, login y todas las pantallas del admin.
- Versiones **móvil y escritorio** de cada una.
- Estados: vacío, carga, error, y las dos pieles (Calita y Hamburguesería).

> Recuerda: define tú el lenguaje visual. Esto solo fija la marca, los colores, las
> tipografías y el contenido/funcionalidad que debe existir.
