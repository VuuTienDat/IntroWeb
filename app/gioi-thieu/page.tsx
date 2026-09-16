import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  HeartHandshake,
  MoveUpRight,
} from "lucide-react";
import { MotionRuntime } from "@/components/motion-runtime";

export const metadata: Metadata = {
  title: "Giới thiệu Bee System Việt Nam",
  description:
    "Bee System Việt Nam phát triển giải pháp công nghệ cho ngành y tế và điều dưỡng, bắt đầu từ quy trình vận hành thực tế.",
  alternates: { canonical: "/gioi-thieu" },
};

const principles = [
  {
    icon: Compass,
    number: "01",
    title: "Hiểu công việc thật",
    description: "Quan sát vai trò, dữ liệu và điểm nghẽn trước khi nói tới tính năng.",
  },
  {
    icon: HeartHandshake,
    number: "02",
    title: "Thiết kế cùng người dùng",
    description: "Để người trực tiếp vận hành góp ý từ những phiên bản đầu tiên.",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "Mở rộng có kiểm chứng",
    description: "Chạy phạm vi vừa đủ, đo kết quả rồi mới phát triển bước tiếp theo.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="about-art-direction">
      <MotionRuntime />

      <section className="about-art-hero">
        <div className="about-art-glow" aria-hidden="true" />
        <div className="shell about-art-grid">
          <div className="about-art-copy" data-reveal>
            <p className="art-kicker art-kicker-dark"><span /> Về Bee System</p>
            <h1>Công nghệ để đội ngũ y tế <em>làm việc nhẹ hơn.</em></h1>
            <p className="about-art-lead">
              Chúng tôi xây phần mềm quanh nhịp làm việc thật của y tế và điều dưỡng — rõ việc, liền dữ liệu, dễ sử dụng.
            </p>
            <div className="hero-actions">
              <Link href="/dich-vu" className="button button-art-primary">Khám phá giải pháp <ArrowRight size={18} /></Link>
              <Link href="/lien-he" className="text-link">Trao đổi cùng Bee System <MoveUpRight size={18} /></Link>
            </div>
          </div>

          <div className="about-art-visual" data-reveal data-reveal-delay="2">
            <div className="about-art-photo">
              <Image
                src="/media/care-team-real.webp"
                alt="Đội ngũ y tế trao đổi trong môi trường làm việc lâm sàng"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <div className="about-art-photo-overlay" />
              <div className="about-photo-label"><span>Y tế</span><i /> <span>Công nghệ</span></div>
            </div>
            <div className="about-quote-card">
              <small>Điểm bắt đầu</small>
              <strong>Không phải một danh sách tính năng.</strong>
              <span>Mà là một công việc đang cần được làm tốt hơn.</span>
            </div>
          </div>
        </div>

        <div className="shell about-focus-strip" data-reveal>
          <div><span>01</span><strong>Y tế &amp; điều dưỡng</strong></div>
          <div><span>02</span><strong>Quy trình vận hành</strong></div>
          <div><span>03</span><strong>Sản phẩm dễ dùng</strong></div>
        </div>
      </section>

      <section id="tam-nhin" className="about-story-section anchor-target">
        <div className="shell about-story-grid">
          <div className="about-story-heading" data-reveal>
            <p className="art-kicker art-kicker-dark"><span /> Mục tiêu</p>
            <h2>Đưa công nghệ vào đúng nơi đang gây áp lực.</h2>
          </div>
          <div className="about-story-copy" data-reveal data-reveal-delay="2">
            <p>
              Bee System hướng tới trở thành đối tác công nghệ đáng tin cậy cho y tế và điều dưỡng tại Việt Nam.
            </p>
            <p>
              Mỗi dự án bắt đầu bằng việc cùng đội ngũ vận hành làm rõ một điểm nghẽn, rồi biến nó thành giải pháp có thể dùng và cải tiến lâu dài.
            </p>
          </div>
        </div>

        <div className="shell about-story-media" data-reveal>
          <div className="about-story-image">
            <Image
              src="/media/hospital-operations-real.webp"
              alt="Nhân viên y tế phối hợp vận hành trong bệnh viện"
              fill
              sizes="(max-width: 900px) 100vw, 58vw"
            />
          </div>
          <div className="about-story-note">
            <span>Tầm nhìn</span>
            <strong>Quy trình rõ hơn.<br />Đội ngũ chủ động hơn.</strong>
            <p>Công nghệ đứng phía sau để con người có thêm thời gian cho công việc quan trọng.</p>
          </div>
        </div>
      </section>

      <section id="nguyen-tac" className="about-principles-section anchor-target">
        <div className="shell">
          <div className="about-principles-heading" data-reveal>
            <p className="art-kicker art-kicker-light"><span /> Cách chúng tôi làm</p>
            <h2>Ba nguyên tắc.<br />Một trải nghiệm mạch lạc.</h2>
          </div>
          <div className="about-principles-list">
            {principles.map(({ icon: Icon, number, title, description }) => (
              <article key={number} data-reveal>
                <span>{number}</span>
                <Icon aria-hidden="true" size={26} />
                <div><h3>{title}</h3><p>{description}</p></div>
                <MoveUpRight aria-hidden="true" size={19} />
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
