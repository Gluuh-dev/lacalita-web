# 02 — Mapa del sitio y páginas

Rutas con prefijo de idioma (`/es`, `/en`, `/fr`). `es` es el por defecto.

```
/[locale]                      Landing (home)
/[locale]/carta                Selector de carta (Restaurante | Hamburguesería)
/[locale]/carta/restaurante    Carta restaurante + desayunos (tema La Calita)
/[locale]/carta/hamburgueseria Carta hamburguesería (tema burger, distinto)
/[locale]/carta/[menu]/[producto]  Detalle de producto (foto/vídeo, alérgenos, desc, precio)
/[locale]/eventos              Agenda: DJs, conciertos, por día
/[locale]/info                 Horarios, ubicación, contacto, redes (opcional, o en landing)

/admin                         Panel de administración (login, sin idioma)
/admin/login
/admin/landing                 Editar hero, imágenes, vídeos de la home
/admin/menus                   Cabeceras de cada carta (restaurante / hamburguesería)
/admin/categorias              Categorías por carta (reordenar arrastrando)
/admin/productos               CRUD productos: precios, descripción, foto/vídeo, alérgenos
/admin/eventos                 CRUD eventos
/admin/horarios                Horarios y datos del local
```

## Páginas públicas

### Landing `/[locale]`
- Hero animado con logo, lema y CTA "Ver carta" (→ QR friendly).
- Bloques editables desde admin: imágenes, **vídeos**, texto de presentación.
- Sección eventos próximos (quién pincha/canta hoy y esta semana).
- Horarios + ubicación + redes + enlace a Google Maps.
- Acceso rápido a las dos cartas.

### Selector de carta `/[locale]/carta`
- Dos puertas grandes: **Restaurante & Desayunos** / **Hamburguesería**.
- Cada una con su estilo visual de preview.
- El QR de mesa puede apuntar aquí, o directo a una carta concreta.

### Carta restaurante `/[locale]/carta/restaurante`
- Cabecera editable (imagen/título/subtítulo desde admin).
- Categorías (Desayunos, Tostadas, Ensaladas, Entrantes, Arroces, Principales,
  Carnes, Cafés…) navegables.
- Producto: foto/vídeo, nombre, descripción, precio(s) (media/entera donde aplique),
  iconos de alérgenos.
- Leyenda de alérgenos.
- Búsqueda por nombre/ingrediente (ref ANOIS/MENURY).

### Carta hamburguesería `/[locale]/carta/hamburgueseria`
- Mismo motor de datos, **tema y layout propios**.
- Categorías tipo carrusel superior (ref Burger King).
- Detalle de producto con foto grande (sin carrito: solo informativo).

### Detalle de producto `/[locale]/carta/[menu]/[producto]`
- Página propia (URL compartible y SEO indexable por producto).
- **Foto o vídeo grande** del producto (lo que tenga cargado).
- Título, descripción completa, precio(s).
- Iconos + nombres de alérgenos.
- Etiquetas (destacado, nuevo, sin gluten…) si aplica.
- Animación de entrada (imagen escala/parallax, texto en stagger).
- Botón volver a la carta; hereda el tema de su carta.

### Eventos `/[locale]/eventos`
- Lista/calendario por día. Cada evento: fecha, hora, artista/DJ, foto, descripción.
- Destacar "hoy".

## Flujo principal (cliente con QR)

```
Escanea QR en mesa
  → abre /es/carta/restaurante (o la que toque)
  → navega categorías, ve fotos/precios/alérgenos
  → puede cambiar idioma y saltar a la otra carta o a eventos
```

Sin login, sin pedidos, sin pagos. Rápido y bonito.
