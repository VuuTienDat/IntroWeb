import type { Metadata } from "next";
import Link from "next/link";
import { company, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hệ thống xếp lịch điều dưỡng",
  description: "Cách Bee System tiếp cận bài toán xếp lịch điều dưỡng với ràng buộc bắt buộc và cơ chế điểm phạt nhiều mức.",
  alternates: { canonical: "/du-an/he-thong-xep-lich" },
};

const productUrl = `${siteUrl}/du-an/he-thong-xep-lich`;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${productUrl}#software`,
      name: "Hệ thống xếp lịch điều dưỡng Bee System",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Giải pháp hỗ trợ xếp lịch điều dưỡng theo ràng buộc, mức ưu tiên và mục tiêu cân bằng khối lượng.",
      url: productUrl,
      author: { "@id": `${siteUrl}/#organization`, name: company.name },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Dự án", item: `${siteUrl}/du-an` },
        {
          "@type": "ListItem",
          position: 3,
          name: "Hệ thống xếp lịch điều dưỡng",
          item: productUrl,
        },
      ],
    },
  ],
};

export default function SchedulingProjectPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">Sản phẩm đang phát triển</p>
          <h1>Xếp lịch điều dưỡng theo mức ưu tiên thay vì cố ép mọi yêu cầu.</h1>
          <p>Hệ thống giữ các điều kiện bắt buộc thành ràng buộc cứng và chuyển những mong muốn có thể nới lỏng thành điểm phạt để tìm lịch khả thi.</p>
        </div>
      </section>
      <section className="page-section">
        <div className="shell article-layout">
          <article className="page-copy">
            <div className="breadcrumb"><Link href="/">Trang chủ</Link><span>/</span><Link href="/du-an">Dự án</Link><span>/</span><span>Xếp lịch điều dưỡng</span></div>
            <h2>Bài toán vận hành</h2>
            <p>Lịch trực cần đáp ứng số lượng nhân sự, kỹ năng và quy định của từng ca. Đồng thời, lịch vẫn phải giảm chênh lệch về ca đêm và tổng khối lượng giữa các thành viên.</p>
            <h2>Cách mô hình hóa</h2>
            <p>Những điều kiện không thể vi phạm được giữ thành ràng buộc bắt buộc. Các mong muốn có thể điều chỉnh được chuyển thành điểm phạt. Mức phạt tăng theo độ nghiêm trọng để hệ thống hiểu ưu tiên nào cần xử lý trước.</p>
            <h2>Thứ tự ưu tiên</h2>
            <ul>
              <li>Trước hết bảo đảm lịch hợp lệ và đủ người cho các ca cần thiết.</li>
              <li>Ưu tiên giảm chênh lệch số ca đêm giữa các thành viên.</li>
              <li>Tiếp theo cân bằng tổng khối lượng công việc.</li>
              <li>Sau cùng giảm các sai lệch còn lại theo trọng số đã thống nhất.</li>
            </ul>
            <h2>Giá trị hướng tới</h2>
            <p>Người quản lý có thể tạo lịch nhanh hơn, nhìn thấy cảnh báo và hiểu nguyên nhân một lịch được đánh giá tốt hoặc cần điều chỉnh.</p>
          </article>
          <aside className="article-aside"><p>Phạm vi</p><strong>Phân tích bài toán</strong><strong>Mô hình tối ưu</strong><strong>Giao diện quản lý lịch</strong></aside>
        </div>
      </section>
    </main>
  );
}
