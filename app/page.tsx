import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, MoveRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { MotionRuntime } from "@/components/motion-runtime";
import { getHomepageContent } from "@/lib/homepage";
import { getProjects } from "@/lib/projects";
import { company, siteUrl } from "@/lib/site";
import { insights, processSteps, projectHighlights, services, strengths } from "./data";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: company.name,
  url: siteUrl,
  description: company.description,
  areaServed: { "@type": "Country", name: "Việt Nam" },
  knowsAbout: [
    "Phần mềm y tế",
    "Phần mềm điều dưỡng",
    "Xếp lịch điều dưỡng",
    "Chuyển đổi số y tế",
  ],
};

const shiftRows = [
  ["Khoa Nội", "06:00 – 14:00", "Đủ nhân lực"],
  ["Khoa Ngoại", "14:00 – 22:00", "Cần rà soát"],
  ["Khoa Cấp cứu", "22:00 – 06:00", "Đã cân bằng"],
];

export const revalidate = 300;

export default async function Home() {
  const [homepage, projects] = await Promise.all([getHomepageContent(), getProjects()]);
  const featuredProject = projects.find((project) => project.featured) ?? projects[0];
  return (
    <main>
      <MotionRuntime />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="shell hero-layout">
          <div className="hero-copy" data-reveal>
            <div className="hero-kicker"><span className="pulse-dot" /> {homepage.hero_kicker}</div>
            <h1>{homepage.hero_title} <span>{homepage.hero_highlight}</span></h1>
            <p className="hero-lead">{homepage.hero_description}</p>
            <div className="hero-actions">
              <Link href="/lien-he" className="button button-primary">Trao đổi bài toán <ArrowRight size={17} /></Link>
              <Link href="/dich-vu" className="text-link text-link-light">Khám phá giải pháp <MoveRight size={18} /></Link>
            </div>
            <div className="hero-proof">
              <div><strong>01</strong><span>Quy trình thực tế</span></div>
              <div><strong>02</strong><span>Dữ liệu rõ ràng</span></div>
              <div><strong>03</strong><span>Triển khai từng bước</span></div>
            </div>
          </div>

          {homepage.hero_image_url ? (
            <div className="hero-media hero-photo-stage" data-reveal data-reveal-delay="2">
              <img src={homepage.hero_image_url} alt={homepage.hero_image_alt} width="900" height="1080" />
              <div className="hero-photo-glow" />
              <div className="hero-photo-badge"><span>Bee System</span><strong>Giải pháp số cho y tế</strong></div>
              <div className="hero-floating-card"><span>Thiết kế theo quy trình</span><strong>Dễ dùng · Rõ dữ liệu · Có thể mở rộng</strong></div>
            </div>
          ) : <div className="hero-media care-board" data-reveal data-reveal-delay="2">
            <div className="care-board-head">
              <div><span>Bee Workforce</span><strong>Điều phối ca trực</strong></div>
              <span className="week-pill">Tuần 38</span>
            </div>
            <div className="care-board-metrics">
              <div><span>Nhân sự</span><strong>24</strong></div>
              <div><span>Ca cần phủ</span><strong>18</strong></div>
              <div><span>Cảnh báo</span><strong>01</strong></div>
            </div>
            <div className="care-shift-list">
              {shiftRows.map(([unit, time, status], index) => (
                <div className="care-shift-row" key={unit}>
                  <span className={`shift-index shift-${index + 1}`}>{index + 1}</span>
                  <div><strong>{unit}</strong><span>{time}</span></div>
                  <em>{status}</em>
                </div>
              ))}
            </div>
            <div className="care-board-foot"><span>Ưu tiên cân bằng ca đêm</span><strong>Đang tối ưu</strong></div>
          </div>}
        </div>
        <div className="hero-ticker" aria-label="Năng lực nổi bật">
          <div><span>Xếp lịch điều dưỡng</span><i /><span>Số hóa quy trình</span><i /><span>Phần mềm theo yêu cầu</span><i /><span>Tích hợp dữ liệu</span><i /></div>
        </div>
      </section>

      <section className="section section-services" data-reveal>
        <div className="shell">
          <SectionHeading
            eyebrow="Giải pháp"
            title="Tập trung vào những điểm đang làm đội ngũ mất thời gian."
            description="Bee System bắt đầu từ quy trình, vai trò và dữ liệu thực tế trước khi lựa chọn công nghệ triển khai."
          />
          <div className="service-grid">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.number} className="service-card motion-card">
                  <div className="service-topline"><span>{service.number}</span><Icon size={24} strokeWidth={1.7} aria-hidden="true" /></div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul>{service.tags.map((tag) => <li key={tag}><Check size={14} /> {tag}</li>)}</ul>
                </article>
              );
            })}
          </div>
          <Link href="/dich-vu" className="text-link mt-8 inline-flex">Xem phạm vi dịch vụ <ArrowRight size={17} /></Link>
        </div>
      </section>

      {featuredProject ? <section className="section section-project" data-reveal>
        <div className="shell project-layout">
          <div className="project-copy">
            <p className="eyebrow eyebrow-light">{featuredProject.project_stage}</p>
            <h2>{featuredProject.title}</h2>
            <p>{featuredProject.summary}</p>
            <Link href={`/du-an/${featuredProject.slug}`} className="button button-white">Xem bài toán và cách làm <ArrowUpRight size={17} /></Link>
          </div>
          <div className="project-panel">
            <div className="project-panel-head"><span>{featuredProject.category}</span><span className="status-pill">{featuredProject.project_stage}</span></div>
            {featuredProject.image_url ? (
              <div className="project-panel-photo"><img src={featuredProject.image_url} alt={featuredProject.image_alt || featuredProject.title} width="900" height="620" /></div>
            ) : (
              <div className="project-calendar" aria-hidden="true">
                {Array.from({ length: 24 }).map((_, index) => <span key={index} className={index % 7 === 2 || index % 9 === 0 ? "active" : ""} />)}
              </div>
            )}
            <div className="project-stats">
              {projectHighlights.map((item) => {
                const Icon = item.icon;
                return <div key={item.label}><Icon size={19} aria-hidden="true" /><span>{item.label}</span><strong>{item.value}</strong></div>;
              })}
            </div>
          </div>
        </div>
      </section> : null}

      <section className="section" data-reveal>
        <div className="shell">
          <SectionHeading eyebrow="Cách tiếp cận" title="Phần mềm phải phù hợp với công việc của người sử dụng." />
          <div className="strength-grid">
            {strengths.map((item) => {
              const Icon = item.icon;
              return <article key={item.title}><Icon size={23} strokeWidth={1.7} aria-hidden="true" /><h3>{item.title}</h3><p>{item.description}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section className="section section-process" data-reveal>
        <div className="shell">
          <SectionHeading eyebrow="Quy trình" title="Bốn bước để đi từ nhu cầu đến giải pháp sử dụng được." />
          <div className="process-list">
            {processSteps.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section section-insights" data-reveal>
        <div className="shell">
          <div className="insight-heading-row">
            <SectionHeading eyebrow="Kiến thức" title="Góc nhìn về số hóa y tế và điều dưỡng." />
            <Link href="/kien-thuc" className="text-link">Xem tất cả bài viết <ArrowRight size={17} /></Link>
          </div>
          <div className="insight-grid">
            {insights.map((article, index) => (
              <Link href={article.href} key={article.title} className="insight-card motion-card">
                <div className={`insight-visual visual-${index + 1}`} aria-hidden="true"><span>0{index + 1}</span></div>
                <div className="insight-meta"><span>{article.category}</span><span>{article.readTime}</span></div>
                <h3>{article.title}</h3><p>{article.excerpt}</p>
                <span className="text-link">Đọc bài <ArrowUpRight size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" data-reveal>
        <div className="shell cta-inner">
          <div><p className="eyebrow eyebrow-light">Bắt đầu từ một quy trình</p><h2>Đơn vị của bạn đang muốn giảm thao tác thủ công ở đâu?</h2></div>
          <div className="cta-actions">
            <Link href="/lien-he" className="button button-white">Trao đổi cùng Bee System <ArrowRight size={17} /></Link>
            <Link href="/du-an" className="text-link text-link-light">Xem sản phẩm đang phát triển <ArrowUpRight size={17} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
