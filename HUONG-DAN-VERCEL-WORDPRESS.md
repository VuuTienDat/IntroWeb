# Hướng dẫn deploy Bee System lên Vercel và đăng bài bằng WordPress

Tài liệu này dành cho bộ mã nguồn `Bee-System-Vercel-Source.zip`.

## 1. Kiến trúc đề xuất

- `www.tenmien.vn`: website Bee System chạy Next.js trên Vercel.
- `app.tenmien.vn`: web chức năng có đăng nhập Google.
- `cms.tenmien.vn`: WordPress dùng riêng cho người biên tập bài viết.

WordPress là nơi soạn và bấm Xuất bản. Website Next.js đọc bài công khai qua WordPress REST API rồi hiển thị tại `/kien-thuc/ten-bai-viet`. Người đọc không cần vào giao diện WordPress.

## 2. Deploy lên Vercel bằng GitHub - cách dễ quản lý nhất

### Bước 1: đưa mã nguồn lên GitHub

1. Giải nén `Bee-System-Vercel-Source.zip`.
2. Đăng nhập GitHub và tạo repository mới, ví dụ `bee-system-website`.
3. Chọn **Add file > Upload files**, tải toàn bộ tệp và thư mục bên trong thư mục vừa giải nén.
4. Bấm **Commit changes**.

Lưu ý: tải **nội dung bên trong** thư mục lên repository, để `package.json` nằm ngay ở cấp đầu tiên.

### Bước 2: import vào Vercel

