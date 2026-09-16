"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type AdminPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type EditablePost = Omit<AdminPost, "id" | "created_at" | "updated_at"> & { id?: string };

const emptyPost: EditablePost = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Chuyển đổi số y tế",
  cover_image_url: "",
  cover_image_alt: "",
  author_name: "Bee System Việt Nam",
  seo_title: "",
  seo_description: "",
  status: "draft",
  published_at: null,
};

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D")
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function AdminDashboard({ initialPosts, userId, userEmail }: {
  initialPosts: AdminPost[];
  userId: string;
  userEmail: string;
}) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [editing, setEditing] = useState<EditablePost>({ ...emptyPost });
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const visiblePosts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return posts;
    return posts.filter((post) => `${post.title} ${post.slug} ${post.category}`.toLowerCase().includes(keyword));
  }, [posts, query]);

  function selectPost(post?: AdminPost) {
    setEditing(post ? { ...post } : { ...emptyPost });
    setMessage("");
  }

  function change<K extends keyof EditablePost>(key: K, value: EditablePost[K]) {
    setEditing((current) => ({ ...current, [key]: value }));
  }

  async function refreshPublicPages(slugs: string[]) {
    await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slugs }),
    });
  }

  async function save(status: "draft" | "published") {
    if (!editing.title.trim() || !editing.content.trim()) {
      setMessage("Bạn cần nhập tiêu đề và nội dung bài viết.");
      return;
    }
    const slug = slugify(editing.slug || editing.title);
    if (!slug) {
      setMessage("Đường dẫn bài viết chưa hợp lệ.");
      return;
    }

    setBusy(true);
    setMessage("");
    const supabase = createClient();
    const payload = {
      title: editing.title.trim(), slug, excerpt: editing.excerpt?.trim() || null,
      content: editing.content.trim(), category: editing.category?.trim() || null,
      cover_image_url: editing.cover_image_url?.trim() || null,
      cover_image_alt: editing.cover_image_alt?.trim() || editing.title.trim(),
      author_name: editing.author_name?.trim() || "Bee System Việt Nam",
      seo_title: editing.seo_title?.trim() || editing.title.trim(),
      seo_description: editing.seo_description?.trim() || editing.excerpt?.trim() || null,
      status,
      published_at: status === "published" ? (editing.published_at ?? new Date().toISOString()) : editing.published_at,
      created_by: userId,
      updated_by: userId,
    };
    const request = editing.id
      ? supabase.from("posts").update(payload).eq("id", editing.id).select().single()
      : supabase.from("posts").insert(payload).select().single();
    const { data, error } = await request;

    if (error) {
      setMessage(error.code === "23505" ? "Đường dẫn (slug) này đã được dùng." : error.message);
    } else {
      const saved = data as AdminPost;
      setPosts((current) => [saved, ...current.filter((post) => post.id !== saved.id)]);
      setEditing({ ...saved });
      await refreshPublicPages([slug]);
      router.refresh();
      setMessage(status === "published" ? "Đã đăng bài lên website." : "Đã lưu bản nháp.");
    }
    setBusy(false);
  }

  async function unpublish() {
    if (!editing.id) return;
    setBusy(true);
    const oldSlug = editing.slug;
    const { data, error } = await createClient().from("posts")
      .update({ status: "draft", updated_by: userId }).eq("id", editing.id).select().single();
    if (error) setMessage(error.message);
    else {
      const saved = data as AdminPost;
      setPosts((current) => [saved, ...current.filter((post) => post.id !== saved.id)]);
      setEditing({ ...saved });
      await refreshPublicPages([oldSlug]);
      router.refresh();
      setMessage("Đã gỡ bài khỏi website và giữ lại dưới dạng bản nháp.");
    }
    setBusy(false);
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Ảnh phải nhỏ hơn 5 MB.");
      return;
    }
    setBusy(true);
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `${userId}/${Date.now()}-${safeName}`;
    const supabase = createClient();
    const { error } = await supabase.storage.from("post-images").upload(path, file, { upsert: false });
    if (error) setMessage(error.message);
    else {
      const { data } = supabase.storage.from("post-images").getPublicUrl(path);
      change("cover_image_url", data.publicUrl);
      setMessage("Đã tải ảnh lên. Nhớ lưu bài viết.");
    }
    setBusy(false);
  }

  async function signOut() {
    await createClient().auth.signOut();
    window.location.href = "/admin";
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div><span className="admin-kicker">Bee System CMS</span><h1>Quản lý bài viết</h1><p>{userEmail}</p></div>
        <div className="admin-topbar-actions">
          <button className="admin-secondary-button" onClick={() => selectPost()}>+ Bài viết mới</button>
          <button className="admin-secondary-button" onClick={signOut}>Đăng xuất</button>
        </div>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <label>Tìm bài<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tiêu đề, slug…" /></label>
          <div className="admin-post-list">
            {visiblePosts.map((post) => (
              <button key={post.id} className={editing.id === post.id ? "active" : ""} onClick={() => selectPost(post)}>
                <strong>{post.title}</strong><span>{post.status === "published" ? "Đang hiển thị" : post.status === "draft" ? "Bản nháp" : "Đã lưu trữ"}</span>
              </button>
            ))}
            {!visiblePosts.length ? <p>Chưa có bài viết.</p> : null}
          </div>
        </aside>
        <section className="admin-editor">
          <div className="admin-field-row">
            <label>Tiêu đề *<input value={editing.title} onChange={(e) => { change("title", e.target.value); if (!editing.id) change("slug", slugify(e.target.value)); }} /></label>
            <label>Đường dẫn (slug) *<input value={editing.slug} onChange={(e) => change("slug", slugify(e.target.value))} placeholder="phan-mem-y-te" /></label>
          </div>
          <label>Mô tả ngắn<textarea rows={3} value={editing.excerpt ?? ""} onChange={(e) => change("excerpt", e.target.value)} maxLength={300} /></label>
          <div className="admin-field-row">
            <label>Chuyên mục<input value={editing.category ?? ""} onChange={(e) => change("category", e.target.value)} /></label>
            <label>Tác giả<input value={editing.author_name ?? ""} onChange={(e) => change("author_name", e.target.value)} /></label>
          </div>
          <label>Nội dung *<textarea className="admin-content-input" rows={18} value={editing.content} onChange={(e) => change("content", e.target.value)} placeholder={"## Tiêu đề mục\n\nNội dung đoạn văn…\n\n- Ý thứ nhất\n- Ý thứ hai"} /></label>
          <div className="admin-field-row">
            <label>Ảnh đại diện<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={uploadImage} /></label>
            <label>Hoặc URL ảnh<input value={editing.cover_image_url ?? ""} onChange={(e) => change("cover_image_url", e.target.value)} /></label>
          </div>
          <label>Mô tả ảnh (alt)<input value={editing.cover_image_alt ?? ""} onChange={(e) => change("cover_image_alt", e.target.value)} /></label>
          <div className="admin-seo-box">
            <h2>SEO bài viết</h2>
            <label>Tiêu đề SEO<input value={editing.seo_title ?? ""} maxLength={70} onChange={(e) => change("seo_title", e.target.value)} /></label>
            <label>Mô tả SEO<textarea rows={3} value={editing.seo_description ?? ""} maxLength={170} onChange={(e) => change("seo_description", e.target.value)} /></label>
          </div>
          {message ? <p className="admin-message" role="status">{message}</p> : null}
          <div className="admin-actions">
            <button className="admin-secondary-button" disabled={busy} onClick={() => save("draft")}>Lưu nháp</button>
            <button className="admin-primary-button" disabled={busy} onClick={() => save("published")}>{busy ? "Đang xử lý…" : "Đăng bài"}</button>
            {editing.id && editing.status === "published" ? <button className="admin-danger-button" disabled={busy} onClick={unpublish}>Gỡ bài</button> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
