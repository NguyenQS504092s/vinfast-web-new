# VinFast Dealer Cloud Functions

## Các Functions

| Function | Trigger | Mô tả |
|----------|---------|-------|
| `onContractExported` | Database onCreate | Sync hợp đồng mới xuất sang Google Sheets |
| `onContractUpdated` | Database onUpdate | Cập nhật Google Sheets khi hợp đồng thay đổi |
| `dailySummary` | Scheduled (2 AM) | Tạo báo cáo tổng hợp hàng ngày |
| `syncToSheets` | HTTP GET | Sync thủ công 1 hợp đồng |

---

## Setup Google Sheets Integration

### Bước 1: Tạo Google Cloud Service Account

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project hoặc tạo mới
3. Vào **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **Service Account**
5. Đặt tên: `vinfast-sheets-sync`
6. Click **Create and Continue**
7. Role: **Editor** (hoặc custom role với Sheets access)
8. Click **Done**

### Bước 2: Tạo Key cho Service Account

1. Click vào service account vừa tạo
2. Tab **Keys** → **Add Key** → **Create new key**
3. Chọn **JSON** → **Create**
4. Lưu file JSON (quan trọng!)

### Bước 3: Enable Google Sheets API

1. Vào **APIs & Services** → **Library**
2. Tìm **Google Sheets API**
3. Click **Enable**

### Bước 4: Tạo Google Sheets

1. Tạo Google Sheet mới
2. Đặt tên sheet đầu tiên: `HopDongDaXuat`
3. Thêm header row:
   ```
   STT | Ngày XHĐ | TVBH | Tên KH | SĐT | Email | Địa chỉ | CCCD | Dòng xe | Phiên bản | Ngoại thất | Nội thất | Giá niêm yết | Giá giảm | Giá HĐ | Tiền cọc | Tình trạng | Ngân hàng | Số tiền vay | Số tiền phải thu | Quà tặng | Quà tặng khác | Contract ID | Synced At
   ```
4. Share sheet với email của service account (Editor permission)
5. Copy Sheets ID từ URL: `https://docs.google.com/spreadsheets/d/{SHEETS_ID}/edit`

### Bước 5: Configure Firebase Functions

```bash
# Set Google Sheets ID
firebase functions:config:set sheets.id="YOUR_GOOGLE_SHEETS_ID"

# Set Service Account (escape JSON properly)
firebase functions:config:set google.service_account="$(cat path/to/service-account.json)"
```

Hoặc tạo file `.env` trong thư mục functions:
```env
GOOGLE_SHEETS_ID=your_sheets_id
GOOGLE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```

### Bước 6: Deploy

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## Testing

### Test locally với emulator:
```bash
cd functions
npm run serve
```

### Test HTTP endpoint:
```bash
curl "https://asia-southeast1-vinfast-dealer-mgmt.cloudfunctions.net/syncToSheets?contractId=YOUR_CONTRACT_ID"
```

---

## Logs

Xem logs:
```bash
firebase functions:log
```

Hoặc vào Firebase Console → Functions → Logs

---

## Columns trong Google Sheets

| Column | Field | Mô tả |
|--------|-------|-------|
| A | stt | Số thứ tự |
| B | ngayXhd | Ngày xuất hợp đồng |
| C | tvbh | Tư vấn bán hàng |
| D | tenKh | Tên khách hàng |
| E | soDienThoai | Số điện thoại |
| F | email | Email |
| G | diaChi | Địa chỉ |
| H | cccd | CCCD |
| I | dongXe | Dòng xe |
| J | phienBan | Phiên bản |
| K | ngoaiThat | Màu ngoại thất |
| L | noiThat | Màu nội thất |
| M | giaNiemYet | Giá niêm yết |
| N | giaGiam | Giá giảm |
| O | giaHopDong | Giá hợp đồng |
| P | soTienCoc | Số tiền cọc |
| Q | tinhTrang | Tình trạng |
| R | nganHang | Ngân hàng |
| S | soTienVay | Số tiền vay |
| T | soTienPhaiThu | Số tiền phải thu |
| U | quaTang | Quà tặng theo xe |
| V | quaTangKhac | Quà tặng khác |
| W | contractId | ID hợp đồng (để update) |
| X | syncedAt | Thời gian sync |