1. Đăng nhập [Vercel](https://vercel.com/).
2. Chọn **Add New > Project**.
3. Kết nối GitHub và chọn repository `bee-system-website`.
4. Vercel sẽ tự nhận Framework Preset là **Next.js**.
5. Không đổi Root Directory nếu `package.json` đang nằm ở cấp đầu tiên.
6. Thêm biến môi trường ở phần **Environment Variables** theo bảng dưới.
7. Bấm **Deploy**.

### Biến môi trường

| Tên biến | Giá trị mẫu | Bắt buộc |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.tenmien.vn` | Có khi gắn tên miền chính thức |
| `NEXT_PUBLIC_APP_URL` | `https://app.tenmien.vn` | Có khi web app đã hoạt động |
| `WORDPRESS_API_URL` | `https://cms.tenmien.vn/wp-json/wp/v2` | Có để lấy bài từ WordPress |
| `CONTACT_WEBHOOK_URL` | URL hệ thống nhận lead | Có để form liên hệ gửi thật |
| `CONTACT_WEBHOOK_SECRET` | Chuỗi bí mật của webhook | Tùy hệ thống nhận lead |

Nếu chưa có tên miền, deploy lần đầu trước. Sau khi Vercel cấp địa chỉ `https://ten-du-an.vercel.app`, đặt địa chỉ này vào `NEXT_PUBLIC_SITE_URL` và redeploy để canonical cùng sitemap dùng đúng URL.

Mỗi lần đẩy code mới lên nhánh chính của GitHub, Vercel sẽ tự build và cập nhật website.

## 3. Deploy bằng Vercel CLI - phương án thay thế

Mở Terminal trong thư mục đã giải nén rồi chạy:

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

Khi được hỏi framework, chọn Next.js. Sau đó vẫn cần khai báo các biến môi trường trong **Project Settings > Environment Variables** và deploy lại.

## 4. Chuẩn bị WordPress làm CMS

WordPress mã nguồn mở không mất phí bản quyền, nhưng tên miền và máy chủ WordPress thường có phí. WordPress cần môi trường hỗ trợ PHP và cơ sở dữ liệu; không cài WordPress trực tiếp vào dự án Next.js trên Vercel.

1. Cài WordPress ở `cms.tenmien.vn` hoặc tạo site WordPress.com phù hợp.
2. Vào **Settings > Permalinks**, chọn cấu trúc **Post name** rồi lưu.
3. Nếu WordPress chỉ dùng làm CMS headless, vào **Settings > Reading** và bật **Discourage search engines from indexing this site** để tránh Google lập chỉ mục cả bản WordPress và bản Next.js. Tùy chọn này không khóa REST API.
4. Mở thử địa chỉ `https://cms.tenmien.vn/wp-json/wp/v2/posts?per_page=1`. Nếu thấy dữ liệu JSON, website có thể lấy bài.
5. Thêm `WORDPRESS_API_URL=https://cms.tenmien.vn/wp-json/wp/v2` trong Vercel rồi redeploy.

Không cần plugin trả phí để website đọc các trường bài viết cơ bản. Hệ thống sử dụng tiêu đề, nội dung, mô tả ngắn, chuyên mục, tác giả, ảnh đại diện và ngày cập nhật từ REST API mặc định.

## 5. Quy trình đăng một bài SEO

1. Trong WordPress Admin, vào **Posts > Add New Post**.
2. Viết tiêu đề rõ câu hỏi hoặc nhu cầu tìm kiếm. Mỗi bài chỉ có một tiêu đề chính.
3. Kiểm tra **Slug**: viết thường, không dấu, dùng dấu gạch ngang. Ví dụ `phan-mem-xep-lich-dieu-duong`.
4. Viết 2-4 câu mở đầu trả lời trực tiếp vấn đề.
5. Chia nội dung thành các mục H2/H3; đoạn văn ngắn, dùng danh sách hoặc bảng khi thật sự cần.
6. Chọn một **Category**. Bộ chuyên mục khởi đầu nên gồm: `Điều dưỡng`, `Chuyển đổi số`, `Kiến trúc số`, `Case study`.
7. Điền **Excerpt** khoảng 140-160 ký tự. Website dùng phần này làm mô tả trên danh sách và metadata.
8. Thêm **Featured Image**, ưu tiên WebP 1600 x 900 px, dung lượng khoảng 200 KB trở xuống; điền Alt Text mô tả đúng ảnh.
9. Thêm 2-4 liên kết nội bộ phù hợp tới trang Dịch vụ, Dự án và bài kiến thức liên quan.
10. Ghi nguồn cho số liệu, quy định và khẳng định chuyên môn. Không dùng dữ liệu người bệnh và không công bố khách hàng/chứng nhận khi chưa được phép.
11. Kiểm tra Preview trên máy tính và điện thoại, sau đó bấm **Publish**.

Bài mới thường xuất hiện trên website trong tối đa khoảng 5 phút vì hệ thống làm mới dữ liệu theo chu kỳ. URL hiển thị sẽ là `https://www.tenmien.vn/kien-thuc/slug-cua-bai`.

## 6. Checklist trước khi công khai website

- Thay logo tạm bằng logo chính thức nền trong suốt.
- Điền email, hotline, địa chỉ và thông tin pháp lý đã được doanh nghiệp duyệt.
- Kiểm tra URL web app và đăng nhập Google thật.
- Kết nối form liên hệ với webhook hoặc CRM.
- Đặt `NEXT_PUBLIC_SITE_URL` đúng tên miền chính thức.
- Gửi `sitemap.xml` trong Google Search Console.
- Kiểm tra `robots.txt`, canonical và một bài WordPress mới.
- Đảm bảo WordPress CMS không tạo bản nội dung trùng lặp được Google lập chỉ mục.

## 7. Nguồn hướng dẫn chính thức

- Vercel: [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- Vercel: [Environment Variables](https://vercel.com/docs/environment-variables)
- WordPress: [Posts REST API](https://developer.wordpress.org/rest-api/reference/posts/)
- WordPress: [Create a post](https://wordpress.com/support/posts/)
- WordPress: [Permalink settings](https://wordpress.org/documentation/article/settings-permalinks-screen/)
- WordPress: [Reading settings](https://wordpress.org/documentation/article/settings-reading-screen/)
