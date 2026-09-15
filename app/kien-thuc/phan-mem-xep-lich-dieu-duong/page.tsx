import type { Metadata } from "next";
import Link from "next/link";
import { ArticleByline } from "@/components/article-byline";
import { company, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Phần mềm xếp lịch điều dưỡng cần giải quyết gì",
  description: "Các nhóm ràng buộc, tiêu chí công bằng và khả năng giải thích mà phần mềm xếp lịch điều dưỡng cần xử lý.",
  alternates: { canonical: "/kien-thuc/phan-mem-xep-lich-dieu-duong" },
};

const articleUrl = `${siteUrl}/kien-thuc/phan-mem-xep-lich-dieu-duong`;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Phần mềm xếp lịch điều dưỡng cần giải quyết những bài toán nào?",
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
        { "@type": "ListItem", position: 3, name: "Xếp lịch điều dưỡng", item: articleUrl },
      ],
    },
  ],
};

export default function NurseSchedulingArticle() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="page-hero article-hero">
        <div className="shell">
          <p className="eyebrow">Điều dưỡng · 6 phút đọc</p>
          <h1>Phần mềm xếp lịch điều dưỡng cần giải quyết những bài toán nào?</h1>
          <p>Một lịch tốt không chỉ đủ người. Lịch còn phải tôn trọng ràng buộc, giảm chênh lệch và giúp người quản lý hiểu vì sao cần điều chỉnh.</p>
        </div>
      </section>
      <section className="page-section">
        <div className="shell article-layout">
          <article className="page-copy">
            <nav className="breadcrumb" aria-label="Đường dẫn bài viết"><Link href="/">Trang chủ</Link><span>/</span><Link href="/kien-thuc">Kiến thức</Link><span>/</span><span>Xếp lịch điều dưỡng</span></nav>
            <ArticleByline updatedAt="15/09/2026" updatedAtIso="2026-09-15" />
            <p className="article-intro">Bài toán xếp lịch là sự kết hợp giữa điều kiện bắt buộc và các mục tiêu mong muốn. Tách hai nhóm này giúp hệ thống tìm được lịch khả thi mà vẫn phản ánh đúng ưu tiên vận hành.</p>
            <h2>Điều kiện bắt buộc phải được kiểm tra trước</h2>
            <p>Ví dụ thường gặp gồm số người tối thiểu trong ca, kỹ năng cần thiết, thời gian nghỉ và những ngày nhân sự không thể làm việc. Danh sách cụ thể phải do đơn vị sử dụng xác nhận.</p>
            <h2>Công bằng không chỉ là chia đều số ca</h2>
            <p>Ca đêm, ca cuối tuần và khối lượng công việc có mức độ ảnh hưởng khác nhau. Vì vậy, phần mềm cần cho phép xây tiêu chí cân bằng theo chính sách thay vì chỉ đếm tổng số ca.</p>
            <h2>Yêu cầu mềm nên được biểu diễn bằng điểm phạt</h2>
            <p>Nếu mọi mong muốn đều trở thành điều kiện bắt buộc, hệ thống có thể không tìm được lịch. Điểm phạt giúp chấp nhận một sai lệch có kiểm soát và cho biết sai lệch nào nghiêm trọng hơn.</p>
            <h2>Khả năng giải thích kết quả là một phần của sản phẩm</h2>
            <p>Người quản lý cần biết ca nào thiếu người, ai đang có tải cao và quy tắc nào tạo ra cảnh báo. Khả năng giải thích giúp lịch do hệ thống đề xuất trở thành công cụ hỗ trợ quyết định.</p>
            <div className="article-cta"><strong>Cần xem cách Bee System mô hình hóa bài toán này?</strong><p>Trang dự án trình bày ràng buộc bắt buộc, điểm phạt và thứ tự ưu tiên.</p><Link href="/du-an/he-thong-xep-lich" className="button button-dark">Xem hệ thống xếp lịch</Link></div>
          </article>
          <aside className="article-aside"><p>Nội dung chính</p><strong>Ràng buộc bắt buộc</strong><strong>Tiêu chí công bằng</strong><strong>Điểm phạt và cảnh báo</strong></aside>
        </div>
      </section>
    </main>
  );
}
