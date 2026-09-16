# Website Bee System Việt Nam

Website doanh nghiệp nhiều trang dành cho Bee System Việt Nam, xây dựng bằng Next.js và TypeScript để triển khai trên Vercel.

Trang quản trị nội bộ nằm tại `/admin` và không được liên kết trên giao diện công khai. Admin có thể quản lý bài viết, dự án, ảnh và nội dung hero trang chủ bằng Supabase. Dự án nổi bật được đồng bộ tự động ra trang chủ, danh sách `/du-an` và trang chi tiết.

Trang dự án dùng ba giai đoạn thống nhất: **Đã hoàn thành**, **Đang triển khai** và **Đang nghiên cứu**. Nếu database cũ còn giá trị “Đang phát triển”, chạy `supabase/upgrade-project-stages.sql` một lần trong SQL Editor.

## Chạy trên máy cá nhân

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Biến môi trường

Tạo `.env.local` từ `.env.example` và cấu hình:

- `NEXT_PUBLIC_SITE_URL`: tên miền chính thức của website.
- `NEXT_PUBLIC_APP_URL`: URL trang quản trị, ví dụ `https://intro-web-pi.vercel.app/admin`.
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL của Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Publishable/anon key của Supabase; không dùng service role key.
- `CONTACT_WEBHOOK_URL`: webhook nhận biểu mẫu liên hệ.
- `CONTACT_WEBHOOK_SECRET`: mã bí mật Bearer cho webhook nếu hệ thống nhận yêu cầu sử dụng.

## Triển khai trên Vercel

1. Đưa thư mục này lên một Git repository.
2. Trong Vercel, chọn **Add New Project** và import repository.
3. Vercel sẽ nhận diện framework Next.js; giữ Build Command theo `package.json`.
4. Thêm các biến môi trường ở phần **Project Settings → Environment Variables**.
5. Deploy, sau đó đặt tên miền thật và cập nhật `NEXT_PUBLIC_SITE_URL`.

## Nội dung cần Bee System xác nhận trước khi công khai

- Logo gốc dạng SVG hoặc PNG nền trong suốt. Ảnh trong `brand-reference` là phiên bản trang trí Quốc khánh, không dùng làm logo chính.
- Email, hotline, địa chỉ và người phụ trách tiếp nhận liên hệ.
- Email Google của nhân viên được phép vào trang quản trị.
- Tên khách hàng, phạm vi dự án và số liệu hiệu quả được phép công bố.

Xem hướng dẫn từng bước tại [HUONG-DAN-VERCEL-SUPABASE.md](./HUONG-DAN-VERCEL-SUPABASE.md).

Nguồn ảnh chụp thật sử dụng trong giao diện được ghi tại [docs/IMAGE-CREDITS.md](./docs/IMAGE-CREDITS.md).
