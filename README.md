# PHẦN MỀM QUẢN LÝ HỒ SƠ ĐẤT ĐAI & THEO DÕI TIẾN ĐỘ DỊCH VỤ
*(Land Records & Service Workflow Management System)*

Hệ thống quản lý hồ sơ nhà đất được tối ưu hóa cho các văn phòng công chứng, công ty tư vấn pháp lý bất động sản, môi giới và cơ quan địa chính tại Việt Nam theo chuẩn **Luật Đất đai 2024**.

---

## 🚀 ĐIỂM NỔI BẬT

1. **Chuẩn hóa 6 Nhóm dữ liệu đầu vào:**
   * **Nhóm 1: Khách hàng:** Họ tên, CCCD/MST, Số điện thoại, Địa chỉ thường trú, Người đồng sở hữu/vợ chồng.
   * **Nhóm 2: Loại hồ sơ:** Chuyển nhượng (Mua bán), Tặng cho, Thừa kế, Cấp lần đầu (theo Điều 137), Cấp đổi/Cấp lại (mẫu mới 2025 có mã QR), Chuyển mục đích sử dụng (lên thổ cư), Thế chấp, Xóa thế chấp, Tách/Hợp thửa, Cho thuê, Góp vốn.
   * **Nhóm 3: Thông tin thửa đất:** Vị trí, Số thửa, Tờ bản đồ, Diện tích ($m^2$), Loại đất (ONT, ODT, CLN, LUC...), Số Giấy chứng nhận, Số vào sổ cấp GCN, Tình trạng pháp lý.
   * **Nhóm 4: Giấy tờ đính kèm ĐỘNG:** Checklist giấy tờ **tự động thay đổi theo Loại hồ sơ** được chọn. Cho phép tải lên file ảnh/PDF trực tiếp, phân loại bản chính / bản sao công chứng / photo.
   * **Nhóm 5: Tiến độ xử lý:** Mã hồ sơ tự động sinh dạng `HS-YYYY-XXX` (ví dụ `HS-2026-001`), ngày tiếp nhận, người phụ trách, cơ quan giải quyết, trạng thái hồ sơ, ngày nộp và ngày hẹn trả (kèm cảnh báo trễ hạn).
   * **Nhóm 6: Quản lý Tài chính:** Giá trị dịch vụ, Tạm ứng, Đã thanh toán, Tự động tính số tiền còn lại (công nợ), ghi chú thanh toán.

2. **Tích hợp Excel toàn diện:**
   * **Xuất Excel:** Xuất toàn bộ danh sách hồ sơ lọc được ra file `.xlsx` đầy đủ 27 cột tiếng Việt.
   * **Nhập Excel:** Đọc file Excel sẵn có của bạn, tự động phân tích và nạp hàng loạt hồ sơ vào hệ thống kèm checklist giấy tờ tự động.
   * **Tải mẫu Excel:** Có sẵn nút tải template Excel chuẩn.

3. **Lưu trữ IndexedDB Browser (Vercel Ready):**
   * Hoạt động 100% trên Vercel mà không cần cấu hình Database bên ngoài hay API keys phức tạp.
   * Hỗ trợ lưu ảnh và PDF trực tiếp trong bộ nhớ IndexedDB của trình duyệt.

---

## 💻 HƯỚNG DẪN CHẠY THỬ TRÊN MÁY (LOCAL)

1. Mở PowerShell hoặc Terminal tại thư mục dự án:
   ```bash
   cd C:\Users\Dell\quan-ly-ho-so-dat-dai
   ```
2. Khởi động môi trường phát triển:
   ```bash
   npm run dev
   ```
3. Mở trình duyệt web truy cập: [http://localhost:3000](http://localhost:3000)

---

## ☁️ HƯỚNG DẪN TRIỂN KHAI LÊN VERCEL (https://vercel.com/)

### Cách 1: Triển khai qua GitHub (Khuyên dùng - Nhanh nhất)
1. Đẩy mã nguồn lên tài khoản GitHub của bạn:
   ```bash
   # Tạo repository mới trên GitHub (ví dụ: quan-ly-ho-so-dat-dai)
   git remote add origin https://github.com/<tai-khoan-cua-ban>/quan-ly-ho-so-dat-dai.git
   git branch -M main
   git push -u origin main
   ```
2. Đăng nhập vào [https://vercel.com/](https://vercel.com/).
3. Nhấp nút **"Add New..."** $\rightarrow$ chọn **"Project"**.
4. Chọn repository `quan-ly-ho-so-dat-dai` vừa đẩy lên.
5. Nhấp **"Deploy"** (Giữ nguyên các thiết lập mặc định).
6. Sau khoảng 1 phút, Vercel sẽ cấp cho bạn một đường link miễn phí (ví dụ: `https://quan-ly-ho-so-dat-dai.vercel.app`) để sử dụng hoặc gửi cho đồng nghiệp thử nghiệm!

### Cách 2: Triển khai trực tiếp bằng Vercel CLI
1. Cài đặt Vercel CLI (nếu chưa có):
   ```bash
   npm install -g vercel
   ```
2. Đăng nhập và deploy ngay trong thư mục dự án:
   ```bash
   vercel
   ```
   Làm theo hướng dẫn trên màn hình (nhấn Enter để chọn mặc định).
