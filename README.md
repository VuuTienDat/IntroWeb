# Website Bee System Việt Nam

Website doanh nghiệp nhiều trang dành cho Bee System Việt Nam, xây dựng bằng Next.js và TypeScript để triển khai trên Vercel.

## Chạy trên máy cá nhân

```bash
pnpm install
pnpm dev
```

Mở `http://localhost:3000`.

## Biến môi trường

Tạo `.env.local` từ `.env.example` và cấu hình:

- `NEXT_PUBLIC_SITE_URL`: tên miền chính thức của website.
- `NEXT_PUBLIC_APP_URL`: URL web app có đăng nhập Google.
- `WORDPRESS_API_URL`: URL REST API của WordPress, ví dụ `https://cms.example.com/wp-json/wp/v2`.
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
- URL web app và thông tin cấu hình Google OAuth.
- Tên khách hàng, phạm vi dự án và số liệu hiệu quả được phép công bố.

Xem hướng dẫn đầy đủ tại [HUONG-DAN-VERCEL-WORDPRESS.md](./HUONG-DAN-VERCEL-WORDPRESS.md).
