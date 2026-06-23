# 🔒 INTERNO — No enviar al cliente

_Costes reales, márgenes y cómo gestionarlo. Solo para uso propio._

---

## Costes reales de servicios (lo que pagas tú)

| Servicio | Plan | Coste real | ¿Pausa? / notas |
|---|---|---|---|
| Dominio | `.es` / `.com` | ~10–15 €/año | — |
| **Supabase** | **Pro (25 $/mes ≈ 23 €)** | **~280 €/año** | El **Free pausa a los ~7 días sin actividad** → no vale para producción. Pro no se pausa, trae backups. |
| Supabase | Free | 0 € | Solo desarrollo/pruebas. |
| Hosting Vercel | Pro (20 $/mes) | ~240 €/año | Hobby = gratis pero **uso no comercial** según ToS. |
| Hosting Cloudflare Pages | Free | **0 €** | **Permite uso comercial** → alternativa gratis correcta. |
| VPS (Hetzner/Contabo) | — | ~60–80 €/año | No se pausa, pero lo mantienes tú. |
| Email transaccional | Resend free / Brevo free | 0 € (hasta cuota) | Para entradas/QR y pedidos. |
| Pasarela pago | Stripe | 0 € fijo · ~1,5 %+0,25 €/venta | Solo si hay módulo de pago. |

**Coste real mínimo producción**: 1 dominio + Supabase Pro = **~295 €/año** (con Cloudflare Pages gratis de hosting). Si usas Vercel Pro: ~535 €/año.

## ¿Cuántas BD en Supabase Pro?

- Pro se paga **por cuenta/organización**, no por web. Cubre **1 proyecto** (= 1 base de datos). Cada proyecto extra ~10 $/mes.
- **La Calita usa 1 sola BD** (cartas + hamburguesería + eventos + contenido). No hace falta más.

## Despliegue: Netlify

- **Desplegamos en Netlify** (plan **gratuito**, que **permite uso comercial**). 0 € de hosting.
- Next.js funciona en Netlify con su adaptador oficial; **probar el deploy** (Next 16 es nuevo: middleware/`proxy`, ISR). Si diera guerra, alternativa: Vercel (Hobby gratis pero "no comercial" por ToS, o Pro ~20 €/mes) o Cloudflare Pages (gratis).
- Coste de hosting al cliente: **0 €** (solo dominio + Supabase).

## Precio acordado (amigo) — cuentas reales

| Concepto | Importe |
|---|---|
| Precio cobrado al cliente | **1.390 €** |
| − Servicios 1.er año (dominio + Supabase Pro, a coste) | **−295 €** |
| **= Ganancia neta (tu trabajo, 1.er año)** | **~1.095 €** |
| Horas estimadas | ~162 h |
| **€/hora sobre el precio (1.390 / 162)** | **~8,6 €/h** |
| €/hora sobre ganancia neta (1.095 / 162) | ~6,8 €/h |
| Valor a tarifa normal de mercado (162 × 25 €/h) | **~4.050 €** |
| Descuento de amigo aplicado | **~2.660 €** |

- **Servicios anuales: ~295 €/año a precio de coste** (dominio + Supabase Pro). Los descuentas de la ganancia.
- **Módulos (entradas, pedido+pago)**: aparte (700–1.800 € c/u).

### Horas para desarrollar esto desde cero (una persona)

Estimación profesional realista de un desarrollador construyendo TODO esto **desde cero**:

| Bloque | Horas |
|---|---|
| Arquitectura/setup (Next.js, Supabase, auth, i18n, despliegue) | 7 h |
| Sistema de diseño (tokens, fuentes, componentes) | 10 h |
| Portada/hero (carrusel, modos de evento, animaciones) | 14 h |
| Cartas interactivas (store, favoritos, mi lista, reels de vídeo, filtros, alérgenos) | 22 h |
| Ficha de producto + eventos + detalle de evento | 11 h |
| Landing hamburguesería (hero con efectos, slider, ofertas, votadas, marquesina, vídeo FX, todo configurable) | 28 h |
| Panel de administración completo (todos los editores + previsualización en vivo) | 36 h |
| Multi-idioma + IA de traducción | 7 h |
| Diseño de iconos/imágenes, vectorización y vídeos con IA | 13 h |
| Responsive, pruebas, pulido, bugs, despliegue | 14 h |
| **Total** | **~162 h** (≈ 20 jornadas · ~4 semanas a tiempo completo) |

**A tarifa normal usada en la propuesta (25 €/h):** 162 h × 25 € = **~4.050 €** (valor real sin descuento).
**€/hora a 1.390 € sobre 162 h:** **~8,6 €/h** (precio de amigo, muy por debajo de mercado).

> Si lo cobraras a tarifa de mercado (25–40 €/h) este proyecto valdría **4.000–6.500 €**. El 1.390 € es **precio de amigo/portfolio**.

### Aviso sobre "mantenimiento y cambios incluidos"

- En el presupuesto pone "incluido" para el amigo. **Acota mentalmente** (p. ej. cambios razonables el primer año); si empieza a pedir rediseños grandes o módulos, **cóbralos aparte** para no trabajar gratis indefinidamente.

## Cómo gestionarlo

- Un solo proyecto Git → un solo despliegue.
- Supabase: 1 proyecto; subir a Pro antes de poner en producción.
- Dominio: apuntar a Vercel/Cloudflare.
- Pasarela: dar de alta Stripe del cliente (cobros van a su cuenta).
- Formación: 1 sesión de panel.
