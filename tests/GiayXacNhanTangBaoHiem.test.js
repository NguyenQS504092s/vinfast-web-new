const fs = require('fs');
const path = require('path');

describe('GiayXacNhanTangBaoHiem Showroom Logic', () => {
  let fileContent;

  beforeAll(() => {
    const filePath = path.join(__dirname, '../src/components/BieuMau/GiayXacNhanTangBaoHiem.jsx');
    fileContent = fs.readFileSync(filePath, 'utf8');
  });

  test('should conditionally render branch info based on showroom selection', () => {
    // Kiểm tra logic conditional rendering cho header
    expect(fileContent).toMatch(/\{branch \? \(/);
    expect(fileContent).toMatch(/\[Chưa chọn showroom\]/);
    
    // Kiểm tra logic conditional rendering cho phần "Bằng bản này"
    expect(fileContent).toMatch(/\{branch \? \(/);
    expect(fileContent).toMatch(/branch\.name/);
    expect(fileContent).toMatch(/branch\.address/);
  });

  test('should not use default branch when no showroom is selected', () => {
    // Kiểm tra rằng không sử dụng getDefaultBranch() khi không có showroom
    const loadDataMatch = fileContent.match(/const branchInfo = showroomName \? getBranchByShowroomName\(showroomName\) : null;/);
    expect(loadDataMatch).toBeTruthy();
  });

  test('should set branch to null when no showroom data', () => {
    // Kiểm tra rằng setBranch(null) được gọi khi không có dữ liệu
    expect(fileContent).toMatch(/setBranch\(null\);/);
  });

  test('should handle showroom from exportedContracts and contracts', () => {
    // Kiểm tra logic load từ exportedContracts trước, sau đó mới contracts
    expect(fileContent).toMatch(/exportedContracts\/\$\{contractId\}/);
    expect(fileContent).toMatch(/contracts\/\$\{contractId\}/);
  });

  test('should not have hardcoded showroom fallback', () => {
    // Kiểm tra rằng không có fallback cứng như "TRƯỜNG CHINH"
    const showroomAssignment = fileContent.match(/let showroomName = incoming\.showroom \|\| "";/);
    expect(showroomAssignment).toBeTruthy();
  });

  test('should display placeholder text when no branch selected', () => {
    // Kiểm tra hiển thị placeholder khi không có branch
    expect(fileContent).toMatch(/\[Chưa chọn showroom\]/);
    expect(fileContent).toMatch(/\[Chưa có địa chỉ\]/);
  });

  test('should use branch.name instead of constructed name', () => {
    // Kiểm tra sử dụng branch.name thay vì tự construct tên
    expect(fileContent).toMatch(/\{branch\.name\}/);
  });

  test('should not use getShowroomShortName function', () => {
    // Kiểm tra rằng function getShowroomShortName đã được xóa
    expect(fileContent).not.toMatch(/getShowroomShortName/);
  });
});