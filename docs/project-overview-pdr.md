# Project Overview & Product Development Requirements

## 1. Tổng Quan Dự Án

### 1.1 Giới Thiệu

**VinFast Dealer Management System** là hệ thống quản lý đại lý VinFast dành cho công ty **CÔNG TY CỔ PHẦN ĐẦU TƯ THƯƠNG MẠI VÀ DỊCH VỤ Ô TÔ ĐÔNG SÀI GÒN** (VinFast Đông Sài Gòn).

Hệ thống hỗ trợ quản lý hợp đồng, khách hàng, nhân sự, và in ấn biểu mẫu pháp lý cho 3 showroom:
- **Thủ Đức** (S00501) - 391 Võ Nguyên Giáp, TP. Thủ Đức
- **Trường Chinh** (S00901) - 682A Trường Chinh, Q. Tân Bình
- **Âu Cơ** (S41501) - 616 Âu Cơ, Q. Tân Phú

### 1.2 Mục Tiêu Kinh Doanh

| Mục tiêu | Mô tả |
|----------|-------|
| **Số hóa quy trình** | Chuyển đổi quy trình bán xe từ giấy tờ sang digital |
| **Quản lý hợp đồng** | Tạo, theo dõi, xuất hợp đồng một cách có hệ thống |
| **In ấn biểu mẫu** | Tự động điền thông tin vào 27 loại biểu mẫu pháp lý |
| **Báo cáo thống kê** | Dashboard phân tích doanh số theo thời gian và showroom |
| **Quản lý khách hàng** | Lưu trữ thông tin khách hàng và lịch sử giao dịch |

### 1.3 Đối Tượng Người Dùng

| Vai trò | Mô tả | Chức năng chính |
|---------|-------|-----------------|
| **Nhân viên kinh doanh (NVKD)** | Tư vấn và bán xe | Tạo báo giá, tạo hợp đồng, in biểu mẫu |
| **Quản lý showroom** | Giám sát hoạt động | Xem dashboard, duyệt hợp đồng, quản lý nhân sự |
| **Kế toán** | Xử lý tài chính | Xuất hóa đơn, theo dõi công nợ |
| **Admin hệ thống** | Quản trị toàn bộ | Quản lý người dùng, cấu hình hệ thống |

---

## 2. Tính Năng Cốt Lõi

### 2.1 Quản Lý Hợp Đồng

#### 2.1.1 Tạo Hợp Đồng Mới
- Nhập thông tin khách hàng (họ tên, CCCD, SĐT, địa chỉ)
- Chọn xe (dòng xe, phiên bản, màu ngoại thất, màu nội thất)
- Tính giá tự động (giá niêm yết - giảm giá - VinClub)
- Chọn ưu đãi theo dòng xe
- Tự động sinh mã VSO: `{maDms}-VSO-{YY}-{MM}-{sequence}`

#### 2.1.2 Quản Lý Hợp Đồng
- Danh sách hợp đồng dạng bảng với filter/sort
- Trạng thái: Nháp → Xuất → Hoàn thành
- Chỉnh sửa thông tin hợp đồng
- Xuất hợp đồng sang Google Sheets (tự động qua Cloud Functions)

### 2.2 Báo Giá & Tính Toán

- Tính giá xe theo cấu hình (model, trim, màu sắc)
- Tính tiền vay ngân hàng (lãi suất, kỳ hạn)
- Áp dụng ưu đãi (giảm giá trực tiếp, phần trăm, quà tặng)
- In báo giá chi tiết cho khách hàng

### 2.3 In Ấn Biểu Mẫu (27 loại)

#### Nhóm Hợp Đồng
- Hợp Đồng Mua Bán Xe
- Phụ Lục Hợp Đồng
- Đề Xuất Giá Bán

#### Nhóm Giấy Xác Nhận
- Giấy Xác Nhận Thông Tin
- Giấy Xác Nhận Kiểu Loại
- Giấy Xác Nhận SKSM (Sơ Kết Sản Xuất)
- Giấy Xác Nhận Thanh Toán NH
- Giấy Xác Nhận Tặng Bảo Hiểm

#### Nhóm Thỏa Thuận Vay
- BIDV - Thỏa Thuận Hỗ Trợ Lãi Vay
- Shinhan - Thỏa Thuận Hỗ Trợ Lãi Vay CĐX
- TPBank - Thỏa Thuận Hỗ Trợ Lãi Vay
- VPBank - Thỏa Thuận HTLS
- LFVN - Thỏa Thuận Hỗ Trợ Lãi Suất Vay

#### Nhóm Thanh Toán
- Giấy Đề Nghị Thanh Toán
- Đề Nghị Xuất Hóa Đơn
- Phiếu Rút Cọc
- Giấy Xác Nhận Phải Thu KH-DL-Gửi-NH

