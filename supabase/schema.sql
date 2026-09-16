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

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text not null,
  content text not null,
  category text not null default 'Giải pháp y tế',
  project_stage text not null default 'Đang triển khai',
  app_url text,
  image_url text,
  image_alt text not null,
  seo_title text not null,
  seo_description text not null,
  status public.post_status not null default 'draft',
  featured boolean not null default false,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Hồ sơ tối thiểu của khách đã chủ động đăng nhập Google để mở web app.
-- Không lưu mật khẩu, access token, refresh token hay dữ liệu sức khỏe.
create table if not exists public.customer_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  consented_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.project_viewers (
  user_id uuid not null references public.customer_accounts(user_id) on delete cascade,
  project_slug text not null references public.projects(slug) on update cascade on delete cascade,
  first_viewed_at timestamptz not null default now(),
  last_viewed_at timestamptz not null default now(),
  view_count integer not null default 1 check (view_count > 0),
  primary key (user_id, project_slug)
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

-- Các chỉ mục quan trọng cho trang danh sách, slug và tìm kiếm trong quản trị.
create index if not exists posts_published_idx on public.posts (published_at desc) where status = 'published';
create index if not exists posts_category_published_idx on public.posts (category, published_at desc) where status = 'published';
create index if not exists posts_updated_idx on public.posts (updated_at desc);
create index if not exists posts_search_idx on public.posts using gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(excerpt, '')));
create index if not exists projects_published_idx on public.projects (featured desc, published_at desc) where status = 'published';
create index if not exists project_viewers_recent_idx on public.project_viewers (last_viewed_at desc);
create index if not exists project_viewers_project_idx on public.project_viewers (project_slug, last_viewed_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists homepage_content_set_updated_at on public.homepage_content;
create trigger homepage_content_set_updated_at before update on public.homepage_content
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
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

create or replace function public.record_project_access(p_project_slug text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  account auth.users%rowtype;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  select * into account from auth.users where id = (select auth.uid());
  if account.id is null then
    raise exception 'User not found';
  end if;

  if not exists (
    select 1 from public.projects
    where slug = p_project_slug and status = 'published'
      and published_at is not null and published_at <= now()
  ) then
    raise exception 'Project not available';
  end if;

  insert into public.customer_accounts (user_id, email, display_name, avatar_url, consented_at, last_seen_at)
  values (
    account.id,
    account.email,
    coalesce(account.raw_user_meta_data ->> 'full_name', account.raw_user_meta_data ->> 'name'),
    coalesce(account.raw_user_meta_data ->> 'avatar_url', account.raw_user_meta_data ->> 'picture'),
    now(),
    now()
  )
  on conflict (user_id) do update set
    email = excluded.email,
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    last_seen_at = now();

  insert into public.project_viewers (user_id, project_slug, first_viewed_at, last_viewed_at, view_count)
  values (account.id, p_project_slug, now(), now(), 1)
  on conflict (user_id, project_slug) do update set
    last_viewed_at = now(),
    view_count = project_viewers.view_count + 1;
end;
$$;
revoke all on function public.record_project_access(text) from public;
grant execute on function public.record_project_access(text) to authenticated;

alter table public.staff_members enable row level security;
alter table public.posts enable row level security;
alter table public.homepage_content enable row level security;
alter table public.projects enable row level security;
alter table public.customer_accounts enable row level security;
alter table public.project_viewers enable row level security;
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant select on public.staff_members to authenticated;
grant select on public.homepage_content to anon, authenticated;
grant update on public.homepage_content to authenticated;
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
grant select on public.customer_accounts to authenticated;
grant select on public.project_viewers to authenticated;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects" on public.projects for select to anon, authenticated
using (status = 'published' and published_at is not null and published_at <= now());

drop policy if exists "Staff can read all projects" on public.projects;
create policy "Staff can read all projects" on public.projects for select to authenticated using ((select private.is_staff()));
drop policy if exists "Staff can insert projects" on public.projects;
create policy "Staff can insert projects" on public.projects for insert to authenticated with check ((select private.is_staff()));
drop policy if exists "Staff can update projects" on public.projects;
create policy "Staff can update projects" on public.projects for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
drop policy if exists "Staff can delete projects" on public.projects;
create policy "Staff can delete projects" on public.projects for delete to authenticated using ((select private.is_staff()));

drop policy if exists "Customers can read own account" on public.customer_accounts;
create policy "Customers can read own account" on public.customer_accounts for select to authenticated
using (user_id = (select auth.uid()));
drop policy if exists "Staff can read customer accounts" on public.customer_accounts;
create policy "Staff can read customer accounts" on public.customer_accounts for select to authenticated
using ((select private.is_staff()));

drop policy if exists "Customers can read own project views" on public.project_viewers;
create policy "Customers can read own project views" on public.project_viewers for select to authenticated
using (user_id = (select auth.uid()));
drop policy if exists "Staff can read project viewers" on public.project_viewers;
create policy "Staff can read project viewers" on public.project_viewers for select to authenticated
using ((select private.is_staff()));

drop policy if exists "Public can read homepage content" on public.homepage_content;
create policy "Public can read homepage content" on public.homepage_content for select to anon, authenticated
using (true);

drop policy if exists "Staff can update homepage content" on public.homepage_content;
create policy "Staff can update homepage content" on public.homepage_content for update to authenticated
using ((select private.is_staff())) with check ((select private.is_staff()));

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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-assets', 'site-assets', true, 8388608, array['image/jpeg','image/png','image/webp','image/gif'])
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

drop policy if exists "Anyone can view site assets" on storage.objects;
create policy "Anyone can view site assets" on storage.objects for select to public
using (bucket_id = 'site-assets');

drop policy if exists "Staff can upload site assets" on storage.objects;
create policy "Staff can upload site assets" on storage.objects for insert to authenticated
with check (bucket_id = 'site-assets' and (select private.is_staff()));

drop policy if exists "Staff can update site assets" on storage.objects;
create policy "Staff can update site assets" on storage.objects for update to authenticated
using (bucket_id = 'site-assets' and (select private.is_staff()));

drop policy if exists "Staff can delete site assets" on storage.objects;
create policy "Staff can delete site assets" on storage.objects for delete to authenticated
using (bucket_id = 'site-assets' and (select private.is_staff()));

insert into public.projects (title, slug, summary, content, category, project_stage, image_alt, seo_title, seo_description, status, featured, published_at)
values (
  'Hệ thống xếp lịch điều dưỡng', 'he-thong-xep-lich',
  'Tự động phân ca, cân bằng ca đêm và khối lượng công việc bằng mô hình ưu tiên nhiều mức.',
  E'## Bài toán vận hành\n\nLịch trực cần đáp ứng số lượng nhân sự, kỹ năng và quy định của từng ca. Đồng thời, lịch vẫn phải giảm chênh lệch về ca đêm và tổng khối lượng giữa các thành viên.\n\n## Cách mô hình hóa\n\nNhững điều kiện không thể vi phạm được giữ thành ràng buộc bắt buộc. Các mong muốn có thể điều chỉnh được chuyển thành điểm phạt. Mức phạt tăng theo độ nghiêm trọng để hệ thống hiểu ưu tiên nào cần xử lý trước.\n\n## Thứ tự ưu tiên\n\n- Trước hết bảo đảm lịch hợp lệ và đủ người cho các ca cần thiết.\n- Ưu tiên giảm chênh lệch số ca đêm giữa các thành viên.\n- Tiếp theo cân bằng tổng khối lượng công việc.\n- Sau cùng giảm các sai lệch còn lại theo trọng số đã thống nhất.\n\n## Giá trị hướng tới\n\nNgười quản lý có thể tạo lịch nhanh hơn, nhìn thấy cảnh báo và hiểu nguyên nhân một lịch được đánh giá tốt hoặc cần điều chỉnh.',
  'Điều phối điều dưỡng', 'Đang triển khai',
  'Giao diện hệ thống xếp lịch điều dưỡng Bee System',
  'Hệ thống xếp lịch điều dưỡng',
  'Cách Bee System tiếp cận bài toán xếp lịch điều dưỡng với ràng buộc bắt buộc và cơ chế điểm phạt nhiều mức.',
  'published', true, now()
) on conflict (slug) do nothing;

-- Sau khi bạn đăng nhập Google lần đầu ở /admin, thay email rồi chạy riêng đoạn dưới:
-- insert into public.staff_members (user_id, email, display_name, role)
-- select id, email, coalesce(raw_user_meta_data ->> 'full_name', email), 'admin'
-- from auth.users where email = 'EMAIL_GOOGLE_CUA_BAN'
-- on conflict (user_id) do update set active = true, role = 'admin';
