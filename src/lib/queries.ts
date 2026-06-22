import {createClient} from '@/lib/supabase/server';
import {supabasePublic} from '@/lib/supabase/public';

type I18n = Record<string, string>;

export type Allergen = {id?: string; code: string; name: I18n; icon: string};
export type Variant = {id: string; name: I18n; price: number; position: number};
export type Product = {
  id: string;
  slug: string;
  name: I18n;
  description: I18n | null;
  price: number | null;
  image: string | null;
  video: string | null;
  featured: boolean;
  available: boolean;
  position: number;
  category_id: string;
  product_variants: Variant[];
  product_allergens: {allergens: Allergen}[];
};
export type Category = {
  id: string;
  menu_id: string;
  name: I18n;
  description: I18n | null;
  position: number;
  visible: boolean;
  products: Product[];
};
export type Menu = {
  id: string;
  slug: string;
  name: I18n;
  subtitle: I18n | null;
  theme: string;
  header_image: string | null;
  header_video: string | null;
  position: number;
  categories: Category[];
};
export type EventRow = {
  id: string;
  title: I18n;
  description: I18n | null;
  artist: string | null;
  kind: string;
  starts_at: string;
  image: string | null;
  video: string | null;
  images: string[] | null;
  published: boolean;
};

export type HeroCaption = {
  kind?: 'text' | 'image'; // texto o imagen (png/svg, ej. logo de un DJ)
  font?: 'sans' | 'modern' | 'eight'; // tipografía del texto
  text: string;
  src?: string | null; // url de la imagen cuando kind='image'
  size?: number; // ancho % de la imagen (10-100)
  orientation: 'horizontal' | 'vertical';
  position:
    | 'top-left' | 'top' | 'top-right'
    | 'left' | 'center' | 'right'
    | 'bottom-left' | 'bottom' | 'bottom-right';
  color: string;
  bg: string | null; // fondo del texto (null = sin fondo)
  opacity: number; // 0-100 transparencia del texto
  anim: 'none' | 'fade' | 'enter' | 'marquee' | 'marquee-y' | 'diagonal';
  speed: number; // 1-10 (solo animaciones en movimiento)
  offsetY?: number; // px para subir/bajar el texto y evitar solapes
  fontSize?: number; // px (si no, usa el tamaño por defecto)
};

export type HeroSlide = {
  type: 'image' | 'video';
  url: string;
  overlay: number; // 0-90: oscurecimiento sobre la media
  logoLight: boolean; // logo/textos en blanco
  loop: boolean; // vídeo: true=repetir, false=pasar al terminar
  poster?: string; // imagen del primer fotograma (carga instantánea del vídeo)
  captions?: HeroCaption[]; // varios textos independientes por diapositiva
  ctaLabel?: string; // texto del botón (defecto "Ver la carta")
  ctaHref?: string; // destino del botón (interno /carta o URL externa)
};
export type Settings = {
  id: number;
  hours: Record<string, unknown> | null;
  address: string | null;
  maps_url: string | null;
  phone: string | null;
  email: string | null;
  social: Record<string, string> | null;
  landing: I18n | null;
  hero_image: string | null;
  hero_video: string | null;
  hero: HeroSlide[] | null;
};

// ---------- Público ----------

export async function getMenus() {
  const supabase = supabasePublic;
  const {data} = await supabase
    .from('menus')
    .select('id, slug, name, subtitle, theme, header_image, header_video, position')
    .order('position');
  return data ?? [];
}

export async function getMenu(slug: string): Promise<Menu | null> {
  const supabase = supabasePublic;
  const {data} = await supabase
    .from('menus')
    .select(
      `id, slug, name, subtitle, theme, header_image, header_video, position,
       categories (
         id, menu_id, name, description, position, visible,
         products (
           id, slug, name, description, price, image, video, featured, available, position, category_id,
           product_variants ( id, name, price, position ),
           product_allergens ( allergens ( id, code, name, icon ) )
         )
       )`
    )
    .eq('slug', slug)
    .maybeSingle();

  if (!data) return null;
  const menu = data as unknown as Menu;
  menu.categories?.sort((a, b) => a.position - b.position);
  for (const c of menu.categories ?? []) {
    c.products?.sort((a, b) => a.position - b.position);
    for (const p of c.products ?? []) {
      p.product_variants?.sort((a, b) => a.position - b.position);
    }
  }
  return menu;
}

export async function getSettings(): Promise<Settings | null> {
  const supabase = supabasePublic;
  const {data} = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
  return (data as Settings) ?? null;
}

export async function getUpcomingEvents(limit = 20): Promise<EventRow[]> {
  const supabase = supabasePublic;
  const {data} = await supabase
    .from('events')
    .select('*')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at')
    .limit(limit);
  return (data as EventRow[]) ?? [];
}

// ---------- Admin (autenticado: RLS deja ver/editar todo) ----------

export async function getAllergens(): Promise<Allergen[]> {
  const supabase = await createClient();
  const {data} = await supabase.from('allergens').select('id, code, name, icon').order('code');
  return (data as Allergen[]) ?? [];
}

export async function getMenusWithCategories() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('menus')
    .select('id, slug, name, theme, position, categories ( id, name, position )')
    .order('position');
  const menus = (data as unknown as Menu[]) ?? [];
  for (const m of menus) m.categories?.sort((a, b) => a.position - b.position);
  return menus;
}

export async function getProductsAdmin() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('products')
    .select(
      `id, slug, name, description, price, image, video, featured, available, position, category_id,
       product_variants ( id, name, price, position ),
       product_allergens ( allergens ( id, code ) ),
       categories ( name, menus ( name, slug ) )`
    )
    .order('position');
  return (data as unknown as (Product & {categories: {name: I18n; menus: {name: I18n; slug: string}}})[]) ?? [];
}

export async function getProductById(id: string) {
  const supabase = await createClient();
  const {data} = await supabase
    .from('products')
    .select(
      `id, slug, name, description, price, image, video, featured, available, position, category_id,
       product_variants ( id, name, price, position ),
       product_allergens ( allergens ( id, code ) )`
    )
    .eq('id', id)
    .maybeSingle();
  return (data as unknown as Product) ?? null;
}

export async function getCategoriesAdmin() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('categories')
    .select('id, menu_id, name, description, position, visible, menus ( name, slug )')
    .order('position');
  return (data as unknown as (Category & {menus: {name: I18n; slug: string}})[]) ?? [];
}

export async function getCategoryById(id: string) {
  const supabase = await createClient();
  const {data} = await supabase
    .from('categories')
    .select('id, menu_id, name, description, position, visible')
    .eq('id', id)
    .maybeSingle();
  return (data as unknown as Category) ?? null;
}

export async function getMenuById(id: string) {
  const supabase = await createClient();
  const {data} = await supabase
    .from('menus')
    .select('id, slug, name, subtitle, theme, header_image, header_video, position')
    .eq('id', id)
    .maybeSingle();
  return (data as unknown as Menu) ?? null;
}

export async function getAllEvents(): Promise<EventRow[]> {
  const supabase = await createClient();
  const {data} = await supabase.from('events').select('*').order('starts_at', {ascending: false});
  return (data as EventRow[]) ?? [];
}

export async function getEventById(id: string) {
  const supabase = await createClient();
  const {data} = await supabase.from('events').select('*').eq('id', id).maybeSingle();
  return (data as EventRow) ?? null;
}

// Público: solo eventos publicados.
export async function getPublicEvent(id: string) {
  const supabase = supabasePublic;
  const {data} = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .maybeSingle();
  return (data as EventRow) ?? null;
}
