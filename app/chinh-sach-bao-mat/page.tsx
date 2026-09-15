import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description:
    "Nguyên tắc tiếp nhận và sử dụng thông tin gửi qua website Bee System Việt Nam.",
  alternates: { canonical: "/chinh-sach-bao-mat" },
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <section className="page-hero article-hero">
        <div className="shell">
          <p className="eyebrow">Minh bạch dữ liệu</p>
          <h1>Chính sách bảo mật thông tin trên website Bee System.</h1>
          <p>Trang này giải thích loại thông tin website tiếp nhận, mục đích sử dụng và cách người gửi có thể yêu cầu hỗ trợ.</p>
        </div>
      </section>
      <section className="page-section">
        <div className="shell page-copy legal-copy">
          <nav className="breadcrumb" aria-label="Đường dẫn trang">
            <Link href="/">Trang chủ</Link><span>/</span><span aria-current="page">Chính sách bảo mật</span>
          </nav>
          <p className="article-intro">Bee System chỉ đề nghị người dùng cung cấp thông tin cần thiết để trao đổi về nhu cầu phần mềm. Không gửi thông tin định danh, hồ sơ bệnh án hoặc dữ liệu sức khỏe của người bệnh qua biểu mẫu công khai.</p>
          <h2>Thông tin có thể được tiếp nhận</h2>
          <p>Biểu mẫu liên hệ có thể tiếp nhận họ tên, đơn vị, email hoặc số điện thoại, nhóm nhu cầu và nội dung mô tả do người dùng chủ động cung cấp.</p>
          <h2>Mục đích sử dụng</h2>
          <p>Thông tin được dùng để phản hồi yêu cầu, làm rõ phạm vi trao đổi và cải thiện chất lượng hỗ trợ. Bee System không sử dụng biểu mẫu này để tiếp nhận dữ liệu điều trị hoặc hồ sơ người bệnh.</p>
          <h2>Chia sẻ và lưu trữ</h2>
          <p>Thông tin chỉ được chuyển qua hạ tầng vận hành website và hệ thống tiếp nhận yêu cầu do Bee System cấu hình. Thời gian lưu giữ được giới hạn theo nhu cầu xử lý yêu cầu và nghĩa vụ pháp lý áp dụng.</p>
          <h2>Quyền của người gửi</h2>
          <p>Người gửi có thể dùng trang <Link href="/lien-he">Liên hệ</Link> để yêu cầu kiểm tra, điều chỉnh hoặc xóa thông tin đã cung cấp, trong phạm vi Bee System có thể xác minh yêu cầu.</p>
          <h2>Cập nhật chính sách</h2>
          <p>Nội dung có thể được cập nhật khi cách vận hành website hoặc quy trình tiếp nhận thông tin thay đổi. Phiên bản hiện tại được cập nhật ngày 15/09/2026.</p>
        </div>
      </section>
    </main>
  );
}
