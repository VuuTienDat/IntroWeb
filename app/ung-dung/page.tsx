import type { Metadata } from "next";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { AppGoogleLogin } from "@/components/app-google-login";
import { AppSignOut } from "@/components/app-sign-out";
import { getProjectBySlug } from "@/lib/projects";
import { appUrl } from "@/lib/site";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Cổng truy cập ứng dụng",
  description: "Đăng nhập Google để truy cập web app Bee System.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ project?: string }> };

function safeHttpUrl(value: string | null | undefined) {
  if (!value) return "";
  try {
    const parsed = new URL(value);
    if (parsed.pathname === "/admin" || parsed.pathname.startsWith("/admin/")) return "";
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : "";
  } catch {
    return "";
  }
}

export default async function AppGatewayPage({ searchParams }: Props) {
  const rawProject = (await searchParams).project ?? "";
  const projectSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rawProject) ? rawProject : "";
  const project = projectSlug ? await getProjectBySlug(projectSlug) : null;
  const projectName = project?.title ?? "Web app Bee System";
  const targetUrl = safeHttpUrl(project?.app_url || appUrl);
  const redirectPath = projectSlug ? `/ung-dung?project=${encodeURIComponent(projectSlug)}` : "/ung-dung";

  let user: User | null = null;
  let accessRecorded = false;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;
    if (user && projectSlug) {
      const { error } = await supabase.rpc("record_project_access", { p_project_slug: projectSlug });
      accessRecorded = !error;
    }
  }

  return (
    <main className="app-gateway">
      <section className="app-gateway-shell" aria-labelledby="login-title">
        <div className="app-gateway-image">
          <Image src="/media/clinical-technology-real.webp" alt="Thiết bị và máy tính hỗ trợ công việc y tế số" fill priority sizes="(max-width: 820px) 100vw, 50vw" />
          <div className="app-gateway-image-wash" />
          <div className="app-gateway-image-copy">
            <span>Bee Workspace</span>
            <strong>Một cổng truy cập.<br />Đúng dự án.</strong>
          </div>
        </div>

        <div className="login-card app-access-card">
          <Link href="/" className="brand">
            <span className="brand-mark" aria-hidden="true">B</span>
            <span>BEE SYSTEM</span>
          </Link>
          <p className="app-access-kicker"><LockKeyhole size={14} /> Cổng ứng dụng bảo mật</p>
          <h1 id="login-title">{user ? "Sẵn sàng truy cập." : projectName}</h1>

          {user ? (
            <>
              <div className="signed-in-profile">
                {typeof user.user_metadata.avatar_url === "string" ? <img src={user.user_metadata.avatar_url} alt="" width="42" height="42" /> : <span>{(user.email ?? "B").slice(0, 1).toUpperCase()}</span>}
                <div><small>Đã đăng nhập bằng Google</small><strong>{user.email}</strong></div>
                <CheckCircle2 size={21} />
              </div>
              {targetUrl ? (
                <a href={targetUrl} className="google-button google-button-active">
                  Mở {projectName} <ArrowRight size={18} />
                </a>
              ) : (
                <div className="app-url-missing">
                  <strong>Chưa có URL web app</strong>
                  <span>Quản trị viên cần thêm đường dẫn ứng dụng trong mục Dự án.</span>
                </div>
              )}
              <p className="access-status"><ShieldCheck size={15} /> {accessRecorded ? "Lượt truy cập này đã được ghi nhận." : "Phiên đăng nhập đã được xác thực."}</p>
              <AppSignOut redirectPath={redirectPath} />
            </>
          ) : isSupabaseConfigured() ? (
            <>
              <p>Đăng nhập bằng tài khoản Google để tiếp tục tới ứng dụng của dự án.</p>
              <AppGoogleLogin redirectPath={redirectPath} />
              <p className="privacy-hint app-privacy-hint">
                Khi tiếp tục, bạn đồng ý để Bee System lưu tên, email và thời điểm truy cập dự án; không lưu mật khẩu hay Google token. Xem <Link href="/chinh-sach-bao-mat">chính sách bảo mật</Link>.
              </p>
            </>
          ) : (
            <div className="app-url-missing">
              <strong>Chưa kết nối đăng nhập Google</strong>
              <span>Thêm biến môi trường Supabase trên Vercel rồi redeploy.</span>
            </div>
          )}

          <Link href={projectSlug ? `/du-an/${projectSlug}` : "/du-an"} className="text-link app-back-link"><ArrowLeft size={16} /> Quay lại hồ sơ dự án</Link>
        </div>
      </section>
    </main>
  );
}
