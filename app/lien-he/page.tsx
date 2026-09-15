import type { Metadata } from "next";
import { Building2, ClipboardList, Clock3 } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Liên hệ Bee System",
  description: "Trao đổi nhu cầu xếp lịch điều dưỡng, số hóa quy trình chăm sóc hoặc phát triển phần mềm y tế theo yêu cầu.",
  alternates: { canonical: "/lien-he" },
};

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">Liên hệ</p>
          <h1>Bắt đầu bằng quy trình anh chị đang muốn cải thiện.</h1>
          <p>Bee System sẽ dựa trên bối cảnh sử dụng, dữ liệu đầu vào và mục tiêu vận hành để cùng làm rõ phạm vi phù hợp.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="shell contact-grid">
          <aside className="contact-panel">
            <p className="eyebrow eyebrow-light">Chuẩn bị trước khi trao đổi</p>
            <h2>Ba thông tin giúp buổi làm việc đi thẳng vào vấn đề.</h2>
            <div className="contact-list contact-checklist">
              <span><Building2 size={20} /><b>Đơn vị và nhóm người dùng</b></span>
              <span><ClipboardList size={20} /><b>Quy trình đang thực hiện</b></span>
              <span><Clock3 size={20} /><b>Mục tiêu và thời gian dự kiến</b></span>
            </div>
            <p className="contact-footnote">Thông tin email, hotline và địa chỉ chính thức sẽ được cập nhật sau khi Bee System xác nhận.</p>
          </aside>
          <div className="brief-card">
            <p className="eyebrow">Gửi yêu cầu</p>
            <h2>Mô tả ngắn bài toán của đơn vị</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
