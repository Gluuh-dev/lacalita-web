-- 0003_hero_gallery.sql — Hero con varias diapositivas y galería de eventos.
-- hero: array de slides {type:'image'|'video', url, overlay (0-90), logoLight, loop}.
alter table settings add column if not exists hero   jsonb not null default '[]'::jsonb;
alter table events   add column if not exists images jsonb not null default '[]'::jsonb;
