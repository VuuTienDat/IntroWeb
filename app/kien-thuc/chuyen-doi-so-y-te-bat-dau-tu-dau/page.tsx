import type { Metadata } from "next";
import Link from "next/link";
import { ArticleByline } from "@/components/article-byline";
import { company, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chuyển đổi số y tế nên bắt đầu từ đâu",
  description: "Cách lựa chọn quy trình phù hợp để bắt đầu số hóa tại cơ sở y tế dựa trên tần suất, rủi ro và khả năng đo hiệu quả.",
  alternates: { canonical: "/kien-thuc/chuyen-doi-so-y-te-bat-dau-tu-dau" },
};

const articleUrl = `${siteUrl}/kien-thuc/chuyen-doi-so-y-te-bat-dau-tu-dau`;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Cơ sở y tế nên bắt đầu số hóa từ quy trình nào?",
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
        { "@type": "ListItem", position: 3, name: "Điểm bắt đầu số hóa", item: articleUrl },
      ],
    },
  ],
};

export default function DigitalHealthStartingPointArticle() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="page-hero article-hero">
        <div className="shell">
          <p className="eyebrow">Chuyển đổi số · 5 phút đọc</p>
          <h1>Cơ sở y tế nên bắt đầu số hóa từ quy trình nào?</h1>
          <p>Điểm khởi đầu phù hợp thường không phải hệ thống lớn nhất, mà là quy trình lặp lại nhiều, gây tốn thời gian và có thể đo được thay đổi.</p>
        </div>
      </section>
      <section className="page-section">
        <div className="shell article-layout">
          <article className="page-copy">
            <nav className="breadcrumb" aria-label="Đường dẫn bài viết"><Link href="/">Trang chủ</Link><span>/</span><Link href="/kien-thuc">Kiến thức</Link><span>/</span><span>Điểm bắt đầu số hóa</span></nav>
            <ArticleByline updatedAt="15/09/2026" updatedAtIso="2026-09-15" />
            <p className="article-intro">Một dự án số hóa dễ thất bại khi phạm vi quá rộng hoặc không có cách đánh giá kết quả. Chọn đúng quy trình đầu tiên giúp đội ngũ học nhanh và giảm rủi ro triển khai.</p>
            <h2>Ưu tiên công việc có tần suất cao</h2>
            <p>Công việc lặp lại hằng ngày hoặc hằng tuần tạo ra nhiều cơ hội giảm thao tác thủ công. Xếp lịch, tổng hợp biểu mẫu và theo dõi đầu việc là những nhóm nên được khảo sát trước.</p>
            <h2>Đánh giá mức độ rõ ràng của dữ liệu</h2>
            <p>Quy trình có đầu vào, người chịu trách nhiệm và kết quả đầu ra rõ ràng sẽ dễ số hóa hơn. Nếu quy tắc thay đổi theo từng người, bước đầu tiên nên là thống nhất quy trình.</p>
            <h2>Chọn chỉ số có thể đo trước và sau</h2>
            <p>Thời gian xử lý, số lần nhập lại dữ liệu, số lỗi cần sửa hoặc thời gian tổng hợp báo cáo là các ví dụ có thể dùng để đánh giá. Chỉ số phải phù hợp với mục tiêu thật của đơn vị.</p>
            <h2>Triển khai thử trong phạm vi có kiểm soát</h2>
            <p>Một khoa, một nhóm người dùng hoặc một loại biểu mẫu là phạm vi phù hợp để thử nghiệm. Phản hồi ở giai đoạn này giúp điều chỉnh sản phẩm trước khi mở rộng.</p>
            <div className="article-cta"><strong>Đang lựa chọn quy trình để bắt đầu?</strong><p>Bee System có thể cùng đơn vị làm rõ người dùng, dữ liệu và tiêu chí đánh giá.</p><Link href="/lien-he" className="button button-dark">Gửi nhu cầu tư vấn</Link></div>
          </article>
          <aside className="article-aside"><p>Bốn tiêu chí</p><strong>Tần suất cao</strong><strong>Dữ liệu rõ</strong><strong>Đo được kết quả</strong><strong>Thử nghiệm nhỏ</strong></aside>
        </div>
      </section>
    </main>
  );
}
