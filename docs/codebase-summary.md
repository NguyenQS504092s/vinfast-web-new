# Codebase Summary

## 1. Directory Structure

```
vinfast-web/
├── src/                        # Source code chính
│   ├── components/             # React components
│   │   ├── BieuMau/           # 27 printable legal forms
│   │   ├── FilterPanel/       # Filter UI components
│   │   ├── shared/            # Reusable components
│   │   └── *.jsx              # Layout components
│   ├── pages/                 # Page components (16 files)
│   ├── data/                  # Static data files
│   ├── firebase/              # Firebase configuration
│   ├── utils/                 # Utility functions
│   ├── assets/                # Static assets
│   ├── images/                # Image files
│   ├── App.jsx                # Root component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── functions/                  # Firebase Cloud Functions
├── docs/                       # Documentation
├── tests/                      # Test files
├── plans/                      # Migration plans
└── dist/                       # Build output
```

---

## 2. File Inventory

### 2.1 Pages (16 files)

| File | Chức năng | Kích thước |
|------|-----------|------------|
| `CalculatorPage.jsx` | Tính toán báo giá xe | 115KB |
| `QuanLyKhachHangPage.jsx` | Quản lý khách hàng | 120KB |
| `HopDongPage.jsx` | Quản lý hợp đồng (draft) | 119KB |
| `HopDongDaXuatPage.jsx` | Hợp đồng đã xuất | 113KB |
| `ContractFormPage.jsx` | Form tạo/sửa hợp đồng | 87KB |
| `DanhSachXePage.jsx` | Danh sách xe | 80KB |
| `NhanSuPage.jsx` | Quản lý nhân sự | 77KB |
| `EditHopDongDaXuatPage.jsx` | Chỉnh sửa HĐ đã xuất | 68KB |
| `Dashboard.jsx` | Dashboard thống kê | 64KB |
| `Profile.jsx` | Trang hồ sơ cá nhân | 40KB |
| `Invoice2Page.jsx` | In báo giá | 32KB |
| `Home.jsx` | Trang chủ (báo giá) | 12KB |
| `Login.jsx` | Đăng nhập | 9KB |
| `TestPromotionFilterPage.jsx` | Test lọc ưu đãi | 7KB |
| `TestHopDongPromotionPage.jsx` | Test ưu đãi HĐ | 10KB |
| `Menu.jsx` | Menu điều hướng | 4KB |

### 2.2 BieuMau Components (27 files)

#### Hợp Đồng & Phụ Lục
| File | Mô tả |
|------|-------|
| `HopDongMuaBanXe.jsx` | Hợp đồng mua bán xe chính |
| `PhuLucHopDong.jsx` | Phụ lục hợp đồng |
| `DeXuatGiaban.jsx` | Đề xuất giá bán |

#### Giấy Xác Nhận
| File | Mô tả |
|------|-------|
| `GiayXacNhan.jsx` | Giấy xác nhận chung |
| `GiayXacNhanKieuLoai.jsx` | Xác nhận kiểu loại xe |
| `GiayXacNhanSKSM.jsx` | Xác nhận SKSM |
| `GiayXacNhanThanhToanNH.jsx` | Xác nhận thanh toán NH |
| `GiayXacNhanTangBaoHiem.jsx` | Xác nhận tặng bảo hiểm |
| `GiayXacNhanTangBaoHiemVPBank.jsx` | Xác nhận BH VPBank |
| `GiayXacNhanThongTin.jsx` | Xác nhận thông tin |
| `GiayXacNhanThongTinTangQua.jsx` | Xác nhận tặng quà |
| `GiayXacNhanPhaiThuKH-DL-Gui-NH.jsx` | Xác nhận công nợ |

