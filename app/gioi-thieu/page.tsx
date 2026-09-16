import type { Metadata } from "next";
import { CheckCircle2, Compass, HeartHandshake } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Giới thiệu Bee System Việt Nam",
  description:
    "Bee System Việt Nam phát triển giải pháp công nghệ cho ngành y tế và điều dưỡng, bắt đầu từ quy trình vận hành thực tế.",
  alternates: { canonical: "/gioi-thieu" },
};

const principles = [
  [Compass, "Hiểu đúng bài toán", "Làm rõ người sử dụng, dữ liệu và điểm nghẽn trước khi xác định phạm vi phần mềm."],
  [HeartHandshake, "Thiết kế cùng người dùng", "Ưu tiên thao tác dễ hiểu và phản hồi từ những người trực tiếp thực hiện công việc."],
  [CheckCircle2, "Triển khai có kiểm chứng", "Bắt đầu bằng phạm vi vừa đủ, đo kết quả rồi mới mở rộng sang quy trình tiếp theo."],
] as const;

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero about-page-hero">
        <div className="shell">
          <p className="eyebrow">Giới thiệu</p>
          <h1>Bee System Việt Nam xây phần mềm cho những công việc cần sự rõ ràng và tin cậy.</h1>
          <p>Chúng tôi tập trung vào các bài toán vận hành trong y tế và điều dưỡng, nơi quy trình, con người và dữ liệu cần được kết nối mạch lạc.</p>
        </div>
      </section>

      <section className="page-section mission-section">
        <div className="shell mission-layout">
          <div>
            <p className="eyebrow">Mục tiêu</p>
            <h2>Trở thành doanh nghiệp số 1 về giải pháp công nghệ tối ưu cho y tế và điều dưỡng tại Việt Nam.</h2>
          </div>
          <div className="mission-copy">
            <p>Bee System Việt Nam ra đời với mục tiêu đưa công nghệ vào đúng những quy trình đang gây áp lực cho đội ngũ chăm sóc và quản lý.</p>
            <p>Thay vì bắt đầu bằng một danh sách tính năng, chúng tôi bắt đầu bằng câu hỏi: công việc nào đang lặp lại, dữ liệu nào khó theo dõi và quyết định nào cần được hỗ trợ tốt hơn?</p>
          </div>
        </div>
      </section>

      <section className="page-section page-section-soft">
        <div className="shell">
          <SectionHeading eyebrow="Nguyên tắc làm việc" title="Từ quy trình thật đến sản phẩm sử dụng được." />
          <div className="simple-grid">
            {principles.map(([Icon, title, description]) => (
              <article className="simple-card" key={title}>
                <Icon size={25} aria-hidden="true" />
                <h2>{title}</h2>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
