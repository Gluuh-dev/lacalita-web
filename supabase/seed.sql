-- seed.sql — Contenido inicial La Calita (DEV). Idempotente: borra y recarga.
-- 3 cartas: Desayunos & Meriendas + Restaurante (tema calita) y Hamburguesería
-- (tema burger, FICTICIA de relleno). Datos reales en docs/09.
-- name/description jsonb {es,en,fr}: aquí es=en=fr (placeholder); EN/FR se
-- auto-traducen desde el admin cuando haya GOOGLE_TRANSLATE_API_KEY.

create or replace function pg_temp.j(t text) returns jsonb
  language sql immutable as $$ select jsonb_build_object('es', t, 'en', t, 'fr', t) $$;

truncate menus, categories, products, product_variants, allergens, product_allergens, events
  restart identity cascade;

-- ---------- Alérgenos (14 UE) ----------
insert into allergens (code, name, icon) values
  ('gluten', pg_temp.j('Gluten'), '🌾'), ('lacteos', pg_temp.j('Lácteos'), '🥛'),
  ('huevos', pg_temp.j('Huevos'), '🥚'), ('pescados', pg_temp.j('Pescado'), '🐟'),
  ('crustaceos', pg_temp.j('Crustáceos'), '🦐'), ('moluscos', pg_temp.j('Moluscos'), '🦑'),
  ('frutos_cascara', pg_temp.j('Frutos de cáscara'), '🌰'), ('cacahuete', pg_temp.j('Cacahuete'), '🥜'),
  ('soja', pg_temp.j('Soja'), '🫛'), ('sesamo', pg_temp.j('Sésamo'), '🌱'),
  ('mostaza', pg_temp.j('Mostaza'), '🟡'), ('apio', pg_temp.j('Apio'), '🥬'),
  ('sulfitos', pg_temp.j('Sulfitos'), '🍷'), ('altramuces', pg_temp.j('Altramuces'), '🫘');
-- Iconos reales (PNG en public/allergens/<code>.png)
update allergens set icon = '/allergens/' || code || '.png';

-- ---------- Menús ----------
insert into menus (slug, name, subtitle, theme, position) values
  ('desayunos',      pg_temp.j('Desayunos & Meriendas'),   pg_temp.j('Tostadas, bowls y café con vistas al mar'),    'calita', 0),
  ('restaurante',    pg_temp.j('Restaurante'),             pg_temp.j('Cocina mediterránea con los pies en la arena'),'calita', 1),
  ('hamburgueseria', pg_temp.j('Hamburguesería'),          pg_temp.j('Smash, crispy y mucho sabor'),                 'burger', 2);

-- ---------- Categorías ----------
insert into categories (menu_id, name, position)
select m.id, pg_temp.j(c.name), c.pos from menus m
cross join (values ('Tostadas de siempre',0),('Tostadas gourmet',1),('Cafés',2)) as c(name,pos)
where m.slug = 'desayunos';

insert into categories (menu_id, name, position)
select m.id, pg_temp.j(c.name), c.pos from menus m
cross join (values ('Ensaladas',0),('Entrantes',1),('Principales',2)) as c(name,pos)
where m.slug = 'restaurante';

insert into categories (menu_id, name, position)
select m.id, pg_temp.j(c.name), c.pos from menus m
cross join (values ('Burgers',0),('Veggie',1),('Sides',2),('Bebidas',3),('Postres',4)) as c(name,pos)
where m.slug = 'hamburgueseria';

-- ---------- Productos (helper de insert por categoría) ----------
-- DESAYUNOS & MERIENDAS
insert into products (category_id, slug, name, description, price, featured, position)
select c.id, v.slug, pg_temp.j(v.name), case when v.descr='' then null else pg_temp.j(v.descr) end, v.price, v.featured, v.pos
from categories c join menus m on m.id=c.menu_id
cross join (values
  ('la-iberica','La Ibérica','Tomate rallado, AOVE, semillas y jamón ibérico.',7.95,true,0),
  ('la-burrata','La Burrata','Crema de aguacate, tomates cherry confitados, pistacho crujiente, burrata cremosa y aceite de albahaca.',8.90,false,1),
  ('guacasalmon','Guacasalmón','Aguacate, queso crema, salmón ahumado, huevo poché, brotes tiernos y semillas.',9.90,true,2),
  ('benedict-la-calita','Benedict La Calita','Huevos benedictinos sobre pan casero, salsa holandesa y bacon crujiente.',9.50,false,3)
) as v(slug,name,descr,price,featured,pos)
where m.slug='desayunos' and c.name->>'es'='Tostadas gourmet';

