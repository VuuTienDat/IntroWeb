import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowUpRight, HeartPulse, ShieldCheck } from "lucide-react";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Sản phẩm và dự án",
  description: "Sản phẩm Bee System đang phát triển cho bài toán xếp lịch và điều phối điều dưỡng.",
  alternates: { canonical: "/du-an" },
};

export const revalidate = 300;

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
      <section className="page-section">
        <div className="shell">
          <div className="project-public-grid">
            {projects.map((project, index) => <Link href={`/du-an/${project.slug}`} className="project-public-card motion-card" key={project.id}>
              {project.image_url ? <div className="project-public-image"><img src={project.image_url} alt={project.image_alt} width="900" height="560" /></div> : <div className="project-public-image"><Image src={["/media/bee-nursing-workflow.webp", "/media/bee-care-team.webp", "/media/bee-human-care.webp"][index % 3]} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" /><span className="project-image-index">{String(index + 1).padStart(2, "0")}</span></div>}
              <div className="project-public-copy"><div className="project-card-meta"><span>{project.category}</span><span>{project.project_stage}</span></div><h2>{project.title}</h2><p>{project.summary}</p><span className="text-link">Xem dự án <ArrowUpRight size={17} /></span></div>
            </Link>)}
          </div>
          {!projects.length ? <div className="project-empty-state"><HeartPulse size={28} /><h2>Dự án đang được cập nhật</h2><p>Bee System sẽ công bố thông tin sau khi phạm vi và dữ liệu dự án được xác nhận.</p></div> : null}
          <aside className="project-note medical-project-note"><div><p className="eyebrow">Nguyên tắc công bố</p><h2>Thông tin đúng tạo nên niềm tin số.</h2></div><p>Các dự án khách hàng, tên đơn vị và chỉ số hiệu quả chỉ xuất hiện khi đã được xác nhận. Nội dung không dùng số liệu minh họa như kết quả thật.</p></aside>
        </div>
      </section>
    </main>
  );
}