#### Nhóm Khác
- PDI KH (Pre-Delivery Inspection)
- Phiếu Tặng Bảo Hiểm
- Phiếu Đề Nghị Lắp Phụ Kiện
- Giấy Thỏa Thuận Trả Chậm
- Giấy Thỏa Thuận Trả Thay

### 2.4 Dashboard & Báo Cáo

- Biểu đồ doanh số theo tháng/quý
- Thống kê theo showroom
- Top nhân viên bán hàng
- Tổng quan hợp đồng (pending, xuất, hoàn thành)

### 2.5 Quản Lý Nhân Sự

- Danh sách nhân viên theo showroom
- Thông tin liên hệ, vị trí, bộ phận
- Phân quyền truy cập

### 2.6 Quản Lý Khách Hàng

- Lưu trữ thông tin khách hàng
- Lịch sử mua xe
- Tìm kiếm và filter

---

## 3. Yêu Cầu Chức Năng (Functional Requirements)

### FR-001: Xác thực người dùng
| ID | FR-001 |
|----|--------|
| **Mô tả** | Hệ thống phải xác thực người dùng trước khi truy cập |
| **Tiêu chí** | Đăng nhập bằng email/password qua Firebase Auth |
| **Ưu tiên** | Cao |

### FR-002: Tạo hợp đồng
| ID | FR-002 |
|----|--------|
| **Mô tả** | NVKD có thể tạo hợp đồng mới với đầy đủ thông tin |
| **Tiêu chí** | Validate required fields trước khi lưu |
| **Ưu tiên** | Cao |

### FR-003: Sinh mã VSO tự động
| ID | FR-003 |
|----|--------|
| **Mô tả** | Hệ thống tự sinh mã VSO khi chọn showroom |
| **Tiêu chí** | Mã duy nhất, format chuẩn, atomic counter |
| **Ưu tiên** | Cao |

### FR-004: In biểu mẫu
| ID | FR-004 |
|----|--------|
| **Mô tả** | In các biểu mẫu pháp lý với thông tin từ hợp đồng |
| **Tiêu chí** | Layout chuẩn A4, không tràn trang |
| **Ưu tiên** | Cao |

### FR-005: Lọc ưu đãi theo dòng xe
| ID | FR-005 |
|----|--------|
| **Mô tả** | Chỉ hiển thị ưu đãi phù hợp với dòng xe đã chọn |
| **Tiêu chí** | Mapping chính xác giữa model và dong_xe |
| **Ưu tiên** | Trung bình |

### FR-006: Sync Google Sheets
| ID | FR-006 |
|----|--------|
| **Mô tả** | Tự động đồng bộ hợp đồng đã xuất lên Google Sheets |
| **Tiêu chí** | Trigger khi create/update exportedContracts |
| **Ưu tiên** | Trung bình |

---

## 4. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

### NFR-001: Performance
- Thời gian tải trang < 3 giây
- Thời gian response Firebase < 500ms

### NFR-002: Security
- Xác thực bắt buộc cho mọi route (trừ login)
- Không lưu credentials trong code
- Firebase Security Rules bảo vệ database

### NFR-003: Usability
- Giao diện tiếng Việt
- Responsive design (desktop first)
- Print layout chuẩn A4

### NFR-004: Maintainability
- Code structure rõ ràng
- Documentation đầy đủ
- Test coverage > 90%

### NFR-005: Availability
- Deploy trên Vercel (SLA 99.9%)
- Firebase Realtime Database (SLA 99.95%)

---

## 5. Ràng Buộc Kỹ Thuật

### 5.1 Platform
- Frontend: React 18 + Vite (ES Modules)
- Backend: Firebase Realtime Database
- Hosting: Vercel (frontend), Firebase (cloud functions)

### 5.2 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 5.3 Dependencies
- Node.js 18+ (development)
- Node.js 20 (cloud functions)

---

## 6. Metrics & KPIs

| Metric | Target | Đo lường |
|--------|--------|----------|
| Số hợp đồng/ngày | > 10 | Firebase Analytics |
| Thời gian tạo HĐ | < 5 phút | User feedback |
| Lỗi in biểu mẫu | < 1% | Error logs |
| Uptime | 99.9% | Vercel monitoring |

---

## 7. Roadmap

### Phase 1 (Hiện tại) ✅
- Quản lý hợp đồng cơ bản
- In 27 loại biểu mẫu
- Dashboard thống kê

### Phase 2 (Dự kiến)
- Notification system
- Mobile responsive
- Báo cáo nâng cao

### Phase 3 (Tương lai)
- Mobile app
- Integration với VinFast API
- AI-powered insights

---

## 8. Change Log

| Version | Ngày | Thay đổi |
|---------|------|----------|
| 1.0.0 | 2025-12 | Initial release với đầy đủ tính năng core |
| 1.1.0 | 2025-12 | Thêm tính năng lọc ưu đãi theo dòng xe |
| 1.2.0 | 2025-12 | Thêm các biểu mẫu ngân hàng (VPBank, TPBank) |
