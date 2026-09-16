"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signIn() {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/admin` },
      });
      if (authError) throw authError;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể đăng nhập lúc này.");
      setLoading(false);
    }
  }

  return (
    <section className="admin-auth-card">
      <span className="admin-kicker">Bee System CMS</span>
      <h1>Quản trị bài viết</h1>
      <p>Nhân viên được cấp quyền có thể soạn, đăng và gỡ bài khỏi website.</p>
      <button className="admin-primary-button" type="button" onClick={signIn} disabled={loading}>
        {loading ? "Đang chuyển hướng…" : "Đăng nhập bằng Google"}
      </button>
      {error ? <p className="admin-error" role="alert">{error}</p> : null}
    </section>
  );
}