insert into products (category_id, slug, name, description, price, featured, position)
select c.id, v.slug, pg_temp.j(v.name), case when v.descr='' then null else pg_temp.j(v.descr) end, v.price, v.featured, v.pos
from categories c join menus m on m.id=c.menu_id
cross join (values
  ('cafe-solo','Café solo','',1.80,false,0),
  ('cafe-con-leche','Café con leche','',1.80,false,1),
  ('capuchino-nata','Capuchino con nata','',2.50,false,2),
  ('cafe-irlandes','Café irlandés','',5.50,false,3)
) as v(slug,name,descr,price,featured,pos)
where m.slug='desayunos' and c.name->>'es'='Cafés';

-- RESTAURANTE
insert into products (category_id, slug, name, description, price, featured, position)
select c.id, v.slug, pg_temp.j(v.name), case when v.descr='' then null else pg_temp.j(v.descr) end, v.price, v.featured, v.pos
from categories c join menus m on m.id=c.menu_id
cross join (values
  ('ensalada-la-calita','Ensalada La Calita','Mezclum con aguacate, mango, frutos rojos, nueces y queso de cabra, salsa de frutos rojos y helado de queso de cabra.',16.00,true,0),
  ('ensalada-la-bahia','Ensalada La Bahía','Queso de cabra, fresas, aguacate, mezclum, mango y vinagreta de mango.',15.50,false,1),
  ('ensalada-melva','Tomate, aguacate y melva','Tomate fresco, aguacate y melva con vinagreta de miel y mostaza.',15.00,false,2),
  ('ensalada-burrata','Ensalada de burrata','Burrata, tomate cherry, pistacho, rúcula, parmesano, crujiente de jamón ibérico y vinagreta de miel y lima.',17.00,false,3)
) as v(slug,name,descr,price,featured,pos)
where m.slug='restaurante' and c.name->>'es'='Ensaladas';

insert into products (category_id, slug, name, description, price, featured, position)
select c.id, v.slug, pg_temp.j(v.name), case when v.descr='' then null else pg_temp.j(v.descr) end, v.price, v.featured, v.pos
from categories c join menus m on m.id=c.menu_id
cross join (values
  ('salmorejo','Salmorejo tradicional','Tomate, pan, ajo, AOVE, jamón ibérico y huevo duro.',8.00,false,0),
  ('croquetas-jamon','Croquetas de jamón ibérico','Con lagrimitas de alioli de mango.',15.00,false,1),
  ('tartar-atun','Tartar de atún','Atún rojo, aguacate, mango, cebolla morada, pistacho y mayonesa de lima.',17.00,true,2),
  ('huevos-rotos','Huevos rotos','Patatas tiernas, huevos rotos, crema de champiñones, foie y ralladura cítrica.',18.00,false,3)
) as v(slug,name,descr,price,featured,pos)
where m.slug='restaurante' and c.name->>'es'='Entrantes';

insert into products (category_id, slug, name, description, price, featured, position)
select c.id, v.slug, pg_temp.j(v.name), case when v.descr='' then null else pg_temp.j(v.descr) end, v.price, v.featured, v.pos
from categories c join menus m on m.id=c.menu_id
cross join (values
  ('crujiente-pulpo','Crujiente de pulpo','Pulpo en panko dorado al momento con alioli de pimentón ahumado.',24.00,true,0),
  ('salmon-eneldo','Salmón en salsa de eneldo','Lomo de salmón al horno con crema de eneldo y puerro.',23.00,false,1),
  ('poke-salmon','Poke de salmón','Salmón, gambas al ajillo, aguacate, mango y verduras sobre arroz, sésamo y salsa de la casa.',18.00,false,2),
  ('hamburguesa-la-calita','Hamburguesa La Calita','Nuestra hamburguesa de la casa.',16.00,false,3)
) as v(slug,name,descr,price,featured,pos)
where m.slug='restaurante' and c.name->>'es'='Principales';

-- HAMBURGUESERÍA (FICTICIA)
insert into products (category_id, slug, name, description, price, featured, position)
select c.id, v.slug, pg_temp.j(v.name), case when v.descr='' then null else pg_temp.j(v.descr) end, v.price, v.featured, v.pos
from categories c join menus m on m.id=c.menu_id
cross join (values
  ('la-calita-classic','La Calita Classic','Ternera, cheddar, lechuga, tomate, cebolla caramelizada y salsa de la casa.',9.90,true,0),
  ('la-doble-playa','La Doble Playa','Doble de ternera, doble cheddar, bacon crujiente y salsa BBQ.',12.50,true,1),
  ('crispy-chicken','Crispy Chicken','Pollo crujiente, lechuga, pepinillo y mayo picante.',10.50,false,2),
  ('smash-bahia','Smash Bahía','Doble smash, queso fundido, cebolla y pickles.',11.00,false,3)
) as v(slug,name,descr,price,featured,pos)
where m.slug='hamburgueseria' and c.name->>'es'='Burgers';

