"use client";

import { createClient } from "@/lib/supabase/client";

export function AppSignOut({ redirectPath }: { redirectPath: string }) {
  async function signOut() {
    await createClient().auth.signOut();
    window.location.href = redirectPath;
  }

  return <button type="button" className="app-sign-out" onClick={signOut}>Đăng xuất tài khoản này</button>;
}
