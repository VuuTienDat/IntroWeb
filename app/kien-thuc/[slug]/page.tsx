import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleByline } from "@/components/article-byline";
import { ArticleContent } from "@/components/article-content";
import { company, siteUrl } from "@/lib/site";
import { getCmsPostBySlug } from "@/lib/posts";

export const revalidate = 300;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCmsPostBySlug(slug);

  if (!post) {
    return {
      title: "Không tìm thấy bài viết",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `/kien-thuc/${post.slug}`;
  const description = post.seoDescription.slice(0, 158);

  return {
    title: post.seoTitle,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      locale: "vi_VN",
      title: post.title,
      description,
      url: canonical,
      publishedTime: post.publishedAt,
      modifiedTime: post.modifiedAt,
      authors: [post.author],
      images: post.image
        ? [
            {
              url: post.image.src,
              width: post.image.width,
              height: post.image.height,
              alt: post.image.alt,
            },
          ]
        : [],
    },
  };
}

export default async function CmsArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getCmsPostBySlug(slug);
  if (!post) notFound();

  const canonicalUrl = `${siteUrl}/kien-thuc/${post.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        headline: post.title,
        description: post.excerpt,
        mainEntityOfPage: canonicalUrl,
        author: { "@type": "Organization", name: post.author },
        publisher: {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: company.name,
        },
        datePublished: post.publishedAt,
        dateModified: post.modifiedAt,
        image: post.image?.src,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Kiến thức",
            item: `${siteUrl}/kien-thuc`,
          },
          { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="page-hero article-hero">
        <div className="shell">
          <p className="eyebrow">
            {post.category} · {post.readTime}
          </p>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </div>
      </section>
      <section className="page-section">
        <div className="shell article-layout">
          <article className="page-copy wp-article">
            <nav className="breadcrumb" aria-label="Đường dẫn bài viết">
              <Link href="/">Trang chủ</Link>
              <span>/</span>
              <Link href="/kien-thuc">Kiến thức</Link>
              <span>/</span>
              <span aria-current="page">{post.title}</span>
            </nav>
            <ArticleByline
              author={post.author}
              updatedAt={formatDate(post.modifiedAt)}
              updatedAtIso={post.modifiedAt}
            />
            {post.image ? (
              <figure className="article-cover">
                {/* Supabase Storage supplies the public media URL. */}
                <img
                  src={post.image.src}
                  alt={post.image.alt}
                  width={post.image.width}
                  height={post.image.height}
                  loading="eager"
                />
              </figure>
            ) : null}
            <ArticleContent content={post.content} />
            <div className="article-cta">
              <strong>Đang cân nhắc một quy trình cần số hóa?</strong>
              <p>Gửi bối cảnh vận hành để Bee System cùng làm rõ phạm vi phù hợp.</p>
              <Link href="/lien-he" className="button button-dark">
                Trao đổi cùng Bee System
              </Link>
            </div>
          </article>
          <aside className="article-aside">
            <p>Thông tin bài viết</p>
            <strong>{post.category}</strong>
            <strong>{post.readTime}</strong>
            <strong>Cập nhật {formatDate(post.modifiedAt)}</strong>
          </aside>
        </div>
      </section>
    </main>
  );
}