insert into products (category_id, slug, name, description, price, featured, position)
select c.id, v.slug, pg_temp.j(v.name), case when v.descr='' then null else pg_temp.j(v.descr) end, v.price, v.featured, v.pos
from categories c join menus m on m.id=c.menu_id
cross join (values ('veggie-mediterranea','Veggie Mediterránea','Burger de garbanzo y remolacha, hummus, rúcula y tomate seco.',10.00,false,0)) as v(slug,name,descr,price,featured,pos)
where m.slug='hamburgueseria' and c.name->>'es'='Veggie';

insert into products (category_id, slug, name, description, price, featured, position)
select c.id, v.slug, pg_temp.j(v.name), case when v.descr='' then null else pg_temp.j(v.descr) end, v.price, v.featured, v.pos
from categories c join menus m on m.id=c.menu_id
cross join (values
  ('patatas-la-calita','Patatas La Calita','Patatas con alioli de la casa.',4.50,false,0),
  ('aros-cebolla','Aros de cebolla','',4.90,false,1),
  ('nuggets-pollo','Nuggets de pollo (6 ud)','',5.50,false,2)
) as v(slug,name,descr,price,featured,pos)
where m.slug='hamburgueseria' and c.name->>'es'='Sides';

insert into products (category_id, slug, name, description, price, featured, position)
select c.id, v.slug, pg_temp.j(v.name), case when v.descr='' then null else pg_temp.j(v.descr) end, v.price, v.featured, v.pos
from categories c join menus m on m.id=c.menu_id
cross join (values
  ('refresco-burger','Refresco','Coca-Cola, Fanta, Sprite.',2.50,false,0),
  ('cerveza','Cerveza','',2.80,false,1),
  ('agua','Agua','',1.80,false,2)
) as v(slug,name,descr,price,featured,pos)
where m.slug='hamburgueseria' and c.name->>'es'='Bebidas';

insert into products (category_id, slug, name, description, price, featured, position)
select c.id, v.slug, pg_temp.j(v.name), case when v.descr='' then null else pg_temp.j(v.descr) end, v.price, v.featured, v.pos
from categories c join menus m on m.id=c.menu_id
cross join (values
  ('brownie-helado','Brownie con helado','',5.50,true,0),
  ('cheesecake','Cheesecake','',5.00,false,1)
) as v(slug,name,descr,price,featured,pos)
where m.slug='hamburgueseria' and c.name->>'es'='Postres';

-- Variantes (Media / Entera) en Desayunos
insert into products (category_id, slug, name, position)
select c.id, v.slug, pg_temp.j(v.name), v.pos
from categories c join menus m on m.id=c.menu_id
cross join (values ('tostada-tomate','Tomate rallado',0),('tostada-jamon-serrano','Jamón serrano',1),('tostada-queso-manchego','Queso manchego',2)) as v(slug,name,pos)
where m.slug='desayunos' and c.name->>'es'='Tostadas de siempre';

insert into product_variants (product_id, name, price, position)
select p.id, pg_temp.j(v.vname), v.price, v.pos
from products p
cross join (values
  ('tostada-tomate','Media',0.40,0),('tostada-tomate','Entera',0.70,1),
  ('tostada-jamon-serrano','Media',1.50,0),('tostada-jamon-serrano','Entera',2.95,1),
  ('tostada-queso-manchego','Media',1.95,0),('tostada-queso-manchego','Entera',3.40,1)
) as v(pslug,vname,price,pos)
where p.slug=v.pslug;

