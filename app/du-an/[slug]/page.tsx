import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, HeartPulse } from "lucide-react";
import { ArticleContent } from "@/components/article-content";
import { getProjectBySlug, normalizeProjectStage } from "@/lib/projects";
import { company, siteUrl } from "@/lib/site";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  if (!project) return { title: "Không tìm thấy dự án", robots: { index: false, follow: false } };
  const canonical = `/du-an/${project.slug}`;
  return { title: project.seo_title, description: project.seo_description, alternates: { canonical }, openGraph: { type: "article", title: project.seo_title, description: project.seo_description, url: canonical, images: project.image_url ? [{ url: project.image_url, alt: project.image_alt }] : [] } };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectBySlug((await params).slug); if (!project) notFound();
  const projectStage = normalizeProjectStage(project.project_stage);
  const projectUrl = `${siteUrl}/du-an/${project.slug}`;
  const structuredData = { "@context": "https://schema.org", "@graph": [{ "@type": "SoftwareApplication", "@id": `${projectUrl}#software`, name: project.title, applicationCategory: "BusinessApplication", operatingSystem: "Web", description: project.summary, url: projectUrl, author: { "@id": `${siteUrl}/#organization`, name: company.name }, image: project.image_url }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Dự án", item: `${siteUrl}/du-an` }, { "@type": "ListItem", position: 3, name: project.title, item: projectUrl }] }] };
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <section className="page-hero medical-page-hero"><div className="medical-orbit medical-orbit-one" aria-hidden="true"><HeartPulse /></div><div className="medical-orbit medical-orbit-two" aria-hidden="true"><Activity /></div><div className="shell"><p className="eyebrow">{project.category} · {projectStage}</p><h1>{project.title}</h1><p>{project.summary}</p></div></section>
    <section className="page-section"><div className="shell article-layout"><article className="page-copy project-article"><nav className="breadcrumb"><Link href="/">Trang chủ</Link><span>/</span><Link href="/du-an">Dự án</Link><span>/</span><span>{project.title}</span></nav><figure className="project-detail-cover">{project.image_url ? <img src={project.image_url} alt={project.image_alt} width="1200" height="720" /> : <Image src="/media/clinical-technology-real.webp" alt="Máy tính và thiết bị hỗ trợ công việc y tế số" width={1600} height={1067} />}</figure><ArticleContent content={project.content} /></article><aside className="article-aside medical-aside"><p>Thông tin dự án</p><strong>{project.category}</strong><strong>{projectStage}</strong><strong>Bee System Việt Nam</strong></aside></div></section>
  </main>;
}
