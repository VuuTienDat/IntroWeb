const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelHost ? `https://${vercelHost}` : "https://bee-system-vietnam-demo.vudat090305.chatgpt.site")
).replace(/\/$/, "");

export const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/admin";

export const company = {
  name: "Bee System Việt Nam",
  shortName: "Bee System",
  description:
    "Bee System Việt Nam phát triển các giải pháp phần mềm tối ưu cho ngành y tế và điều dưỡng tại Việt Nam.",
};