-- ---------- Alérgenos por producto ----------
insert into product_allergens (product_id, allergen_id)
select p.id, a.id
from (values
  ('la-iberica','gluten'),('la-iberica','sesamo'),('la-iberica','frutos_cascara'),
  ('la-burrata','gluten'),('la-burrata','lacteos'),('la-burrata','frutos_cascara'),
  ('guacasalmon','gluten'),('guacasalmon','lacteos'),('guacasalmon','pescados'),('guacasalmon','huevos'),('guacasalmon','sesamo'),
  ('benedict-la-calita','gluten'),('benedict-la-calita','huevos'),('benedict-la-calita','lacteos'),('benedict-la-calita','sulfitos'),
  ('ensalada-la-calita','frutos_cascara'),('ensalada-la-calita','lacteos'),('ensalada-la-calita','sulfitos'),
  ('ensalada-la-bahia','lacteos'),('ensalada-la-bahia','sulfitos'),
  ('ensalada-melva','pescados'),('ensalada-melva','mostaza'),
  ('ensalada-burrata','lacteos'),('ensalada-burrata','frutos_cascara'),
  ('salmorejo','gluten'),('salmorejo','huevos'),
  ('croquetas-jamon','gluten'),('croquetas-jamon','lacteos'),('croquetas-jamon','huevos'),('croquetas-jamon','frutos_cascara'),
  ('tartar-atun','pescados'),('tartar-atun','frutos_cascara'),('tartar-atun','lacteos'),('tartar-atun','sesamo'),('tartar-atun','soja'),
  ('huevos-rotos','huevos'),('huevos-rotos','lacteos'),
  ('crujiente-pulpo','gluten'),('crujiente-pulpo','moluscos'),('crujiente-pulpo','lacteos'),('crujiente-pulpo','altramuces'),
  ('salmon-eneldo','pescados'),('salmon-eneldo','lacteos'),('salmon-eneldo','sulfitos'),
  ('poke-salmon','pescados'),('poke-salmon','crustaceos'),('poke-salmon','sesamo'),('poke-salmon','lacteos'),('poke-salmon','soja'),
  ('hamburguesa-la-calita','sulfitos'),('hamburguesa-la-calita','lacteos'),('hamburguesa-la-calita','gluten'),
  ('capuchino-nata','lacteos'),
  ('tostada-queso-manchego','lacteos'),
  ('la-calita-classic','gluten'),('la-calita-classic','lacteos'),('la-calita-classic','huevos'),('la-calita-classic','sulfitos'),
  ('la-doble-playa','gluten'),('la-doble-playa','lacteos'),('la-doble-playa','sulfitos'),
  ('crispy-chicken','gluten'),('crispy-chicken','lacteos'),('crispy-chicken','huevos'),('crispy-chicken','mostaza'),
  ('smash-bahia','gluten'),('smash-bahia','lacteos'),('smash-bahia','sulfitos'),
  ('veggie-mediterranea','gluten'),('veggie-mediterranea','sesamo'),
  ('patatas-la-calita','huevos'),('aros-cebolla','gluten'),('nuggets-pollo','gluten'),
  ('brownie-helado','gluten'),('brownie-helado','lacteos'),('brownie-helado','huevos'),('brownie-helado','frutos_cascara'),
  ('cheesecake','gluten'),('cheesecake','lacteos'),('cheesecake','huevos')
) as x(pslug, acode)
join products p on p.slug = x.pslug
join allergens a on a.code = x.acode;

-- ---------- Eventos (placeholder, fechas futuras relativas) ----------
insert into events (title, description, artist, kind, starts_at, published) values
  (pg_temp.j('Sunset Sessions'),    pg_temp.j('Sesión chill-house al atardecer frente al mar.'), 'DJ Marea',       'dj',         now() + interval '3 days'  + interval '20 hours', true),
  (pg_temp.j('Concierto acústico'), pg_temp.j('Versiones acústicas bajo las estrellas.'),         'Dúo Salobreña',  'concierto',  now() + interval '7 days'  + interval '21 hours', true),
  (pg_temp.j('Fiesta de la espuma'),pg_temp.j('Tarde de espuma para los más peques.'),            null,             'otro',       now() + interval '12 days' + interval '18 hours', true);

-- ---------- Ajustes del local ----------
insert into settings (id, address, maps_url, phone, hours, social, landing)
values (1,
  'C. Pº Marítimo, s/n, 18680 Salobreña, Granada',
  'https://www.google.com/maps/search/?api=1&query=La+Calita+Beach+Salobre%C3%B1a',
  '+34 958 61 00 00',
  jsonb_build_object('lun_vie','09:00 – 00:00','sab','09:00 – 02:00','dom','09:00 – 00:00'),
  jsonb_build_object('instagram','https://www.instagram.com/lacalitabeach/','facebook','https://www.facebook.com/people/La-Calita-Beach/61570968837712/'),
  pg_temp.j('Cocina mediterránea con los pies en la arena, en Salobreña.'))
on conflict (id) do update set address=excluded.address, maps_url=excluded.maps_url, phone=excluded.phone, hours=excluded.hours, social=excluded.social, landing=excluded.landing;
