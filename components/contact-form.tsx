"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import Link from "next/link";

type SubmitState = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { message?: string };

      if (!response.ok) throw new Error(result.message ?? "Không thể gửi yêu cầu lúc này.");

      form.reset();
      setState("success");
      setMessage(result.message ?? "Bee System đã nhận được yêu cầu của bạn.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Không thể gửi yêu cầu lúc này.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Họ và tên<input name="fullName" autoComplete="name" required maxLength={100} /></label>
        <label>Đơn vị<input name="organization" autoComplete="organization" required maxLength={140} /></label>
      </div>
      <div className="form-row">
        <label>Email hoặc số điện thoại<input name="contact" required maxLength={120} /></label>
        <label>Nhu cầu
          <select name="need" required defaultValue="">
            <option value="" disabled>Chọn nội dung trao đổi</option>
            <option value="scheduling">Xếp lịch điều dưỡng</option>
            <option value="workflow">Số hóa quy trình chăm sóc</option>
            <option value="custom">Phần mềm theo yêu cầu</option>
            <option value="other">Nhu cầu khác</option>
          </select>
        </label>
      </div>
      <label>Mô tả ngắn<textarea name="message" required maxLength={1500} rows={6} placeholder="Quy trình hiện tại, nhóm người dùng và điều anh/chị muốn cải thiện..." /></label>
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <p className="privacy-hint">Không gửi thông tin định danh hoặc dữ liệu sức khỏe của người bệnh qua biểu mẫu này. Xem <Link href="/chinh-sach-bao-mat">chính sách bảo mật</Link>.</p>
      <button className="button button-primary" type="submit" disabled={state === "sending"}>
        {state === "sending" ? <LoaderCircle className="spin" size={17} /> : null}
        {state === "sending" ? "Đang gửi" : "Gửi yêu cầu"}
        {state !== "sending" ? <ArrowRight size={17} /> : null}
      </button>
      {message ? <p className={`form-message form-message-${state}`} role="status">{message}</p> : null}
    </form>
  );
}
