import type { Metadata } from "next";
import Link from "next/link";
import { ArticleByline } from "@/components/article-byline";
import { company, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tách website giới thiệu và phần mềm y tế",
  description: "Vì sao website công khai và ứng dụng nghiệp vụ y tế nên có mục tiêu, quyền truy cập và cấu trúc SEO riêng.",
  alternates: { canonical: "/kien-thuc/website-va-phan-mem-y-te" },
};

const articleUrl = `${siteUrl}/kien-thuc/website-va-phan-mem-y-te`;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Vì sao website giới thiệu và phần mềm y tế nên được tách rõ?",
      mainEntityOfPage: articleUrl,
      author: { "@type": "Organization", name: company.name },
      publisher: { "@id": `${siteUrl}/#organization`, name: company.name },
      datePublished: "2026-09-10",
      dateModified: "2026-09-15",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Kiến thức", item: `${siteUrl}/kien-thuc` },
        { "@type": "ListItem", position: 3, name: "Website và phần mềm", item: articleUrl },
      ],
    },
  ],
};

export default function WebsiteAndHealthAppArticle() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="page-hero article-hero">
        <div className="shell">
          <p className="eyebrow">Kiến trúc số · 7 phút đọc</p>
          <h1>Vì sao website giới thiệu và phần mềm y tế nên được tách rõ?</h1>
          <p>Một bên cần được tìm thấy công khai; bên còn lại cần đăng nhập, phân quyền và bảo vệ dữ liệu nghiệp vụ.</p>
        </div>
      </section>
      <section className="page-section">
        <div className="shell article-layout">
          <article className="page-copy">
            <nav className="breadcrumb" aria-label="Đường dẫn bài viết"><Link href="/">Trang chủ</Link><span>/</span><Link href="/kien-thuc">Kiến thức</Link><span>/</span><span>Website và phần mềm</span></nav>
            <ArticleByline updatedAt="15/09/2026" updatedAtIso="2026-09-15" />
            <p className="article-intro">Tách website doanh nghiệp và web app giúp mỗi phần được tối ưu đúng mục tiêu, đồng thời tạo ranh giới rõ giữa nội dung công khai và dữ liệu cần kiểm soát.</p>
            <h2>Website công khai phục vụ tìm kiếm và giới thiệu</h2>
            <p>Trang dịch vụ, dự án và bài viết cần URL ổn định, nội dung đọc được không cần đăng nhập và liên kết nội bộ rõ ràng. Đây là phần Google và công cụ tìm kiếm AI có thể thu thập.</p>
            <h2>Web app phục vụ nghiệp vụ và người dùng đã xác thực</h2>
            <p>Ứng dụng tập trung vào thao tác, dữ liệu và phân quyền. Các màn hình riêng tư không cần xuất hiện trên công cụ tìm kiếm và nên được đặt noindex cùng cơ chế xác thực phù hợp.</p>
            <h2>Có thể liên kết hai phần bằng một hành trình thống nhất</h2>
            <p>Nút “Đăng nhập” trên website dẫn sang ứng dụng, thường ở tên miền phụ. Người dùng vẫn nhận biết cùng một thương hiệu nhưng hệ thống kỹ thuật có thể được quản lý tách biệt.</p>
            <h2>Tách hệ thống không có nghĩa là tách trải nghiệm</h2>
            <p>Màu sắc, ngôn ngữ, trạng thái lỗi và hướng dẫn cần nhất quán. Điều khác biệt nằm ở quyền truy cập, dữ liệu và mục tiêu của từng khu vực.</p>
            <div className="article-cta"><strong>Cần xây website và web app thành một hành trình thống nhất?</strong><p>Xem phạm vi Bee System có thể khảo sát, thiết kế và phát triển theo từng giai đoạn.</p><Link href="/dich-vu" className="button button-dark">Xem giải pháp</Link></div>
          </article>
          <aside className="article-aside"><p>Mô hình đề xuất</p><strong>beesystem.vn</strong><strong>app.beesystem.vn</strong><strong>Đăng nhập Google</strong></aside>
        </div>
      </section>
    </main>
  );
}
