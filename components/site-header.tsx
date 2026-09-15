import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { appUrl } from "@/lib/site";

const nav = [
  ["Giới thiệu", "/gioi-thieu"],
  ["Dịch vụ", "/dich-vu"],
  ["Dự án", "/du-an"],
  ["Kiến thức", "/kien-thuc"],
  ["Liên hệ", "/lien-he"],
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell flex h-[76px] items-center justify-between gap-6">
        <Link href="/" className="brand" aria-label="Bee System - Trang chủ">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>BEE SYSTEM</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Điều hướng chính">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="nav-link">{label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={appUrl} className="button button-dark">
            Đăng nhập <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <details className="mobile-menu lg:hidden">
          <summary aria-label="Mở menu"><Menu size={24} aria-hidden="true" /></summary>
          <nav aria-label="Điều hướng di động">
            {nav.map(([label, href]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
            <a href={appUrl} className="mobile-app-link">
              Mở web app <ArrowUpRight size={16} />
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
