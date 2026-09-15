const configuredEndpoint =
  process.env.WORDPRESS_API_URL ?? process.env.WORDPRESS_URL ?? "";

const apiBase = configuredEndpoint
  ? configuredEndpoint.replace(/\/$/, "").includes("/wp-json/wp/v2")
    ? configuredEndpoint.replace(/\/$/, "")
    : `${configuredEndpoint.replace(/\/$/, "")}/wp-json/wp/v2`
  : "";

type WordPressRendered = {
  rendered: string;
};

type WordPressPostResponse = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: WordPressRendered;
  excerpt: WordPressRendered;
  content: WordPressRendered;
  _embedded?: {
    author?: Array<{ name?: string }>;
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      alt_text?: string;
      media_details?: { width?: number; height?: number };
    }>;
    "wp:term"?: Array<Array<{ name?: string; taxonomy?: string }>>;
  };
};

export type CmsPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  category: string;
  author: string;
  publishedAt: string;
  modifiedAt: string;
  readTime: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export function plainText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&hellip;/gi, "…")
    .replace(/\s+/g, " ")
    .trim();
}

function mapPost(post: WordPressPostResponse): CmsPost {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const categories = post._embedded?.["wp:term"]
    ?.flat()
    .filter((term) => term.taxonomy === "category" && term.name)
    .map((term) => plainText(term.name ?? ""));
  const contentText = plainText(post.content.rendered);
  const excerpt = plainText(post.excerpt.rendered) || contentText.slice(0, 180);

  return {
    id: post.id,
    slug: post.slug,
    title: plainText(post.title.rendered),
    excerpt,
    contentHtml: post.content.rendered,
    category: categories?.[0] ?? "Kiến thức",
    author: plainText(post._embedded?.author?.[0]?.name ?? "Bee System Việt Nam"),
    publishedAt: post.date,
    modifiedAt: post.modified,
    readTime: `${Math.max(3, Math.ceil(contentText.split(/\s+/).length / 220))} phút đọc`,
    image: media?.source_url
      ? {
          src: media.source_url,
          alt: plainText(media.alt_text ?? "") || plainText(post.title.rendered),
          width: media.media_details?.width ?? 1200,
          height: media.media_details?.height ?? 675,
        }
      : undefined,
  };
}

async function requestPosts(path: string): Promise<WordPressPostResponse[]> {
  if (!apiBase) return [];

  try {
    const response = await fetch(`${apiBase}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];
    return (await response.json()) as WordPressPostResponse[];
  } catch {
    return [];
  }
}

export async function getCmsPosts(limit = 12): Promise<CmsPost[]> {
  const perPage = Math.min(Math.max(limit, 1), 50);
  const posts = await requestPosts(
    `/posts?status=publish&orderby=date&order=desc&per_page=${perPage}&_embed=1`,
  );
  return posts.map(mapPost);
}

export async function getCmsPostBySlug(slug: string): Promise<CmsPost | null> {
  const posts = await requestPosts(
    `/posts?status=publish&slug=${encodeURIComponent(slug)}&per_page=1&_embed=1`,
  );
  return posts[0] ? mapPost(posts[0]) : null;
}

export function isCmsConfigured() {
  return Boolean(apiBase);
}
