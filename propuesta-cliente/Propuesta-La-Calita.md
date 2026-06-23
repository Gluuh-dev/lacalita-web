# Propuesta web — La Calita Beach Club

_Documento para cliente · Salobreña (Granada)_
_Versión 1 · Junio 2026_

---

## 1. Resumen ejecutivo

Se propone una presencia web **moderna, rápida y totalmente autogestionable** para La Calita, con un **panel de administración** propio desde el que el cliente cambia textos, fotos, cartas, precios, eventos y portadas **sin tocar código**.

Todo el contenido es **multi-idioma (Español, Inglés y Francés)** desde el primer día, con posibilidad de **añadir más idiomas** en el futuro, y un **botón de traducción automática** que ayuda a rellenar los idiomas a partir del español.

El sitio se ve **perfectamente en PC, tablet y móvil** (diseño adaptable "mobile-first").

### Planteamiento: una sola web (un dominio) con dos áreas

Se hace **una única web bajo un solo dominio** (`tudominio.com`), con **dos áreas/marcas** que comparten el mismo motor, panel y base de datos, pero con identidad propia cada una:

| Área | Ruta | Enfoque | Identidad |
|------|------|---------|-----------|
| **La Calita** | `tudominio.com` | Beach club, restaurante, cafetería, eventos | Cálida, mediterránea (arena, dorado, azul mar) |
| **La Calita Burger** | `tudominio.com/hamburgueseria` | Hamburguesería premium "smash" | Oscura, energética (negro, naranja fuego, dorado) |

Ventajas de un solo dominio/proyecto:
- **Un solo mantenimiento, un panel y una base de datos** → más barato y simple.
- Coste fijo mínimo: **un dominio + un Supabase Pro** (≈ 295 €/año).
- Cada área conserva su **estética propia** (la hamburguesería es oscura/naranja, la principal cálida).

> Módulos estrella que se pueden añadir: **venta/reserva de entradas para eventos** (área La Calita) y **pedido y pago online de hamburguesas** (área Burger).

---

## 2. Diseño y experiencia

- **Responsive real**: probado en **PC, tablet y móvil**. En móvil, navegación con menú hamburguesa, deslizadores táctiles (sliders) y hojas inferiores (bottom-sheets).
- **Rendimiento**: carga rápida, imágenes optimizadas automáticamente (AVIF/WebP), animaciones suaves.
- **Tipografías de marca** propias (Adam, Modern Romance, Eight One) + Playfair y Geist.
- **Accesibilidad básica**: contraste, navegación por teclado, textos alternativos.
- **Animaciones**: portada con efectos (humo, fuego, chispas, vídeo), transiciones, entradas animadas.
- **Actualización en tiempo real**: si el cliente cambia un precio o una foto desde el panel, la web se actualiza sola para quien la esté viendo, sin recargar.

---

## 3. Idiomas

- **3 idiomas incluidos**: Español (por defecto), Inglés, Francés.
- **Cualquier texto editable** del sitio se puede traducir desde el panel.
- En cada campo de texto: botón **"Generar traducciones"** (IA gratuita) que rellena EN/FR a partir del ES; luego se puede corregir a mano.
- **Ampliable**: añadir un 4.º idioma (p. ej. Alemán) es una opción de bajo coste.

---

## 4. Páginas — Web La Calita

### Públicas (lo que ve el cliente final)

1. **Inicio (Portada / Hero)**
   - Carrusel de portadas configurable: imagen o vídeo de fondo, logo, eyebrow, título/lema, frase de bienvenida, botones.
   - 3 modos de zona de eventos: **solo botón**, **rótulo de evento** (3 líneas con color y tipografía por línea, autorrelleno con el próximo evento), o **lista/agenda de eventos**.
   - Marquesina de texto en movimiento opcional.
   - Secciones de contenido editables: sobre el sitio, platos destacados, historia, reseñas, galería.
   - Sección **Cartas**, **Eventos** y **Ubicación** (panel de horarios, mapa estilizado, datos de contacto).

2. **Cartas** (`/carta`) — listado de cartas (Desayunos, Restaurante, etc.).

3. **Carta interactiva** (`/carta/[carta]`)
   - Productos con foto/vídeo, precio (o "desde X €" con variantes), alérgenos con iconos.
   - **Favoritos** (♥), **Mi lista** personal (sin pedido), modo **Vídeo** (reels verticales de los platos).
   - Filtros por categoría, buscador, persistencia en el dispositivo.
   - Ficha de producto en **modal** (ingredientes, alérgenos, notas).

4. **Detalle de producto** (`/carta/[carta]/[producto]`) — página individual para enlaces directos/SEO.

5. **Eventos** (`/eventos`) — agenda de conciertos/DJ/eventos con tarjetas, fecha, artista.

