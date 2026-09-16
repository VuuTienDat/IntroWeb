-- Chạy một lần trong Supabase SQL Editor cho database Bee System đã tạo trước đây.
-- File này thêm URL web app vào dự án và lưu tối thiểu người đã chủ động đăng nhập Google.

alter table public.projects add column if not exists app_url text;

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

create index if not exists project_viewers_recent_idx on public.project_viewers (last_viewed_at desc);
create index if not exists project_viewers_project_idx on public.project_viewers (project_slug, last_viewed_at desc);

alter table public.customer_accounts enable row level security;
alter table public.project_viewers enable row level security;
grant select on public.customer_accounts to authenticated;
grant select on public.project_viewers to authenticated;

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
