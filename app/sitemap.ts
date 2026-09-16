import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getCmsPosts } from "@/lib/posts";
import { getProjects } from "@/lib/projects";

export const revalidate = 300;

const staticPaths = [
  "",
  "/gioi-thieu",
  "/dich-vu",
  "/du-an",
  "/kien-thuc",
  "/kien-thuc/phan-mem-xep-lich-dieu-duong",
  "/kien-thuc/chuyen-doi-so-y-te-bat-dau-tu-dau",
  "/kien-thuc/website-va-phan-mem-y-te",
  "/lien-he",
  "/chinh-sach-bao-mat",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cmsPosts, projects] = await Promise.all([getCmsPosts(50), getProjects()]);
  const cmsEntries: MetadataRoute.Sitemap = cmsPosts.map((post) => ({
    url: `${siteUrl}/kien-thuc/${post.slug}`,
    lastModified: new Date(post.modifiedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-09-15"),
    changeFrequency: (path.startsWith("/kien-thuc") ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "" ? 1 : path === "/dich-vu" ? 0.9 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({ url: `${siteUrl}/du-an/${project.slug}`, lastModified: new Date(project.updated_at), changeFrequency: "monthly", priority: project.featured ? 0.8 : 0.7 }));

  return [...staticEntries, ...projectEntries, ...cmsEntries];
}
