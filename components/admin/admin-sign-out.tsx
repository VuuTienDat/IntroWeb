"use client";

import { createClient } from "@/lib/supabase/client";

export function AdminSignOut() {
  async function signOut() {
    await createClient().auth.signOut();
    window.location.href = "/admin";
  }

  return <button className="admin-secondary-button" onClick={signOut}>Đăng xuất</button>;
}
