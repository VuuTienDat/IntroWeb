-- Chạy một lần sau upgrade-homepage.sql để thêm CMS dự án.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text not null,
  content text not null,
  category text not null default 'Giải pháp y tế',
  project_stage text not null default 'Đang triển khai',
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

create index if not exists projects_published_idx on public.projects (featured desc, published_at desc) where status = 'published';
drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
alter table public.projects enable row level security;
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects" on public.projects for select to anon, authenticated using (status = 'published' and published_at is not null and published_at <= now());
drop policy if exists "Staff can read all projects" on public.projects;
create policy "Staff can read all projects" on public.projects for select to authenticated using ((select private.is_staff()));
drop policy if exists "Staff can insert projects" on public.projects;
create policy "Staff can insert projects" on public.projects for insert to authenticated with check ((select private.is_staff()));
drop policy if exists "Staff can update projects" on public.projects;
create policy "Staff can update projects" on public.projects for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
drop policy if exists "Staff can delete projects" on public.projects;
create policy "Staff can delete projects" on public.projects for delete to authenticated using ((select private.is_staff()));

insert into public.projects (title, slug, summary, content, category, project_stage, image_alt, seo_title, seo_description, status, featured, published_at)
values (
  'Hệ thống xếp lịch điều dưỡng', 'he-thong-xep-lich',
  'Tự động phân ca, cân bằng ca đêm và khối lượng công việc bằng mô hình ưu tiên nhiều mức.',
  E'## Bài toán vận hành\n\nLịch trực cần đáp ứng số lượng nhân sự, kỹ năng và quy định của từng ca. Đồng thời, lịch vẫn phải giảm chênh lệch về ca đêm và tổng khối lượng giữa các thành viên.\n\n## Cách mô hình hóa\n\nNhững điều kiện không thể vi phạm được giữ thành ràng buộc bắt buộc. Các mong muốn có thể điều chỉnh được chuyển thành điểm phạt. Mức phạt tăng theo độ nghiêm trọng để hệ thống hiểu ưu tiên nào cần xử lý trước.\n\n## Thứ tự ưu tiên\n\n- Trước hết bảo đảm lịch hợp lệ và đủ người cho các ca cần thiết.\n- Ưu tiên giảm chênh lệch số ca đêm giữa các thành viên.\n- Tiếp theo cân bằng tổng khối lượng công việc.\n- Sau cùng giảm các sai lệch còn lại theo trọng số đã thống nhất.\n\n## Giá trị hướng tới\n\nNgười quản lý có thể tạo lịch nhanh hơn, nhìn thấy cảnh báo và hiểu nguyên nhân một lịch được đánh giá tốt hoặc cần điều chỉnh.',
  'Điều phối điều dưỡng', 'Đang triển khai', 'Giao diện hệ thống xếp lịch điều dưỡng Bee System',
  'Hệ thống xếp lịch điều dưỡng', 'Cách Bee System tiếp cận bài toán xếp lịch điều dưỡng với ràng buộc bắt buộc và cơ chế điểm phạt nhiều mức.',
  'published', true, now()
) on conflict (slug) do nothing;

alter table public.projects alter column project_stage set default 'Đang triển khai';
update public.projects set project_stage = 'Đang triển khai' where project_stage = 'Đang phát triển';