#### Thỏa Thuận Ngân Hàng
| File | Ngân hàng |
|------|-----------|
| `BIDV_ThoaThuanHoTroLaiVay.jsx` | BIDV |
| `TTHTLV_CĐX_Shinhan_gui_DL.jsx` | Shinhan |
| `TT_HTLV_CĐX_TPB.jsx` | TPBank |
| `GiayThoaThuanHTLS_VPBank.jsx` | VPBank |
| `Thoa_thuan_ho_tro_lai_suat_vay_CĐX_Vinfast_va_LFVN.jsx` | LFVN |
| `GiayThoaThuanHoTroVayLai.jsx` | Thỏa thuận chung |
| `GiayThoaThuanHTVLCT90_nien_kim_60_thang.jsx` | HTVL CT90 |

#### Thanh Toán & Khác
| File | Mô tả |
|------|-------|
| `GiayDeNghiThanhToan.jsx` | Đề nghị thanh toán |
| `DeNghiXuatHoaDon.jsx` | Đề nghị xuất hóa đơn |
| `PhieuRutCoc.jsx` | Phiếu rút cọc |
| `PhieuTangBaoHiem.jsx` | Phiếu tặng bảo hiểm |
| `PhieuDeNghiLapPhuKien.jsx` | Đề nghị lắp phụ kiện |
| `PDI_KH.jsx` | Pre-Delivery Inspection |
| `GiayThoaThuanTraCham.jsx` | Thỏa thuận trả chậm |
| `GiayThoaThuanTraThay.jsx` | Thỏa thuận trả thay |

### 2.3 Data Files (4 files)

| File | Mô tả | Schema |
|------|-------|--------|
| `branchData.js` | 3 showrooms | `{ id, maDms, displayName, address, taxCode, bankAccount, ... }` |
| `calculatorData.js` | Giá xe (12 models) | `{ model, trim, exterior_color, interior_color, price_vnd, car_image_url }` |
| `promotionsData.js` | Ưu đãi mẫu | `{ id, name, type, value, dongXe[], ... }` |
| `provincesData.js` | Danh sách tỉnh/thành | `{ code, name }` |

### 2.4 Utility Files

| File | Chức năng |
|------|-----------|
| `src/utils/vsoGenerator.js` | Sinh mã VSO với atomic counter |
| `src/utils/vndToWords.js` | Chuyển số thành chữ tiếng Việt |

### 2.5 Layout Components

| File | Chức năng |
|------|-----------|
| `Header.jsx` | Navigation header |
| `Footer.jsx` | Footer |
| `ProtectedRoute.jsx` | Route guard (auth check) |
| `FilterPanel.jsx` | Panel lọc dữ liệu |
| `EmployeeBarChart.jsx` | Biểu đồ nhân viên |
| `PendingContractsTable.jsx` | Bảng HĐ pending |

### 2.6 Shared Components

| File | Chức năng |
|------|-----------|
| `shared/CurrencyInput.jsx` | Input tiền tệ với formatting |
| `shared/Pagination.jsx` | Phân trang |

### 2.7 Cloud Functions (4 functions)

| Function | Trigger | Mô tả |
|----------|---------|-------|
| `onContractExported` | onCreate `/exportedContracts` | Sync to Google Sheets |
| `onContractUpdated` | onUpdate `/exportedContracts` | Update Sheets row |
| `dailySummary` | Schedule 2AM | Daily stats summary |
| `syncToSheets` | HTTP GET | Manual sync trigger |

---

## 3. Key Modules & Responsibilities

### 3.1 Authentication Module
```
src/firebase/config.js      → Firebase init
src/pages/Login.jsx         → Login UI
src/components/ProtectedRoute.jsx → Route guard
```

### 3.2 Contract Module
```
src/pages/HopDongPage.jsx           → Draft contracts
src/pages/HopDongDaXuatPage.jsx     → Exported contracts
src/pages/ContractFormPage.jsx      → Create/Edit form
src/pages/EditHopDongDaXuatPage.jsx → Edit exported
```

### 3.3 Calculator Module
```
src/pages/CalculatorPage.jsx  → Price calculator
src/pages/Invoice2Page.jsx    → Print invoice
src/data/calculatorData.js    → Vehicle pricing
src/data/promotionsData.js    → Promotions
```

### 3.4 BieuMau Module
```
src/components/BieuMau/*     → 27 printable forms
src/data/branchData.js       → Branch info for forms
```

