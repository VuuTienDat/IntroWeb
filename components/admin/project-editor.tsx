"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { normalizeProjectStage, projectStages, type Project } from "@/lib/projects";

type EditableProject = Omit<Project, "id" | "created_at" | "updated_at"> & { id?: string };
const emptyProject: EditableProject = { title: "", slug: "", summary: "", content: "", category: "Giải pháp y tế", project_stage: "Đang triển khai", app_url: null, image_url: null, image_alt: "", seo_title: "", seo_description: "", status: "draft", featured: false, published_at: null };

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function ProjectEditor({ initialProjects, userId }: { initialProjects: Project[]; userId: string }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<EditableProject>({ ...emptyProject });
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const visible = useMemo(() => projects.filter((item) => `${item.title} ${item.category}`.toLowerCase().includes(query.toLowerCase())), [projects, query]);

  function change<K extends keyof EditableProject>(key: K, value: EditableProject[K]) { setEditing((current) => ({ ...current, [key]: value })); }
  async function revalidate(slug: string) { await fetch("/api/admin/revalidate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projects: true, projectSlugs: [slug] }) }); }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    if (file.size > 8 * 1024 * 1024) return setMessage("Ảnh dự án phải nhỏ hơn 8 MB.");
    setBusy(true); setMessage("");
    const path = `projects/${userId}-${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
    const supabase = createClient();
    const { error } = await supabase.storage.from("site-assets").upload(path, file);
    if (error) setMessage(error.message); else { const { data } = supabase.storage.from("site-assets").getPublicUrl(path); change("image_url", data.publicUrl); setMessage("Đã tải ảnh lên. Nhớ lưu dự án."); }
    setBusy(false);
  }

  async function save(status: "draft" | "published") {
    if (!editing.title.trim() || !editing.summary.trim() || !editing.content.trim()) return setMessage("Cần nhập tiêu đề, mô tả ngắn và nội dung dự án.");
    const slug = slugify(editing.slug || editing.title); if (!slug) return setMessage("Slug chưa hợp lệ.");
    setBusy(true); setMessage("");
    const payload = { title: editing.title.trim(), slug, summary: editing.summary.trim(), content: editing.content.trim(), category: editing.category.trim(), project_stage: editing.project_stage.trim(), app_url: editing.app_url?.trim() || null, image_url: editing.image_url?.trim() || null, image_alt: editing.image_alt.trim() || editing.title.trim(), seo_title: editing.seo_title.trim() || editing.title.trim(), seo_description: editing.seo_description.trim() || editing.summary.trim(), status, featured: editing.featured, published_at: status === "published" ? (editing.published_at ?? new Date().toISOString()) : editing.published_at, created_by: userId, updated_by: userId };
    const supabase = createClient();
    const request = editing.id ? supabase.from("projects").update(payload).eq("id", editing.id).select().single() : supabase.from("projects").insert(payload).select().single();
    const { data, error } = await request;
    if (error) setMessage(error.code === "23505" ? "Slug dự án đã tồn tại." : error.message);
    else { const saved = data as Project; setProjects((current) => [saved, ...current.filter((item) => item.id !== saved.id)]); setEditing({ ...saved }); await revalidate(slug); router.refresh(); setMessage(status === "published" ? "Đã công khai dự án." : "Đã lưu bản nháp."); }
    setBusy(false);
  }

  async function unpublish() {
    if (!editing.id) return; setBusy(true);
    const { data, error } = await createClient().from("projects").update({ status: "draft", updated_by: userId }).eq("id", editing.id).select().single();
    if (error) setMessage(error.message); else { const saved = data as Project; setProjects((current) => [saved, ...current.filter((item) => item.id !== saved.id)]); setEditing({ ...saved }); await revalidate(saved.slug); router.refresh(); setMessage("Đã ẩn dự án khỏi website."); }
    setBusy(false);
  }

  return <div className="admin-layout">
    <aside className="admin-sidebar"><button className="admin-primary-button admin-full-button" onClick={() => { setEditing({ ...emptyProject }); setMessage(""); }}>+ Dự án mới</button><label>Tìm dự án<input value={query} onChange={(e) => setQuery(e.target.value)} /></label><div className="admin-post-list">{visible.map((project) => <button key={project.id} className={editing.id === project.id ? "active" : ""} onClick={() => { setEditing({ ...project, project_stage: normalizeProjectStage(project.project_stage) }); setMessage(""); }}><strong>{project.title}</strong><span>{project.status === "published" ? "Đang hiển thị" : "Bản nháp"} · {normalizeProjectStage(project.project_stage)}</span></button>)}</div></aside>
    <section className="admin-editor">
      <div className="admin-field-row"><label>Tên dự án *<input value={editing.title} onChange={(e) => { change("title", e.target.value); if (!editing.id) change("slug", slugify(e.target.value)); }} /></label><label>Slug *<input value={editing.slug} onChange={(e) => change("slug", slugify(e.target.value))} /></label></div>
      <label>Mô tả ngắn *<textarea rows={3} value={editing.summary} onChange={(e) => change("summary", e.target.value)} /></label>
      <div className="admin-field-row"><label>Nhóm dự án<input value={editing.category} onChange={(e) => change("category", e.target.value)} /></label><label>Giai đoạn dự án<select value={normalizeProjectStage(editing.project_stage)} onChange={(e) => change("project_stage", e.target.value)}>{projectStages.map((stage) => <option value={stage} key={stage}>{stage}</option>)}</select></label></div>
      <label>URL web app / bản demo<input type="url" value={editing.app_url ?? ""} onChange={(e) => change("app_url", e.target.value)} placeholder="https://app.beesystem.vn/du-an/..." /><small>Khách sẽ đăng nhập Google tại cổng ứng dụng trước khi mở đường dẫn này. Không nhập đường dẫn /admin.</small></label>
      <label>Nội dung dự án *<textarea className="admin-content-input" rows={18} value={editing.content} onChange={(e) => change("content", e.target.value)} placeholder={"## Bài toán\n\nNội dung…\n\n## Giải pháp\n\n- Hạng mục thứ nhất"} /></label>
      <div className="admin-field-row"><label>Ảnh dự án<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={uploadImage} /></label><label>Hoặc URL ảnh<input value={editing.image_url ?? ""} onChange={(e) => change("image_url", e.target.value)} /></label></div>
      <label>Mô tả ảnh<input value={editing.image_alt} onChange={(e) => change("image_alt", e.target.value)} /></label>
      <label className="admin-checkbox"><input type="checkbox" checked={editing.featured} onChange={(e) => change("featured", e.target.checked)} /> Đánh dấu là dự án nổi bật</label>
      <div className="admin-seo-box"><h2>SEO dự án</h2><label>Tiêu đề SEO<input value={editing.seo_title} onChange={(e) => change("seo_title", e.target.value)} /></label><label>Mô tả SEO<textarea rows={3} value={editing.seo_description} onChange={(e) => change("seo_description", e.target.value)} /></label></div>
      {message ? <p className="admin-message">{message}</p> : null}
      <div className="admin-actions"><button className="admin-secondary-button" disabled={busy} onClick={() => save("draft")}>Lưu nháp</button><button className="admin-primary-button" disabled={busy} onClick={() => save("published")}>Đăng dự án</button>{editing.id && editing.status === "published" ? <button className="admin-danger-button" disabled={busy} onClick={unpublish}>Ẩn dự án</button> : null}</div>
    </section>
  </div>;
}
