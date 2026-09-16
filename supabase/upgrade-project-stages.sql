-- Chạy một lần trong Supabase SQL Editor nếu dự án đã dùng schema cũ.
-- Không xóa dữ liệu; chỉ chuẩn hóa tên giai đoạn và giá trị mặc định.
alter table public.projects alter column project_stage set default 'Đang triển khai';

update public.projects
set project_stage = 'Đang triển khai'
where project_stage = 'Đang phát triển';
