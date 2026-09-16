const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CmsPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  seoTitle: string;
  seoDescription: string;
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

const fields = [
  "id",
  "title",
  "slug",
  "excerpt",
  "content",
  "category",
  "cover_image_url",
  "cover_image_alt",
  "author_name",
  "seo_title",
  "seo_description",
  "published_at",
  "created_at",
  "updated_at",
].join(",");

function plainText(value: string) {
  return value.replace(/[#*_>`~-]/g, " ").replace(/\s+/g, " ").trim();
}

function mapPost(post: PostRow): CmsPost {
  const contentText = plainText(post.content);
  const excerpt = post.excerpt?.trim() || contentText.slice(0, 180);
  const publishedAt = post.published_at ?? post.created_at;

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt,
    content: post.content,
    category: post.category?.trim() || "Kiến thức",
    author: post.author_name?.trim() || "Bee System Việt Nam",
    seoTitle: post.seo_title?.trim() || post.title,
    seoDescription: post.seo_description?.trim() || excerpt,
    publishedAt,
    modifiedAt: post.updated_at,
    readTime: `${Math.max(3, Math.ceil(contentText.split(/\s+/).length / 220))} phút đọc`,
    image: post.cover_image_url
      ? {
          src: post.cover_image_url,
          alt: post.cover_image_alt?.trim() || post.title,
          width: 1200,
          height: 675,
        }
      : undefined,
  };
}

async function requestPosts(query: URLSearchParams): Promise<PostRow[]> {
  if (!supabaseUrl || !supabaseAnonKey) return [];

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/posts?${query.toString()}`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];
    return (await response.json()) as PostRow[];
  } catch {
    return [];
  }
}

export async function getCmsPosts(limit = 12): Promise<CmsPost[]> {
  const query = new URLSearchParams({
    select: fields,
    status: "eq.published",
    order: "published_at.desc",
    limit: String(Math.min(Math.max(limit, 1), 50)),
  });
  return (await requestPosts(query)).map(mapPost);
}

export async function getCmsPostBySlug(slug: string): Promise<CmsPost | null> {
  const query = new URLSearchParams({
    select: fields,
    status: "eq.published",
    slug: `eq.${slug}`,
    limit: "1",
  });
  const posts = await requestPosts(query);
  return posts[0] ? mapPost(posts[0]) : null;
}

export function isCmsConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
