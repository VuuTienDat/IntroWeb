const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export type HomepageContent = {
  id: string;
  hero_kicker: string;
  hero_title: string;
  hero_highlight: string;
  hero_description: string;
  hero_image_url: string | null;
  hero_image_alt: string;
  updated_at: string;
};

export const defaultHomepageContent: HomepageContent = {
  id: "homepage",
  hero_kicker: "Công nghệ cho y tế và điều dưỡng",
  hero_title: "Phần mềm y tế",
  hero_highlight: "được thiết kế quanh người vận hành.",
  hero_description: "Bee System Việt Nam phát triển giải pháp phần mềm cho y tế và điều dưỡng, giúp quy trình chăm sóc rõ hơn, dữ liệu dễ theo dõi hơn và đội ngũ vận hành nhẹ hơn.",
  hero_image_url: null,
  hero_image_alt: "Giải pháp phần mềm y tế và điều dưỡng của Bee System Việt Nam",
  updated_at: new Date(0).toISOString(),
};

export async function getHomepageContent(): Promise<HomepageContent> {
  if (!supabaseUrl || !supabaseKey) return defaultHomepageContent;
  const query = new URLSearchParams({ select: "*", id: "eq.homepage", limit: "1" });
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/homepage_content?${query}`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      next: { revalidate: 300 },
    });
    if (!response.ok) return defaultHomepageContent;
    const rows = await response.json() as HomepageContent[];
    return rows[0] ?? defaultHomepageContent;
  } catch {
    return defaultHomepageContent;
  }
}
