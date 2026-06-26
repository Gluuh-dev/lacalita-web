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
  is_new: boolean;
  tag: string | null;
  ingredients: string[];
  available: boolean;
  position: number;
  category_id: string;
  old_price: number | null;
  votes: number;
  rating: number | null;
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

// Modelo de portada en módulo sin dependencias de servidor (cliente lo importa).
export type {HeroSlide} from './hero-types';
export {DEFAULT_HERO_SLIDE} from './hero-types';
import type {HeroSlide} from './hero-types';
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
  content: import('./content-types').LandingContent | null;
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
           id, slug, name, description, price, image, video, featured, is_new, tag, ingredients, available, position, category_id, old_price, votes, rating,
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

export async function getFeaturedProducts(limit = 4) {
  const {data} = await supabasePublic
    .from('products')
    .select('id, slug, name, price, image, categories ( menus ( slug ) )')
    .eq('featured', true)
    .eq('available', true)
    .not('image', 'is', null)
    .limit(limit);
  return (
    (data as unknown as {
      id: string;
      slug: string;
      name: I18n;
      price: number | null;
      image: string | null;
      categories: {menus: {slug: string} | null} | null;
    }[]) ?? []
  );
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
      `id, slug, name, description, price, image, video, featured, is_new, tag, ingredients, available, position, category_id, old_price, votes, rating,
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
      `id, slug, name, description, price, image, video, featured, is_new, tag, ingredients, available, position, category_id, old_price, votes, rating,
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

// ---- Entradas de eventos ----
export type EventTicket = {
  id: string;
  event_id: string;
  name: I18n;
  description: I18n;
  price: number;
  capacity: number | null;
  sold: number;
  active: boolean;
  position: number;
};
export async function getEventTickets(eventId: string): Promise<EventTicket[]> {
  const {data} = await supabasePublic.from('event_tickets').select('*').eq('event_id', eventId).eq('active', true).order('position');
  return (data as EventTicket[]) ?? [];
}
export async function getEventTicketsAdmin(eventId: string): Promise<EventTicket[]> {
  const supabase = await createClient();
  const {data} = await supabase.from('event_tickets').select('*').eq('event_id', eventId).order('position');
  return (data as EventTicket[]) ?? [];
}

// ---- Hamburguesería: diapositivas de portada + ofertas ----
export type BurgerSlide = {
  id: string;
  name: string;
  eyebrow: I18n;
  title: I18n;
  price: number | null;
  image: string | null;
  position: number;
  active: boolean;
  title_font: string;
  title_color: string;
  title_behind: boolean;
  bg_effect: string;
  bg_image: string | null;
  bg_color: string;
  text_shadow: boolean;
  title_outline: boolean;
  price_outline: boolean;
  hide_title: boolean;
  hide_price: boolean;
  accent_color: string;
  button_color: string;
  text_color: string;
  edge_colors: Record<string, string>;
  media_y: number;
  title_scale: number;
  eyebrow_scale: number;
  price_scale: number;
  overlay_fx: string;
  show_rings: boolean;
  title_gradient: string;
  fx_sparks: boolean;
  fx_smoke: boolean;
  price_font: string;
  price_color: string;
  price_gradient: string;
  title_y: number;
  price_y: number;
  fx_video: string;
  fx_video_behind: boolean;
  fx_video_x: number;
  fx_video_y: number;
  fx_video_scale: number;
};
export type BurgerOffer = {
  id: string;
  title: I18n;
  eyebrow: I18n;
  rating: number | null;
  description: I18n;
  discount_label: string;
  price: number | null;
  old_price: number | null;
  color_style: string;
  image: string | null;
  position: number;
  active: boolean;
};

export async function getBurgerSlides(): Promise<BurgerSlide[]> {
  const {data} = await supabasePublic.from('burger_hero_slides').select('*').eq('active', true).order('position');
  return (data as BurgerSlide[]) ?? [];
}
export async function getBurgerOffers(): Promise<BurgerOffer[]> {
  const {data} = await supabasePublic.from('burger_offers').select('*').eq('active', true).order('position');
  return (data as BurgerOffer[]) ?? [];
}
export async function getBurgerOffer(id: string): Promise<BurgerOffer | null> {
  const {data} = await supabasePublic.from('burger_offers').select('*').eq('id', id).eq('active', true).maybeSingle();
  return (data as BurgerOffer) ?? null;
}
export async function getBurgerSlidesAdmin(): Promise<BurgerSlide[]> {
  const supabase = await createClient();
  const {data} = await supabase.from('burger_hero_slides').select('*').order('position');
  return (data as BurgerSlide[]) ?? [];
}
export async function getBurgerOffersAdmin(): Promise<BurgerOffer[]> {
  const supabase = await createClient();
  const {data} = await supabase.from('burger_offers').select('*').order('position');
  return (data as BurgerOffer[]) ?? [];
}
