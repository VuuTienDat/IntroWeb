import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowDown, ArrowUpRight, HeartPulse, ShieldCheck } from "lucide-react";
import { getProjects, normalizeProjectStage, type Project } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Sản phẩm và dự án",
  description: "Các dự án Bee System đã hoàn thành, đang triển khai và đang nghiên cứu cho lĩnh vực y tế và điều dưỡng.",
  alternates: { canonical: "/du-an" },
};

export const revalidate = 300;

const stageGroups = [
  {
    label: "Đã hoàn thành",
    id: "da-hoan-thanh",
    description: "Dự án đã nghiệm thu hoặc đã được đưa vào sử dụng trong phạm vi công bố.",
  },
  {
    label: "Đang triển khai",
    id: "dang-trien-khai",
    description: "Sản phẩm đang được xây dựng, kiểm thử hoặc hoàn thiện cùng đơn vị sử dụng.",
  },
  {
    label: "Đang nghiên cứu",
    id: "dang-nghien-cuu",
    description: "Bài toán đang ở giai đoạn khảo sát nghiệp vụ, thử nghiệm ý tưởng hoặc xác định phạm vi.",
  },
] as const;

const fallbackImages = [
  "/media/clinical-technology-real.webp",
  "/media/hospital-operations-real.webp",
  "/media/care-team-real.webp",
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const projectStage = normalizeProjectStage(project.project_stage);
  return (
    <Link href={`/du-an/${project.slug}`} className="project-public-card motion-card">
      {project.image_url ? (
        <div className="project-public-image"><img src={project.image_url} alt={project.image_alt} width="900" height="560" /></div>
      ) : (
        <div className="project-public-image">
          <Image src={fallbackImages[index % fallbackImages.length]} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" />
          <span className="project-image-index">{String(index + 1).padStart(2, "0")}</span>
        </div>
      )}
      <div className="project-public-copy">
        <div className="project-card-meta"><span>{project.category}</span><span>{projectStage}</span></div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <span className="text-link">Xem dự án <ArrowUpRight size={17} /></span>
      </div>
    </Link>
  );
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <main>
      <section className="page-hero medical-page-hero project-page-hero">
        <div className="medical-orbit medical-orbit-one" aria-hidden="true"><HeartPulse /></div>
        <div className="medical-orbit medical-orbit-two" aria-hidden="true"><Activity /></div>
        <div className="shell project-hero-layout">
          <div><p className="eyebrow">Sản phẩm và dự án</p><h1>Công nghệ đồng hành cùng quy trình chăm sóc.</h1><p>Mỗi dự án bắt đầu từ công việc thực tế của cơ sở y tế, sau đó mới lựa chọn dữ liệu, giao diện và phương pháp triển khai phù hợp.</p></div>
          <div className="medical-trust-card"><ShieldCheck size={26} /><strong>Dữ liệu minh bạch</strong><span>Chỉ công bố phạm vi và kết quả đã được xác nhận.</span></div>
        </div>
      </section>

      <nav className="project-stage-nav" aria-label="Lọc theo giai đoạn dự án">
        <div className="shell">
          {stageGroups.map((stage) => (
            <Link href={`#${stage.id}`} key={stage.id}>{stage.label}<ArrowDown size={15} /></Link>
          ))}
        </div>
      </nav>

      <section className="page-section project-catalogue">
        <div className="shell">
          {stageGroups.map((stage, stageIndex) => {
            const stageProjects = projects.filter((project) => normalizeProjectStage(project.project_stage) === stage.label);
            return (
              <section id={stage.id} className="project-stage-group anchor-target" key={stage.id}>
                <header className="project-stage-heading">
                  <div><span>{String(stageIndex + 1).padStart(2, "0")}</span><h2>{stage.label}</h2></div>
                  <div><p>{stage.description}</p><strong>{stageProjects.length.toString().padStart(2, "0")} dự án công khai</strong></div>
                </header>
                {stageProjects.length ? (
                  <div className="project-public-grid">
                    {stageProjects.map((project, index) => <ProjectCard project={project} index={stageIndex + index} key={project.id} />)}
                  </div>
                ) : (
                  <div className="project-stage-empty"><span>Thông tin đang được cập nhật</span><p>Bee System sẽ hiển thị dự án ở giai đoạn này sau khi phạm vi công bố được xác nhận.</p></div>
                )}
              </section>
            );
          })}

          <aside className="project-note medical-project-note"><div><p className="eyebrow">Nguyên tắc công bố</p><h2>Thông tin đúng tạo nên niềm tin số.</h2></div><p>Các dự án khách hàng, tên đơn vị và chỉ số hiệu quả chỉ xuất hiện khi đã được xác nhận. Nội dung không dùng số liệu minh họa như kết quả thật.</p></aside>
        </div>
      </section>
    </main>
  );
}
