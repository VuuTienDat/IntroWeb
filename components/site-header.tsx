import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Menu,
} from "lucide-react";

const nav = [
  {
    label: "Giới thiệu",
    href: "/gioi-thieu",
    eyebrow: "Về Bee System",
    description: "Hiểu chúng tôi là ai, đang giải quyết bài toán nào và cách một dự án được triển khai.",
    items: [
      { title: "Tổng quan công ty", description: "Định hướng công nghệ cho y tế và điều dưỡng.", href: "/gioi-thieu" },
      { title: "Tầm nhìn & mục tiêu", description: "Mục tiêu dài hạn của Bee System Việt Nam.", href: "/gioi-thieu#tam-nhin" },
      { title: "Nguyên tắc làm việc", description: "Từ quy trình thật đến sản phẩm sử dụng được.", href: "/gioi-thieu#nguyen-tac" },
    ],
  },
  {
    label: "Dịch vụ",
    href: "/dich-vu",
    eyebrow: "Hệ giải pháp",
    description: "Các phạm vi Bee System có thể khảo sát, thiết kế và phát triển cùng đơn vị y tế.",
    items: [
      { title: "Xếp lịch & điều phối", description: "Lập lịch nhiều ràng buộc và cân bằng tải.", href: "/dich-vu#xep-lich-dieu-phoi" },
      { title: "Số hóa quy trình", description: "Biểu mẫu, phân công, cảnh báo và báo cáo.", href: "/dich-vu#so-hoa-quy-trinh" },
      { title: "Phần mềm theo yêu cầu", description: "Web app và tích hợp theo nghiệp vụ riêng.", href: "/dich-vu#phan-mem-theo-yeu-cau" },
    ],
  },
  {
    label: "Dự án",
    href: "/du-an",
    eyebrow: "Hồ sơ triển khai",
    description: "Theo dõi sản phẩm theo từng giai đoạn, chỉ công bố dữ liệu đã được xác nhận.",
    items: [
      { title: "Đã hoàn thành", description: "Các dự án đã nghiệm thu hoặc đưa vào sử dụng.", href: "/du-an#da-hoan-thanh" },
      { title: "Đang triển khai", description: "Các sản phẩm đang xây dựng và kiểm thử.", href: "/du-an#dang-trien-khai" },
      { title: "Đang nghiên cứu", description: "Bài toán và hướng giải pháp đang được khảo sát.", href: "/du-an#dang-nghien-cuu" },
    ],
  },
  {
    label: "Kiến thức",
    href: "/kien-thuc",
    eyebrow: "Thư viện chuyên môn",
    description: "Bài viết dễ tra cứu về vận hành điều dưỡng, chuyển đổi số và kiến trúc phần mềm.",
    items: [
      { title: "Phần mềm điều dưỡng", description: "Bài toán xếp lịch và điều phối nhân sự.", href: "/kien-thuc/phan-mem-xep-lich-dieu-duong" },
      { title: "Chuyển đổi số y tế", description: "Chọn đúng quy trình để bắt đầu số hóa.", href: "/kien-thuc/chuyen-doi-so-y-te-bat-dau-tu-dau" },
      { title: "Kiến trúc hệ thống", description: "Tách website công khai và ứng dụng nghiệp vụ.", href: "/kien-thuc/website-va-phan-mem-y-te" },
    ],
  },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell flex h-[76px] items-center justify-between gap-6">
        <Link href="/" className="brand" aria-label="Bee System - Trang chủ">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>BEE SYSTEM</span>
        </Link>

        <nav className="desktop-nav hidden items-center lg:flex" aria-label="Điều hướng chính">
          {nav.map((item) => (
            <div className="nav-item" key={item.href}>
              <Link href={item.href} className="nav-link nav-trigger">
                {item.label}<ChevronDown size={14} aria-hidden="true" />
              </Link>
              <div className="mega-menu">
                <div className="shell mega-menu-inner">
                  <div className="mega-menu-intro">
                    <span>{item.eyebrow}</span>
                    <strong>{item.label}</strong>
                    <p>{item.description}</p>
                    <Link href={item.href}>Đi tới trang {item.label.toLocaleLowerCase("vi")} <ArrowRight size={16} /></Link>
                  </div>
                  <div className="mega-menu-links">
                    {item.items.map((entry, index) => (
                      <Link href={entry.href} className="mega-menu-link" key={entry.href}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{entry.title}</strong>
                        <p>{entry.description}</p>
                        <ArrowUpRight size={17} aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Link href="/lien-he" className="header-cta">Trao đổi dự án <ArrowUpRight size={16} /></Link>
        </nav>

        <details className="mobile-menu lg:hidden">
          <summary aria-label="Mở menu"><Menu size={24} aria-hidden="true" /></summary>
          <nav aria-label="Điều hướng di động">
            {nav.map((item) => (
              <details className="mobile-nav-group" key={item.href}>
                <summary>{item.label}<ChevronDown size={15} /></summary>
                <Link className="mobile-nav-overview" href={item.href}>Xem tổng quan</Link>
                {item.items.map((entry) => <Link key={entry.href} href={entry.href}>{entry.title}</Link>)}
              </details>
            ))}
            <Link className="mobile-contact-link" href="/lien-he">Trao đổi dự án</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
