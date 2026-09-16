import type { Metadata } from "next";
import { AdminDashboard, type AdminPost } from "@/components/admin/admin-dashboard";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminSignOut } from "@/components/admin/admin-sign-out";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { defaultHomepageContent, type HomepageContent } from "@/lib/homepage";

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

  const [{ data: posts, error }, { data: homepage }] = await Promise.all([
    supabase.from("posts").select("*").order("updated_at", { ascending: false }),
    supabase.from("homepage_content").select("*").eq("id", "homepage").maybeSingle(),
  ]);
  return (
    <main className="admin-page">
      {error ? <section className="admin-auth-card"><h1>Không đọc được dữ liệu</h1><p>{error.message}</p></section> : <AdminDashboard initialPosts={(posts ?? []) as AdminPost[]} initialHomepage={(homepage ?? defaultHomepageContent) as HomepageContent} userId={user.id} userEmail={user.email ?? ""} />}
    </main>
  );
}
