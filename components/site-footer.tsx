import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-main">
          <div>
            <Link href="/" className="brand brand-light">
              <span className="brand-mark" aria-hidden="true">B</span>
              <span>BEE SYSTEM</span>
            </Link>
            <p className="mt-5 max-w-md text-[1rem] leading-7 text-white/60">
              Giải pháp phần mềm tập trung vào những bài toán vận hành thực tế của ngành y tế và điều dưỡng tại Việt Nam.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <p className="footer-title">Khám phá</p>
              <Link href="/dich-vu">Dịch vụ</Link>
              <Link href="/du-an">Dự án</Link>
              <Link href="/kien-thuc">Kiến thức</Link>
            </div>
            <div>
              <p className="footer-title">Kết nối</p>
              <Link href="/gioi-thieu">Giới thiệu</Link>
              <Link href="/lien-he">Liên hệ</Link>
              <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Bee System Việt Nam</span>
          <span>Công nghệ cho y tế và điều dưỡng</span>
        </div>
      </div>
    </footer>
  );
}
