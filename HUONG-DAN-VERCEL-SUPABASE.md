# Hướng dẫn Bee System CMS miễn phí: Supabase + Google + Vercel

Tài liệu này dành cho người lần đầu thiết lập. Bạn không cần WordPress. Website dùng:

- Vercel để build và chạy website Next.js.
- Supabase Free để lưu bài viết bằng PostgreSQL, lưu ảnh và xác thực người dùng.
- Google OAuth để nhân viên đăng nhập ở `/admin`.
- Row Level Security (RLS) để chỉ nhân viên được cấp quyền mới sửa bài.

## 1. Những gì đã có trong mã nguồn

- `/admin`: trang quản trị bài viết, không cho công cụ tìm kiếm lập chỉ mục.
- `/auth/callback`: nhận kết quả đăng nhập Google.
- `/kien-thuc`: chỉ hiển thị các bài có trạng thái `published`.
- Nút **Lưu nháp**, **Đăng bài**, **Gỡ bài**. Gỡ bài chuyển về bản nháp, không xóa dữ liệu.
- Tải ảnh tối đa 5 MB lên bucket `post-images`.
- SEO theo từng bài: slug, title, description, ảnh/alt, Article schema, canonical và sitemap.
- RLS và chỉ mục PostgreSQL cho slug, danh sách bài đã đăng, chuyên mục và tìm kiếm.

## 2. Tạo dự án Supabase Free

