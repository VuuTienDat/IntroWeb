import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: staff } = await supabase.from("staff_members").select("active").eq("user_id", user.id).maybeSingle();
  if (!staff?.active) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => ({ slugs: [] })) as { slugs?: string[]; homepage?: boolean; projects?: boolean; projectSlugs?: string[] };
  revalidatePath("/kien-thuc");
  revalidatePath("/sitemap.xml");
  if (body.homepage) revalidatePath("/");
  if (body.projects) revalidatePath("/du-an");
  for (const slug of body.slugs?.slice(0, 5) ?? []) {
    if (/^[a-z0-9-]+$/.test(slug)) revalidatePath(`/kien-thuc/${slug}`);
  }
  for (const slug of body.projectSlugs?.slice(0, 5) ?? []) {
    if (/^[a-z0-9-]+$/.test(slug)) revalidatePath(`/du-an/${slug}`);
  }
  return NextResponse.json({ revalidated: true });
}
