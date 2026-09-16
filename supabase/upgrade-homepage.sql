-- Chạy file này một lần nếu bạn đã chạy schema.sql của phiên bản trước.
create table if not exists public.homepage_content (
  id text primary key default 'homepage',
  hero_kicker text not null,
  hero_title text not null,
  hero_highlight text not null,
  hero_description text not null,
  hero_image_url text,
  hero_image_alt text not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.homepage_content (
  id, hero_kicker, hero_title, hero_highlight, hero_description, hero_image_alt
) values (
  'homepage',
  'Công nghệ cho y tế và điều dưỡng',
  'Phần mềm y tế',
  'được thiết kế quanh người vận hành.',
  'Bee System Việt Nam phát triển giải pháp phần mềm cho y tế và điều dưỡng, giúp quy trình chăm sóc rõ hơn, dữ liệu dễ theo dõi hơn và đội ngũ vận hành nhẹ hơn.',
  'Giải pháp phần mềm y tế và điều dưỡng của Bee System Việt Nam'
) on conflict (id) do nothing;

drop trigger if exists homepage_content_set_updated_at on public.homepage_content;
create trigger homepage_content_set_updated_at before update on public.homepage_content
for each row execute function public.set_updated_at();

alter table public.homepage_content enable row level security;
grant select on public.homepage_content to anon, authenticated;
grant update on public.homepage_content to authenticated;

drop policy if exists "Public can read homepage content" on public.homepage_content;
create policy "Public can read homepage content" on public.homepage_content for select to anon, authenticated using (true);

drop policy if exists "Staff can update homepage content" on public.homepage_content;
create policy "Staff can update homepage content" on public.homepage_content for update to authenticated
using ((select private.is_staff())) with check ((select private.is_staff()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-assets', 'site-assets', true, 8388608, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view site assets" on storage.objects;
create policy "Anyone can view site assets" on storage.objects for select to public using (bucket_id = 'site-assets');

drop policy if exists "Staff can upload site assets" on storage.objects;
create policy "Staff can upload site assets" on storage.objects for insert to authenticated
with check (bucket_id = 'site-assets' and (select private.is_staff()));

drop policy if exists "Staff can update site assets" on storage.objects;
create policy "Staff can update site assets" on storage.objects for update to authenticated
using (bucket_id = 'site-assets' and (select private.is_staff()));

drop policy if exists "Staff can delete site assets" on storage.objects;
create policy "Staff can delete site assets" on storage.objects for delete to authenticated
using (bucket_id = 'site-assets' and (select private.is_staff()));
