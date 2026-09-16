"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { HomepageContent } from "@/lib/homepage";

export function HomepageEditor({ initialContent, userId }: { initialContent: HomepageContent; userId: string }) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function change<K extends keyof HomepageContent>(key: K, value: HomepageContent[K]) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  async function uploadHero(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) return setMessage("Ảnh trang chủ phải nhỏ hơn 8 MB.");
    setBusy(true);
    setMessage("");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `homepage/${userId}-${Date.now()}-${safeName}`;
    const supabase = createClient();
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: false });
    if (error) setMessage(error.message);
    else {
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      change("hero_image_url", data.publicUrl);
      setMessage("Đã tải ảnh lên. Bấm Lưu trang chủ để công khai ảnh.");
    }
    setBusy(false);
  }

  async function save() {
    if (!content.hero_title.trim() || !content.hero_highlight.trim() || !content.hero_description.trim()) {
      return setMessage("Tiêu đề và mô tả không được để trống.");
    }
    setBusy(true);
    setMessage("");
    const { error } = await createClient().from("homepage_content").update({
      hero_kicker: content.hero_kicker.trim(),
      hero_title: content.hero_title.trim(),
      hero_highlight: content.hero_highlight.trim(),
      hero_description: content.hero_description.trim(),
      hero_image_url: content.hero_image_url?.trim() || null,
      hero_image_alt: content.hero_image_alt.trim() || content.hero_title.trim(),
      updated_by: userId,
    }).eq("id", "homepage");
    if (error) setMessage(error.message);
    else {
      await fetch("/api/admin/revalidate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ homepage: true }) });
      router.refresh();
      setMessage("Đã cập nhật trang chủ.");
    }
    setBusy(false);
  }

  return (
    <section className="admin-home-editor">
      <div className="admin-editor-heading"><div><span className="admin-kicker">Trang tổng quan</span><h2>Nội dung nổi bật</h2></div><p>Thay nội dung và ảnh hero mà không cần sửa code.</p></div>
      <div className="admin-home-grid">
        <div className="admin-editor">
          <label>Dòng giới thiệu<input value={content.hero_kicker} onChange={(e) => change("hero_kicker", e.target.value)} /></label>
          <div className="admin-field-row">
            <label>Tiêu đề chính<input value={content.hero_title} onChange={(e) => change("hero_title", e.target.value)} /></label>
            <label>Phần nhấn màu vàng<input value={content.hero_highlight} onChange={(e) => change("hero_highlight", e.target.value)} /></label>
          </div>
          <label>Mô tả<textarea rows={5} value={content.hero_description} onChange={(e) => change("hero_description", e.target.value)} /></label>
          <div className="admin-field-row">
            <label>Tải ảnh hero<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={uploadHero} /></label>
            <label>Hoặc URL ảnh<input value={content.hero_image_url ?? ""} onChange={(e) => change("hero_image_url", e.target.value)} /></label>
          </div>
          <label>Mô tả ảnh cho SEO<input value={content.hero_image_alt} onChange={(e) => change("hero_image_alt", e.target.value)} /></label>
          {message ? <p className="admin-message" role="status">{message}</p> : null}
          <div className="admin-actions"><button className="admin-primary-button" disabled={busy} onClick={save}>{busy ? "Đang lưu…" : "Lưu trang chủ"}</button></div>
        </div>
        <div className="admin-home-preview">
          <span>Xem trước</span>
          <div className="admin-preview-card">
            {content.hero_image_url ? <img src={content.hero_image_url} alt="" /> : <div className="admin-preview-placeholder">Ảnh hero</div>}
            <div><small>{content.hero_kicker}</small><strong>{content.hero_title} <em>{content.hero_highlight}</em></strong><p>{content.hero_description}</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
