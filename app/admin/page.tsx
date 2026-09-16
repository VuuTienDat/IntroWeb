import type { Metadata } from "next";
import { AdminDashboard, type AdminPost, type ProjectViewer } from "@/components/admin/admin-dashboard";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminSignOut } from "@/components/admin/admin-sign-out";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { defaultHomepageContent, type HomepageContent } from "@/lib/homepage";
import type { Project } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Quản trị nội dung",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return <main className="admin-page"><section className="admin-auth-card"><h1>Chưa kết nối Supabase</h1><p>Thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY trong Vercel rồi redeploy.</p></section></main>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <main className="admin-page"><AdminLogin /></main>;

  const { data: staff } = await supabase.from("staff_members").select("role,active").eq("user_id", user.id).maybeSingle();
  if (!staff?.active) {
    return (
      <main className="admin-page"><section className="admin-auth-card"><h1>Tài khoản chưa được cấp quyền</h1><p>Đã đăng nhập bằng <strong>{user.email}</strong>. Quản trị viên cần thêm email này vào bảng staff_members theo file hướng dẫn.</p><AdminSignOut /></section></main>
    );
  }

  const [{ data: posts, error }, { data: homepage }, { data: projects }, { data: projectViewers }] = await Promise.all([
    supabase.from("posts").select("*").order("updated_at", { ascending: false }),
    supabase.from("homepage_content").select("*").eq("id", "homepage").maybeSingle(),
    supabase.from("projects").select("*").order("updated_at", { ascending: false }),
    supabase.from("project_viewers").select("user_id,project_slug,first_viewed_at,last_viewed_at,view_count,customer_accounts(email,display_name,avatar_url),projects(title)").order("last_viewed_at", { ascending: false }),
  ]);
  const normalizedViewers: ProjectViewer[] = (projectViewers ?? []).map((viewer) => ({
    user_id: viewer.user_id,
    project_slug: viewer.project_slug,
    first_viewed_at: viewer.first_viewed_at,
    last_viewed_at: viewer.last_viewed_at,
    view_count: viewer.view_count,
    customer_accounts: Array.isArray(viewer.customer_accounts) ? (viewer.customer_accounts[0] ?? null) : viewer.customer_accounts,
    projects: Array.isArray(viewer.projects) ? (viewer.projects[0] ?? null) : viewer.projects,
  }));
  return (
    <main className="admin-page">
      {error ? <section className="admin-auth-card"><h1>Không đọc được dữ liệu</h1><p>{error.message}</p></section> : <AdminDashboard initialPosts={(posts ?? []) as AdminPost[]} initialHomepage={(homepage ?? defaultHomepageContent) as HomepageContent} initialProjects={(projects ?? []) as Project[]} initialViewers={normalizedViewers} userId={user.id} userEmail={user.email ?? ""} />}
    </main>
  );
}
