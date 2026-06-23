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

## ¿Vercel Pro necesario?

- No obligatorio. **Cloudflare Pages (gratis, comercial OK)** o VPS son alternativas.
- Vercel Hobby funciona pero es "no comercial" por ToS.
- Recomendado al cliente: cobrar la cuota de mantenimiento que cubra el hosting que elijas.

## Precio acordado (amigo)

- **Desarrollo web completo: 1.390 € pago único** (web + hamburguesería + panel + 3 idiomas + IA traducción). Incluye mantenimiento, cambios/ideas y ayuda a meter platos/traducciones.
- **Servicios anuales: ~295 €/año a precio de coste** (dominio + Supabase Pro). Sin recargo.
- **Módulos (entradas, pedido+pago)**: aparte (700–1.800 € c/u).

### Cálculo de horas / €·hora (para ti)

Estimación del trabajo (a ojo, todo lo construido):

| Bloque | Horas aprox. |
|---|---|
| Web pública (portada, cartas, eventos, ubicación) | 20–28 h |
| Área hamburguesería (landing, efectos, carta) | 14–20 h |
| Panel de administración (todos los editores + previsualización) | 18–26 h |
| Multi-idioma + IA de traducción | 5–8 h |
| Ajustes, responsive, pruebas, despliegue | 8–12 h |
| **Total estimado** | **~65–94 h** (≈ **8–12 jornadas**) |

**€/hora resultante a 1.390 €:**
- A 65 h → **~21 €/h**
- A 80 h → **~17 €/h**
- A 94 h → **~15 €/h**

> Realidad: es **precio de amigo / portfolio** (por debajo de tarifa de mercado, que estaría en 30–50 €/h). Para clientes normales, este mismo trabajo se cobraría **3.000–4.500 €**.

### Aviso sobre "mantenimiento y cambios incluidos"

- En el presupuesto pone "incluido" para el amigo. **Acota mentalmente** (p. ej. cambios razonables el primer año); si empieza a pedir rediseños grandes o módulos, **cóbralos aparte** para no trabajar gratis indefinidamente.

## Cómo gestionarlo

- Un solo proyecto Git → un solo despliegue.
- Supabase: 1 proyecto; subir a Pro antes de poner en producción.
- Dominio: apuntar a Vercel/Cloudflare.
- Pasarela: dar de alta Stripe del cliente (cobros van a su cuenta).
- Formación: 1 sesión de panel.
