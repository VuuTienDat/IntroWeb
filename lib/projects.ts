const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const projectStages = ["Đã hoàn thành", "Đang triển khai", "Đang nghiên cứu"] as const;
export type ProjectStage = (typeof projectStages)[number];

export function normalizeProjectStage(stage: string): ProjectStage {
  const value = stage.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/đ/g, "d");
  if (value.includes("hoan thanh") || value.includes("da lam") || value.includes("nghiem thu")) return "Đã hoàn thành";
  if (value.includes("nghien cuu") || value.includes("de xuat") || value.includes("y tuong")) return "Đang nghiên cứu";
  return "Đang triển khai";
}

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  project_stage: string;
  app_url: string | null;
  image_url: string | null;
  image_alt: string;
  seo_title: string;
  seo_description: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const fallbackProject: Project = {
  id: "fallback-scheduling",
  title: "Hệ thống xếp lịch điều dưỡng",
  slug: "he-thong-xep-lich",
  summary: "Tự động phân ca, cân bằng ca đêm và khối lượng công việc bằng mô hình ưu tiên nhiều mức.",
  content: "## Bài toán vận hành\n\nLịch trực cần đáp ứng số lượng nhân sự, kỹ năng và quy định của từng ca. Đồng thời, lịch vẫn phải giảm chênh lệch về ca đêm và tổng khối lượng giữa các thành viên.\n\n## Cách mô hình hóa\n\nNhững điều kiện không thể vi phạm được giữ thành ràng buộc bắt buộc. Các mong muốn có thể điều chỉnh được chuyển thành điểm phạt. Mức phạt tăng theo độ nghiêm trọng để hệ thống hiểu ưu tiên nào cần xử lý trước.\n\n## Thứ tự ưu tiên\n\n- Trước hết bảo đảm lịch hợp lệ và đủ người cho các ca cần thiết.\n- Ưu tiên giảm chênh lệch số ca đêm giữa các thành viên.\n- Tiếp theo cân bằng tổng khối lượng công việc.\n- Sau cùng giảm các sai lệch còn lại theo trọng số đã thống nhất.\n\n## Giá trị hướng tới\n\nNgười quản lý có thể tạo lịch nhanh hơn, nhìn thấy cảnh báo và hiểu nguyên nhân một lịch được đánh giá tốt hoặc cần điều chỉnh.",
  category: "Điều phối điều dưỡng",
  project_stage: "Đang triển khai",
  app_url: null,
  image_url: null,
  image_alt: "Giao diện hệ thống xếp lịch điều dưỡng Bee System",
  seo_title: "Hệ thống xếp lịch điều dưỡng",
  seo_description: "Cách Bee System tiếp cận bài toán xếp lịch điều dưỡng với ràng buộc bắt buộc và cơ chế điểm phạt nhiều mức.",
  status: "published",
  featured: true,
  published_at: "2026-09-01T00:00:00.000Z",
  created_at: "2026-09-01T00:00:00.000Z",
  updated_at: "2026-09-01T00:00:00.000Z",
};

const fields = "id,title,slug,summary,content,category,project_stage,app_url,image_url,image_alt,seo_title,seo_description,status,featured,published_at,created_at,updated_at";
const legacyFields = "id,title,slug,summary,content,category,project_stage,image_url,image_alt,seo_title,seo_description,status,featured,published_at,created_at,updated_at";

async function request(query: URLSearchParams): Promise<Project[] | null> {
  if (!supabaseUrl || !supabaseKey) return null;
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/projects?${query}`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      next: { revalidate: 300 },
    });
    if (response.ok) return await response.json() as Project[];

    // Giữ website hoạt động trong khoảng thời gian admin chưa chạy migration app_url.
    const legacyQuery = new URLSearchParams(query);
    legacyQuery.set("select", legacyFields);
    const legacyResponse = await fetch(`${supabaseUrl}/rest/v1/projects?${legacyQuery}`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      next: { revalidate: 300 },
    });
    if (!legacyResponse.ok) return null;
    const legacyRows = await legacyResponse.json() as Omit<Project, "app_url">[];
    return legacyRows.map((project) => ({ ...project, app_url: null }));
  } catch { return null; }
}

export async function getProjects(): Promise<Project[]> {
  const rows = await request(new URLSearchParams({ select: fields, status: "eq.published", order: "featured.desc,published_at.desc" }));
  return rows ?? [fallbackProject];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const rows = await request(new URLSearchParams({ select: fields, status: "eq.published", slug: `eq.${slug}`, limit: "1" }));
  if (rows === null) return slug === fallbackProject.slug ? fallbackProject : null;
  return rows[0] ?? null;
}
