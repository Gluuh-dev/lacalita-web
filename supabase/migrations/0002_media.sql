-- 0002_media.sql — Media para hero y vídeos de eventos.
alter table settings add column if not exists hero_image text;
alter table settings add column if not exists hero_video text;
alter table events   add column if not exists video text;
