import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCmsPosts } from "@/lib/posts";
import { insights } from "../data";

export const metadata: Metadata = {
  title: "Kiến thức về số hóa y tế và điều dưỡng",
  description:
    "Bài viết của Bee System về phần mềm điều dưỡng, xếp lịch, số hóa quy trình y tế và kiến trúc hệ thống.",
  alternates: { canonical: "/kien-thuc" },
};

export const revalidate = 300;

export default async function InsightsPage() {
  const cmsPosts = await getCmsPosts(12);
  const cmsSlugs = new Set(cmsPosts.map((post) => post.slug));
  const articles = [
    ...cmsPosts.map((post) => ({
      category: post.category,
      title: post.title,
      excerpt: post.excerpt,
      href: `/kien-thuc/${post.slug}`,
      readTime: post.readTime,
      image: post.image,
    })),
    ...insights
      .filter((article) => !cmsSlugs.has(article.href.split("/").pop() ?? ""))
      .map((article) => ({ ...article, image: undefined })),
  ];

  return (
    <main>
      <section className="page-hero insight-page-hero">
        <div className="shell">
          <p className="eyebrow">Kiến thức</p>
          <h1>Kiến thức về chuyển đổi số y tế và quản lý điều dưỡng.</h1>
          <p>Mỗi bài viết trả lời một câu hỏi cụ thể, chỉ ra cách triển khai và phân biệt rõ nội dung công nghệ với tư vấn chuyên môn y khoa.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="shell insight-grid">
          {articles.map((article, index) => (
            <Link href={article.href} key={article.title} className="insight-card">
              {article.image ? (
                <div className="insight-visual insight-image">
                  <img
                    src={article.image.src}
                    alt={article.image.alt}
                    width={article.image.width}
                    height={article.image.height}
                    loading="lazy"
                  />
                </div>
              ) : <div className="insight-visual insight-image"><Image src={["/media/bee-nursing-workflow.webp", "/media/bee-human-care.webp", "/media/bee-care-team.webp"][index % 3]} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /></div>}
              <div className="insight-meta"><span>{article.category}</span><span>{article.readTime}</span></div>
              <h2>{article.title}</h2>
              <p>{article.excerpt}</p>
              <span className="text-link">Đọc bài <ArrowUpRight size={16} /></span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