6. **Detalle de evento** (`/eventos/[id]`) — info completa + (módulo) compra/reserva de entradas.

7. **Legales** — aviso legal, privacidad, cookies (a incluir).

### Módulo estrella: Entradas para conciertos / eventos

- Venta o **reserva** de entradas por evento (aforo, tipos de entrada, precio).
- Pago online (pasarela) o reserva sin pago.
- Confirmación por email + entrada con QR.
- Panel para ver/gestionar reservas y validar QR en la puerta.

---

## 5. Páginas — Web La Calita Burger

### Públicas

1. **Landing Hamburguesería** (`/`) — pantalla completa, tema oscuro/naranja:
   - **Hero tipo escaparate**: hamburguesa grande que entra animada (arriba/abajo o lateral en móvil), anillos dorados, efectos de **humo / fuego / chispas / vídeo** configurables (delante o detrás de la hamburguesa, posición y tamaño ajustables).
   - Título y precio con tipografía, color o **degradado dorado** configurables.
   - Marquesina diagonal "smash · juicy · crispy".
   - **Ofertas** (tarjetas con descuento, valoración ★, precio tachado, estilo de color).
   - **Favoritas de la gente** (más votadas, con ♥ y votos).
   - Panel de **14 alérgenos UE**.

2. **Carta de hamburguesas** (`/carta/hamburgueseria`) — misma carta interactiva, en tema oscuro.

3. **Detalle de hamburguesa / oferta**.

### Módulo estrella: Pedido y pago online

- Carrito de compra, personalización (ingredientes, extras).
- **Pago en la web** (tarjeta, Apple/Google Pay, Bizum según pasarela).
- Recogida en local / (opcional) reparto.
- Gestión de pedidos en el panel + aviso al local.

---

## 6. Panel de administración (común a ambas)

Todo autogestionable, sin conocimientos técnicos:

- **Panel/Dashboard**: resumen (productos, categorías, cartas, eventos, próximos eventos).
- **Portada (Hero)**: editor visual con **previsualización en vivo (PC/Móvil)** y "Recargar animación".
- **Productos**: una página por carta, alta/edición **en página** con todos los campos (nombre, descripción, precio, variantes, alérgenos, foto/vídeo, etiqueta, destacado, etc.) y **traducciones**.
- **Categorías** y **Menús / Cartas**.
- **Hamburguesería**: editor de **diapositivas del hero** (con previsualización y todos los efectos) y **ofertas**.
- **Eventos**: alta/edición de eventos, publicar/borrador.
- **Contenido**: secciones de la home editables.
- **Ajustes**: datos del sitio, horarios, contacto, idiomas.
- **Tiempo real** + **traducción asistida por IA** en todos los textos.

---

## 7. Tecnología e infraestructura

- **Next.js** (React) — web rápida, SEO-friendly, renderizado en servidor.
- **Supabase** — base de datos, autenticación del panel, almacenamiento de imágenes/vídeos, tiempo real.
- **Vercel** — alojamiento, despliegue automático, CDN global, HTTPS.
- **Dominios**: `lacalita.es` y `lacalitaburger.es` (o los que se elijan).
- Código en repositorio Git (control de versiones y copias).

---

## 8. Opciones / módulos que se pueden incluir

| Módulo | Descripción |
|--------|-------------|
| 🎟️ Entradas/reservas de eventos | Venta o reserva con aforo, pago y QR (web La Calita). |
| 🍔 Pedido + pago online | Carrito y pago de hamburguesas (web Burger). |
| 🪑 Reserva de mesa | Reserva de mesas con franjas horarias y aforo. |
| 📧 Newsletter / avisos | Captación de emails y envíos de novedades. |
| ⭐ Reseñas / valoraciones | Reseñas de clientes y votación de platos. |
| 📊 Analítica | Panel de visitas y comportamiento (privacy-friendly). |
| 🌐 Idioma extra | Añadir un idioma adicional. |
| 🔔 Notificaciones | Avisos push / email de pedidos y reservas. |
| 🧾 Facturación / TPV | Integración con sistemas de caja (a evaluar). |

---

## 9. Plazos orientativos

- **Base**: contenido + cartas + portada + panel + 3 idiomas → 2–4 semanas.
- **Área hamburguesería** (landing + carta + panel) → 1–2 semanas.
- **Módulo de pago/entradas** → 1–2 semanas adicionales por módulo.

---

## 10. Próximos pasos

1. Validar el planteamiento (¿una web o dos?).
2. Elegir módulos a incluir (entradas, pedidos, reservas…).
3. Confirmar dominios y datos (horarios, contacto, fotos).
4. Cerrar presupuesto (ver `Presupuesto.md`).
5. Puesta en marcha y formación del panel (1 sesión).

> El presupuesto detallado y orientativo está en el archivo **`Presupuesto.md`** de esta misma carpeta.
