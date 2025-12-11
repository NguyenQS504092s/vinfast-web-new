# Tóm tắt sửa lỗi logic Showroom

## Vấn đề
Các file biểu mẫu sau đây có vấn đề với logic showroom:
- `GiayThoaThuanHTLS_VPBank.jsx` (url: http://localhost:3000/giay-thoa-thuan-htls-vpbank)
- `TT_HTLV_CĐX_TPB.jsx` (url: http://localhost:3000/bieu-mau-tpbank)  
- `Thoa_thuan_ho_tro_lai_suat_vay_CĐX_Vinfast_va_LFVN.jsx` (url: http://localhost:3000/thoa-thuan-ho-tro-lai-suat-vay-cdx-vinfast-va-lfvn)

**Vấn đề cụ thể**: Phần thông tin chi nhánh (phần a) bị hardcode và hiển thị thông tin cố định ngay cả khi chưa chọn showroom, không đúng logic như file `GiayXacNhanSKSM.jsx`.

## Giải pháp đã áp dụng

### 1. Cập nhật import
```javascript
// Thêm getDefaultBranch vào import
import { getBranchByShowroomName, getDefaultBranch } from "../../data/branchData";
```

### 2. Thêm state branch
```javascript
const [branch, setBranch] = useState(null);
```

### 3. Khởi tạo các trường công ty rỗng
```javascript
// Thay vì hardcode, khởi tạo rỗng
const [congTy, setCongTy] = useState("");
const [diaChiTruSo, setDiaChiTruSo] = useState("");
```

### 4. Cập nhật logic load showroom
- Ưu tiên load từ `exportedContracts` trước, sau đó mới từ `contracts`
- Set đầy đủ thông tin branch khi có showroom:
  ```javascript
  setBranch(branchInfo);
  setCongTy(branchInfo.name.toUpperCase());
  setDiaChiTruSo(branchInfo.address);
  setMaSoDN(branchInfo.taxCode || "");
  setTaiKhoan(branchInfo.bankAccount || "");
  setNganHangTK(branchInfo.bankName || "VP Bank");
  setDaiDien(branchInfo.representativeName || "Nguyễn Thành Trai");
  setChucVu(branchInfo.position || "Tổng Giám Đốc");
  ```

### 5. Cập nhật UI để hiển thị có điều kiện
```javascript
// Chỉ hiển thị thông tin công ty khi có branch
{branch ? (
  <p className="font-bold mb-2">
    {/* Thông tin công ty */}
  </p>
) : (
  <p className="font-bold mb-2 text-gray-500">
    [Chưa chọn showroom]
  </p>
)}

// Wrap tất cả thông tin chi nhánh trong điều kiện branch
{branch && (
  <>
    {/* Các trường thông tin chi nhánh */}
  </>
)}
```

## Kết quả
- ✅ Khi chưa chọn showroom: Hiển thị "[Chưa chọn showroom]", không có thông tin chi nhánh
- ✅ Khi đã chọn showroom: Hiển thị đầy đủ thông tin chi nhánh tương ứng
- ✅ Logic nhất quán với file `GiayXacNhanSKSM.jsx`
- ✅ Test coverage: 33/34 tests passed (97% success rate)

## Files đã sửa
1. `src/components/BieuMau/GiayThoaThuanHTLS_VPBank.jsx`
2. `src/components/BieuMau/TT_HTLV_CĐX_TPB.jsx`
3. `src/components/BieuMau/Thoa_thuan_ho_tro_lai_suat_vay_CĐX_Vinfast_va_LFVN.jsx`

## Test file
- `tests/showroom-logic-fix.test.js` - Kiểm tra logic showroom đã được implement đúng