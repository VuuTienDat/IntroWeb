import {
  CalendarRange,
  ChartNoAxesCombined,
  ClipboardCheck,
  DatabaseZap,
  HeartPulse,
  Network,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

export const services = [
  {
    icon: CalendarRange,
    number: "01",
    title: "Xếp lịch và điều phối điều dưỡng",
    description:
      "Hỗ trợ lập lịch nhiều ràng buộc, phân bổ ca trực và theo dõi mức độ cân bằng giữa các thành viên.",
    tags: ["Lịch ca nhiều ràng buộc", "Cân bằng tải", "Điều chỉnh linh hoạt"],
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Số hóa quy trình chăm sóc",
    description:
      "Chuyển biểu mẫu và quy trình phối hợp hằng ngày thành luồng công việc rõ ràng, dễ theo dõi và tổng hợp.",
    tags: ["Biểu mẫu điện tử", "Theo dõi công việc", "Báo cáo quản trị"],
  },
  {
    icon: DatabaseZap,
    number: "03",
    title: "Phần mềm y tế theo yêu cầu",
    description:
      "Phân tích nghiệp vụ, phát triển web app và kết nối dữ liệu theo phạm vi vận hành của từng đơn vị.",
    tags: ["Phân tích nghiệp vụ", "Tích hợp hệ thống", "Vận hành và cải tiến"],
  },
];

export const strengths = [
  {
    icon: HeartPulse,
    title: "Bắt đầu từ công việc chăm sóc",
    description: "Mỗi giải pháp được nhìn từ quy trình thực tế của cơ sở y tế và đội ngũ điều dưỡng.",
  },
  {
    icon: UsersRound,
    title: "Dễ hiểu với người sử dụng",
    description: "Giao diện và luồng thao tác được tổ chức rõ ràng để giảm thời gian làm quen với hệ thống.",
  },
  {
    icon: ShieldCheck,
    title: "Phân quyền và dữ liệu rõ ràng",
    description: "Kiến trúc tách biệt website công khai, ứng dụng nghiệp vụ và lớp dữ liệu cần bảo vệ.",
  },
  {
    icon: Network,
    title: "Triển khai theo từng giai đoạn",
    description: "Ưu tiên phần mang lại giá trị trước, sau đó mở rộng tích hợp khi quy trình đã được kiểm chứng.",
  },
];

export const insights = [
  {
    category: "Điều dưỡng",
    title: "Phần mềm xếp lịch điều dưỡng cần giải quyết những bài toán nào?",
    excerpt:
      "Từ ràng buộc ca trực đến cân bằng khối lượng, một lịch tốt cần vừa khả thi vừa giải thích được.",
    href: "/kien-thuc/phan-mem-xep-lich-dieu-duong",
    readTime: "6 phút đọc",
  },
  {
    category: "Chuyển đổi số",
    title: "Cơ sở y tế nên bắt đầu số hóa từ quy trình nào?",
    excerpt:
      "Một cách chọn bài toán khởi đầu dựa trên tần suất, mức độ lặp lại và khả năng đo hiệu quả.",
    href: "/kien-thuc/chuyen-doi-so-y-te-bat-dau-tu-dau",
    readTime: "5 phút đọc",
  },
  {
    category: "Kiến trúc số",
    title: "Vì sao website giới thiệu và phần mềm y tế nên được tách rõ?",
    excerpt:
      "Website phục vụ tìm kiếm và giới thiệu; ứng dụng phục vụ đăng nhập, dữ liệu và nghiệp vụ nội bộ.",
    href: "/kien-thuc/website-va-phan-mem-y-te",
    readTime: "7 phút đọc",
  },
];

export const processSteps = [
  ["01", "Khảo sát quy trình", "Làm rõ vai trò, dữ liệu đầu vào và điểm đang gây tốn thời gian."],
  ["02", "Thiết kế giải pháp", "Xác định phạm vi, luồng sử dụng và nguyên tắc phân quyền."],
  ["03", "Phát triển và thử nghiệm", "Xây phiên bản sử dụng được, kiểm tra bằng tình huống thực tế."],
  ["04", "Triển khai và cải tiến", "Theo dõi phản hồi, đo hiệu quả và mở rộng theo nhu cầu."],
];

export const projectHighlights = [
  { icon: ChartNoAxesCombined, label: "Bài toán", value: "Ca trực nhiều ràng buộc" },
  { icon: Sparkles, label: "Cách tiếp cận", value: "Tối ưu theo mức ưu tiên" },
  { icon: UsersRound, label: "Trọng tâm", value: "Công bằng khối lượng" },
];