1. Mở [supabase.com](https://supabase.com/) và đăng nhập.
2. Chọn **New project**.
3. Chọn gói **Free**, đặt tên ví dụ `bee-system-cms`.
4. Tạo mật khẩu cơ sở dữ liệu mạnh và cất ở nơi an toàn. Trang web này không cần đưa mật khẩu đó vào Vercel.
5. Chọn vùng gần Việt Nam nếu giao diện có lựa chọn phù hợp, rồi bấm tạo dự án.

Gói Free không yêu cầu mua tên miền và phù hợp để demo. Dự án Free ít hoạt động có thể bị tạm dừng; khi làm production nên kiểm tra lại giới hạn hiện hành tại trang Pricing của Supabase.

## 3. Tạo database, quyền truy cập và kho ảnh

1. Trong Supabase, chọn **SQL Editor** → **New query**.
2. Mở file `supabase/schema.sql` trong mã nguồn, sao chép toàn bộ nội dung vào ô query.
3. Bấm **Run**.
4. Thấy thông báo thành công là xong. Trong **Table Editor** sẽ có `posts` và `staff_members`; trong **Storage** sẽ có `post-images`.

Không tắt RLS. File SQL đã tạo chính sách: khách chỉ đọc được bài đã xuất bản; nhân viên hợp lệ mới đọc/sửa được mọi bài.

## 4. Lấy hai biến Supabase cho Vercel

Trong Supabase vào **Project Settings** → **API** (một số giao diện ghi **Data API / API Keys**) và sao chép:

| Biến Vercel | Giá trị |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL dạng `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key hoặc legacy `anon public` key |

`NEXT_PUBLIC_SUPABASE_ANON_KEY` được phép dùng ở trình duyệt vì RLS bảo vệ dữ liệu. Tuyệt đối không đưa `service_role`/secret key vào biến bắt đầu bằng `NEXT_PUBLIC_`, GitHub hay gửi cho người khác.

## 5. Bật đăng nhập Google

Việc này có hai phía: Google cấp Client ID/Secret, Supabase tiếp nhận đăng nhập.

### 5.1 Lấy callback URL ở Supabase

1. Supabase → **Authentication** → **Providers** → **Google**.
2. Ghi lại callback URL được hiển thị. Thường có dạng:

   `https://PROJECT_REF.supabase.co/auth/v1/callback`

### 5.2 Tạo OAuth Client trong Google Cloud

1. Mở [Google Cloud Console](https://console.cloud.google.com/), tạo hoặc chọn một project.
2. Mở **Google Auth Platform**. Điền Branding: tên app `Bee System CMS`, email hỗ trợ và thông tin bắt buộc.
3. Ở **Audience**, chọn External nếu nhân viên dùng tài khoản Google thông thường. Khi app còn Testing, thêm email nhân viên vào **Test users**.
4. Vào **Clients** → **Create client** → chọn **Web application**.
5. **Authorized JavaScript origins** thêm:

   - `https://intro-web-pi.vercel.app`
   - `http://localhost:3000` nếu muốn chạy trên máy

6. **Authorized redirect URIs** thêm callback URL của Supabase ở bước 5.1. Đây là URL `supabase.co/auth/v1/callback`, không phải `/auth/callback` của website.
7. Tạo client, sao chép Client ID và Client Secret.

### 5.3 Hoàn tất ở Supabase

1. Quay lại **Authentication** → **Providers** → **Google**.
2. Bật Google, dán Client ID và Client Secret, rồi Save.
3. Vào **Authentication** → **URL Configuration**:

   - Site URL: `https://intro-web-pi.vercel.app`
   - Redirect URLs: thêm `https://intro-web-pi.vercel.app/**`
   - Khi chạy local, thêm `http://localhost:3000/**`

## 6. Khai báo biến môi trường trên Vercel

Vercel → project `intro-web-pi` → **Settings** → **Environment Variables**. Điền:

```text
NEXT_PUBLIC_SITE_URL=https://intro-web-pi.vercel.app
NEXT_PUBLIC_APP_URL=https://intro-web-pi.vercel.app/admin
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=KEY_BAN_DA_COPY
```

Chọn Production, Preview và Development nếu muốn mọi môi trường đều hoạt động. Sau khi thêm/sửa biến, vào **Deployments** và Redeploy bản mới nhất. Biến môi trường không tự đi vào deployment đã build trước đó.

## 7. Cấp quyền quản trị viên đầu tiên

1. Mở `https://intro-web-pi.vercel.app/admin`.
2. Bấm **Đăng nhập bằng Google** và chọn tài khoản của bạn.
3. Lần đầu trang sẽ báo tài khoản chưa được cấp quyền. Đây là hành vi đúng.
4. Supabase → **SQL Editor** → **New query**; thay email rồi Run:

```sql
insert into public.staff_members (user_id, email, display_name, role)
select id, email, coalesce(raw_user_meta_data ->> 'full_name', email), 'admin'
from auth.users
where email = 'email-google-cua-ban@gmail.com'
on conflict (user_id) do update
set active = true, role = 'admin';
```

5. Tải lại `/admin`. Bạn sẽ thấy danh sách và form soạn bài.

Để thêm nhân viên: yêu cầu họ đăng nhập `/admin` một lần, sau đó chạy câu SQL trên với email của họ và đổi role thành `editor`. Để khóa người dùng nhưng giữ lịch sử:

```sql
update public.staff_members set active = false
where email = 'nhan-vien@example.com';
```

## 8. Đăng và gỡ một bài

1. Chọn **+ Bài viết mới**.
2. Nhập tiêu đề; slug được tạo tự động và có thể sửa.
3. Nhập mô tả ngắn, chuyên mục, tác giả và nội dung.
4. Nội dung hỗ trợ cú pháp đơn giản:

```text
## Tiêu đề lớn

### Tiêu đề nhỏ

Đây là một đoạn văn.

- Ý thứ nhất
- Ý thứ hai

> Nội dung cần nhấn mạnh
```

5. Tải ảnh và viết mô tả ảnh (alt) đúng nội dung.
6. Điền tiêu đề SEO khoảng 50–60 ký tự, mô tả SEO khoảng 140–160 ký tự.
7. **Lưu nháp** để chưa công khai; **Đăng bài** để xuất hiện ở `/kien-thuc` và sitemap.
8. **Gỡ bài** để bài biến mất khỏi website công khai nhưng dữ liệu vẫn còn trong quản trị.

Không đổi slug của bài đã được Google lập chỉ mục nếu không thiết lập redirect, vì đường dẫn cũ sẽ trả 404.

## 9. Vì sao dùng PostgreSQL và các chỉ mục nào đã có

PostgreSQL phù hợp vì dữ liệu bài viết có cấu trúc, cần lọc theo trạng thái/ngày/chuyên mục và cần phân quyền chắc chắn. Với quy mô website doanh nghiệp, tốc độ thường phụ thuộc nhiều vào chỉ mục và cache hơn việc chọn một cơ sở dữ liệu NoSQL.

File SQL tạo sẵn:

- unique index cho `slug` để mở đúng một bài rất nhanh.
- partial index `published_at desc` chỉ trên bài đã đăng để tải trang kiến thức.
- index `(category, published_at)` để lọc chuyên mục.
- GIN full-text index cho tiêu đề + mô tả khi mở rộng tìm kiếm.
- index `updated_at` cho danh sách quản trị.

## 10. Chạy và kiểm tra trên máy

```bash
cp .env.example .env.local
npm install
npm run dev
```

Điền bốn biến `NEXT_PUBLIC_...` vào `.env.local`, mở `http://localhost:3000`. Trước khi đẩy code:

```bash
npm run lint
npm run build
```

## 11. Checklist sau khi deploy

- `/admin` đăng nhập được và tài khoản lạ bị từ chối.
- Lưu nháp không xuất hiện ở `/kien-thuc`.
- Đăng bài tạo đúng URL; gỡ bài làm URL đó không còn công khai.
- Ảnh tải lên hiển thị và có alt text.
- `https://intro-web-pi.vercel.app/robots.txt` chặn `/admin`, `/auth`, `/api`.
- `https://intro-web-pi.vercel.app/sitemap.xml` chỉ có bài đã đăng.
- Khi có tên miền thật, đổi Site URL/Redirect URLs ở Supabase, Google và các biến Vercel rồi Redeploy.

## 12. Tài liệu chính thức

- Supabase: [Google login](https://supabase.com/docs/guides/auth/social-login/auth-google)
- Supabase: [Server-side auth với Next.js](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)
- Supabase: [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- Vercel: [Environment Variables](https://vercel.com/docs/environment-variables)
