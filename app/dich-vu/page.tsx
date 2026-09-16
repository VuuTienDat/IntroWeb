import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { company, siteUrl } from "@/lib/site";
import { services } from "../data";

export const metadata: Metadata = {
  title: "Giải pháp phần mềm y tế và điều dưỡng",
  description:
    "Các giải pháp của Bee System gồm xếp lịch điều dưỡng, số hóa quy trình chăm sóc và phát triển phần mềm y tế theo yêu cầu.",
  alternates: { canonical: "/dich-vu" },
};

const faqs = [
  {
    question: "Bee System đang tập trung vào những giải pháp nào?",
    answer:
      "Trọng tâm hiện tại gồm xếp lịch và điều phối điều dưỡng, số hóa quy trình chăm sóc và phát triển phần mềm y tế theo yêu cầu.",
  },
  {
    question: "Một dự án phần mềm y tế nên bắt đầu từ đâu?",
    answer:
      "Nên bắt đầu từ một quy trình có người phụ trách, dữ liệu đầu vào và kết quả đầu ra rõ ràng. Bee System khảo sát quy trình trước khi đề xuất phạm vi kỹ thuật.",
  },
  {
    question: "Bee System có triển khai theo từng giai đoạn không?",
    answer:
      "Có. Phạm vi được chia thành các phiên bản có thể kiểm tra, lấy phản hồi và đo hiệu quả trước khi mở rộng.",
  },
  {
    question: "Có nên gửi dữ liệu bệnh nhân qua biểu mẫu liên hệ không?",
    answer:
      "Không. Biểu mẫu công khai chỉ dùng để mô tả nhu cầu tổng quát; không gửi thông tin định danh hoặc dữ liệu sức khỏe của người bệnh.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...services.map((service) => ({
      "@type": "Service",
      name: service.title,
      description: service.description,
      provider: { "@id": `${siteUrl}/#organization`, name: company.name },
      areaServed: { "@type": "Country", name: "Việt Nam" },
      url: `${siteUrl}/dich-vu`,
    })),
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

export default function ServicesPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="page-hero service-page-hero">
        <div className="shell">
          <p className="eyebrow">Giải pháp</p>
          <h1>Giải pháp phần mềm y tế được thiết kế quanh quy trình thực tế.</h1>
          <p>Mỗi phạm vi bắt đầu bằng khảo sát nghiệp vụ, xác định dữ liệu cần quản lý và ưu tiên phần mang lại giá trị sớm nhất.</p>
        </div>
      </section>

      <section className="page-section page-section-soft">
        <div className="shell service-grid">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.number} className="service-card">
                <div className="service-topline"><span>{service.number}</span><Icon size={24} aria-hidden="true" /></div>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <ul>{service.tags.map((tag) => <li key={tag}><Check size={14} /> {tag}</li>)}</ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-section">
        <div className="shell delivery-grid">
          <div>
            <p className="eyebrow">Phạm vi triển khai</p>
            <h2>Từ khảo sát nghiệp vụ đến vận hành và cải tiến.</h2>
          </div>
          <ul className="delivery-list">
            <li><span>01</span><div><strong>Phân tích nghiệp vụ</strong><p>Làm rõ vai trò, luồng công việc, dữ liệu và giới hạn của hệ thống.</p></div></li>
            <li><span>02</span><div><strong>Thiết kế trải nghiệm</strong><p>Tổ chức thao tác theo ngữ cảnh sử dụng trên máy tính và thiết bị di động.</p></div></li>
            <li><span>03</span><div><strong>Phát triển phần mềm</strong><p>Xây dựng theo từng phiên bản có thể kiểm tra bằng tình huống thực tế.</p></div></li>
            <li><span>04</span><div><strong>Tích hợp và cải tiến</strong><p>Kết nối hệ thống trong phạm vi phù hợp và theo dõi phản hồi sau triển khai.</p></div></li>
          </ul>
        </div>
      </section>

      <section className="page-section page-section-soft">
        <div className="shell faq-layout">
          <div>
            <p className="eyebrow">Câu hỏi thường gặp</p>
            <h2>Thông tin cần biết trước khi bắt đầu.</h2>
            <p>Phạm vi cuối cùng luôn được xác định sau khi làm rõ người dùng, dữ liệu và điều kiện vận hành của đơn vị.</p>
          </div>
          <Accordion type="single" collapsible className="faq-list">
            {faqs.map((faq, index) => (
              <AccordionItem value={`faq-${index + 1}`} key={faq.question}>
                <AccordionTrigger className="faq-question">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="faq-answer">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="cta-section">
        <div className="shell cta-inner">
          <div><p className="eyebrow eyebrow-light">Trao đổi yêu cầu</p><h2>Bắt đầu từ quy trình đang gây tốn thời gian nhất.</h2></div>
          <Link href="/lien-he" className="button button-white">Gửi bài toán cho Bee System <ArrowRight size={17} /></Link>
        </div>
      </section>
    </main>
  );
}
