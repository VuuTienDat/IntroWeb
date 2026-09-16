import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, ArrowUpRight, HeartPulse, MoveRight, ShieldCheck, Sparkles } from "lucide-react";
import { MotionRuntime } from "@/components/motion-runtime";
import { getHomepageContent } from "@/lib/homepage";
import { getProjects, normalizeProjectStage } from "@/lib/projects";
import { company, siteUrl } from "@/lib/site";
import { insights, projectHighlights, services } from "./data";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: company.name,
  url: siteUrl,
  description: company.description,
  areaServed: { "@type": "Country", name: "Việt Nam" },
  knowsAbout: ["Phần mềm y tế", "Phần mềm điều dưỡng", "Xếp lịch điều dưỡng", "Chuyển đổi số y tế"],
};

const serviceMedia = [
  { src: "/media/nursing-workflow-real.webp", alt: "Nhân viên y tế chuẩn bị cho ca làm việc tại bệnh viện" },
  { src: "/media/clinical-technology-real.webp", alt: "Máy tính và ống nghe hỗ trợ công việc y tế số" },
];

const audience = ["Phòng điều dưỡng", "Khối vận hành", "Ban công nghệ", "Lãnh đạo cơ sở y tế"];

export const revalidate = 300;

export default async function Home() {
  const [homepage, projects] = await Promise.all([getHomepageContent(), getProjects()]);
  const featuredProject = projects.find((project) => project.featured) ?? projects[0];

  return (
    <main className="home-art-direction">
      <MotionRuntime />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <section className="art-hero">
        <div className="art-hero-aurora" aria-hidden="true" />
        <div className="shell art-hero-grid">
          <div className="art-hero-copy" data-reveal>
            <p className="art-kicker"><span /> {homepage.hero_kicker}</p>
            <h1>{homepage.hero_title}<em>{homepage.hero_highlight}</em></h1>
            <p className="art-hero-lead">{homepage.hero_description}</p>
            <div className="hero-actions">
              <Link href="/lien-he" className="button button-art-primary">Trao đổi cùng chúng tôi <ArrowRight size={18} /></Link>
              <Link href="/du-an" className="text-link art-text-link">Xem dự án <MoveRight size={19} /></Link>
            </div>
          </div>

          <div className="art-hero-visual" data-reveal data-reveal-delay="2">
            <div className="art-photo-frame">
              {homepage.hero_image_url ? (
                <img src={homepage.hero_image_url} alt={homepage.hero_image_alt} width="1536" height="1024" />
              ) : (
                <Image src="/media/care-team-real.webp" alt="Hai nhân viên y tế phối hợp trong môi trường lâm sàng" fill priority sizes="(max-width: 980px) 100vw, 58vw" />
              )}
              <div className="art-photo-wash" />
            </div>
            <div className="art-float-card art-float-status">
              <span className="live-dot" />
              <div><small>Vận hành hôm nay</small><strong>Quy trình đang đồng bộ</strong></div>
              <Activity size={22} />
            </div>
            <div className="art-float-card art-float-metric">
              <span>Ưu tiên</span><strong>Đúng người · Đúng ca</strong><i>Giảm thao tác lặp lại</i>
            </div>
            <div className="art-hero-seal" aria-hidden="true"><HeartPulse /><span>CARE<br />× TECH</span></div>
          </div>
        </div>

        <div className="art-marquee" aria-label="Năng lực Bee System">
          <div>
            {["Điều phối điều dưỡng", "Số hóa quy trình", "Phần mềm theo yêu cầu", "Dữ liệu vận hành", "Trải nghiệm dễ dùng"].map((item) => <span key={item}>{item}<i /></span>)}
            {["Điều phối điều dưỡng", "Số hóa quy trình", "Phần mềm theo yêu cầu", "Dữ liệu vận hành", "Trải nghiệm dễ dùng"].map((item) => <span aria-hidden="true" key={`${item}-copy`}>{item}<i /></span>)}
          </div>
        </div>
      </section>

      <section className="audience-section" data-reveal>
        <div className="shell audience-layout">
          <p>Giải pháp được thiết kế cùng ngôn ngữ của người vận hành</p>
          <div className="audience-list">{audience.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
      </section>

      <section className="art-section art-services">
        <div className="shell">
          <div className="art-heading" data-reveal>
            <div><p className="art-kicker art-kicker-dark"><span /> Hệ giải pháp</p><h2>Ít thao tác hơn.<br /><em>Nhiều thời gian chăm sóc hơn.</em></h2></div>
            <p>Bee System biến những bước thủ công, dữ liệu rời rạc và lịch làm việc phức tạp thành trải nghiệm rõ ràng cho đội ngũ y tế.</p>
          </div>

          <div className="art-service-mosaic">
            {services.map((service, index) => {
              const Icon = service.icon;
              const media = serviceMedia[index === 0 ? 0 : 1];
              return (
                <article className={`art-service-card art-service-${index + 1}`} key={service.number} data-reveal>
                  {index !== 1 ? <div className="art-service-photo"><Image src={media.src} alt={media.alt} fill sizes={index === 0 ? "(max-width: 900px) 100vw, 62vw" : "(max-width: 900px) 100vw, 38vw"} /></div> : (
                    <div className="art-data-visual" aria-hidden="true">
                      <div className="data-visual-top"><span>Quy trình chăm sóc</span><i>Trực tuyến</i></div>
                      <div className="data-wave"><svg viewBox="0 0 480 120" preserveAspectRatio="none"><path d="M0 82 C42 82 48 34 86 34 S130 96 172 72 218 20 258 51 301 104 342 70 383 36 426 58 454 74 480 36" /></svg></div>
                      <div className="data-pills"><span>Tiếp nhận</span><span>Phân công</span><span>Theo dõi</span></div>
                    </div>
                  )}
                  <div className="art-service-content">
                    <div className="art-service-icon"><Icon size={23} /><span>{service.number}</span></div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <Link href={`/dich-vu#${service.slug}`} aria-label={`Tìm hiểu ${service.title}`}><ArrowUpRight size={20} /></Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="journey-section">
        <div className="shell journey-grid">
          <div className="journey-photo" data-reveal>
            <Image src="/media/hospital-operations-real.webp" alt="Nhân viên y tế di chuyển thiết bị trong hành lang bệnh viện" fill sizes="(max-width: 980px) 100vw, 48vw" />
            <div className="journey-photo-caption"><Sparkles size={18} /><span>Thiết kế quanh nhịp làm việc thực tế</span></div>
          </div>
          <div className="journey-copy" data-reveal data-reveal-delay="2">
            <p className="art-kicker art-kicker-light"><span /> Một luồng xuyên suốt</p>
            <h2>Từ dữ liệu đầu vào đến quyết định rõ ràng.</h2>
            <div className="journey-steps">
              <article><span>01</span><div><h3>Hiểu đúng quy trình</h3><p>Xác định vai trò, điểm nghẽn và dữ liệu thật sự cần thiết.</p></div></article>
              <article><span>02</span><div><h3>Đưa công việc lên một luồng</h3><p>Gom biểu mẫu, phân công và cảnh báo vào giao diện dễ theo dõi.</p></div></article>
              <article><span>03</span><div><h3>Cải tiến bằng dữ liệu</h3><p>Đo kết quả, nhận phản hồi và mở rộng theo từng giai đoạn.</p></div></article>
            </div>
            <Link href="/gioi-thieu" className="button button-ghost-light">Cách Bee System làm việc <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      {featuredProject ? <section className="art-section featured-story">
        <div className="shell">
          <div className="featured-story-head" data-reveal>
            <div><p className="art-kicker art-kicker-dark"><span /> Dự án nổi bật</p><h2>{featuredProject.title}</h2></div>
            <div><p>{featuredProject.summary}</p><Link href={`/du-an/${featuredProject.slug}`} className="text-link">Khám phá dự án <ArrowUpRight size={18} /></Link></div>
          </div>
          <div className="product-stage" data-reveal>
            <div className="product-stage-glow" aria-hidden="true" />
            <div className="product-window">
              <div className="product-window-bar"><span><i /><i /><i /></span><strong>Bee Workforce</strong><em>{normalizeProjectStage(featuredProject.project_stage)}</em></div>
              {featuredProject.image_url ? <div className="product-custom-image"><img src={featuredProject.image_url} alt={featuredProject.image_alt || featuredProject.title} width="1200" height="760" /></div> : <div className="product-board">
                <div className="product-side"><b>B</b><span /><span /><span /><span /></div>
                <div className="product-main">
                  <div className="product-summary"><div><small>Nhân sự</small><strong>24</strong></div><div><small>Ca cần phủ</small><strong>18</strong></div><div><small>Cảnh báo</small><strong>01</strong></div></div>
                  <div className="product-schedule"><div className="schedule-labels"><span>Khoa Nội</span><span>Khoa Ngoại</span><span>Cấp cứu</span><span>Ngoại trú</span></div><div className="schedule-grid">{Array.from({ length: 32 }).map((_, index) => <i key={index} className={index % 5 === 0 || index % 7 === 3 ? "is-active" : ""} />)}</div></div>
                </div>
              </div>}
            </div>
            <div className="product-proof-row">{projectHighlights.map((item) => { const Icon = item.icon; return <div key={item.label}><Icon size={20} /><span>{item.label}</span><strong>{item.value}</strong></div>; })}</div>
          </div>
        </div>
      </section> : null}

      <section className="human-section">
        <div className="shell human-grid">
          <div className="human-copy" data-reveal>
            <ShieldCheck size={30} />
            <p className="art-kicker art-kicker-dark"><span /> Công nghệ có trách nhiệm</p>
            <h2>Phần mềm tốt phải để con người ở lại trung tâm.</h2>
            <p>Chúng tôi ưu tiên trải nghiệm dễ hiểu, dữ liệu minh bạch và triển khai theo phạm vi có thể kiểm chứng.</p>
            <div className="human-values"><span>Rõ quy trình</span><span>Đúng dữ liệu</span><span>Dễ sử dụng</span></div>
          </div>
          <div className="human-photo" data-reveal data-reveal-delay="2"><Image src="/media/care-team-real.webp" alt="Đội ngũ y tế trao đổi trực tiếp trong quá trình làm việc" fill sizes="(max-width: 900px) 100vw, 52vw" /></div>
        </div>
      </section>

      <section className="art-section insight-editorial">
        <div className="shell">
          <div className="art-heading insight-art-heading" data-reveal>
            <div><p className="art-kicker art-kicker-dark"><span /> Kiến thức</p><h2>Góc nhìn từ công việc thật.</h2></div>
            <Link href="/kien-thuc" className="button button-outline-dark">Xem tất cả bài viết <ArrowRight size={17} /></Link>
          </div>
          <div className="editorial-grid">
            {insights.map((article, index) => {
              const pictures = ["/media/clinical-technology-real.webp", "/media/health-professional-real.webp", "/media/hospital-operations-real.webp"];
              return <Link href={article.href} className={`editorial-card editorial-card-${index + 1}`} key={article.title} data-reveal>
                <div className="editorial-image"><Image src={pictures[index]} alt="" fill sizes="(max-width: 800px) 100vw, 33vw" /></div>
                <div className="editorial-overlay" />
                <div className="editorial-content"><span>{article.category} · {article.readTime}</span><h3>{article.title}</h3><i><ArrowUpRight size={20} /></i></div>
              </Link>;
            })}
          </div>
        </div>
      </section>

      <section className="art-cta">
        <div className="art-cta-orbit" aria-hidden="true"><HeartPulse /></div>
        <div className="shell art-cta-inner" data-reveal>
          <p className="art-kicker art-kicker-light"><span /> Bắt đầu từ một quy trình</p>
          <h2>Cùng biến một điểm nghẽn vận hành thành giải pháp có thể sử dụng.</h2>
          <div><Link href="/lien-he" className="button button-art-primary">Trao đổi dự án <ArrowRight size={18} /></Link><span>Bee System Việt Nam · Công nghệ cho y tế và điều dưỡng</span></div>
        </div>
      </section>
    </main>
  );
}
