import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";

export const metadata: Metadata = {
  title: "Sản phẩm và dự án",
  description: "Sản phẩm Bee System đang phát triển cho bài toán xếp lịch và điều phối điều dưỡng.",
  alternates: { canonical: "/du-an" },
};

export default function ProjectsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">Sản phẩm và dự án</p>
          <h1>Giải pháp được trình bày bằng bài toán và cách tiếp cận.</h1>
          <p>Bee System chỉ công bố những thông tin có thể kiểm chứng. Case study khách hàng sẽ được bổ sung sau khi có sự đồng ý công khai.</p>
        </div>
      </section>
      <section className="page-section">
        <div className="shell project-list-layout">
          <Link href="/du-an/he-thong-xep-lich" className="simple-card featured-project-card">
            <p className="eyebrow">Sản phẩm đang phát triển</p>
            <CalendarDays size={38} aria-hidden="true" />
            <h2>Hệ thống xếp lịch điều dưỡng</h2>
            <p>Tự động phân ca, cân bằng ca đêm và khối lượng công việc bằng mô hình ưu tiên nhiều mức.</p>
            <span className="text-link mt-6">Xem bài toán và cách làm <ArrowUpRight size={17} /></span>
          </Link>
          <aside className="project-note">
            <p className="eyebrow">Nguyên tắc công bố</p>
            <h2>Không dùng số liệu minh họa như kết quả thật.</h2>
            <p>Các dự án khách hàng, tên đơn vị và chỉ số hiệu quả chỉ xuất hiện khi đã được xác nhận. Điều này giúp nội dung của Bee System đáng tin cậy với cả người đọc và công cụ tìm kiếm.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
