const limits = {
  fullName: 100,
  organization: 140,
  contact: 120,
  need: 60,
  message: 1500,
} as const;

type Lead = Record<keyof typeof limits | "website", unknown>;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > 20_000) {
    return Response.json({ message: "Nội dung gửi lên quá dài." }, { status: 413 });
  }

  let body: Lead;
  try {
    body = JSON.parse(raw) as Lead;
  } catch {
    return Response.json({ message: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  if (clean(body.website, 200)) {
    return Response.json({ message: "Yêu cầu đã được ghi nhận." });
  }

  const lead = {
    fullName: clean(body.fullName, limits.fullName),
    organization: clean(body.organization, limits.organization),
    contact: clean(body.contact, limits.contact),
    need: clean(body.need, limits.need),
    message: clean(body.message, limits.message),
    submittedAt: new Date().toISOString(),
    source: "bee-system-website",
  };

  if (!lead.fullName || !lead.organization || !lead.contact || !lead.need || !lead.message) {
    return Response.json({ message: "Vui lòng điền đầy đủ các trường bắt buộc." }, { status: 400 });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    return Response.json(
      { message: "Kênh tiếp nhận đang được cấu hình. Vui lòng thử lại sau." },
      { status: 503 },
    );
  }

  const webhookResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CONTACT_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_SECRET}` }
        : {}),
    },
    body: JSON.stringify(lead),
  });

  if (!webhookResponse.ok) {
    return Response.json({ message: "Chưa thể gửi yêu cầu. Vui lòng thử lại sau." }, { status: 502 });
  }

  return Response.json({ message: "Bee System đã nhận được yêu cầu của bạn." });
}