### 3.5 Analytics Module
```
src/pages/Dashboard.jsx      → Charts & stats
src/components/EmployeeBarChart.jsx → Employee chart
functions/index.js           → dailySummary function
```

---

## 4. Data Flow Overview

### 4.1 Contract Creation Flow
```
[User] → ContractFormPage
           ↓
       Select Showroom → generateVSO(maDms)
           ↓
       Fill Form Data
           ↓
       Save to Firebase: /contracts/{id}
           ↓
       Export → /exportedContracts/{id}
           ↓
       Cloud Function → Google Sheets
```

### 4.2 BieuMau Print Flow
```
[HopDongDaXuatPage] → Select Contract
           ↓
       Click Print Button
           ↓
       navigate('/bieu-mau-route', { state: contractData })
           ↓
[BieuMau Component] → Render form with data
           ↓
       window.print() → Browser Print Dialog
```

### 4.3 Calculator Flow
```
[CalculatorPage] → Select Model/Trim/Color
           ↓
       Lookup price from calculatorData.js
           ↓
       Apply discounts (Fix, VinClub, Promotions)
           ↓
       Calculate loan (if applicable)
           ↓
       Generate Invoice → Invoice2Page
```

---

## 5. Firebase Database Structure

```
vinfast-d5bd8-default-rtdb/
├── contracts/                # Draft contracts
│   └── {contractId}/
│       ├── stt
│       ├── tenKh
│       ├── cccd
│       ├── soDienThoai
│       ├── diaChi
│       ├── dongXe
│       ├── phienBan
│       ├── ngoaiThat
│       ├── noiThat
│       ├── giaNiemYet
│       ├── giaHopDong
│       ├── soTienCoc
│       ├── soTienVay
│       ├── showroom
│       ├── vso
│       ├── tinhTrang
│       └── createdAt
│
├── exportedContracts/        # Exported contracts
│   └── {contractId}/         # Same structure as contracts
│
├── vsoCounters/              # VSO sequence counters
│   └── {maDms}-{YY}-{MM}/   # e.g., "S00901-25-12": 35
│
├── promotions/               # Active promotions
│   └── {promotionId}/
│       ├── name
│       ├── type             # "fixed", "percent", "display"
│       ├── value
│       ├── dongXe[]
│       └── active
│
├── employees/                # Employee data
│   └── {employeeId}/
│
├── customers/                # Customer data
│   └── {customerId}/
│
└── dailySummaries/          # Daily stats (from Cloud Function)
    └── {YYYY-MM-DD}/
        ├── contractCount
        ├── totalValue
        └── generatedAt
```

---

## 6. Key Dependencies

### Production
| Package | Version | Usage |
|---------|---------|-------|
| react | 18.3.1 | UI framework |
| react-router-dom | 6.26.0 | Routing |
| firebase | 10.13.0 | Backend services |
| chart.js | 4.5.1 | Charts |
| react-chartjs-2 | 5.3.1 | Chart components |
| lucide-react | 0.553.0 | Icons |
| tailwindcss | 3.4.10 | Styling |
| react-toastify | 11.0.5 | Notifications |

### Development
| Package | Version | Usage |
|---------|---------|-------|
| vite | 5.4.1 | Build tool |
| autoprefixer | 10.4.20 | CSS processing |
| postcss | 8.4.41 | CSS processing |

---

## 7. Test Coverage

```
tests/
├── showroom-fix-summary.md    # Showroom logic test summary
├── README.md                  # Test documentation
└── *.test.jsx                 # Unit tests (alongside components)

Coverage: 33/34 tests pass (97%)
Focus areas: showroom logic, editable fields
```

---

## 8. Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite build configuration |
| `tailwind.config.js` | TailwindCSS configuration |
| `postcss.config.js` | PostCSS plugins |
| `firebase.json` | Firebase hosting config |
| `.firebaserc` | Firebase project aliases |
| `vercel.json` | Vercel deployment config |
| `database.rules.json` | Firebase DB security rules |
| `.env` | Environment variables |
| `.env.example` | Environment template |
