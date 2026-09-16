"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.09-1.92 3.27-4.76 3.27-8.09Z" />
      <path fill="#34A853" d="M12 23c2.98 0 5.48-.99 7.29-2.66l-3.57-2.76c-.99.66-2.25 1.05-3.72 1.05-2.87 0-5.3-1.94-6.17-4.55H2.14v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.83 14.08A6.6 6.6 0 0 1 5.48 12c0-.72.12-1.42.35-2.08V7.08H2.14A11 11 0 0 0 1 12c0 1.77.42 3.44 1.14 4.92l3.69-2.84Z" />
      <path fill="#EA4335" d="M12 5.37c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.56 10.56 0 0 0 12 1a11 11 0 0 0-9.86 6.08l3.69 2.84C6.7 7.31 9.13 5.37 12 5.37Z" />
    </svg>
  );
}

export function AppGoogleLogin({ redirectPath }: { redirectPath: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signIn() {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const callback = new URL("/auth/callback", window.location.origin);
      callback.searchParams.set("next", redirectPath);
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callback.toString() },
      });
      if (authError) throw authError;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể đăng nhập lúc này.");
      setLoading(false);
    }
  }

  return (
    <>
      <button type="button" className="google-button google-button-active" onClick={signIn} disabled={loading}>
        <GoogleMark /> {loading ? "Đang chuyển hướng…" : "Tiếp tục bằng Google"}
      </button>
      {error ? <p className="admin-error" role="alert">{error}</p> : null}
    </>
  );
}
