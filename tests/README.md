# Test Suite cho VinFast Web Application

## Mô tả

Test suite này được tạo để kiểm tra 2 vấn đề chính trong component `GiayXacNhanKieuLoai`:

1. **Logic hiển thị showroom**: Đảm bảo chỉ hiển thị thông tin chi nhánh khi có showroom được chọn
2. **Khả năng chỉnh sửa các trường trong bảng**: Đảm bảo người dùng có thể sửa, xóa dữ liệu trong biểu mẫu

## Cấu trúc Test Files

### 1. `GiayXacNhanKieuLoai.test.js`
- Test tổng thể cho component
- Kiểm tra integration giữa showroom logic và editable fields
- Test các trường hợp thực tế

### 2. `showroom-logic.test.js`
- Test riêng cho logic xử lý showroom
- Kiểm tra các edge cases (null, undefined, empty string)
- Test mapping showroom name với branch data

### 3. `editable-fields.test.js`
- Test riêng cho khả năng chỉnh sửa các trường trong bảng
- Kiểm tra CSS styling và user interaction
- Test keyboard navigation và focus behavior

## Cách chạy tests

### Cài đặt dependencies
```bash
cd tests
npm install
```

### Chạy tất cả tests
```bash
npm test
```

### Chạy tests theo từng loại
```bash
# Test logic showroom
npm run test:showroom

# Test editable fields
npm run test:editable

# Test component tổng thể
npm run test:component
```

### Chạy tests với watch mode
```bash
npm run test:watch
```

### Chạy tests với coverage report
```bash
npm run test:coverage
```

## Test Cases

### Vấn đề 1: Logic hiển thị showroom

#### ✅ Test Cases Passed
- [x] Không hiển thị thông tin chi nhánh khi không có showroom
- [x] Hiển thị thông tin chi nhánh khi có showroom hợp lệ
- [x] Xử lý showroom rỗng hoặc null từ database
- [x] Ưu tiên showroom từ exportedContracts hơn location.state
- [x] Xử lý showroom chỉ có khoảng trắng

#### ❌ Test Cases Failed (Cần sửa)
- [ ] Component vẫn hiển thị chi nhánh mặc định khi không có showroom
- [ ] Logic không đúng khi showroom = ""

### Vấn đề 2: Khả năng chỉnh sửa các trường trong bảng

#### ✅ Test Cases Passed
- [x] Các input trong bảng có thể focus được
- [x] Có thể thay đổi giá trị trong input
- [x] Input có styling phù hợp (background xanh nhạt)
- [x] Có placeholder text rõ ràng

#### ❌ Test Cases Failed (Cần sửa)
- [ ] Input không thể chỉnh sửa khi in (CSS print không hoạt động đúng)
- [ ] Border và background vẫn hiển thị khi in

## Kết quả Debug

### Debug Info từ Component
Khi chạy component thực tế, debug info hiển thị:
```
Showroom từ location.state: null
Branch hiện tại: [Tên chi nhánh vẫn hiển thị]
Firebase Key: [key]
```

### Console Logs
```
Loaded from exportedContracts: { showroom: "", ... }
Showroom in exportedContracts: ""
```

## Vấn đề được phát hiện

### 1. Logic Showroom
- Component vẫn sử dụng `getDefaultBranch()` ở một số nơi
- Logic kiểm tra `showroom.trim() !== ""` chưa được áp dụng đồng nhất
- Cần đảm bảo `setBranch(null)` được gọi khi showroom rỗng

### 2. Editable Fields
- CSS `editable-field` chỉ áp dụng khi print
- Cần thêm CSS để input có thể chỉnh sửa được cả khi không print
- Border và background cần được ẩn đúng cách khi in

## Khuyến nghị sửa lỗi

### 1. Sửa Logic Showroom
```javascript
// Đảm bảo logic nhất quán
if (contractData.showroom && contractData.showroom.trim() !== "") {
  // Set branch
} else {
  setBranch(null); // Quan trọng!
}
```

### 2. Sửa CSS Editable Fields
```css
.editable-field {
  /* Normal state - có thể chỉnh sửa */
  background: #eff6ff;
  border: 1px solid #93c5fd;
}

@media print {
  .editable-field {
    border: none !important;
    background: transparent !important;
    /* ... */
  }
}
```

## Chạy Tests để Verify Fix

Sau khi sửa code, chạy lại tests để đảm bảo:
```bash
npm test
```

Tất cả tests phải pass để đảm bảo 2 vấn đề đã được giải quyết hoàn toàn.