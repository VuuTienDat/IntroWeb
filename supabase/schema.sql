-- Bee System CMS — chạy toàn bộ file này một lần trong Supabase SQL Editor.
create extension if not exists pgcrypto;

do $$ begin
  create type public.post_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null;
end $$;

create table if not exists public.staff_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text,
  content text not null,
  category text,
  cover_image_url text,
  cover_image_alt text,
  author_name text default 'Bee System Việt Nam',
  seo_title text,
  seo_description text,
  status public.post_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Các chỉ mục quan trọng cho trang danh sách, slug và tìm kiếm trong quản trị.
create index if not exists posts_published_idx on public.posts (published_at desc) where status = 'published';
create index if not exists posts_category_published_idx on public.posts (category, published_at desc) where status = 'published';
create index if not exists posts_updated_idx on public.posts (updated_at desc);
create index if not exists posts_search_idx on public.posts using gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(excerpt, '')));

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
for each row execute function public.set_updated_at();

create schema if not exists private;
create or replace function private.is_staff()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.staff_members
    where user_id = (select auth.uid()) and active = true
  );
$$;
revoke all on function private.is_staff() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_staff() to authenticated;

alter table public.staff_members enable row level security;
alter table public.posts enable row level security;
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant select on public.staff_members to authenticated;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts" on public.posts for select to anon, authenticated
using (status = 'published' and published_at is not null and published_at <= now());

drop policy if exists "Staff can read all posts" on public.posts;
create policy "Staff can read all posts" on public.posts for select to authenticated
using ((select private.is_staff()));

drop policy if exists "Staff can insert posts" on public.posts;
create policy "Staff can insert posts" on public.posts for insert to authenticated
with check ((select private.is_staff()));

drop policy if exists "Staff can update posts" on public.posts;
create policy "Staff can update posts" on public.posts for update to authenticated
using ((select private.is_staff())) with check ((select private.is_staff()));

drop policy if exists "Staff can delete posts" on public.posts;
create policy "Staff can delete posts" on public.posts for delete to authenticated
using ((select private.is_staff()));

drop policy if exists "Staff can read own membership" on public.staff_members;
create policy "Staff can read own membership" on public.staff_members for select to authenticated
using (user_id = (select auth.uid()) and active = true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-images', 'post-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view post images" on storage.objects;
create policy "Anyone can view post images" on storage.objects for select to public
using (bucket_id = 'post-images');

drop policy if exists "Staff can upload post images" on storage.objects;
create policy "Staff can upload post images" on storage.objects for insert to authenticated
with check (bucket_id = 'post-images' and (select private.is_staff()));

drop policy if exists "Staff can update post images" on storage.objects;
create policy "Staff can update post images" on storage.objects for update to authenticated
using (bucket_id = 'post-images' and (select private.is_staff()));

drop policy if exists "Staff can delete post images" on storage.objects;
create policy "Staff can delete post images" on storage.objects for delete to authenticated
using (bucket_id = 'post-images' and (select private.is_staff()));

-- Sau khi bạn đăng nhập Google lần đầu ở /admin, thay email rồi chạy riêng đoạn dưới:
-- insert into public.staff_members (user_id, email, display_name, role)
-- select id, email, coalesce(raw_user_meta_data ->> 'full_name', email), 'admin'
-- from auth.users where email = 'EMAIL_GOOGLE_CUA_BAN'
-- on conflict (user_id) do update set active = true, role = 'admin';
